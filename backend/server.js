const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();

let mongoServer;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const database = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';
  const isHealthy = dbState === 1;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'ok' : 'degraded',
    service: 'nova-chat-backend',
    database,
    timestamp: new Date().toISOString(),
  });
});

// Demo fault injection: kills the process so Kubernetes reports the pod as
// restarting. Hitting it repeatedly trips kubelet's backoff into CrashLoopBackOff,
// which is what the SolutionSync monitoring agent detects.
if (process.env.ENABLE_CRASH_ENDPOINT === 'true') {
  app.post('/crash', (req, res) => {
    console.error('Crash endpoint invoked - exiting process');
    res.status(200).json({ status: 'crashing', service: 'nova-chat-backend' });
    // Let the response flush before taking the process down.
    res.on('finish', () => process.exit(1));
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Database Connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log('Attempting connection to MongoDB at:', uri);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log('Connected to MongoDB at', uri);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.log('Starting in-memory MongoDB database server fallback...');
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('Connected to In-Memory MongoDB at', mongoUri);
    } catch (fallbackErr) {
      console.error('Failed to start in-memory MongoDB:', fallbackErr);
      setTimeout(connectDB, 5000);
    }
  }
};

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error after initial connect:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
});

connectDB();

// Socket.IO Logic
const onlineUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    onlineUsers.set(userData._id, socket.id);
    socket.emit('connected');
    io.emit('get-online-users', Array.from(onlineUsers.keys()));
  });

  socket.on('join-chat', (room) => {
    socket.join(room);
    console.log('User Joined Room: ' + room);
  });

  socket.on('typing', (room) => {
    // room is the receiverId, senderId is the one typing
    let senderId;
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        senderId = userId;
        break;
      }
    }
    socket.in(room).emit('typing', senderId);
  });

  socket.on('stop-typing', (room) => {
    let senderId;
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        senderId = userId;
        break;
      }
    }
    socket.in(room).emit('stop-typing', senderId);
  });

  socket.on('new-message', async (newMessageReceived) => {
    const { senderId, receiverId, message } = newMessageReceived;
    
    // In a real app, you'd save to DB here if not already saved via API
    // But we use the API to save, and socket just for real-time delivery
    
    socket.in(receiverId).emit('message-received', newMessageReceived);
  });

  socket.on('disconnect', () => {
    let disconnectedUserId;
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        break;
      }
    }
    if (disconnectedUserId) {
      onlineUsers.delete(disconnectedUserId);
      io.emit('get-online-users', Array.from(onlineUsers.keys()));
    }
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

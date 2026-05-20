const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get chat history between two users
// @route   GET /api/messages/:receiverId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id;

    let newMessage = await Message.create({
      senderId,
      receiverId,
      message
    });

    const sender = await User.findById(senderId).select('username');
    
    const messageData = {
      ...newMessage._doc,
      senderName: sender.username
    };

    res.status(201).json(messageData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages, sendMessage };

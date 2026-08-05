import axios from 'axios';

const baseURL = '/api';

const API = axios.create({ baseURL });

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

API.interceptors.request.use((req) => {
  const user = getStoredUser();
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export const signIn = (formData) => API.post('/auth/login', formData);
export const signUp = (formData) => API.post('/auth/signup', formData);
export const fetchUsers = () => API.get('/users');
export const fetchMessages = (receiverId) => API.get(`/messages/${receiverId}`);
export const sendMessage = (messageData) => API.post('/messages', messageData);

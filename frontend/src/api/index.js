import axios from 'axios';

const baseURL = '/api';

const API = axios.create({ baseURL });

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user'));
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

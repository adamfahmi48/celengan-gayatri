import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Auth
export const login = (email, password) => api.post('/auth/login', { email, password }).then(r => r.data.user);
export const register = (payload) => api.post('/auth/register', payload).then(r => r.data.user);

// Master data
export const getUsers = () => api.get('/users').then(r => r.data);
export const updateUser = (u) => api.put(`/users/${u.id}`, u).then(r => r.data);
export const createUser = (u) => api.post('/users', u).then(r => r.data);
export const getAccounts = () => api.get('/accounts').then(r => r.data);

// Transaksi & ledger
export const getTransactions = () => api.get('/transactions').then(r => r.data);
export const addDeposit = (payload) => api.post('/transactions/deposit', payload).then(r => r.data);
export const addWithdrawal = (payload) => api.post('/transactions/withdrawal', payload).then(r => r.data);
export const getLedger = () => api.get('/ledger').then(r => r.data);

// AI proxy (Gemini via backend)
export const aiGenerate = (prompt, systemInstruction) =>
  api.post('/ai/generate', { prompt, systemInstruction }).then(r => r.data.text);

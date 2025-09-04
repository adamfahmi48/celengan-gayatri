import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, seed, calculateBalance, nextUserId } from './store.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// seed data sekali saat start
if (db.transactions.length === 0) seed();

// health check
app.get('/health', (_req, res) => res.json({ ok: true }));

// === AUTH (demo, password plain) ===
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = db.users.find(u => u.email === email && u.password_hash === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ user });
});

app.post('/auth/register', (req, res) => {
  const { name, email, phone, password } = req.body || {};
  if (!name || !email || !phone || !password) return res.status(400).json({ error: 'Missing fields' });
  if (db.users.find(u => u.email === email)) return res.status(409).json({ error: 'Email exists' });
  const user = { id: nextUserId(), name, email, phone, role: 'user', password_hash: password, is_active: true, created_at: new Date().toISOString() };
  db.users.push(user);
  res.json({ user });
});

// === USERS ===
app.get('/users', (_req, res) => res.json(db.users));
app.put('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const i = db.users.findIndex(u => u.id === id);
  if (i < 0) return res.status(404).json({ error: 'Not found' });
  db.users[i] = { ...db.users[i], ...req.body };
  res.json(db.users[i]);
});
app.post('/users', (req, res) => {
  const user = { id: nextUserId(), ...req.body, created_at: new Date().toISOString() };
  db.users.push(user);
  res.json(user);
});

// === ACCOUNTS ===
app.get('/accounts', (_req, res) => res.json(db.accounts));

// === TRANSACTIONS ===
app.get('/transactions', (_req, res) => res.json(db.transactions));
app.post('/transactions/deposit', (req, res) => {
  const { user_id, amount, date, note } = req.body || {};
  if (!user_id || !amount || !date) return res.status(400).json({ error: 'Missing fields' });

  const id = (db.transactions.at(-1)?.id || 0) + 1;
  const t = { id, user_id: Number(user_id), amount: Number(amount), date: new Date(date).toISOString(), note: note || '', method: 'Tunai Manual', type: 'deposit', created_at: new Date().toISOString() };
  db.transactions.push(t);

  const leId = (db.ledger_entries.at(-1)?.id || 0) + 1;
  db.ledger_entries.push({ id: leId,     transaction_id: id, account_id: 101, direction: 'debit',  amount: t.amount });
  db.ledger_entries.push({ id: leId + 1, transaction_id: id, account_id: 201, direction: 'credit', amount: t.amount });

  res.json(t);
});
app.post('/transactions/withdrawal', (req, res) => {
  const { user_id, amount, date, note } = req.body || {};
  if (!user_id || !amount || !date) return res.status(400).json({ error: 'Missing fields' });

  if (Number(amount) > calculateBalance(Number(user_id))) return res.status(400).json({ error: 'Insufficient balance' });

  const id = (db.transactions.at(-1)?.id || 0) + 1;
  const t = { id, user_id: Number(user_id), amount: Number(amount), date: new Date(date).toISOString(), note: note || '', method: 'Tunai Manual', type: 'withdrawal', created_at: new Date().toISOString() };
  db.transactions.push(t);

  const leId = (db.ledger_entries.at(-1)?.id || 0) + 1;
  db.ledger_entries.push({ id: leId,     transaction_id: id, account_id: 101, direction: 'credit', amount: t.amount });
  db.ledger_entries.push({ id: leId + 1, transaction_id: id, account_id: 201, direction: 'debit',  amount: t.amount });

  res.json(t);
});

// === LEDGER ===
app.get('/ledger', (_req, res) => res.json(db.ledger_entries));

// === PROXY GEMINI ===
app.post('/ai/generate', async (req, res) => {
  try {
    const { prompt, systemInstruction } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      ...(systemInstruction ? { systemInstruction: { parts: [{ text: systemInstruction }] } } : {})
    };

    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!r.ok) return res.status(500).json({ error: 'Gemini error', detail: await r.text() });

    const j = await r.json();
    const text = j?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    res.json({ text });
  } catch (e) {
    res.status(500).json({ error: 'AI proxy failed', detail: String(e) });
  }
});

app.listen(PORT, () => console.log(`API running on :${PORT}`));

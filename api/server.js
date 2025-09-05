// server.js — versi PostgreSQL penuh (copy–paste)

// 1) Imports & setup
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { pool, dbPing } from "./db.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// 2) Utilities
async function getSystemAccounts(client) {
  // Ambil ID akun KAS dan TABUNGAN_USER dari tabel accounts
  const { rows } = await client.query(
    `SELECT id, code FROM accounts WHERE code IN ('KAS','TABUNGAN_USER')`
  );
  const map = Object.fromEntries(rows.map(r => [r.code, r.id]));
  if (!map.KAS || !map.TABUNGAN_USER) {
    throw new Error("Akun sistem tidak lengkap. Pastikan migrasi/seed sudah jalan.");
  }
  return { KAS: map.KAS, TABUNGAN_USER: map.TABUNGAN_USER };
}

async function getUserBalance(userId) {
  const { rows } = await pool.query(
    `SELECT COALESCE(SUM(CASE WHEN type='deposit' THEN amount ELSE -amount END),0) AS balance
     FROM transactions WHERE user_id = $1`,
    [userId]
  );
  return Number(rows[0]?.balance || 0);
}

// 3) Health checks
app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/db/health", async (_req, res) => {
  try {
    const ok = await dbPing();
    res.json({ ok });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// 4) AUTH (DEMO: password disimpan plain — cocokkan dengan seed)
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Missing email/password" });

    const { rows } = await pool.query(
      `SELECT id, name, email, phone, role, password_hash, is_active, created_at
       FROM users
       WHERE email = $1 AND password_hash = $2
       LIMIT 1`,
      [email, password]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    res.json({ user });
  } catch (e) {
    res.status(500).json({ error: "Login failed", detail: String(e) });
  }
});

app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body || {};
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }
    // Cek email sudah ada?
    const exists = await pool.query(`SELECT 1 FROM users WHERE email = $1`, [email]);
    if (exists.rowCount > 0) return res.status(409).json({ error: "Email exists" });

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, phone, role, password_hash, is_active, created_at)
       VALUES ($1,$2,$3,'user',$4,true, NOW())
       RETURNING id, name, email, phone, role, is_active, created_at`,
      [name, email, phone, password]
    );
    res.json({ user: rows[0] });
  } catch (e) {
    res.status(500).json({ error: "Register failed", detail: String(e) });
  }
});

// 5) USERS
app.get("/users", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, email, phone, role, is_active, created_at
       FROM users
       ORDER BY id`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Fetch users failed", detail: String(e) });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { name, email, phone, role = "user", password_hash = "user123", is_active = true } =
      req.body || {};
    if (!name || !email || !phone) return res.status(400).json({ error: "Missing fields" });

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, phone, role, password_hash, is_active, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,NOW())
       RETURNING id, name, email, phone, role, is_active, created_at`,
      [name, email, phone, role, password_hash, is_active]
    );
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: "Create user failed", detail: String(e) });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    // Bangun SET dinamis dari field yang dikirim
    const allowed = ["name", "email", "phone", "role", "password_hash", "is_active"];
    const keys = allowed.filter(k => k in req.body);
    if (keys.length === 0) return res.status(400).json({ error: "No fields to update" });

    const sets = keys.map((k, i) => `${k} = $${i + 2}`).join(", ");
    const values = keys.map(k => req.body[k]);

    const { rows } = await pool.query(
      `UPDATE users SET ${sets} WHERE id = $1
       RETURNING id, name, email, phone, role, is_active, created_at`,
      [id, ...values]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: "Update user failed", detail: String(e) });
  }
});

// 6) ACCOUNTS
app.get("/accounts", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, code, name, type, created_at FROM accounts ORDER BY id`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Fetch accounts failed", detail: String(e) });
  }
});

// 7) TRANSACTIONS
app.get("/transactions", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, user_id, amount, date, note, method, type, created_at
       FROM transactions
       ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Fetch transactions failed", detail: String(e) });
  }
});

app.post("/transactions/deposit", async (req, res) => {
  const client = await pool.connect();
  try {
    const { user_id, amount, date, note } = req.body || {};
    if (!user_id || !amount || !date) return res.status(400).json({ error: "Missing fields" });

    await client.query("BEGIN");

    const { KAS, TABUNGAN_USER } = await getSystemAccounts(client);

    const tRes = await client.query(
      `INSERT INTO transactions (user_id, amount, date, note, method, type, created_at)
       VALUES ($1,$2,$3,$4,'Tunai Manual','deposit', NOW())
       RETURNING id, user_id, amount, date, note, method, type, created_at`,
      [user_id, amount, new Date(date).toISOString(), note || ""]
    );
    const t = tRes.rows[0];

    await client.query(
      `INSERT INTO ledger_entries (transaction_id, account_id, direction, amount)
       VALUES ($1,$2,'debit',$3), ($1,$4,'credit',$3)`,
      [t.id, KAS, t.amount, TABUNGAN_USER]
    );

    await client.query("COMMIT");
    res.json(t);
  } catch (e) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Deposit failed", detail: String(e) });
  } finally {
    client.release();
  }
});

app.post("/transactions/withdrawal", async (req, res) => {
  const client = await pool.connect();
  try {
    const { user_id, amount, date, note } = req.body || {};
    if (!user_id || !amount || !date) return res.status(400).json({ error: "Missing fields" });

    const balance = await getUserBalance(Number(user_id));
    if (Number(amount) > balance) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    await client.query("BEGIN");

    const { KAS, TABUNGAN_USER } = await getSystemAccounts(client);

    const tRes = await client.query(
      `INSERT INTO transactions (user_id, amount, date, note, method, type, created_at)
       VALUES ($1,$2,$3,$4,'Tunai Manual','withdrawal', NOW())
       RETURNING id, user_id, amount, date, note, method, type, created_at`,
      [user_id, amount, new Date(date).toISOString(), note || ""]
    );
    const t = tRes.rows[0];

    await client.query(
      `INSERT INTO ledger_entries (transaction_id, account_id, direction, amount)
       VALUES ($1,$2,'credit',$3), ($1,$4,'debit',$3)`,
      [t.id, KAS, t.amount, TABUNGAN_USER]
    );

    await client.query("COMMIT");
    res.json(t);
  } catch (e) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Withdrawal failed", detail: String(e) });
  } finally {
    client.release();
  }
});

// 8) LEDGER
app.get("/ledger", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, transaction_id, account_id, direction, amount
       FROM ledger_entries
       ORDER BY id DESC`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Fetch ledger failed", detail: String(e) });
  }
});

// 9) AI Proxy (tetap sama, pakai Gemini API Key)
app.post("/ai/generate", async (req, res) => {
  try {
    const { prompt, systemInstruction } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      ...(systemInstruction ? { systemInstruction: { parts: [{ text: systemInstruction }] } } : {}),
    };

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) return res.status(500).json({ error: "Gemini error", detail: await r.text() });

    const j = await r.json();
    const text = j?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    res.json({ text });
  } catch (e) {
    res.status(500).json({ error: "AI proxy failed", detail: String(e) });
  }
});

// 10) Start
app.listen(PORT, () => console.log(`API running on :${PORT}`));


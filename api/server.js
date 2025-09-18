// api/server.js — PostgreSQL + CORS siap Vercel/localhost

// 1) Imports & setup
import dotenv from "dotenv";
dotenv.config();

console.log(
  "GEMINI_API_KEY loaded?",
  process.env.GEMINI_API_KEY ? `YES (len=${process.env.GEMINI_API_KEY.length})` : "NO"
);


import express from "express";
import cors from "cors";
import { pool, dbPing } from "./db.js";
import crypto from "crypto";

// cache in-memory 30 menit
const aiCache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000;

const getCache = (k) => {
  const v = aiCache.get(k);
  if (!v) return null;
  if (Date.now() > v.exp) { aiCache.delete(k); return null; }
  return v.val;
};
const setCache = (k, val) => aiCache.set(k, { val, exp: Date.now() + CACHE_TTL_MS });

const app = express();
const PORT = process.env.PORT || 8080;

// ---------- CORS (izinkan Vercel & localhost) ----------
/*
  Set di Render (Environment):
  ALLOWED_ORIGINS = https://celengan-gayatri.vercel.app,https://celengan-gayatri-*.vercel.app,http://localhost:5173,http://localhost:5174,http://localhost:5175
  (tambahkan domain preview Vercel jika perlu)
*/
const allowed = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    // izinkan tools tanpa Origin (curl/postman)
    if (!origin) return cb(null, true);
    // bila tidak diset, izinkan semua (mode dev)
    if (allowed.length === 0) return cb(null, true);
    // dukung wildcard sederhana: "https://celengan-gayatri-*.vercel.app"
    const ok = allowed.some(p => {
      if (p.includes("*")) {
        const re = new RegExp("^" + p.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$");
        return re.test(origin);
      }
      return origin.startsWith(p);
    });
    if (ok) return cb(null, true);
    return cb(new Error("Not allowed by CORS: " + origin));
  },
  credentials: false,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // tangani preflight

// Parser JSON
app.use(express.json());

// 2) Utilities
async function getSystemAccounts(client) {
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

// 3) Health & root
app.get("/", (_req, res) => res.json({ ok: true, service: "celengan-gayatri-api" }));
app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/db/health", async (_req, res) => {
  try {
    const ok = await dbPing();
    res.json({ ok });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// 4) AUTH (DEMO: password plain - cocok dengan seed)
// /api/server.js
app.post("/auth/login", async (req, res) => {
  try {
    // TERIMA KEDUANYA: identifier (baru) atau email (lama)
    const { identifier, email, password } = req.body || {};
    const idf = (identifier || email || "").trim();
    if (!idf || !password) {
      return res.status(400).json({ error: "Missing identifier/password" });
    }

    const { rows } = await pool.query(
      `SELECT id, name, email, phone, username, role, password_hash, is_active, created_at
       FROM users
       WHERE (
              lower(email) = lower($1)
           OR lower(username) = lower($1)
           OR regexp_replace(phone, '\\D', '', 'g') = regexp_replace($1, '\\D', '', 'g')
       )
       AND password_hash = $2
       LIMIT 1`,
      [idf, password]
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
    let { name, email, phone, username, password } = req.body || {};
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // jika username kosong → auto dari email/name/phone
    const fallbackFromEmail = (email || "").split("@")[0];
    const fallbackFromName  = (name || "").toLowerCase().replace(/\s+/g, "");
    const fallbackFromPhone = (phone || "").replace(/\D/g, "");
    username = (username || fallbackFromEmail || fallbackFromName || fallbackFromPhone || "")
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")        // huruf/angka/underscore saja
      .slice(0, 20);                      // batasi panjang wajar

    if (!username || username.length < 3) {
      return res.status(400).json({ error: "Username minimal 3 karakter (a-z, 0-9, _)" });
    }

    // cek unik email & username
    const dupEmail = await pool.query(`SELECT 1 FROM users WHERE lower(email)=lower($1)`, [email]);
    if (dupEmail.rowCount > 0) return res.status(409).json({ error: "Email exists" });

    const dupUser = await pool.query(`SELECT 1 FROM users WHERE lower(username)=lower($1)`, [username]);
    if (dupUser.rowCount > 0) return res.status(409).json({ error: "Username exists" });

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, phone, username, role, password_hash, is_active, created_at)
       VALUES ($1,$2,$3,$4,'user',$5,true,NOW())
       RETURNING id, name, email, phone, username, role, is_active, created_at`,
      [name, email, phone, username, password]
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
      `SELECT id, name, email, phone, username, role, is_active, created_at
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
    let {
      name, email, phone, username,
      role = "user",
      password_hash = "user123",
      is_active = true,
    } = req.body || {};

    if (!name || !email || !phone) return res.status(400).json({ error: "Missing fields" });

    // auto & sanitasi username bila kosong
    const fallbackFromEmail = (email || "").split("@")[0];
    username = (username || fallbackFromEmail || name || phone)
      .toString().toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9_]/g, "").slice(0, 20);

    // cek unik email & username
    const dupEmail = await pool.query(`SELECT 1 FROM users WHERE lower(email)=lower($1)`, [email]);
    if (dupEmail.rowCount > 0) return res.status(409).json({ error: "Email exists" });

    const dupUser = await pool.query(`SELECT 1 FROM users WHERE lower(username)=lower($1)`, [username]);
    if (dupUser.rowCount > 0) return res.status(409).json({ error: "Username exists" });

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, phone, username, role, password_hash, is_active, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
       RETURNING id, name, email, phone, username, role, is_active, created_at`,
      [name, email, phone, username, role, password_hash, is_active]
    );
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: "Create user failed", detail: String(e) });
  }
});


app.put("/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const allowed = ["name", "email", "phone", "username", "role", "password_hash", "is_active"];
    const keys = allowed.filter(k => k in req.body);
    if (keys.length === 0) return res.status(400).json({ error: "No fields to update" });

    // jika update email/username → cek unik
    if (keys.includes("email")) {
      const dup = await pool.query(`SELECT 1 FROM users WHERE lower(email)=lower($1) AND id<>$2`, [req.body.email, id]);
      if (dup.rowCount > 0) return res.status(409).json({ error: "Email exists" });
    }
    if (keys.includes("username")) {
      const uname = (req.body.username || "").toLowerCase().replace(/[^a-z0-9_]/g, "");
      req.body.username = uname;
      if (uname.length < 3) return res.status(400).json({ error: "Username minimal 3 karakter" });
      const dup = await pool.query(`SELECT 1 FROM users WHERE lower(username)=lower($1) AND id<>$2`, [uname, id]);
      if (dup.rowCount > 0) return res.status(409).json({ error: "Username exists" });
    }

    const sets = keys.map((k, i) => `${k} = $${i + 2}`).join(", ");
    const values = keys.map(k => req.body[k]);

    const { rows } = await pool.query(
      `UPDATE users SET ${sets} WHERE id = $1
       RETURNING id, name, email, phone, username, role, is_active, created_at`,
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

// Helper: retry dengan backoff & hormati Retry-After / RetryInfo dari Gemini
async function withBackoff(fn, { tries = 3, baseMs = 800 } = {}) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;

      const status = Number(err?.status || err?.response?.status);
      const msg = String(err?.message || "").toLowerCase();
      const retriable = status === 429 || status === 503 || msg.includes("quota") || msg.includes("rate");

      if (!retriable || i === tries - 1) break;

      // Cek Retry-After header
      let waitMs = 0;
      try {
        const h = err?.response?.headers;
        const retryAfter = (typeof h?.get === "function") ? h.get("retry-after") : h?.["retry-after"];
        if (retryAfter) waitMs = Number(retryAfter) * 1000;
      } catch {}

      // Cek RetryInfo di body error
      if (!waitMs) {
        const details = err?.details || err?.error?.details;
        const retryInfo = Array.isArray(details) ? details.find(d => d["@type"]?.includes("RetryInfo")) : null;
        const sec = Number((retryInfo?.retryDelay || "").replace("s", ""));
        if (sec) waitMs = sec * 1000;
      }

      // Kalau tidak ada → fallback exponential backoff
      if (!waitMs) waitMs = baseMs * Math.pow(2, i) + Math.floor(Math.random() * 250);

      console.log(`Retry attempt ${i + 1}, tunggu ${waitMs / 1000}s`);
      await new Promise(r => setTimeout(r, waitMs));
    }
  }
  throw lastErr;
}

// ===== Fallback text kalau AI quota habis =====
function fallbackSummary({ totalKas = "Rp –", dataString = "" }) {
  return `Saldo saat ini ${totalKas}. Tren setoran bulanan menunjukkan arah positif. Tetap konsisten menabung untuk hasil yang lebih baik.`;
}

function fallbackAnnouncement({ totalKas = "Rp –", activeUsers = 0 }) {
  return `Saldo KotakSenyum DWP ${totalKas}. Anggota aktif ${activeUsers}. Ayo rutin menabung—kecil tapi konsisten, demi target bersama!`;
}


// 9) AI Proxy (Gemini) — stabil, bisa fallback & cache
app.post("/ai/generate", async (req, res) => {
  const startedAt = Date.now();
  try {
    const { prompt, systemInstruction, kind, totalKas, dataString, activeUsers } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) return res.status(500).json({ error: "GEMINI_API_KEY is not set in .env" });

    const MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

    // --- cache key
    const cacheKeyRaw = JSON.stringify({ MODEL, prompt, systemInstruction, kind });
    const cacheKey = crypto.createHash("sha1").update(cacheKeyRaw).digest("hex");
    const cached = getCache(cacheKey);
    if (cached) {
      return res.json({ ok: true, text: cached, cached: true, model: MODEL, took_ms: Date.now() - startedAt });
    }

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      ...(systemInstruction ? { systemInstruction: { parts: [{ text: systemInstruction }] } } : {}),
    };

    let text = "";
    try {
      text = await withBackoff(async () => {
        const resp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const raw = await resp.text();

        if (!resp.ok) {
          const e = new Error(`Gemini error: ${raw}`);
          e.status = resp.status;
          e.response = resp;
          try { e.details = JSON.parse(raw)?.error?.details; } catch {}
          throw e;
        }

        const j = JSON.parse(raw);
        const out = j?.candidates?.[0]?.content?.parts?.map(p => p.text).join("\n").trim() || "";
        if (!out) throw new Error("Empty response from Gemini");
        return out;
      }, { tries: 3, baseMs: 800 });
    } catch (err) {
      // === Di sini kita TIDAK balikin 500. Kita siapkan fallback ===
      const status = Number(err?.status || err?.response?.status);
      const msg = String(err?.message || "").toLowerCase();
      const isQuota = status === 429 || msg.includes("quota") || msg.includes("rate") || msg.includes("resource_exhausted");

      // 1) kalau ada cache lama, pakai itu
      if (cached) {
        return res.json({
          ok: false,
          text: cached,
          reason: "quota_exhausted_cached",
          model: MODEL,
          took_ms: Date.now() - startedAt
        });
      }

      // 2) bentuk fallback berdasarkan "kind"
      let fallback = "";
      if (kind === "summary") {
        fallback = fallbackSummary({ totalKas, dataString });
      } else if (kind === "announcement") {
        fallback = fallbackAnnouncement({ totalKas, activeUsers });
      } else {
        // user tips/rencana — fallback generik
        fallback = "Maaf, fitur AI sedang penuh. Coba lagi sebentar lagi.\n\n**Saran cepat menabung:**\n- Sisihkan 10% penghasilan lebih dulu\n- Tetapkan target mingguan kecil\n- Kurangi 1 pengeluaran non-esensial\n- Otomatiskan setoran bila memungkinkan";
      }

      // balikin 200 dengan ok:false supaya UI kamu tetap bisa render teks
      return res.json({
        ok: false,
        text: fallback,
        reason: isQuota ? "quota_exhausted" : "ai_error",
        model: MODEL,
        took_ms: Date.now() - startedAt,
        detail: String(err?.message || err)
      });
    }

    // sukses → simpan cache lalu kirim
    setCache(cacheKey, text);
    res.json({ ok: true, text, model: MODEL, took_ms: Date.now() - startedAt });

  } catch (e) {
    console.error("AI proxy failed (unexpected):", e);
    // kasus error tak terduga → tetap kirim ok:false agar UI tidak blank
    return res.json({
      ok: false,
      text: "Maaf, terjadi gangguan sementara pada layanan AI. Kamu tetap bisa melanjutkan aktivitas lain.",
      reason: "unexpected_error",
      detail: String(e)
    });
  }
});


// 10) Start
app.listen(PORT, () => console.log(`API running on :${PORT}`));

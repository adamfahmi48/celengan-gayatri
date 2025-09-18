// src/App.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

import LandingPage from "./LandingPage.jsx";


// penyimpanan
const STORAGE_USER = "kotaksenyum_user";
const STORAGE_PAGE = "kotaksenyum_page";

/* ===========================
   API CLIENT
=========================== */
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

/* ===========================
   ICONS (inline)
=========================== */
const LogoIcon = () => (
  <img
    src="/kotak senyum DWP.svg"   // pastikan nama sama dengan yang di public/
    alt="KotakSenyum DWP"
    className="h-10 w-10"
    loading="eager"
    decoding="async"
  />
);
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
  strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
  strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
  strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
  strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
  strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-pen-line"><path d="m18 5-3-3H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-3-3Z"/><path d="M8 18h1"/><path d="M18.4 9.6a2 2 0 1 1 3 3L17 17l-4 1 1-4Z"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
  strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>;
const SparklesIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
  strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-sparkles ${className}`}><path d="m12 3-1.9 1.9a2.5 2.5 0 0 0 0 3.8L12 10l1.9-1.9a2.5 2.5 0 0 0 0-3.8L12 3Z"/><path d="M5 11 3 9l1.9-1.9a2.5 2.5 0 0 1 3.8 0L10 9 8.1 10.9a2.5 2.5 0 0 1-3.8 0Z"/><path d="M19 11 17 9l1.9-1.9a2.5 2.5 0 0 1 3.8 0L24 9l-1.9 1.9a2.5 2.5 0 0 1-3.8 0Z"/><path d="m12 21-1.9-1.9a2.5 2.5 0 0 1 0-3.8L12 14l1.9 1.9a2.5 2.5 0 0 1 0 3.8L12 21Z"/></svg>;
const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
  strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const WhatsAppIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
  viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M16.75 13.96c.25.13.43.2.5.33.07.13.07.68-.16 1.32-.23.64-.75 1.16-1.29 1.38-.54.22-1.14.22-1.78.07-.64-.15-1.32-.33-2.68-1.04-1.36-.7-2.25-1.55-3.08-2.8-1.1-1.65-1.36-2.93-1.36-3.18 0-.25.13-.5.25-.64.13-.13.25-.13.38-.13h.38c.13 0 .25.07.38.38l.13.25c.13.25.25.5.38.75s.13.38.07.64c-.07.25-.07.38-.25.64l-.38.38c-.13.13-.07.38.07.64.13.25.38.64.75 1.14.75 1 1.39 1.29 1.64 1.39.25.13.38.07.64-.13l.38-.5c.25-.25.5-.38.75-.25l.88.5c.25.13.5.25.64.38.13.13.13.25.07.5zM12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10zm0 18.13a8.13 8.13 0 1 1 8.13-8.13 8.14 8.14 0 0 1-8.13 8.13z"/></svg>;
const SpinnerIcon = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const UserCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-check">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="m16 11 2 2 4-4"/>
  </svg>
);

const UserXIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-x">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="m17 8 5 5M22 8l-5 5"/>
  </svg>
);


/* ===========================
   HELPERS
=========================== */
const formatCurrency = (amount) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

const calculateBalance = (userId, allTransactions) =>
  allTransactions.filter(t => t.user_id === userId)
                 .reduce((acc, t) => acc + (t.type === "deposit" ? t.amount : -t.amount), 0);

const cleanAi = (t) =>
  (t || "")
    .trim()
    .replace(/^["'`]+|["'`]+$/g, ""); // buang kutip berlebih


/* ===========================
   REUSABLE UI
=========================== */
const Card = ({ title, value, icon, subtext }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
    <div className="bg-amber-100 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  </div>
);

const Button = ({ children, onClick, className = "bg-amber-500 hover:bg-amber-600", type = "button", disabled = false }) => (
  <button
    type={type} onClick={onClick} disabled={disabled}
    className={`px-4 py-2 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 transition duration-200 flex items-center justify-center gap-2 ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    {children}
  </button>
);

const Input = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  minLength,
  maxLength,
  pattern,
  title,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      minLength={minLength}
      maxLength={maxLength}
      pattern={pattern}
      title={title}
      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
    />
  </div>
);

const FormattedCurrencyInput = ({ label, value, onChange, placeholder, required = false }) => {
  const handleInputChange = (e) => onChange(e.target.value.replace(/[^0-9]/g, ""));
  const formattedValue = new Intl.NumberFormat("id-ID").format(value || 0);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text" value={value === "" ? "" : formattedValue} onChange={handleInputChange}
        placeholder={placeholder} required={required}
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
      />
    </div>
  );
};

const Select = ({ label, value, onChange, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      value={value} onChange={onChange}
      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
    >
      {children}
    </select>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};


/* ===========================
   LOGIN PAGE (tanpa register)
=========================== */
const LoginPage = ({ onLogin, onBack }) => {
  const [identifier, setIdentifier] = useState(""); // email/username/HP
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("Email/Username/No. HP dan Password wajib diisi.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await onLogin(identifier, password);
      if (!res?.ok) {
        switch (res?.reason) {
          case "timeout": setError("Waktu koneksi habis. Coba lagi."); break;
          case "network": setError("Tidak bisa terhubung ke server."); break;
          case "invalid": setError(res?.message || "Kredensial salah."); break;
          default: setError(res?.message || "Terjadi kesalahan di server."); break;
        }
      }
    } catch {
      setError("Terjadi kesalahan tak terduga.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-4 font-sans bg-gradient-to-br from-amber-50 via-rose-50 to-sky-50 overflow-hidden">
          {/* lingkaran dekorasi */}
    <div className="pointer-events-none absolute -top-24 -left-24 w-[340px] h-[340px] bg-orange-200/50 rounded-full blur-3xl" />
    <div className="pointer-events-none absolute -bottom-28 -right-24 w-[380px] h-[380px] bg-rose-200/50 rounded-full blur-3xl" />
    <div className="pointer-events-none absolute top-24 right-20 w-[180px] h-[180px] bg-amber-100/60 rounded-full blur-2xl" />
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center mb-6 space-x-3">
          <LogoIcon />
          <h1 className="text-3xl font-bold text-gray-800">KotakSenyum DWP</h1>
        </div>

        <div className="relative z-10 bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-lg">
          {/* <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2> */}

          {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email / Username / No. HP"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email / Username / No. HP"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <Button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600"
              disabled={isLoading}
            >
              {isLoading ? (<><SpinnerIcon /><span>Memproses...</span></>) : "Login"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            <button onClick={onBack} className="hover:text-orange-500 hover:underline transition-colors duration-200">
              « Kembali ke Beranda
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};


/* ===========================
   USER DASHBOARD (1 box, 2 mode)
=========================== */
const MarkdownBlock = ({ text, className = "" }) => {
  if (!text) return null;
  return (
    <div className={`rounded-lg p-4 leading-7 ${className}`}>
      <ReactMarkdown
        components={{
          p: (props) => <p className="mb-2" {...props} />,
          ul: (props) => <ul className="list-disc pl-6 mb-2" {...props} />,
          ol: (props) => <ol className="list-decimal pl-6 mb-2" {...props} />,
          li: (props) => <li className="mb-1" {...props} />,
          strong: (props) => <strong className="font-semibold" {...props} />,
          em: (props) => <em className="italic" {...props} />,
          h1: (props) => <h3 className="text-lg font-semibold mb-2" {...props} />,
          h2: (props) => <h4 className="text-base font-semibold mb-2" {...props} />,
          h3: (props) => <h5 className="text-base font-semibold mb-2" {...props} />,
        }}
      >
        {text.trim()}
      </ReactMarkdown>
    </div>
  );
};

const cleanAiText = (s = "") => {
  // kecilin kebablasan **bold**, heading, tanda kutip panjang, dsb — ringan saja
  return s
    .replace(/^#+\s*/gm, "")             // # heading -> plain
    .replace(/—/g, "-")                  // em dash -> hyphen
    .trim();
};

const enhanceBullets = (md = "") =>
  md.replace(/^[-*]\s+([^:\n]{2,60}):\s*/gm, (_m, t) => `- **${t}**: `);



const UserDashboard = ({ user, users, transactions, onExport, onGenerateTip, onGeneratePlan }) => {
  // ====== data dasar
  const superadmin = useMemo(() => users.find(u => u.role === "superuser"), [users]);
  const userTransactions = useMemo(
    () => transactions.filter(t => t.user_id === user.id).sort((a,b) => new Date(b.date) - new Date(a.date)),
    [transactions, user.id]
  );
  const balance = useMemo(() => calculateBalance(user.id, transactions), [user.id, transactions]);

  // ====== pagination transaksi (tidak diubah)
  const [pageTx, setPageTx] = useState(1);
  const PAGE_SIZE = 10;
  const totalPages = useMemo(() => Math.max(1, Math.ceil(userTransactions.length / PAGE_SIZE)), [userTransactions.length]);
  const pagedUserTransactions = useMemo(() => {
    const start = (pageTx - 1) * PAGE_SIZE;
    return userTransactions.slice(start, start + PAGE_SIZE);
  }, [userTransactions, pageTx]);
  useEffect(() => { if (pageTx > totalPages) setPageTx(totalPages); }, [totalPages, pageTx]);
  const goPrevTx  = () => setPageTx(p => Math.max(1, p - 1));
  const goNextTx  = () => setPageTx(p => Math.min(totalPages, p + 1));
  const goFirstTx = () => setPageTx(1);
  const goLastTx  = () => setPageTx(totalPages);

  // ====== grafik saldo (tidak diubah)
  const chartData = useMemo(() => {
    const chronological = [...userTransactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let cumulative = 0;
    const byDate = new Map();
    chronological.forEach(t => {
      const d = new Date(t.date);
      if (Number.isNaN(d)) return;
      const day = d.toISOString().slice(0, 10);
      cumulative += t.type === "deposit" ? t.amount : -t.amount;
      byDate.set(day, cumulative);
    });
    return Array.from(byDate.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([iso, bal]) => ({ date: iso, balance: bal }))
      .slice(-10);
  }, [userTransactions]);

  // ====== MODE: 'plan' atau 'tips'
  const [mode, setMode] = useState("tips"); // 'plan' | 'tips'

  // ====== state input + hasil
  const [goal, setGoal] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [result, setResult] = useState(""); // hasil gabungan (plan atau tips)
  const [loading, setLoading] = useState(false);

  // setiap kali mode berubah, kosongkan hasil; kalau ke "tips", bersihkan input plan
  useEffect(() => {
    setResult("");           // reset area hasil
    if (mode === "tips") {   // opsional: saat ke tips, kosongkan input plan
      setGoal("");
      setGoalAmount("");
    }
  }, [mode]);

  // ====== aksi
  const runGenerate = async () => {
    try {
      setLoading(true);
      let text = "";
    if (mode === "plan") {
      if (!goal || !goalAmount) return;
      text = await onGeneratePlan(
        `Rencana menabung: tujuan "${goal}", target Rp${goalAmount}. Saldo ${formatCurrency(balance)}.
        Buat 3–5 poin yang ringkas, praktis, dan membumi. Gunakan heading sederhana seperti "Langkah Utama", "Estimasi Target Bulanan".`,
        "Anda perencana keuangan yang ramah, to-the-point, dan memotivasi.",
        "plan"            // ⬅️ tambahkan ini
      );
    } else {
      text = await onGenerateTip(
        `Buat 5–7 tips menabung singkat, kreatif, dan bisa langsung dipraktikkan untuk ${user.name}.
        Sertakan 1 kalimat motivasi penutup. Saldo saat ini ${formatCurrency(balance)}.
        Format rapi dengan bullet bila cocok.`,
        "Anda asisten keuangan yang suportif dan positif.",
        "tips"            // ⬅️ tambahkan ini
      );
    }
      setResult(cleanAiText(text || ""));
    } finally {
      setLoading(false);
    }
  };

  // ====== ekspor CSV transaksi
  const handleExport = () => {
    const headers = ["Tanggal", "Tipe", "Jumlah", "Metode", "Catatan"];
    const data = userTransactions.map(t => ({
      tanggal: formatDate(t.date), tipe: t.type, jumlah: t.amount, metode: t.method, catatan: t.note,
    }));
    onExport(headers, data, `riwayat_transaksi_${user.name.replace(/ /g, "_")}.csv`);
  };

  // ====== UI
  return (
    <div className="space-y-6">

      {/* SATU KOTAK: Plan / Tips */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        {/* header */}
        <div className="px-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Kiri: ikon + judul */}
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <TargetIcon />
            </span>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Asisten Menabung</h2>
              <p className="text-sm text-gray-500">Siap mendampingi perjalanan menabungmu.</p>
            </div>
          </div>

          {/* Kanan: saldo */}
          <div className="shrink-0">
            <div className="rounded-xl px-4 py-3 bg-amber-50 border border-amber-200 shadow-sm sm:text-right">
              <p className="text-xs text-amber-700/80">Saldo Saat Ini</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-700">
                {formatCurrency(balance)}
              </p>
            </div>
          </div>
        </div>


          {/* segmented control */}
          <div className="mt-4 inline-flex rounded-lg border p-1 bg-gray-50">
            <button
              onClick={() => setMode("tips")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                mode === "tips" ? "bg-white shadow border text-amber-700" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              💡 Tips Harian
            </button>
            <button
              onClick={() => setMode("plan")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                mode === "plan" ? "bg-white shadow border text-amber-700" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              🎯 Rencana Tabungan
            </button>
          </div>
        </div>

        {/* body */}
        <div className="px-6 pb-6 mt-4">
          {mode === "plan" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Apa impianmu?"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Contoh: Umrah, Rumah, Liburan Keluarga"
              />
              <FormattedCurrencyInput
                label="Target Tabungan (Rp)"
                value={goalAmount}
                onChange={setGoalAmount}
                placeholder="Contoh: 5.000.000"
              />
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-xs text-gray-500">
              {mode === "plan"
                ? "Tips: Pilih target realistis, isi tujuan & nominalnya."
                : "Tips: Cocok saat butuh dorongan singkat setiap hari."}
            </div>
            <Button
              onClick={runGenerate}
              disabled={loading || (mode === "plan" && (!goal || !goalAmount))}
              className="bg-amber-500 hover:bg-amber-600"
            >
              {loading ? (<><SpinnerIcon /> Memproses...</>) : (<>Jalankan</>)}
            </Button>
          </div>

          {/* hasil gabungan */}
          {result && (
            <div
              className={`mt-5 border rounded-xl ${
                mode === "plan"
                  ? "border-green-200 bg-green-50"
                  : "border-yellow-200 bg-yellow-50"
              }`}
            >
              <MarkdownBlock
                text={result}
                className={mode === "plan" ? "text-green-900" : "text-yellow-900"}
              />
            </div>
          )}
        </div>
      </div>

      {/* Hubungi Bendahara (tetap) */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <WhatsAppIcon />
          <h3 className="text-lg font-semibold text-gray-800">Hubungi Bendahara</h3>
        </div>
        <p className="text-gray-600 mb-4 text-sm">
          Untuk setoran via transfer, konfirmasi data, atau pertanyaan lainnya, hubungi Bendahara lewat WhatsApp di bawah.
        </p>
        {(() => {
          const sa = users.find(u => u.role === "superuser" && u.is_active);
          const phoneRaw = sa?.phone?.replace(/\D/g, "") || "";
          const phoneIntl = phoneRaw
            ? (phoneRaw.startsWith("62") ? phoneRaw : phoneRaw.startsWith("0") ? "62" + phoneRaw.slice(1) : "62" + phoneRaw)
            : "";
          const message = encodeURIComponent(`Halo Bendahara, saya ${user.name}. Mau bertanya seputar KotakSenyum DWP :)`);
          const waUrl = phoneIntl ? `https://wa.me/${phoneIntl}?text=${message}` : null;
          return (
            <a href={waUrl || "#"} target="_blank" rel="noopener noreferrer">
              <Button
                className={`bg-green-600 hover:bg-green-700 ${!waUrl ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={!waUrl}
              >
                <WhatsAppIcon /> Hubungi via WhatsApp
              </Button>
            </a>
          );
        })()}
      </div>

      {/* Grafik (tetap) */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Grafik Progres Tabungan</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(iso) => new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}/>
            <YAxis tickFormatter={(v) => `Rp${v/1000}k`} width={80} />
            <Tooltip
              formatter={(v) => formatCurrency(v)}
              labelFormatter={(iso) => new Date(iso).toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
            />
            <Legend />
            <Line type="monotone" dataKey="balance" name="Saldo" stroke="#f59e0b" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tabel transaksi (tetap) */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h3 className="text-lg font-semibold text-gray-800">Riwayat Transaksi</h3>
          <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 text-sm py-1.5 px-3">
            <DownloadIcon /> Ekspor CSV
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr><th className="px-6 py-3">Tanggal</th><th className="px-6 py-3">Jumlah</th><th className="px-6 py-3 hidden sm:table-cell">Catatan</th></tr>
            </thead>
            <tbody>
              {pagedUserTransactions.map((t) => (
                <tr key={t.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{formatDate(t.date)}</td>
                  <td className={`px-6 py-4 font-semibold ${t.type === "deposit" ? "text-green-600" : "text-red-600"}`}>
                    {t.type === "deposit" ? "+" : "-"} {formatCurrency(t.amount)}
                    <p className="font-normal text-gray-500 sm:hidden">{t.note || ""}</p>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">{t.note || "-"}</td>
                </tr>
              ))}
              {Array.from({ length: Math.max(0, PAGE_SIZE - pagedUserTransactions.length) }).map((_, i) => (
                <tr key={`placeholder-${i}`} className="bg-transparent" aria-hidden="true">
                  <td className="px-6 py-4">&nbsp;</td>
                  <td className="px-6 py-4">&nbsp;</td>
                  <td className="px-6 py-4 hidden sm:table-cell">&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
            <div className="text-sm text-gray-600">
              {(() => {
                const start = (pageTx - 1) * PAGE_SIZE + 1;
                const end = Math.min(pageTx * PAGE_SIZE, userTransactions.length);
                return `Menampilkan ${start}-${end} dari ${userTransactions.length} transaksi`;
              })()}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={goFirstTx} disabled={pageTx === 1} className={`px-3 py-1.5 rounded border text-sm ${pageTx === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}>« Awal</button>
              <button onClick={goPrevTx}  disabled={pageTx === 1} className={`px-3 py-1.5 rounded border text-sm ${pageTx === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}>‹ Sebelumnya</button>
              <span className="px-3 py-1.5 text-sm text-gray-700">Halaman <b>{pageTx}</b> / {totalPages}</span>
              <button onClick={goNextTx}  disabled={pageTx === totalPages} className={`px-3 py-1.5 rounded border text-sm ${pageTx === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}>Berikutnya ›</button>
              <button onClick={goLastTx}  disabled={pageTx === totalPages} className={`px-3 py-1.5 rounded border text-sm ${pageTx === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}>Akhir »</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



/* ===========================
   SUPERUSER DASHBOARD (ringkas)
=========================== */
const SuperuserDashboard = ({ users, transactions, onGenerateSummary, onGenerateAnnouncement }) => {
  const [financialSummary, setFinancialSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [isGeneratingAnnouncement, setIsGeneratingAnnouncement] = useState(false);

  const totalKas = useMemo(() =>
    transactions.reduce((sum, t) => sum + (t.type === "deposit" ? t.amount : -t.amount), 0),
    [transactions]
  );
  const totalLiability = useMemo(() => {
    const userBalances = users.filter(u => u.role === "user").map(u => calculateBalance(u.id, transactions));
    return userBalances.reduce((s, b) => s + b, 0);
  }, [users, transactions]);
  const activeUsers = useMemo(() => users.filter(u => u.is_active && u.role === "user").length, [users]);

  // // Ringkas data bulanan jadi string untuk prompt AI
  // const dataString = useMemo(
  //   () => monthlyDeposits.map(d => `${d.name}: ${formatCurrency(d.total)}`).join(", "),
  //   [monthlyDeposits]
  // );

  const monthlyDeposits = useMemo(() => {
    const buckets = new Map();
    transactions.forEach((t) => {
      const d = new Date(t.date);
      if (Number.isNaN(d)) return;
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!buckets.has(ym)) buckets.set(ym, 0);
      if (t.type === "deposit") buckets.set(ym, buckets.get(ym) + t.amount);
    });
    return Array.from(buckets.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([ym, total]) => {
        const [year, month] = ym.split("-").map(Number);
        const label = new Date(year, month - 1, 1).toLocaleDateString("id-ID", { month: "short", year: "numeric" });
        return { name: label, total };
      });
  }, [transactions]);

      // Ringkas data bulanan jadi string untuk prompt AI
    const dataString = useMemo(
      () => monthlyDeposits.map(d => `${d.name}: ${formatCurrency(d.total)}`).join(", "),
      [monthlyDeposits]
    );


  const recentTransactions = useMemo(
    () => [...transactions].sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0,5)
      .map(t => ({...t, user: users.find(u => u.id === t.user_id)})),
    [transactions, users]
  );

const handleGenerateSummary = async () => {
  setIsGeneratingSummary(true);

  const fallback = () =>
    `Saldo tabungan DWP telah mencapai ${formatCurrency(totalKas)}. ` +
    `Tren tabungan bulanan menunjukkan progres positif; mari pertahankan ritme agar target bersama tercapai.`;

  try {
    const prompt =
      `Buat ringkasan kondisi tabungan DWP. ` +
      `Total saldo: ${formatCurrency(totalKas)}. ` +
      `Data bulanan: ${dataString}. ` +
      `Tulis 2–3 kalimat dengan nada positif dan semangat menabung.`;

    const res = await api.post("/ai/generate", {
      kind: "summary",
      prompt,
      totalKas: formatCurrency(totalKas),
      dataString
    });

    const j = res.data || {};
    const text = cleanAi(j.text || "");
    setFinancialSummary(text || fallback());
    if (j.ok === false) {
      console.warn("AI fallback summary dipakai:", j.reason || "");
    }
  } catch (err) {
    console.error("Gagal generate summary:", err);
    setFinancialSummary(fallback());
  } finally {
    setIsGeneratingSummary(false);
  }
};


const handleGenerateAnnouncement = async () => {
  setIsGeneratingAnnouncement(true);

  // fallback lokal kalau AI error/limit
  const fallback = () =>
    `Saldo KotakSenyum DWP saat ini ${formatCurrency(totalKas)} dengan ${activeUsers} anggota aktif. ` +
    `Yuk lanjutkan semangat menabung agar target bersama makin cepat tercapai!`;

  try {
    const prompt =
      `Buat pengumuman singkat (maks. 2 kalimat) untuk WhatsApp grup DWP UPT PPD Tulungagung. ` +
      `Isi: total saldo KotakSenyum DWP ${formatCurrency(totalKas)} dan jumlah anggota aktif ${activeUsers}. ` +
      `Tulis dengan nada positif dan ajakan langsung untuk menabung.`;

    const res = await api.post("/ai/generate", {
      kind: "announcement",
      prompt,
      totalKas: formatCurrency(totalKas),
      activeUsers
    });

    const j = res.data || {};
    const text = cleanAi(j.text || "");
    // kalau backend balikin ok:false ATAU text kosong → pakai fallback
    setAnnouncement(text || fallback());
    if (j.ok === false) {
      console.warn("AI fallback announcement dipakai:", j.reason || "");
    }
  } catch (err) {
    console.error("Gagal generate pengumuman:", err);
    // jangan alert — tampilkan draf aman agar UX tetap mulus
    setAnnouncement(fallback());
  } finally {
    setIsGeneratingAnnouncement(false);
  }
};




  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Total Saldo Kas" value={formatCurrency(totalKas)} icon={<DollarSignIcon />} />
        <Card title="Total Tabungan Nasabah" value={formatCurrency(totalLiability)} icon={<BookOpenIcon />} subtext="Total liability" />
        <Card title="Jumlah Nasabah Aktif" value={activeUsers} icon={<UsersIcon />} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Asisten Cerdas Bendahara</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Button onClick={handleGenerateSummary} disabled={isGeneratingSummary} className="w-full bg-indigo-600 hover:bg-indigo-700">
              <SparklesIcon /> {isGeneratingSummary ? "Menganalisis..." : "Buat Ringkasan Keuangan"}
            </Button>
            {financialSummary && (
              <MarkdownBlock
                text={financialSummary}
                className="mt-4 bg-indigo-50 border-l-4 border-indigo-500 text-indigo-800"
              />
            )}
          </div>
          <div>
            <Button onClick={handleGenerateAnnouncement} disabled={isGeneratingAnnouncement} className="w-full bg-teal-600 hover:bg-teal-700">
              <SparklesIcon /> {isGeneratingAnnouncement ? "Menyusun Kata..." : "Buat Draf Pengumuman"}
            </Button>
            {announcement && (
              <MarkdownBlock
                text={announcement}
                className="mt-4 bg-teal-50 border-l-4 border-teal-500 text-teal-800"
              />
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Total Setoran per Bulan</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyDeposits}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(v) => `Rp${v/1000}k`} width={80} />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Legend />
            <Bar dataKey="total" name="Total Setoran" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Transaksi Terbaru</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr><th className="px-6 py-3">Tanggal</th><th className="px-6 py-3">Nasabah</th><th className="px-6 py-3">Jumlah</th></tr>
            </thead>
            <tbody>
              {recentTransactions.map(t => (
                <tr key={t.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{formatDate(t.date)}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{t.user?.name || "N/A"}</td>
                  <td className={`px-6 py-4 font-semibold ${t.type === "deposit" ? "text-green-600" : "text-red-600"}`}>
                    {t.type === "deposit" ? "+" : "-"} {formatCurrency(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// === SEARCHABLE SELECT (drop + pencarian di dalam) ===
const SearchableSelect = ({ label, items, value, onChange, placeholder = "Cari nasabah..." }) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [highlight, setHighlight] = React.useState(0);
  const containerRef = React.useRef(null);
  const inputRef = React.useRef(null);

const normalize = (s) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

const filtered = React.useMemo(() => {
  const q = normalize(query.trim());
  if (!q) return items;

  return items.filter((it) => {
    const n = normalize(it.name);
    // cocok di awal seluruh nama: "aman" cocok "Aman"
    if (n.startsWith(q)) return true;
    // cocok di awal kata manapun: "san" cocok "Budi Santoso"
    return n.split(/\s+/).some((w) => w.startsWith(q));
  });
}, [items, query]);


  const selected = items.find(it => String(it.id) === String(value));

  React.useEffect(() => {
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const choose = (it) => {
    onChange(String(it.id));
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="mt-1 w-full flex justify-between items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        <span className={selected ? "text-gray-900" : "text-gray-400"}>
          {selected ? selected.name : "Pilih nasabah"}
        </span>
        <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="p-2 border-b">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <ul className="max-h-56 overflow-auto py-1 text-sm">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-gray-500">Tidak ditemukan</li>
            )}
            {filtered.map((it) => (
              <li
                key={it.id}
                onClick={() => choose(it)}
                className={`cursor-pointer px-3 py-2 hover:bg-amber-50 ${
                  String(it.id) === String(value) ? "font-semibold text-amber-700" : "text-gray-700"
                }`}
              >
                {it.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


/* ===========================
   TRANSACTION ENTRY
=========================== */
const TransactionEntryPage = ({ users, transactions, onAddDeposit, onAddWithdrawal, onSetPage }) => {
  const [activeTab, setActiveTab] = useState("deposit");
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeUsers = users
    .filter(u => u.is_active && u.role === "user")
    .sort((a, b) => a.name.localeCompare(b.name, "id", { sensitivity: "base" }));
  const selectedUserBalance = useMemo(() => userId ? calculateBalance(parseInt(userId), transactions) : 0, [userId, transactions]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const resetForm = () => { setAmount(""); setNote(""); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setSuccess("");
    if (!userId || !amount || !date) { setError("Nasabah, jumlah, dan tanggal wajib diisi."); return; }
    const numericAmount = parseFloat(amount); if (numericAmount <= 0) { setError("Jumlah transaksi harus positif."); return; }
    if (activeTab === "withdrawal" && numericAmount > selectedUserBalance) { setError("Saldo nasabah tidak mencukupi untuk penarikan ini."); return; }
    const nama = users.find(u => u.id == userId)?.name;
    setUserName(nama);
    openModal();
  };

  const sendTransaction = async () => {
    if (isSubmitting) return;
    const numericAmount = parseFloat(amount);
    if (numericAmount <= 0) { setError("Jumlah transaksi harus positif."); return; }

    setIsSubmitting(true);
    const payload = { user_id: parseInt(userId), amount: numericAmount, date: new Date(date).toISOString(), note };

    try {
      if (activeTab === "deposit") await onAddDeposit(payload);
      else await onAddWithdrawal(payload);

      const nama = users.find(u => u.id == userId)?.name;
      const actionText = activeTab === "deposit" ? "Setoran" : "Penarikan";
      setSuccess(`${actionText} untuk ${nama} sebesar ${formatCurrency(numericAmount)} berhasil ditambahkan.`);
      resetForm();
      setTimeout(() => setSuccess(""), 3000);
      closeModal();
    } catch (err) {
      setError(err?.response?.data?.error || "Gagal menyimpan transaksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Entry Transaksi</h2>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button onClick={() => { setActiveTab("deposit"); resetForm(); }}
            className={`${activeTab === "deposit" ? "border-amber-500 text-amber-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Setoran</button>
          <button onClick={() => { setActiveTab("withdrawal"); resetForm(); }}
            className={`${activeTab === "withdrawal" ? "border-amber-500 text-amber-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Penarikan</button>
        </nav>
      </div>

      {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-sm">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <SearchableSelect
          label="Pilih Nasabah"
          items={activeUsers.map(u => ({ id: u.id, name: u.name }))}
          value={userId}
          onChange={(val) => setUserId(val)}
        />
        {activeTab === "withdrawal" && userId && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
            Saldo tersedia: <span className="font-bold">{formatCurrency(selectedUserBalance)}</span>
          </div>
        )}
        <Input label="Tanggal Transaksi" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        <FormattedCurrencyInput label="Jumlah (Rp)" value={amount} onChange={setAmount} placeholder="Contoh: 50.000" required />
        <Input label="Catatan (Opsional)" type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Catatan transaksi" />
        <div className="flex justify-end pt-4 space-x-3">
          <Button onClick={() => onSetPage("superuserDashboard")} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Kembali</Button>
          <Button type="submit">Simpan {activeTab === "deposit" ? "Setoran" : "Penarikan"}</Button>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal} title={activeTab === "deposit" ? "Setoran" : "Penarikan"}>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Apakah anda yakin ingin melakukan {activeTab === "deposit" ? "Setoran" : "Penarikan"}</h2>
            <h3 className="text-2xl text-gray-800 mb-6">Pada Nasabah {userName} Sejumlah {formatCurrency(amount)}</h3>
            <div className="flex justify-end space-x-2 pt-4">
              <Button onClick={closeModal} className="bg-gray-200 text-gray-800 hover:bg-gray-300" disabled={isSubmitting}>Batal</Button>
              <Button onClick={sendTransaction} disabled={isSubmitting}>
                {isSubmitting ? (<><SpinnerIcon /> Menyimpan...</>) : (<>Simpan {activeTab === "deposit" ? "Setoran" : "Penarikan"}</>)}
              </Button>
            </div>
          </div>
        </Modal>
      </form>
    </div>
  );
};

/* ===========================
   USER MANAGEMENT
=========================== */
const UserManagementPage = ({ users, onUpdateUser, onCreateUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

const openModal = (user) => {
  setCurrentUser(
    user
      ? { ...user }
      : {
          name: "",
          email: "",
          phone: "",
          username: "",      // <— TAMBAH
          role: "user",
          password_hash: "",
          is_active: true,
        }
  );
  setIsCreating(!user);
  setIsModalOpen(true);
};

  const closeModal = () => { setIsModalOpen(false); setCurrentUser(null); };

  const handleSave = async () => { if (isCreating) await onCreateUser(currentUser); else await onUpdateUser(currentUser); closeModal(); };
  const handleFieldChange = (field, value) => setCurrentUser(prev => ({ ...prev, [field]: value }));
  const toggleActiveStatus = async (user) => { await onUpdateUser({ ...user, is_active: !user.is_active }); };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h2>
        <Button onClick={() => openModal(null)}>+ Tambah Pengguna</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Nama</th>
              <th className="px-6 py-3 hidden sm:table-cell">Email / Telepon</th>
              <th className="px-6 py-3 hidden md:table-cell">Username</th>   {/* <— BARU */}
              <th className="px-6 py-3 hidden md:table-cell">Peran</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Aksi</th>
            </tr>
          </thead>

        <tbody>
          {users.map(u => (
            <tr key={u.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">
                {u.name}
                <div className="font-normal text-gray-500 sm:hidden">{u.email}</div>
              </td>

              <td className="px-6 py-4 hidden sm:table-cell">
                {u.email}
                <br />
                <span className="text-xs text-gray-400">{u.phone}</span>
              </td>

              {/* USERNAME — BARU */}
              <td className="px-6 py-4 hidden md:table-cell">
                <span className="text-gray-800">{u.username}</span>
              </td>

              <td className="px-6 py-4 hidden md:table-cell">{u.role}</td>

              <td className="px-6 py-4">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    u.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {u.is_active ? "Aktif" : "Non-Aktif"}
                </span>
              </td>

              <td className="px-6 py-4 flex items-center space-x-2">
                <button
                  onClick={() => openModal(u)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit pengguna"
                  aria-label="Edit pengguna"
                >
                  <EditIcon />
                </button>

                {u.is_active ? (
                  // sedang AKTIF → tampilkan tombol untuk menonaktifkan (ikon merah)
                  <button
                    onClick={() => toggleActiveStatus(u)}
                    className="text-red-600 hover:text-red-800"
                    title="Nonaktifkan pengguna"
                    aria-label="Nonaktifkan pengguna"
                  >
                    <UserXIcon />
                  </button>
                ) : (
                  // sedang NON-AKTIF → tampilkan tombol untuk mengaktifkan (ikon hijau)
                  <button
                    onClick={() => toggleActiveStatus(u)}
                    className="text-green-600 hover:text-green-800"
                    title="Aktifkan pengguna"
                    aria-label="Aktifkan pengguna"
                  >
                    <UserCheckIcon />
                  </button>
                )}
              </td>

            </tr>
          ))}
        </tbody>
        </table>
      </div>

<Modal isOpen={isModalOpen} onClose={closeModal} title={isCreating ? "Tambah Pengguna Baru" : "Edit Pengguna"}>
  {currentUser && (
    <div className="space-y-4">
      <Input
        label="Nama Lengkap"
        type="text"
        value={currentUser.name}
        onChange={e => handleFieldChange("name", e.target.value)}
      />

      <Input
        label="Email"
        type="email"
        value={currentUser.email}
        onChange={e => handleFieldChange("email", e.target.value)}
      />

      <Input
        label="No. Telepon"
        type="text"
        value={currentUser.phone}
        onChange={e => handleFieldChange("phone", e.target.value)}
      />

      {/* >>> Tambahkan ini <<< */}
      <Input
        label="Username"
        type="text"
        value={currentUser.username || ""}
        onChange={e => handleFieldChange("username", e.target.value)}
        placeholder="hanya huruf kecil, angka, underscore"
        required
        pattern="^[a-z0-9_]{3,20}$"
        title="3–20 karakter: huruf kecil (a–z), angka (0–9), atau underscore (_)"
      />
      {/* >>> sampai sini <<< */}

      {isCreating && (
        <Input
          label="Password Awal"
          type="text"
          value={currentUser.password_hash}
          onChange={e => handleFieldChange("password_hash", e.target.value)}
          placeholder="Password sementara"
        />
      )}

      <Select
        label="Peran"
        value={currentUser.role}
        onChange={e => handleFieldChange("role", e.target.value)}
      >
        <option value="user">User</option>
        <option value="superuser">Superuser</option>
      </Select>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          checked={currentUser.is_active}
          onChange={e => handleFieldChange("is_active", e.target.checked)}
          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
          Aktif
        </label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button onClick={closeModal} className="bg-gray-200 text-gray-800 hover:bg-gray-300">Batal</Button>
        <Button onClick={handleSave}>{isCreating ? "Buat Pengguna" : "Simpan Perubahan"}</Button>
      </div>
    </div>
  )}
</Modal>

    </div>
  );
};

/* ===========================
   LEDGER PAGE
=========================== */
const LedgerPage = ({ ledgerEntries, transactions, users, accounts, onExport }) => {
  const [filters, setFilters] = useState({ from: "", to: "", user_id: "all" });

  const enriched = useMemo(() => {
    return ledgerEntries
      .map(le => {
        const t = transactions.find(tt => tt.id === le.transaction_id);
        if (!t) return null;
        const u = users.find(uu => uu.id === t.user_id);
        const a = accounts.find(aa => aa.id === le.account_id);
        return { ...le, transaction: t, user: u, account: a };
      })
      .filter(Boolean)
      .filter(e => {
        const d = new Date(e.transaction.date);
        const f = filters.from ? new Date(filters.from) : null;
        const to = filters.to ? new Date(filters.to) : null;
        if (f && d < f) return false;
        if (to && d > to) return false;
        if (filters.user_id !== "all" && e.transaction.user_id != filters.user_id) return false;
        return true;
      })
      .sort((a,b) => new Date(b.transaction.date) - new Date(a.transaction.date));
  }, [ledgerEntries, transactions, users, accounts, filters]);

  // --- Pagination Buku Besar ---
  const [pageLg, setPageLg] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // bisa 10/20/50

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(enriched.length / rowsPerPage)),
    [enriched.length, rowsPerPage]
  );

  const visibleRows = useMemo(() => {
    const start = (pageLg - 1) * rowsPerPage;
    return enriched.slice(start, start + rowsPerPage);
  }, [enriched, pageLg, rowsPerPage]);

  useEffect(() => {
    if (pageLg > totalPages) setPageLg(totalPages);
  }, [totalPages, pageLg]);

  const goFirstLg = () => setPageLg(1);
  const goPrevLg  = () => setPageLg(p => Math.max(1, p - 1));
  const goNextLg  = () => setPageLg(p => Math.min(totalPages, p + 1));
  const goLastLg  = () => setPageLg(totalPages);

  const handleExport = () => {
    const headers = ["Tanggal","Akun","Nasabah","Debit","Kredit","Catatan"];
    const data = enriched.map(e => ({
      tanggal: formatDate(e.transaction.date),
      akun: e.account.name,
      nasabah: e.user?.name || "-",
      debit: e.direction === "debit" ? e.amount : 0,
      kredit: e.direction === "credit" ? e.amount : 0,
      catatan: e.transaction.note,
    }));
    const csv = [
      headers.join(","), ...data.map(row => headers.map(h => JSON.stringify(row[h.toLowerCase().replace(/ /g,"_")], "")).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement("a"), { href: url, download: `buku_besar_${new Date().toISOString().split("T")[0]}.csv` });
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Buku Besar</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 border rounded-lg bg-gray-50">
        <Input label="Dari Tanggal" type="date" value={filters.from} onChange={e => setFilters({...filters, from: e.target.value})} />
        <Input label="Sampai Tanggal" type="date" value={filters.to} onChange={e => setFilters({...filters, to: e.target.value})} />
        <Select label="Nasabah" value={filters.user_id} onChange={e => setFilters({...filters, user_id: e.target.value})}>
          <option value="all">Semua Nasabah</option>
          {users.filter(u => u.role === "user").map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </Select>
        <div className="self-end">
          <Button onClick={handleExport} className="w-full bg-blue-600 hover:bg-blue-700"><DownloadIcon/> Ekspor CSV</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr><th className="px-6 py-3">Tanggal</th><th className="px-6 py-3">Akun</th><th className="px-6 py-3 hidden md:table-cell">Keterangan</th><th className="px-6 py-3 text-right">Debit</th><th className="px-6 py-3 text-right">Kredit</th></tr>
          </thead>
          <tbody>
            {visibleRows.map(e => {
              const desc = e.transaction.type === "deposit" ? `Setoran dari ${e.user?.name}` : `Penarikan oleh ${e.user?.name}`;
              return (
                <tr key={e.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{formatDate(e.transaction.date)}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {e.account.name}
                    <div className="font-normal text-gray-500 md:hidden">{desc} {e.transaction.note ? `(${e.transaction.note})` : ""}</div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">{desc} {e.transaction.note ? `(${e.transaction.note})` : ""}</td>
                  <td className="px-6 py-4 text-right">{e.direction === "debit" ? formatCurrency(e.amount) : "-"}</td>
                  <td className="px-6 py-4 text-right">{e.direction === "credit" ? formatCurrency(e.amount) : "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
          <div className="text-sm text-gray-600">
            {(() => {
              if (enriched.length === 0) return "Tidak ada data";
              const start = (pageLg - 1) * rowsPerPage + 1;
              const end = Math.min(pageLg * rowsPerPage, enriched.length);
              return `Menampilkan ${start}-${end} dari ${enriched.length} entri`;
            })()}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Baris/hal:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPageLg(1); // kembali ke halaman 1 tiap ganti ukuran
              }}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={goFirstLg} disabled={pageLg === 1} className="px-3 py-1.5 rounded border text-sm">« Awal</button>
            <button onClick={goPrevLg} disabled={pageLg === 1} className="px-3 py-1.5 rounded border text-sm">‹ Sebelumnya</button>

            <span className="px-3 py-1.5 text-sm text-gray-700">
              Halaman <b>{pageLg}</b> / {totalPages}
            </span>

            <button onClick={goNextLg} disabled={pageLg === totalPages} className="px-3 py-1.5 rounded border text-sm">Berikutnya ›</button>
            <button onClick={goLastLg} disabled={pageLg === totalPages} className="px-3 py-1.5 rounded border text-sm">Akhir »</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===========================
   MAIN APP
=========================== */
export default function App() {
  // state
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("landing");
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);

  // API helpers (dideklarasikan SEBELUM effect)
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [u, a, t, l] = await Promise.all([
        api.get("/users"), api.get("/accounts"), api.get("/transactions"), api.get("/ledger"),
      ]);
      setUsers(u.data || []); setAccounts(a.data || []); setTransactions(t.data || []); setLedgerEntries(l.data || []);
    } finally { setLoading(false); }
  };

const handleLogin = async (identifier, password) => {
  try {
    // backend sekarang menerima { identifier, password }
    const r = await api.post("/auth/login", { identifier, password });
    const user = r.data?.user;

    if (!user) {
      return { ok: false, reason: "invalid" };
    }

    setCurrentUser(user);
    const startPage = user.role === "superuser" ? "superuserDashboard" : "userDashboard";
    setPage(startPage);

    localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_PAGE, startPage);

    await fetchAll();
    return { ok: true };
  } catch (err) {
    if (err?.code === "ECONNABORTED") return { ok: false, reason: "timeout" };
    if (!err?.response) return { ok: false, reason: "network" };
    const serverMsg = err.response?.data?.error || "Terjadi kesalahan di server.";
    if (/invalid|salah/i.test(serverMsg)) {
      return { ok: false, reason: "invalid", message: serverMsg };
    }
    return { ok: false, reason: "server", message: serverMsg };
  }
};

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("login");
    localStorage.removeItem(STORAGE_USER);
    localStorage.removeItem(STORAGE_PAGE);
  };

    // --- AUTO LOGOUT KARENA TIDAK ADA AKTIVITAS ---
  const timerRef = useRef(null);
  const INACTIVITY_MS = 5 * 60 * 1000; // 5 menit
  // const INACTIVITY_MS = 5 * 1000; // 5 menit

  const scheduleLogout = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    console.log("⏱ Pasang timer auto logout baru");
    timerRef.current = setTimeout(() => {
      console.log("🚪 Auto logout triggered");
      alert("Anda otomatis keluar karena tidak ada aktivitas selama 5 menit.");
      handleLogout();
    }, INACTIVITY_MS);
  };

  useEffect(() => {
    if (!currentUser) return;

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart", "visibilitychange"];
    const onActivity = () => {
      if (document.visibilityState === "hidden") return;
      scheduleLogout();
    };

    scheduleLogout();
    events.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true }));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((ev) => window.removeEventListener(ev, onActivity));
    };
  }, [currentUser, page]);


  // CRUD
  const addDeposit = async (payload) => {
    const r = await api.post("/transactions/deposit", payload);
    await fetchAll();
    return r.data;
  };
  const addWithdrawal = async (payload) => {
    const r = await api.post("/transactions/withdrawal", payload);
    await fetchAll();
    return r.data;
  };
  const updateUser = async (user) => { await api.put(`/users/${user.id}`, user); await fetchAll(); };
  const createUser = async (user) => { await api.post("/users", user); await fetchAll(); };

// AI via backend proxy
const aiGenerate = async (prompt, systemInstruction = "", kind) => {
  try {
    const r = await api.post("/ai/generate", { prompt, systemInstruction, kind });
    const j = r.data || {};
    if (j.text) return j.text;           // sukses atau fallback tetap punya text
    return "Maaf, AI sedang sibuk. Coba lagi sebentar lagi.";
  } catch (e) {
    console.error("AI error:", e?.response?.data || e.message);
    return "Maaf, AI sedang sibuk. Coba lagi sebentar lagi.";  // jangan return "" supaya tidak blank
  }
};




  const exportCSV = (headers, rows, filename) => {
    const csv = [headers.join(","), ...rows.map(row => headers.map(h => JSON.stringify(row[h.toLowerCase().replace(/ /g,"_")], "")).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: filename });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  /* ========= EFFECTS (semua sebelum return) ========= */
// load dari localStorage saat boot
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_USER);
    const savedPage = localStorage.getItem(STORAGE_PAGE);

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setPage(savedPage || "userDashboard");
    } else {
      setPage("landing");   // kalau tidak ada user, fallback ke landing
    }

    setBooting(false);
  }, []);


  // simpan user ke localStorage saat berubah
  useEffect(() => {
    if (currentUser) localStorage.setItem(STORAGE_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  // simpan halaman terakhir
  useEffect(() => {
    if (currentUser) localStorage.setItem(STORAGE_PAGE, page);
  }, [page, currentUser]);

  // setelah user ada (login / refresh) → tarik semua data
  useEffect(() => {
    if (currentUser) fetchAll();
  }, [currentUser]);

  // helper render
  const renderPage = () => {
    switch (page) {
      case "userDashboard":
        return (
          <UserDashboard
            user={currentUser}
            users={users}
            transactions={transactions}
            onExport={exportCSV}
            onGenerateTip={aiGenerate}
            onGeneratePlan={aiGenerate}
          />
        );
      case "superuserDashboard":
        return (
          <SuperuserDashboard
            users={users}
            transactions={transactions}
            onGenerateSummary={aiGenerate}
            onGenerateAnnouncement={aiGenerate}
          />
        );
      case "transactionEntry":
        return (
          <TransactionEntryPage
            users={users}
            transactions={transactions}
            onAddDeposit={addDeposit}
            onAddWithdrawal={addWithdrawal}
            onSetPage={setPage}
          />
        );
      case "userManagement":
        return <UserManagementPage users={users} onUpdateUser={updateUser} onCreateUser={createUser} />;
      case "ledger":
        return (
          <LedgerPage
            ledgerEntries={ledgerEntries}
            transactions={transactions}
            users={users}
            accounts={accounts}
            onExport={exportCSV}
          />
        );
      default:
        return <div>Halaman tidak ditemukan.</div>;
    }
  };

  // ...di dalam App()
  if (booting) {
    return <div className="flex items-center justify-center min-h-screen">Memuat...</div>;
  }

  if (!currentUser) {
    // belum login
    if (page === "landing") {
      return <LandingPage onGetStarted={() => setPage("login")} />;
    }
    // sudah klik "Mulai Sekarang" / "Masuk", tampilkan Login
    return (
    <LoginPage
      onLogin={handleLogin}
      onBack={() => setPage("landing")}
    />
    );
  }


return (
  <div className="relative min-h-screen font-sans bg-gradient-to-br from-amber-50 via-rose-50 to-sky-50 overflow-hidden">

    {/* dekorasi global halaman */}
    <div className="pointer-events-none absolute -top-24 -left-24 w-[340px] h-[340px] bg-orange-200/50 rounded-full blur-3xl" />
    <div className="pointer-events-none absolute -bottom-28 -right-24 w-[380px] h-[380px] bg-rose-200/50 rounded-full blur-3xl" />
    <div className="pointer-events-none absolute top-24 right-20 w-[180px] h-[180px] bg-amber-100/60 rounded-full blur-2xl" />

    <nav className="bg-white/90 backdrop-blur-md shadow-md relative z-10">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 md:h-20">
            <div className="flex items-center space-x-3">
              <LogoIcon />
              <span className="text-xl font-bold text-gray-800 font-display">KotakSenyum DWP</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                {currentUser.role === "superuser" ? (
                  <>
                    <button onClick={() => setPage("superuserDashboard")} className="nav-link">Dashboard</button>
                    <button onClick={() => setPage("transactionEntry")} className="nav-link">Entry Transaksi</button>
                    <button onClick={() => setPage("userManagement")} className="nav-link">Manajemen User</button>
                    <button onClick={() => setPage("ledger")} className="nav-link">Buku Besar</button>
                  </>
                ) : (
                  <button onClick={() => setPage("userDashboard")} className="nav-link">Dashboard</button>
                )}
              </div>
              <hr className="w-full border-gray-200 sm:hidden" />
              <div className="flex items-center gap-3 pt-2 sm:pt-0">
                <span className="text-sm text-gray-700">Halo, <span className="font-semibold">{currentUser.name}</span></span>
                <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:text-red-500">Logout</button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="text-sm text-gray-500">Memuat data…</div>
        </div>
      )}

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{renderPage()}</main>

      <style>{`
        .nav-link {
          padding: 0.5rem 0.75rem;
          border-radius: 0.375rem;
          font-weight: 500;
          color: #4b5563;
          transition: background-color 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .nav-link:hover { background-color: #fef3c7; color: #b45309; }
      `}</style>
    </div>
  );
}

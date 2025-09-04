import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- ICONS (Inline SVG for simplicity) ---
const LogoIcon = () => (
    <div 
        style={{
            backgroundImage: `url("https://samsattulungagung.com/wp-content/uploads/2024/07/gayatri-kecilldpi-1526x1536.png")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
        }}
        className="h-10 w-10"
        role="img"
        aria-label="Celengan DWP Gayatri Logo"
    />
);
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-pen-line"><path d="m18 5-3-3H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-3-3Z"/><path d="M8 18h1"/><path d="M18.4 9.6a2 2 0 1 1 3 3L17 17l-4 1 1-4Z"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>;
const SparklesIcon = ({className = "w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-sparkles ${className}`}><path d="m12 3-1.9 1.9a2.5 2.5 0 0 0 0 3.8L12 10l1.9-1.9a2.5 2.5 0 0 0 0-3.8L12 3Z"/><path d="M5 11 3 9l1.9-1.9a2.5 2.5 0 0 1 3.8 0L10 9 8.1 10.9a2.5 2.5 0 0 1-3.8 0Z"/><path d="M19 11 17 9l1.9-1.9a2.5 2.5 0 0 1 3.8 0L24 9l-1.9 1.9a2.5 2.5 0 0 1-3.8 0Z"/><path d="m12 21-1.9-1.9a2.5 2.5 0 0 1 0-3.8L12 14l1.9 1.9a2.5 2.5 0 0 1 0 3.8L12 21Z"/></svg>;
const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const WhatsAppIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor" className="w-6 h-6"><path d="M16.75 13.96c.25.13.43.2.5.33.07.13.07.68-.16 1.32-.23.64-.75 1.16-1.29 1.38-.54.22-1.14.22-1.78.07-.64-.15-1.32-.33-2.68-1.04-1.36-.7-2.25-1.55-3.08-2.8-1.1-1.65-1.36-2.93-1.36-3.18 0-.25.13-.5.25-.64.13-.13.25-.13.38-.13h.38c.13 0 .25.07.38.38l.13.25c.13.25.25.5.38.75s.13.38.07.64c-.07.25-.07.38-.25.64l-.38.38c-.13.13-.07.38.07.64.13.25.38.64.75 1.14.75 1 1.39 1.29 1.64 1.39.25.13.38.07.64-.13l.38-.5c.25-.25.5-.38.75-.25l.88.5c.25.13.5.25.64.38.13.13.13.25.07.5zM12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10zm0 18.13a8.13 8.13 0 1 1 8.13-8.13 8.14 8.14 0 0 1-8.13 8.13z"/></svg>;


// --- DUMMY DATA SEED ---
const initialData = {
    users: [
        { id: 1, name: 'Bendahara Agung', email: 'superuser@gayatri.com', phone: '081234567890', role: 'superuser', password_hash: 'admin123', is_active: true, created_at: '2023-01-01T10:00:00Z' },
        { id: 2, name: 'Budi Santoso', email: 'budi@example.com', phone: '081111111111', role: 'user', password_hash: 'user123', is_active: true, created_at: '2023-01-05T11:00:00Z' },
        { id: 3, name: 'Citra Lestari', email: 'citra@example.com', phone: '082222222222', role: 'user', password_hash: 'user123', is_active: true, created_at: '2023-01-06T12:00:00Z' },
        { id: 4, name: 'Dedi Mulyadi', email: 'dedi@example.com', phone: '083333333333', role: 'user', password_hash: 'user123', is_active: true, created_at: '2023-01-07T13:00:00Z' },
        { id: 5, name: 'Eka Putri', email: 'eka@example.com', phone: '084444444444', role: 'user', password_hash: 'user123', is_active: true, created_at: '2023-01-08T14:00:00Z' },
        { id: 6, name: 'Fajar Nugroho', email: 'fajar@example.com', phone: '085555555555', role: 'user', password_hash: 'user123', is_active: false, created_at: '2023-01-09T15:00:00Z' },
    ],
    accounts: [
        { id: 101, code: 'KAS', name: 'Kas', type: 'asset', created_at: '2023-01-01T00:00:00Z' },
        { id: 201, code: 'TABUNGAN_USER', name: 'Tabungan User', type: 'liability', created_at: '2023-01-01T00:00:00Z' },
    ],
    transactions: [],
    ledger_entries: [],
};

// --- HELPER FUNCTIONS ---
const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
const calculateBalance = (userId, allTransactions) => allTransactions
    .filter(t => t.user_id === userId)
    .reduce((acc, t) => acc + (t.type === 'deposit' ? t.amount : -t.amount), 0);
const generateCSV = (headers, data) => {
    const csvRows = [
        headers.join(','),
        ...data.map(row => headers.map(header => JSON.stringify(row[header.toLowerCase().replace(/ /g, '_')], '')).join(','))
    ];
    return csvRows.join('\n');
};

const downloadCSV = (csvString, filename) => {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// Seed initial transactions
const seedTransactions = (data) => {
    let transactionId = 1;
    let ledgerEntryId = 1;

    const createTransaction = (userId, date, amount, note, type) => {
        const newTransaction = {
            id: transactionId++,
            user_id: userId,
            date,
            amount,
            method: 'Tunai Manual',
            note,
            type, // 'deposit' or 'withdrawal'
            created_at: new Date().toISOString(),
        };
        data.transactions.push(newTransaction);

        const isDeposit = type === 'deposit';
        data.ledger_entries.push({
            id: ledgerEntryId++,
            transaction_id: newTransaction.id,
            account_id: 101, // KAS
            direction: isDeposit ? 'debit' : 'credit',
            amount,
        });
        data.ledger_entries.push({
            id: ledgerEntryId++,
            transaction_id: newTransaction.id,
            account_id: 201, // TABUNGAN_USER
            direction: isDeposit ? 'credit' : 'debit',
            amount,
        });
    };

    // Dummy deposits
    createTransaction(2, '2023-01-10T10:00:00Z', 50000, 'Setoran awal', 'deposit');
    createTransaction(2, '2023-01-15T11:00:00Z', 75000, 'Tabungan mingguan', 'deposit');
    createTransaction(2, '2023-02-01T09:00:00Z', 100000, 'Gajian', 'deposit');
    createTransaction(3, '2023-01-12T14:00:00Z', 150000, 'Setoran pertama', 'deposit');
    createTransaction(3, '2023-02-05T16:00:00Z', 200000, 'Bonus', 'deposit');
    createTransaction(4, '2023-01-18T08:00:00Z', 200000, 'Tabungan rutin', 'deposit');
    createTransaction(4, '2023-02-18T08:30:00Z', 150000, 'Sisa belanja', 'deposit');
    createTransaction(5, '2023-01-25T13:00:00Z', 80000, '', 'deposit');
    createTransaction(5, '2023-02-20T11:00:00Z', 120000, 'Tabungan', 'deposit');
    
    // Dummy withdrawal
    createTransaction(2, '2023-02-25T10:00:00Z', 40000, 'Keperluan mendadak', 'withdrawal');
};

seedTransactions(initialData);

// --- Gemini API Helper ---
const callGeminiAPI = async (prompt, systemInstruction = "") => {
    // API key is intentionally left blank.
    // The execution environment will automatically provide it.
    const apiKey = ""; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
    };

    if (systemInstruction) {
        payload.systemInstruction = {
            parts: [{ text: systemInstruction }]
        };
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("API Error Response:", errorBody);
            throw new Error(`API call failed with status: ${response.status}`);
        }

        const result = await response.json();
        const candidate = result.candidates?.[0];

        if (candidate && candidate.content?.parts?.[0]?.text) {
            return candidate.content.parts[0].text;
        } else {
            console.error("Unexpected API response structure:", result);
            return "Tidak dapat menghasilkan respons. Struktur respons tidak valid.";
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return "Maaf, terjadi kesalahan saat menghubungi layanan AI. Silakan coba lagi nanti.";
    }
};


// --- UI Components ---
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

const Button = ({ children, onClick, className = 'bg-amber-500 hover:bg-amber-600', type = 'button', disabled = false }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 transition duration-200 flex items-center justify-center gap-2 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {children}
    </button>
);


const Input = ({ label, type, value, onChange, placeholder, required = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
        />
    </div>
);

const FormattedCurrencyInput = ({ label, value, onChange, placeholder, required = false }) => {
    const handleInputChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        onChange(rawValue);
    };

    const formattedValue = new Intl.NumberFormat('id-ID').format(value || 0);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type="text"
                value={value === '' ? '' : formattedValue}
                onChange={handleInputChange}
                placeholder={placeholder}
                required={required}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
        </div>
    );
};


const Select = ({ label, value, onChange, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <select
            value={value}
            onChange={onChange}
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
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

// --- Main Application Pages/Components ---

const LoginPage = ({ onLogin, onSetPage, onRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (isRegister) {
            if (!name || !email || !password || !phone) {
                setError('Semua field wajib diisi.');
                return;
            }
            onRegister({name, email, phone, password});
        } else {
            const success = onLogin(email, password);
            if (!success) {
                setError('Email atau password salah.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                 <div className="flex justify-center items-center mb-6 space-x-3">
                    <LogoIcon />
                    <h1 className="text-3xl font-bold text-gray-800">Celengan DWP Gayatri</h1>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">{isRegister ? 'Registrasi Akun Baru' : 'Login'}</h2>
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isRegister && (
                            <>
                                <Input label="Nama Lengkap" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Anda" required />
                                <Input label="No. Handphone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08123..." required />
                            </>
                        )}
                        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="anda@email.com" required />
                        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                        
                        <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">{isRegister ? 'Daftar' : 'Login'}</Button>
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-6">
                        {isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'}
                        <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="font-medium text-amber-600 hover:text-amber-500 ml-1">
                            {isRegister ? 'Login di sini' : 'Daftar di sini'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- USER ROLE PAGES ---
const UserDashboard = ({ user, users, transactions, onExport }) => {
    const [savingsTip, setSavingsTip] = useState('');
    const [isGeneratingTip, setIsGeneratingTip] = useState(false);
    const [goal, setGoal] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [savingsPlan, setSavingsPlan] = useState('');
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

    const superadmin = useMemo(() => users.find(u => u.role === 'superuser'), [users]);

    const whatsAppUrl = useMemo(() => {
        if (!superadmin || !superadmin.phone) return '#';
        const phone = superadmin.phone.startsWith('0') ? '62' + superadmin.phone.substring(1) : superadmin.phone;
        const message = encodeURIComponent(`Halo Bendahara, saya ${user.name} (ID: ${user.id}). `);
        return `https://wa.me/${phone}?text=${message}`;
    }, [superadmin, user.name, user.id]);

    const userTransactions = useMemo(() =>
        transactions
            .filter(t => t.user_id === user.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date)),
        [transactions, user.id]
    );

    const balance = useMemo(() => calculateBalance(user.id, transactions), [user.id, transactions]);

    const chartData = useMemo(() => {
        const dataMap = new Map();
        let cumulativeAmount = 0;
        const chronologicalTransactions = [...userTransactions].reverse();
        
        chronologicalTransactions.forEach(t => {
            const date = new Date(t.date).toLocaleDateString('fr-CA');
             cumulativeAmount += (t.type === 'deposit' ? t.amount : -t.amount);
            dataMap.set(date, cumulativeAmount);
        });
        
        return Array.from(dataMap.entries()).map(([date, balance]) => {
            return { date: formatDate(date).substring(3), balance };
        });
    }, [userTransactions]);
    
    const handleExport = () => {
        const headers = ['Tanggal', 'Tipe', 'Jumlah', 'Metode', 'Catatan'];
        const data = userTransactions.map(t => ({
            tanggal: formatDate(t.date),
            tipe: t.type,
            jumlah: t.amount,
            metode: t.method,
            catatan: t.note
        }));
        onExport(headers, data, `riwayat_transaksi_${user.name.replace(/ /g, '_')}.csv`);
    };

    const handleGenerateTip = async () => {
        setIsGeneratingTip(true);
        setSavingsTip('');
        const prompt = `Berikan satu tips menabung yang singkat, kreatif, dan memotivasi dalam Bahasa Indonesia untuk ${user.name}. Saldo tabungannya saat ini adalah ${formatCurrency(balance)}. Buatlah seolah-olah Anda adalah seorang pelatih keuangan yang ramah.`;
        const systemInstruction = "Anda adalah asisten keuangan yang ceria dan suportif.";
        const tip = await callGeminiAPI(prompt, systemInstruction);
        setSavingsTip(tip);
        setIsGeneratingTip(false);
    };
    
    const handleGeneratePlan = async () => {
        if (!goal || !goalAmount) return;
        setIsGeneratingPlan(true);
        setSavingsPlan('');
        const prompt = `Saya ${user.name}, ingin punya rencana menabung. Tujuan saya adalah "${goal}" dengan target ${formatCurrency(goalAmount)}. Saldo saya saat ini ${formatCurrency(balance)}. Buatkan rencana menabung sederhana dalam beberapa poin (maksimal 3-4 poin) yang memotivasi dan realistis dalam Bahasa Indonesia.`;
        const systemInstruction = "Anda adalah perencana keuangan yang handal dan memberikan semangat.";
        const plan = await callGeminiAPI(prompt, systemInstruction);
        setSavingsPlan(plan);
        setIsGeneratingPlan(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800">Dashboard Anda</h2>
                <div className="bg-white p-4 rounded-lg shadow-md text-right w-full sm:w-auto">
                    <p className="text-md text-gray-500">Saldo Saat Ini</p>
                    <p className="text-3xl font-bold text-amber-600">{formatCurrency(balance)}</p>
                </div>
            </div>

            {/* AI Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Savings Plan */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <div className="flex items-center gap-3 mb-4">
                        <TargetIcon className="w-8 h-8 text-amber-500" />
                        <h3 className="text-xl font-semibold text-gray-700">🎯 Rencana Tabungan Pribadi</h3>
                    </div>
                    <div className="space-y-4">
                        <Input label="Apa impianmu?" value={goal} onChange={e => setGoal(e.target.value)} placeholder="Contoh: Liburan ke Bali" />
                        <FormattedCurrencyInput label="Target Tabungan (Rp)" value={goalAmount} onChange={setGoalAmount} placeholder="Contoh: 5.000.000" />
                        <Button onClick={handleGeneratePlan} disabled={isGeneratingPlan || !goal || !goalAmount} className="w-full bg-green-600 hover:bg-green-700">
                           <SparklesIcon/> {isGeneratingPlan ? 'Membuat Rencana...' : 'Buatkan Saya Rencana!'}
                        </Button>
                    </div>
                     {savingsPlan && (
                        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-r-lg whitespace-pre-wrap font-sans">
                            <h4 className="font-bold mb-2">Rencana untuk "{goal}":</h4>
                            {savingsPlan.split('\n').map((line, index) => <p key={index} className="mb-1">{line}</p>)}
                        </div>
                    )}
                </div>

                {/* Savings Tip */}
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Butuh Inspirasi Harian?</h3>
                    <Button onClick={handleGenerateTip} disabled={isGeneratingTip} className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900">
                        <SparklesIcon /> {isGeneratingTip ? 'Sedang berpikir...' : 'Beri Saya Tips Menabung'}
                    </Button>
                    {savingsTip && (
                        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-r-lg">
                             <p className="text-sm italic">"{savingsTip}"</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Contact Admin Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-3 mb-2">
                    <WhatsAppIcon />
                    <h3 className="text-xl font-semibold text-gray-700">Hubungi Bendahara</h3>
                </div>
                <p className="text-gray-600 mb-4 text-sm">
                   Untuk melakukan setoran via transfer, konfirmasi data, atau jika ada pertanyaan lain, silakan hubungi Bendahara langsung melalui tombol WhatsApp di bawah.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                    <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-green-500 hover:bg-green-600 text-white">
                            <WhatsAppIcon /> Hubungi via WhatsApp
                        </Button>
                    </a>
                </div>
            </div>


            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Grafik Progres Tabungan</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(value) => `Rp${value/1000}k`} width={80} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Line type="monotone" dataKey="balance" name="Saldo" stroke="#f59e0b" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <h3 className="text-xl font-semibold text-gray-700">Riwayat Transaksi</h3>
                    <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 text-sm py-1.5 px-3">
                       <DownloadIcon/> Ekspor CSV
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Tanggal</th>
                                <th scope="col" className="px-6 py-3">Jumlah</th>
                                <th scope="col" className="px-6 py-3 hidden sm:table-cell">Catatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userTransactions.map(t => (
                                <tr key={t.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{formatDate(t.date)}</td>
                                    <td className={`px-6 py-4 font-semibold ${t.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type === 'deposit' ? '+' : '-'} {formatCurrency(t.amount)}
                                        <p className="font-normal text-gray-500 sm:hidden">{t.note || ''}</p>
                                    </td>
                                    <td className="px-6 py-4 hidden sm:table-cell">{t.note || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- SUPERUSER ROLE PAGES ---
const SuperuserDashboard = ({ users, transactions }) => {
    const [financialSummary, setFinancialSummary] = useState('');
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [announcement, setAnnouncement] = useState('');
    const [isGeneratingAnnouncement, setIsGeneratingAnnouncement] = useState(false);


    const totalKas = useMemo(() => transactions.reduce((sum, t) => sum + (t.type === 'deposit' ? t.amount : -t.amount), 0), [transactions]);
    const totalLiability = useMemo(() => {
      const userBalances = users
        .filter(u => u.role === 'user')
        .map(u => calculateBalance(u.id, transactions));
      return userBalances.reduce((sum, balance) => sum + balance, 0);
    }, [users, transactions]);

    const activeUsers = useMemo(() => users.filter(u => u.is_active && u.role === 'user').length, [users]);
    
    const monthlyDeposits = useMemo(() => {
        const deposits = {};
        transactions.forEach(t => {
            const month = new Date(t.date).toLocaleString('id-ID', { month: 'short', year: 'numeric' });
            if (!deposits[month]) {
                deposits[month] = 0;
            }
             if (t.type === 'deposit') {
                deposits[month] += t.amount;
            }
        });
        return Object.entries(deposits).map(([name, total]) => ({ name, total })).reverse();
    }, [transactions]);
    
    const recentTransactions = useMemo(() => 
        transactions
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)
            .map(t => ({...t, user: users.find(u => u.id === t.user_id)})),
    [transactions, users]);
    
    const handleGenerateSummary = async () => {
        setIsGeneratingSummary(true);
        setFinancialSummary('');
        const dataString = monthlyDeposits.map(d => `${d.name}: ${formatCurrency(d.total)}`).join(', ');
        const prompt = `Anda adalah seorang bendahara untuk program tabungan komunitas "Celengan DWP Gayatri". Total dana terkumpul saat ini adalah ${formatCurrency(totalKas)}. Berdasarkan data total setoran (bukan penarikan) per bulan berikut: ${dataString}, buatlah ringkasan singkat (2-3 kalimat) dalam Bahasa Indonesia yang informatif dan positif. Sebutkan total dana terkumpul yang benar, identifikasi bulan dengan setoran tertinggi, dan berikan kalimat penyemangat.`;
        const summary = await callGeminiAPI(prompt);
        setFinancialSummary(summary);
        setIsGeneratingSummary(false);
    };

    const handleGenerateAnnouncement = async () => {
        setIsGeneratingAnnouncement(true);
        setAnnouncement('');
        const prompt = `Buatkan draf pengumuman singkat (1-2 paragraf) untuk anggota komunitas tabungan "Celengan DWP Gayatri". Sampaikan informasi berikut dengan gaya bahasa yang ramah dan memotivasi: 
        1. Total saldo kas saat ini adalah ${formatCurrency(totalKas)}.
        2. Jumlah anggota aktif adalah ${activeUsers} orang.
        3. Ajak para anggota untuk terus bersemangat menabung demi mencapai tujuan bersama.
        Gunakan sapaan seperti "Ibu-ibu Hebat" atau yang sejenisnya.`;
        const result = await callGeminiAPI(prompt, "Anda adalah seorang bendahara yang komunikatif dan pandai menyemangati anggota.");
        setAnnouncement(result);
        setIsGeneratingAnnouncement(false);
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Dashboard Bendahara</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="Total Saldo Kas" value={formatCurrency(totalKas)} icon={<DollarSignIcon />} />
                <Card title="Total Tabungan Nasabah" value={formatCurrency(totalLiability)} icon={<BookOpenIcon />} subtext="Total liability" />
                <Card title="Jumlah Nasabah Aktif" value={activeUsers} icon={<UsersIcon />} />
            </div>

             {/* Gemini Feature Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h3 className="text-xl font-semibold text-gray-700 mb-4">Asisten Cerdas Bendahara</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Summary */}
                    <div>
                        <Button onClick={handleGenerateSummary} disabled={isGeneratingSummary} className="w-full bg-indigo-600 hover:bg-indigo-700">
                            <SparklesIcon /> {isGeneratingSummary ? 'Menganalisis...' : 'Buat Ringkasan Keuangan'}
                        </Button>
                        {financialSummary && (
                            <div className="mt-4 p-4 bg-indigo-50 border-l-4 border-indigo-500 text-indigo-800 rounded-r-lg whitespace-pre-wrap">
                                <p>{financialSummary}</p>
                            </div>
                        )}
                    </div>
                    {/* Announcement */}
                     <div>
                        <Button onClick={handleGenerateAnnouncement} disabled={isGeneratingAnnouncement} className="w-full bg-teal-600 hover:bg-teal-700">
                            <SparklesIcon /> {isGeneratingAnnouncement ? 'Menyusun Kata...' : 'Buat Draf Pengumuman'}
                        </Button>
                         {announcement && (
                            <div className="mt-4 p-4 bg-teal-50 border-l-4 border-teal-500 text-teal-800 rounded-r-lg">
                               <textarea readOnly value={announcement} className="w-full h-32 p-2 bg-transparent border-0 focus:ring-0 text-sm" />
                            </div>
                        )}
                    </div>
                 </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Total Setoran per Bulan</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyDeposits} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `Rp${value/1000}k`} width={80} />
                        <Tooltip formatter={(value) => formatCurrency(value)}/>
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
                            <tr>
                                <th scope="col" className="px-6 py-3">Tanggal</th>
                                <th scope="col" className="px-6 py-3">Nasabah</th>
                                <th scope="col" className="px-6 py-3">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map(t => (
                                <tr key={t.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{formatDate(t.date)}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{t.user?.name || 'N/A'}</td>
                                    <td className={`px-6 py-4 font-semibold ${t.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                                       {t.type === 'deposit' ? '+' : '-'} {formatCurrency(t.amount)}
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

const TransactionEntryPage = ({ users, transactions, onAddDeposit, onAddWithdrawal, onSetPage }) => {
    const [activeTab, setActiveTab] = useState('deposit');
    const [userId, setUserId] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const activeUsers = users.filter(u => u.is_active && u.role === 'user');
    const selectedUserBalance = useMemo(() => {
        if (!userId) return 0;
        return calculateBalance(parseInt(userId), transactions);
    }, [userId, transactions]);
    
    useEffect(() => {
        if (activeUsers.length > 0 && !userId) {
            setUserId(activeUsers[0].id);
        }
    }, [activeUsers, userId]);

    const resetForm = () => {
        setAmount('');
        setNote('');
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!userId || !amount || !date) {
            setError('Nasabah, jumlah, dan tanggal wajib diisi.');
            return;
        }
        
        const numericAmount = parseFloat(amount);
        if (numericAmount <= 0) {
            setError('Jumlah transaksi harus positif.');
            return;
        }
        
        if (activeTab === 'withdrawal' && numericAmount > selectedUserBalance) {
            setError('Saldo nasabah tidak mencukupi untuk penarikan ini.');
            return;
        }
        
        const transactionData = {
            user_id: parseInt(userId),
            amount: numericAmount,
            date: new Date(date).toISOString(),
            note,
        };
        
        if(activeTab === 'deposit') {
            onAddDeposit(transactionData);
        } else {
            onAddWithdrawal(transactionData);
        }
        
        const actionText = activeTab === 'deposit' ? 'Setoran' : 'Penarikan';
        setSuccess(`${actionText} untuk ${users.find(u=>u.id == userId)?.name} berhasil ditambahkan.`);
        resetForm();
        setTimeout(() => setSuccess(''), 3000);
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Entry Transaksi</h2>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => { setActiveTab('deposit'); resetForm(); }}
                        className={`${activeTab === 'deposit' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Setoran
                    </button>
                    <button
                        onClick={() => { setActiveTab('withdrawal'); resetForm(); }}
                        className={`${activeTab === 'withdrawal' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Penarikan
                    </button>
                </nav>
            </div>

            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
            {success && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-sm">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Select label="Pilih Nasabah" value={userId} onChange={(e) => setUserId(e.target.value)}>
                    {activeUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </Select>
                
                {activeTab === 'withdrawal' && userId && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
                        Saldo tersedia untuk nasabah ini: <span className="font-bold">{formatCurrency(selectedUserBalance)}</span>
                    </div>
                )}
                
                <Input label="Tanggal Transaksi" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                <FormattedCurrencyInput label="Jumlah (Rp)" value={amount} onChange={setAmount} placeholder="Contoh: 50.000" required />
                <Input label="Catatan (Opsional)" type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Catatan transaksi" />
                <div className="flex justify-end pt-4 space-x-3">
                    <Button onClick={() => onSetPage('superuserDashboard')} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Kembali</Button>
                    <Button type="submit">Simpan {activeTab === 'deposit' ? 'Setoran' : 'Penarikan'}</Button>
                </div>
            </form>
        </div>
    );
};


const UserManagementPage = ({ users, onUpdateUser, onCreateUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    const openModal = (user) => {
        setCurrentUser(user ? {...user} : {name:'', email:'', phone:'', role:'user', password_hash:'', is_active: true});
        setIsCreating(!user);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentUser(null);
    };
    
    const handleSave = () => {
        if (isCreating) {
            onCreateUser(currentUser);
        } else {
            onUpdateUser(currentUser);
        }
        closeModal();
    };

    const handleFieldChange = (field, value) => {
        setCurrentUser(prev => ({ ...prev, [field]: value }));
    };

    const toggleActiveStatus = (user) => {
        onUpdateUser({ ...user, is_active: !user.is_active });
    };

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
                            <th className="px-6 py-3 hidden md:table-cell">Peran</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{user.name}
                                    <div className="font-normal text-gray-500 sm:hidden">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 hidden sm:table-cell">{user.email}<br/><span className="text-xs text-gray-400">{user.phone}</span></td>
                                <td className="px-6 py-4 hidden md:table-cell">{user.role}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.is_active ? 'Aktif' : 'Non-Aktif'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex items-center space-x-2">
                                    <button onClick={() => openModal(user)} className="text-blue-600 hover:text-blue-800"><EditIcon/></button>
                                    <button onClick={() => toggleActiveStatus(user)} className="text-red-600 hover:text-red-800"><TrashIcon/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={isCreating ? "Tambah Pengguna Baru" : "Edit Pengguna"}>
                {currentUser && (
                    <div className="space-y-4">
                         <Input label="Nama Lengkap" type="text" value={currentUser.name} onChange={(e) => handleFieldChange('name', e.target.value)} />
                         <Input label="Email" type="email" value={currentUser.email} onChange={(e) => handleFieldChange('email', e.target.value)} />
                         <Input label="No. Telepon" type="text" value={currentUser.phone} onChange={(e) => handleFieldChange('phone', e.target.value)} />
                         { isCreating && <Input label="Password Awal" type="text" value={currentUser.password_hash} onChange={(e) => handleFieldChange('password_hash', e.target.value)} placeholder="Password sementara" />}
                         <Select label="Peran" value={currentUser.role} onChange={(e) => handleFieldChange('role', e.target.value)}>
                            <option value="user">User</option>
                            <option value="superuser">Superuser</option>
                        </Select>
                        <div className="flex items-center">
                            <input type="checkbox" id="is_active" checked={currentUser.is_active} onChange={(e) => handleFieldChange('is_active', e.target.checked)} className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded" />
                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Aktif</label>
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

const LedgerPage = ({ ledgerEntries, transactions, users, accounts, onExport }) => {
    const [filters, setFilters] = useState({ from: '', to: '', user_id: 'all' });

    const enrichedLedger = useMemo(() => {
        return ledgerEntries
            .map(entry => {
                const transaction = transactions.find(t => t.id === entry.transaction_id);
                if (!transaction) return null;
                const user = users.find(u => u.id === transaction.user_id);
                const account = accounts.find(a => a.id === entry.account_id);
                return { ...entry, transaction, user, account };
            })
            .filter(Boolean) // Remove nulls
            .filter(entry => {
                const date = new Date(entry.transaction.date);
                const from = filters.from ? new Date(filters.from) : null;
                const to = filters.to ? new Date(filters.to) : null;
                if (from && date < from) return false;
                if (to && date > to) return false;
                if (filters.user_id !== 'all' && entry.transaction.user_id != filters.user_id) return false;
                return true;
            })
            .sort((a,b) => new Date(b.transaction.date) - new Date(a.transaction.date));
    }, [ledgerEntries, transactions, users, accounts, filters]);
    
    const handleExport = () => {
        const headers = ['Tanggal', 'Akun', 'Nasabah', 'Debit', 'Kredit', 'Catatan'];
        const data = enrichedLedger.map(e => ({
            tanggal: formatDate(e.transaction.date),
            akun: e.account.name,
            nasabah: e.user?.name || '-',
            debit: e.direction === 'debit' ? e.amount : 0,
            kredit: e.direction === 'credit' ? e.amount : 0,
            catatan: e.transaction.note,
        }));
        onExport(headers, data, `buku_besar_${new Date().toISOString().split('T')[0]}.csv`);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Buku Besar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 border rounded-lg bg-gray-50">
                <Input label="Dari Tanggal" type="date" value={filters.from} onChange={e => setFilters({...filters, from: e.target.value})} />
                <Input label="Sampai Tanggal" type="date" value={filters.to} onChange={e => setFilters({...filters, to: e.target.value})} />
                <Select label="Nasabah" value={filters.user_id} onChange={e => setFilters({...filters, user_id: e.target.value})}>
                    <option value="all">Semua Nasabah</option>
                    {users.filter(u=>u.role==='user').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </Select>
                <div className="self-end">
                    <Button onClick={handleExport} className="w-full bg-blue-600 hover:bg-blue-700">
                        <DownloadIcon/> Ekspor CSV
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Tanggal</th>
                            <th className="px-6 py-3">Akun</th>
                            <th className="px-6 py-3 hidden md:table-cell">Keterangan</th>
                            <th className="px-6 py-3 text-right">Debit</th>
                            <th className="px-6 py-3 text-right">Kredit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrichedLedger.map(entry => {
                            const desc = entry.transaction.type === 'deposit' 
                                ? `Setoran dari ${entry.user?.name}`
                                : `Penarikan oleh ${entry.user?.name}`;

                            return (
                                <tr key={entry.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{formatDate(entry.transaction.date)}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{entry.account.name}
                                        <div className="font-normal text-gray-500 md:hidden">{desc} {entry.transaction.note ? `(${entry.transaction.note})` : ''}</div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">{desc} {entry.transaction.note ? `(${entry.transaction.note})` : ''}</td>
                                    <td className="px-6 py-4 text-right">{entry.direction === 'debit' ? formatCurrency(entry.amount) : '-'}</td>
                                    <td className="px-6 py-4 text-right">{entry.direction === 'credit' ? formatCurrency(entry.amount) : '-'}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// --- Main App Component ---
export default function App() {
    // --- STATE MANAGEMENT (Simulating Backend & Database) ---
    const [currentUser, setCurrentUser] = useState(null);
    const [page, setPage] = useState('login'); // login, userDashboard, superuserDashboard, etc.
    const [users, setUsers] = useState(initialData.users);
    const [accounts, setAccounts] = useState(initialData.accounts);
    const [transactions, setTransactions] = useState(initialData.transactions);
    const [ledgerEntries, setLedgerEntries] = useState(initialData.ledger_entries);

    // --- AUTHENTICATION LOGIC ---
    const handleLogin = (email, password) => {
        const user = users.find(u => u.email === email && u.password_hash === password);
        if (user) {
            setCurrentUser(user);
            setPage(user.role === 'superuser' ? 'superuserDashboard' : 'userDashboard');
            return true;
        }
        return false;
    };
    
    const handleRegister = (newUser) => {
        const newId = Math.max(...users.map(u => u.id)) + 1;
        const user = {
            id: newId,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: 'user',
            password_hash: newUser.password,
            is_active: true,
            created_at: new Date().toISOString(),
        };
        setUsers(prevUsers => [...prevUsers, user]);
        setCurrentUser(user);
        setPage('userDashboard');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setPage('login');
    };
    
    // --- DATA MANIPULATION LOGIC (CRUD) ---
    const addTransaction = (transactionData, type) => {
        const newTransactionId = Math.max(0, ...transactions.map(t => t.id)) + 1;
        const newLedgerEntryIdStart = Math.max(0, ...ledgerEntries.map(le => le.id)) + 1;

        const newTransaction = {
            id: newTransactionId,
            ...transactionData,
            method: 'Tunai Manual',
            type, // 'deposit' or 'withdrawal'
            created_at: new Date().toISOString(),
        };
        setTransactions(prev => [...prev, newTransaction]);
        
        const kasAccount = accounts.find(a => a.code === 'KAS');
        const tabunganAccount = accounts.find(a => a.code === 'TABUNGAN_USER');
        const isDeposit = type === 'deposit';

        const newLedgerEntries = [
            { id: newLedgerEntryIdStart, transaction_id: newTransactionId, account_id: kasAccount.id, direction: isDeposit ? 'debit' : 'credit', amount: transactionData.amount },
            { id: newLedgerEntryIdStart + 1, transaction_id: newTransactionId, account_id: tabunganAccount.id, direction: isDeposit ? 'credit' : 'debit', amount: transactionData.amount },
        ];
        setLedgerEntries(prev => [...prev, ...newLedgerEntries]);
    }
    
    const handleAddDeposit = (depositData) => {
        addTransaction(depositData, 'deposit');
    };

    const handleAddWithdrawal = (withdrawalData) => {
        addTransaction(withdrawalData, 'withdrawal');
    };
    
    const handleUpdateUser = (updatedUser) => {
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    };

    const handleCreateUser = (newUserData) => {
        const newId = Math.max(...users.map(u => u.id)) + 1;
        const user = {
            id: newId,
            ...newUserData,
            created_at: new Date().toISOString()
        };
        setUsers(prev => [...prev, user]);
    };

    const handleExport = (headers, data, filename) => {
        const csvString = generateCSV(headers, data);
        downloadCSV(csvString, filename);
    };

    // --- RENDER LOGIC ---
    if (!currentUser) {
        return <LoginPage onLogin={handleLogin} onSetPage={setPage} onRegister={handleRegister} />;
    }

    const renderPage = () => {
        switch(page) {
            case 'userDashboard':
                return <UserDashboard user={currentUser} users={users} transactions={transactions} onExport={handleExport} />;
            case 'superuserDashboard':
                return <SuperuserDashboard users={users} transactions={transactions} />;
            case 'transactionEntry':
                return <TransactionEntryPage users={users} transactions={transactions} onAddDeposit={handleAddDeposit} onAddWithdrawal={handleAddWithdrawal} onSetPage={setPage} />;
            case 'userManagement':
                return <UserManagementPage users={users} onUpdateUser={handleUpdateUser} onCreateUser={handleCreateUser} />;
            case 'ledger':
                return <LedgerPage ledgerEntries={ledgerEntries} transactions={transactions} users={users} accounts={accounts} onExport={handleExport} />;
            default:
                return <div>Halaman tidak ditemukan.</div>;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 md:h-20">
                        <div className="flex items-center space-x-3">
                            <LogoIcon />
                            <span className="text-xl font-bold text-gray-800">Celengan DWP Gayatri</span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
                            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                                {currentUser.role === 'superuser' && (
                                    <>
                                        <button onClick={() => setPage('superuserDashboard')} className="nav-link">Dashboard</button>
                                        <button onClick={() => setPage('transactionEntry')} className="nav-link">Entry Transaksi</button>
                                        <button onClick={() => setPage('userManagement')} className="nav-link">Manajemen User</button>
                                        <button onClick={() => setPage('ledger')} className="nav-link">Buku Besar</button>
                                    </>
                                )}
                                 {currentUser.role === 'user' && (
                                    <>
                                        <button onClick={() => setPage('userDashboard')} className="nav-link">Dashboard</button>
                                    </>
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
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {renderPage()}
            </main>
            <style>{`
              .nav-link {
                padding: 0.5rem 0.75rem;
                border-radius: 0.375rem;
                font-weight: 500;
                color: #4b5563;
                transition: background-color 0.2s, color 0.2s;
                white-space: nowrap;
              }
              .nav-link:hover {
                background-color: #fef3c7; /* amber-100 */
                color: #b45309; /* amber-700 */
              }
            `}</style>
        </div>
    );
}


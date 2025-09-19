// src/LandingPage.jsx
import React from "react";

const Button = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`px-5 py-3 rounded-lg font-semibold transition shadow-md ${className}`}
  >
    {children}
  </button>
);

// Pakai SVG logo barumu (pastikan file ada di /public)
const Logo = () => (
  <div
    className="h-12 w-12 bg-center bg-no-repeat bg-contain"
    style={{ backgroundImage: 'url("/kotak senyum DWP.svg")' }}
    role="img"
    aria-label="KotakSenyum DWP"
  />
);

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
    {/* Header (sticky, tanpa garis) */}
    <header className="sticky top-0 z-50 bg-white/80 supports-[backdrop-filter]:bg-white/60 backdrop-blur shadow-none border-b-0">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
        <Logo />
        <span className="font-bold text-lg sm:text-xl">KotakSenyum DWP</span>
        </div>

        <Button
        onClick={onGetStarted}
        className="bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base"
        >
        Masuk
        </Button>
    </div>
    </header>


    {/* Hero (banner penuh hampir 1 layar) */}
    <section className="relative isolate text-white">
    {/* gradien oranye kekuningan */}
    <div className="absolute inset-0 bg-gradient-to-b from-white-200 via-orange-400 to-orange-700" />

    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8
                    min-h-[86vh] flex flex-col items-center justify-center text-center">

        {/* logo di dalam kartu transparan + drop shadow */}
        <div className="mb-8 rounded-2xl bg-white/40 p-5 backdrop-blur-sm">
        <img
            src="/kotak senyum DWP.svg"
            alt="KotakSenyum DWP"
            className="h-24 w-24 rounded-lg"
            style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.7))" }}
        />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
        Wujudkan Senyum Finansial<br className="hidden sm:block" /> Bersama
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-orange-50">
        Pencatatan tabungan digital yang mudah dan aman, didukung oleh
        <span className="font-semibold underline"> Asisten AI</span> untuk
        perencanaan keuangan cerdas.
        </p>

        <div className="mt-10">
        <Button
            onClick={onGetStarted}
            className="bg-white text-orange-600 hover:bg-orange-100 font-bold text-lg px-8 py-4 shadow-lg"
        >
            Mulai Sekarang
        </Button>
        </div>
    </div>
    </section>


    {/* About + Features (versi mirip Gemini) */}
    <main className="flex-1">
    <section id="about" className="relative py-16 sm:py-24 bg-orange-50 overflow-hidden">
        {/* dekorasi lingkaran lembut kiri-atas */}
        <div className="pointer-events-none absolute top-0 left-0 -translate-x-1/3 opacity-50 z-0">
        <svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="300" cy="300" r="300" fill="url(#gradAbout1)"/>
            <defs>
            <linearGradient id="gradAbout1" x1="0" y1="0" x2="600" y2="600" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FDBA74"/>
                <stop offset="1" stopColor="#F97316" stopOpacity="0"/>
            </linearGradient>
            </defs>
        </svg>
        </div>

        {/* dekorasi lingkaran lembut kanan-bawah */}
        <div className="pointer-events-none absolute bottom-0 right-0 translate-x-1/3 opacity-40 z-0">
        <svg width="520" height="520" viewBox="0 0 520 520" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="260" cy="260" r="260" fill="url(#gradAbout2)"/>
            <defs>
            <linearGradient id="gradAbout2" x1="0" y1="0" x2="520" y2="520" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FB923C"/>
                <stop offset="1" stopColor="#EA580C" stopOpacity="0"/>
            </linearGradient>
            </defs>
        </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Heading */}
            <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-orange-800">
                Apa itu KotakSenyum DWP?
            </h2>
            {/* Accent bar */}
            <div className="w-24 h-1.5 bg-orange-400/90 mx-auto mt-3 rounded-full" />
            <p className="mt-5 text-lg text-gray-700 max-w-3xl mx-auto">
                KotakSenyum DWP adalah aplikasi web untuk mempermudah pengelolaan tabungan di
                lingkungan Dharma Wanita Persatuan (DWP) Bapenda Jatim UPT PPD Tulungagung, dengan
                dukungan <span className="text-orange-800 font-semibold underline">Asisten AI</span> yang cerdas.
            </p>
            </div>

        {/* latar belakang + foto */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="prose lg:prose-lg text-gray-600">
            <h3 className="text-2xl font-bold text-orange-800">Latar Belakang</h3>
            <p>
                Dibuat untuk{" "}
                <span className="text-orange-800 font-semibold">
                menggantikan pencatatan manual
                </span>{", "}
                 agar data lebih akuntabel,
                transparan, mudah diakses, dan membangun kepercayaan bersama.
            </p>
            </div>

            <div className="text-center">
            {/* Ganti src dengan foto kamu */}
            <img
            src="/foto ibu dwp.JPG"
            alt="Kegiatan DWP"
            className="rounded-lg shadow-xl mx-auto w-full h-auto object-cover aspect-video"
            />

            </div>
        </div>

        {/* manfaat utama */}
        <div className="mt-20">
            <h3 className="text-2xl font-bold text-orange-800 text-center mb-8">Manfaat Utama</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* kartu 1 */}
        <div className="flex items-start gap-4 p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all bg-gradient-to-br from-orange-100 to-orange-200 text-gray-800">
            <div className="flex-shrink-0 h-12 w-12 bg-orange-300/50 text-orange-700 rounded-full flex items-center justify-center text-xl">📱</div>
            <div>
            <h4 className="font-bold text-orange-800">Kemudahan Akses</h4>
            <p className="text-sm mt-1">Anggota dapat melihat saldo & riwayat kapan saja.</p>
            </div>
        </div>

        {/* kartu 2 */}
        <div className="flex items-start gap-4 p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all bg-gradient-to-br from-orange-100 to-orange-200 text-gray-800">
            <div className="flex-shrink-0 h-12 w-12 bg-orange-300/50 text-orange-700 rounded-full flex items-center justify-center text-xl">✅</div>
            <div>
            <h4 className="font-bold text-orange-800">Transparansi Terjamin</h4>
            <p className="text-sm mt-1">Semua transaksi tercatat digital, mengurangi risiko keliru.</p>
            </div>
        </div>

        {/* kartu 3 */}
        <div className="flex items-start gap-4 p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all bg-gradient-to-br from-orange-100 to-orange-200 text-gray-800">
            <div className="flex-shrink-0 h-12 w-12 bg-orange-300/50 text-orange-700 rounded-full flex items-center justify-center text-xl">🤖</div>
            <div>
            <h4 className="font-bold text-orange-800">Asisten AI Cerdas</h4>
            <p className="text-sm mt-1">Bantu bendahara & inspirasi rencana menabung bagi anggota.</p>
            </div>
        </div>
        </div>
        </div>
        </div>
    </section>
    </main>

    {/* Quote Section */}
    <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-orange-100">
    <div
        className="
        relative max-w-7xl mx-auto px-6 lg:px-12
        pt-12 md:pt-14
        pb-0
        flex flex-col md:flex-row items-end gap-10
        "
    >
        {/* Foto Warren Buffett */}
        <div className="flex-shrink-0 self-end">
        <img
            src="https://ternakuang.id/wp-content/uploads/2025/06/Warren-Buffett-Images-1.webp"
            alt="Warren Buffett"
            className="
            select-none pointer-events-none object-contain drop-shadow-xl
            h-64 sm:h-72 md:h-80 lg:h-[22rem] xl:h-[24rem]
            "
        />
        </div>

        {/* Teks */}
        <div className="text-gray-800 text-center md:text-left max-w-3xl pb-6 md:pb-10">
        <p className="text-[20px] sm:text-[22px] md:text-[26px] leading-relaxed font-light tracking-wide">
            The <span className="font-semibold text-orange-600">best investment</span> you can make,<br />
            is an <span className="font-semibold text-orange-500">investment in yourself...</span><br />
            The more you <span className="font-semibold text-orange-600">learn</span>, the more you’ll <span className="font-semibold text-orange-600">earn</span>.
        </p>
        <p className="mt-4 text-base italic text-gray-600">— Warren Buffett</p>
        </div>
    </div>

    {/* Garis bawah */}
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
    </section>


    {/* Fitur Unggulan */}
    <section
    id="features"
    className="relative py-16 sm:py-24 bg-gradient-to-b from-white via-orange-50/70 to-white overflow-hidden"
    >
    {/* dekorasi lembut supaya nyatu dengan peach di atas */}
    <div className="pointer-events-none absolute -top-24 -left-20 w-[520px] h-[520px] rounded-full bg-orange-100/40 blur-3xl" />
    <div className="pointer-events-none absolute top-10 -right-24 w-[460px] h-[460px] rounded-full bg-orange-200/30 blur-3xl" />

    <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-orange-900">
        Fitur Unggulan
        </h2>
        {/* accent bar */}
        <div className="w-24 h-1.5 bg-orange-500/90 mx-auto mt-3 rounded-full" />
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
        Dirancang untuk memenuhi kebutuhan komunitas kita.
        </p>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Kartu 1 */}
        <div className="bg-white/80 backdrop-blur-sm border border-orange-100 p-8 rounded-xl shadow-[0_8px_24px_rgba(249,115,22,0.08)] hover:shadow-[0_10px_28px_rgba(249,115,22,0.12)] hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-orange-500 text-white mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="7" y="2" width="10" height="20" rx="2" ry="2"></rect>
                <path d="M12 18h.01"></path>
            </svg>
            </div>
            <h3 className="mt-6 text-lg font-semibold text-gray-900">Pencatatan Digital</h3>
            <p className="mt-2 text-base text-gray-600">
            Semua setoran & penarikan tercatat rapi secara digital, mengurangi penggunaan
            kertas dan mempermudah pencarian data.
            </p>
        </div>

        {/* Kartu 2 */}
        <div className="bg-white/80 backdrop-blur-sm border border-orange-100 p-8 rounded-xl shadow-[0_8px_24px_rgba(249,115,22,0.08)] hover:shadow-[0_10px_28px_rgba(249,115,22,0.12)] hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-orange-500 text-white mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="m12 3-1.9 1.9a2.5 2.5 0 0 0 0 3.8L12 10l1.9-1.9a2.5 2.5 0 0 0 0-3.8L12 3Z"/>
                <path d="M5 11 3 9l1.9-1.9a2.5 2.5 0 0 1 3.8 0L10 9 8.1 10.9a2.5 2.5 0 0 1-3.8 0Z"/>
                <path d="M19 11 17 9l1.9-1.9a2.5 2.5 0 0 1 3.8 0L24 9l-1.9 1.9a2.5 2.5 0 0 1-3.8 0Z"/>
            </svg>
            </div>
            <h3 className="mt-6 text-lg font-semibold text-gray-900">Perencanaan Cerdas (AI)</h3>
            <p className="mt-2 text-base text-gray-600">
            Buat target tabungan dan dapatkan rencana & inspirasi menabung yang dipersonalisasi oleh <b>AI</b>.
            </p>
        </div>

        {/* Kartu 3 */}
        <div className="bg-white/80 backdrop-blur-sm border border-orange-100 p-8 rounded-xl shadow-[0_8px_24px_rgba(249,115,22,0.08)] hover:shadow-[0_10px_28px_rgba(249,115,22,0.12)] hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-orange-500 text-white mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 20V10"></path>
                <path d="M18 20V4"></path>
                <path d="M6 20V16"></path>
            </svg>
            </div>
            <h3 className="mt-6 text-lg font-semibold text-gray-900">Monitoring & Laporan AI</h3>
            <p className="mt-2 text-base text-gray-600">
            Dashboard untuk bendahara, plus <b>Asisten AI</b> siap bantu draf ringkasan keuangan otomatis.
            </p>
        </div>
        </div>
    </div>
    </section>



{/* Footer */}
<footer className="bg-white border-t-2 border-orange-300 text-gray-700">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center space-y-4">
    
    {/* Tombol Instagram */}
    <a
      href="https://www.instagram.com/dwp_uptppd_tulungagung/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        className="h-5 w-5"
      >
        <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zm4.5 3a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"/>
      </svg>
      Ikuti Instagram Kami
    </a>

    {/* Copyright */}
    <p className="text-xs text-gray-500">
      © {new Date().getFullYear()} KotakSenyum DWP UPT PPD Tulungagung. All rights reserved.
    </p>
  </div>
</footer>


    </div>
  );
}

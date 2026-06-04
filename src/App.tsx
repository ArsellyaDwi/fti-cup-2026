"use client";

import { useState, useEffect } from "react";
import { getDbData } from "./app/actions";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import SportsGrid from "./components/SportsGrid";
import RulesAccordion from "./components/RulesAccordion";
import DocumentsCenter from "./components/DocumentsCenter";
import Schedules from "./components/Schedules";
import RegistrationCenter from "./components/RegistrationCenter";
import ContactPersons from "./components/ContactPersons";
import FaqSection from "./components/FaqSection";
import LiveEditor from "./components/LiveEditor";
import MobileQuickNav from "./components/MobileQuickNav";
import ScrollToTop from "./components/ScrollToTop";
import { Sparkles, Trophy, Settings, Shield, RefreshCcw } from "lucide-react";

// Robust static backup database to protect rendering if server is starting / offline
const BACKUP_DB = {
  cabangLomba: [
    {
      id: "voli",
      name: "Voli",
      icon: "Volleyball",
      description: "Turnamen Voli putra-putri antar jurusan FTI ITN Malang. Menguji kekuatan smash, solidnya block, dan kekompakan tim.",
      playersPerTeam: "6 Pemain Utama + 4 Pemain Cadangan",
      requirements: [
        "Mahasiswa aktif FTI ITN Malang (dibuktikan dengan KTM)",
        "Mengisi formulir pendaftaran resmi",
        "Satu jurusan dapat mengirimkan maksimal 2 tim (Putra/Putri)",
        "Membayar uang jaminan/pendataan"
      ]
    },
    {
      id: "basket",
      name: "Basket",
      icon: "Basketball",
      description: "Kompetisi Basket internal FTI ITN Malang bertaraf prestisius untuk memperebutkan piala bergilir Dekan FTI.",
      playersPerTeam: "5 Pemain Utama + 5 Pemain Cadangan",
      requirements: [
        "Mahasiswa aktif FTI ITN Malang (dibuktikan dengan KTM)",
        "Masing-masing tim menyerahkan foto 3x4",
        "Pemain tidak diperbolehkan bermain ganda/lintas tim",
        "Mematuhi jersey standar yang ditentukan panitia"
      ]
    },
    {
      id: "minisoccer",
      name: "Mini Soccer",
      icon: "Footprints",
      description: "Ajang unjuk gigih taktik lapangan hijau mini. Cepat, dinamis, penuh sportivitas, dan menjunjung tinggi fair play.",
      playersPerTeam: "7 Pemain Utama + 5 Pemain Cadangan",
      requirements: [
        "Mahasiswa aktif FTI ITN Malang",
        "Dilarang menggunakan sepatu pul besi (maupun cleat tajam)",
        "Wajib mengenakan pelindung tulang kering (shinguard)",
        "Setiap jurusan wajib mendelegasikan tim terbaiknya"
      ]
    },
    {
      id: "bulutangkis",
      name: "Bulutangkis",
      icon: "Activity",
      description: "Pertandingan bulutangkis kategori Tunggal Putra, Tunggal Putri, Ganda Putra, Ganda Putri, dan Ganda Campuran.",
      playersPerTeam: "Sesuai nomor (Tunggal: 1 | Ganda: 2)",
      requirements: [
        "Mahasiswa aktif FTI ITN Malang",
        "Wajib membawa raket sendiri",
        "Suttlecock disediakan oleh panitia",
        "Setiap prodi maksimal mengirimkan 2 perwakilan per nomor tanding"
      ]
    },
    {
      id: "tariktambang",
      name: "Tarik Tambang",
      icon: "Cable",
      description: "Kompetisi adu kekuatan fisik khas event olahraga FTI ITN Malang yang seru, penuh tawa, sekaligus solidaritas kuat.",
      playersPerTeam: "8 Orang per Tim (Campuran/Sesuai Kategori)",
      requirements: [
        "Mahasiswa aktif per jurusan di FTI ITN Malang",
        "Wajib memakai sepatu olahraga, dilarang bertelanjang kaki",
        "Dilarang menggunakan sarung tangan dengan perekat kuat",
        "Fokus utama pada kebersamaan dan kegembiraan"
      ]
    },
    {
      id: "tenismeja",
      name: "Tenis Meja",
      icon: "Coins",
      description: "Pertandingan tenis meja single & double putra-putri. Menampilkan kecepatan reaksi dan teknik putaran bola (spin) tingkat tinggi.",
      playersPerTeam: "Sesuai nomor (Single atau Double)",
      requirements: [
        "Mahasiswa aktif FTI ITN Malang",
        "Wajib membawa bed (raket tenis meja) sendiri",
        "Bola tenis meja disediakan panitia",
        "Memakai pakaian olahraga yang rapi dan sopan"
      ]
    },
    {
      id: "esports",
      name: "E-Sports",
      icon: "Gamepad2",
      description: "Kompetisi cabang game terpopuler saat ini: Mobile Legends: Bang Bang (MLBB) dan Valorant, adu strategi taktis digital.",
      playersPerTeam: "5 Pemain Utama + 2 Cadangan",
      requirements: [
        "Mahasiswa aktif FTI ITN Malang",
        "Satu tim berisi mahasiswa dari institusi/prodi yang sama",
        "Dilarang menggunakan cheat, skin script, atau segala jenis kecurangan",
        "Wajib membawa device sendiri dalam kondisi baterai terisi penuh"
      ]
    }
  ],
  gameSystems: [
    {
      id: "voli",
      name: "Voli",
      rules: [
        "Sistem setengah kompetisi dilanjutkan babak gugur.",
        "Best of 3 Sets (mencari 2 kemenangan set).",
        "Setiap set rally point 25 poin, deuce maks 30.",
        "TM wajib diikuti semua kapten tim."
      ]
    },
    {
      id: "basket",
      name: "Basket",
      rules: [
        "Sistem grup setengah kompetisi di babak penyisihan.",
        "Waktu tanding 4 x 10 menit (waktu kotor).",
        "Toleransi keterlambatan diskualifikasi 10 menit.",
        "TM membahas aturan draf jersey & nomor punggung."
      ]
    },
    {
      id: "minisoccer",
      name: "Mini Soccer",
      rules: [
        "Pembagian grup babak awal, juara/runner-up lolos eliminasi.",
        "Waktu tanding 2 x 15 menit, rehat 5 menit.",
        "Denda kartu kuning Rp 20rb, kartu merah Rp 50rb.",
        "Imbang langsung berlanjut adu penalti 3 penendang."
      ]
    },
    {
      id: "bulutangkis",
      name: "Bulutangkis",
      rules: [
        "Sistem gugur murni dari penyisihan sampai final.",
        "Rally point 21 poin, deuce selisih 2 (maks 30).",
        "Format Best of 3 jika kedudukan imbang.",
        "Wajib hadir 15 menit sebelum jawdal tanding."
      ]
    },
    {
      id: "tariktambang",
      name: "Tarik Tambang",
      rules: [
        "Sistem gugur murni antar delegasi jurusan.",
        "Sistem Best of 3 tarik sejauh 1,5 meter.",
        "Dilarang melilitkan tali di tubuh atau disandar tanah.",
        "Drawing bagan pertandingan diresmikan di TM."
      ]
    },
    {
      id: "tenismeja",
      name: "Tenis Meja",
      rules: [
        "Sistem gugur format tunggal maupun ganda.",
        "Set permainan Best of 5 Games (mencari 3 menang).",
        "Satu game dimainkan sampai 11 poin, deuce selisih 2.",
        "Regulasi teknis bed diklarifikasi di TM."
      ]
    },
    {
      id: "esports",
      name: "E-Sports",
      rules: [
        "Sistem Single Elimination babak awal, Double babak akhir.",
        "Draft Pick MLBB 5v5 | Custom Match Valorant Std.",
        "5 pemain inti + 2 cadangan terdaftar awal.",
        "Pause teknis mandiri maks 5 menit per tim."
      ]
    }
  ],
  documents: [
    {
      id: "doc1",
      title: "Guidebook Umum FTI CUP 2026",
      description: "Buku petunjuk umum pelaksanaan FTI CUP 2026, memuat ketentuan umum, jadwal dasar, daftar lomba, dan sistem administrasi delegasi.",
      filename: "Guidebook_FTI_CUP_2026.pdf",
      downloadUrl: "https://docs.google.com/document/d/1Xp-mJvsc7Xgq91_vK7VscO_demo_link1/edit?usp=sharing",
      updatedAt: "2026-06-01T08:00:00Z"
    },
    {
      id: "doc2",
      title: "Bahan Presentasi Technical Meeting",
      description: "Slide presentasi penjelasan teknis lomba, regulasi umum, tata tertib, dan keputusan drawing bagan tanding pertandingan.",
      filename: "Technical_Meeting_FTI_CUP_2026.pdf",
      downloadUrl: "https://docs.google.com/presentation/d/1Xp-mJvsc7Xgq91_vK7VscO_demo_link2/edit?usp=sharing",
      updatedAt: "2026-06-03T10:00:00Z"
    },
    {
      id: "doc3",
      title: "Official Rulebook Cabang Lomba",
      description: "Aturan lengkap, ukuran lapangan, kartu pelanggaran, kriteria penilaian, dan sanksi denda seluruh cabang olahraga & esports.",
      filename: "Official_Rulebook_FTI_CUP_2026.docx",
      downloadUrl: "https://docs.google.com/document/d/1Xp-mJvsc7Xgq91_vK7VscO_demo_link3/edit?usp=sharing",
      updatedAt: "2026-06-02T12:00:00Z"
    }
  ],
  jadwal: [
    {
      id: "j1",
      lombaName: "Mini Soccer",
      date: "Senin, 15 Juni 2026",
      time: "08:00 WIB - Selesai",
      location: "Lapangan Utama ITN Malang Kampus II"
    },
    {
      id: "j2",
      lombaName: "Basket (Penyisihan Grup)",
      date: "Selasa, 16 Juni 2026",
      time: "09:00 WIB - 17:00 WIB",
      location: "Lapangan Basket Sport Center ITN Malang Kampus II"
    },
    {
      id: "j3",
      lombaName: "Voli (Penyisihan)",
      date: "Rabu, 17 Juni 2026",
      time: "08:30 WIB - 16:30 WIB",
      location: "Lapangan Voli Kampus II ITN Malang"
    }
  ],
  contacts: [
    {
      id: "c1",
      name: "Bagas Dwi Handoko",
      role: "Ketua Pelaksana FTI CUP 2026",
      whatsapp: "6281234567890"
    },
    {
      id: "c2",
      name: "Anggita Rahma",
      role: "Koordinator Hubungan Masyarakat (Humas)",
      whatsapp: "6282233445566"
    }
  ],
  registrationLinks: [
    { id: "voli", name: "Daftar Voli", link: "#" },
    { id: "basket", name: "Daftar Basket", link: "#" },
    { id: "minisoccer", name: "Daftar Mini Soccer", link: "#" },
    { id: "bulutangkis", name: "Daftar Bulutangkis", link: "#" },
    { id: "tariktambang", name: "Daftar Tarik Tambang", link: "#" },
    { id: "tenismeja", name: "Daftar Tenis Meja", link: "#" },
    { id: "esports", name: "Daftar E-Sports", link: "#" }
  ],
  countdownDate: "2026-06-15T08:00:00",
  portalDeadline: "08 Juni 2026 Pukul 23:59 WIB",
  faqs: [
    {
      id: "faq-1",
      question: "Siapa saja yang dapat mengikuti FTI CUP 2026?",
      answer: "FTI CUP 2026 dapat diikuti oleh:\n• Mahasiswa aktif ITN Malang Kampus 2.\n• Dosen ITN Malang Kampus 1 dan Kampus 2.",
      order: 1
    },
    {
      id: "faq-2",
      question: "Program studi apa saja yang termasuk dalam Fakultas Teknologi Industri (FTI)?",
      answer: "Program Studi S1:\n• Teknik Mesin\n• Teknik Elektro\n• Teknik Industri\n• Teknik Kimia\n• Teknik Informatika\n• Bisnis Digital\n\nProgram Studi D3:\n• Teknik Mesin\n• Teknik Listrik",
      order: 2
    },
    {
      id: "faq-3",
      question: "Apakah setiap program studi wajib mengikuti FTI CUP?",
      answer: "Ya.\n\nSetiap program studi di lingkungan Fakultas Teknologi Industri (FTI) WAJIB mengirimkan minimal 1 tim atau perwakilan pada cabang lomba yang dipertandingkan sebagai bentuk partisipasi dalam kegiatan fakultas.",
      order: 3
    }
  ]
};

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
    }
    return false; // Default is Light Mode
  });
  const [dbData, setDbData] = useState<typeof BACKUP_DB | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Sync dark class on document element & store preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Fetch full-stack database context using Next.js Server Action
  const fetchDbData = async () => {
    try {
      const data = await getDbData();
      if (data) {
        setDbData(data);
      } else {
        console.warn("Server action returned empty context, running fallback seed data");
        setDbData(BACKUP_DB);
      }
    } catch (err) {
      console.error("Failed to connect to Server Action context, using robust fallback:", err);
      setDbData(BACKUP_DB);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDbData();
  }, []);

  if (loading || !dbData) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0B0F19] flex flex-col items-center justify-center p-6 text-center">
        <div className="space-y-4">
          {/* Animated Spinner Icon */}
          <div className="relative inline-flex">
            <div className="h-10 w-10 rounded-full border-2 border-slate-100 border-t-[#003B7A] animate-spin"></div>
            <Shield className="absolute inset-0 m-auto text-[#003B7A] dark:text-[#60A5FA] w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h3 className="font-sans font-semibold text-sm text-[#003B7A] dark:text-white uppercase tracking-wider leading-none">
              FTI CUP ITN MALANG 2026
            </h3>
            <p className="text-[10px] text-[#64748B] dark:text-[#CBD5E1] font-sans font-normal">Memuat Data Panel Akurat...</p>
          </div>
          
          {/* skeleton simulation cards */}
          <div className="max-w-md mx-auto grid grid-cols-3 gap-2 pt-6">
            <div className="h-12 bg-[#F8FAFC] dark:bg-[#121826] rounded-md animate-pulse"></div>
            <div className="h-12 bg-[#F8FAFC] dark:bg-[#121826] rounded-md animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="h-12 bg-[#F8FAFC] dark:bg-[#121826] rounded-md animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F8FAFC] selection:bg-[#2E86DE]/20 overflow-x-hidden transition-colors duration-200">
      
      {/* Sticky Top Navigation */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenEditor={() => setIsEditorOpen(true)}
      />

      {/* Main Body Grid */}
      <main className="relative">
        <Hero countdownTarget={dbData.countdownDate} />
        
        <About />
        
        <SportsGrid sports={dbData.cabangLomba} />
        
        <RulesAccordion systems={dbData.gameSystems} />
        
        <DocumentsCenter documents={dbData.documents} />
        
        <Schedules schedules={dbData.jadwal} />
        
        <RegistrationCenter links={dbData.registrationLinks} portalDeadline={dbData.portalDeadline} />
        
        <FaqSection faqs={dbData.faqs || []} />
        
        <ContactPersons contacts={dbData.contacts} />
      </main>

      {/* Professional Footer */}
      <footer className="py-20 bg-[#F8FAFC] dark:bg-[#0B0F19] border-t border-[#E2E8F0] dark:border-[#131B2E]/30 text-xs text-[#64748B] dark:text-[#CBD5E1] transition-colors font-sans font-normal">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Side: Brand & University Info */}
            <div className="md:col-span-6 space-y-4 text-center md:text-left flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3 font-sans text-[#003B7A] dark:text-[#60A5FA] font-bold text-sm uppercase tracking-wider justify-center md:justify-start">
                <div className="p-2 bg-[#003B7A] dark:bg-[#121826] text-white dark:text-[#60A5FA] rounded-xl flex items-center justify-center shrink-0 transition-all duration-250 ring-2 ring-black/5 dark:ring-[#1E293B]/50">
                  <Shield className="w-4 h-4 text-current" strokeWidth={2.5} />
                </div>
                <span>FTI CUP ITN MALANG 2026</span>
              </div>
              
              <div className="text-[12px] leading-relaxed space-y-1 text-[#475569] dark:text-[#CBD5E1]">
                <p className="font-semibold text-sm text-[#0F172A] dark:text-[#F8FAFC]">Fakultas Teknologi Industri</p>
                <p className="text-normal">Institut Teknologi Nasional Malang</p>
              </div>
            </div>

            {/* Right Side: Location block (highly professional & minimal) */}
            <div className="md:col-span-6 text-center md:text-left space-y-3 flex flex-col items-center md:items-start">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#0F172A] dark:text-[#F8FAFC]">Lokasi Kegiatan</h4>
              <div className="text-xs text-[#64748B] dark:text-[#CBD5E1] space-y-1 leading-relaxed">
                <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Kampus 2 Institut Teknologi Nasional Malang</p>
                <p>Jl. Raya Karanglo KM 2,</p>
                <p>Balearjosari, Kec. Blimbing,</p>
                <p>Kota Malang, Jawa Timur</p>
              </div>
            </div>

          </div>

          {/* Bottom Copyright Row */}
          <div className="pt-8 border-t border-[#E2E8F0] dark:border-[#131B2E]/35 text-xs text-[#64748B] dark:text-[#CBD5E1] font-sans flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} Panitia FTI CUP ITN Malang. All rights reserved.</span>
            <div className="flex items-center gap-4 text-[11px] font-medium justify-center sm:justify-start">
              <span className="text-[#003B7A] dark:text-[#60A5FA]">Solidaritas &bull; Kebersamaan &bull; Sportivitas</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating Database Modeler Drawer (Slide-out Admin) */}
      <LiveEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        dbData={dbData}
        onRefreshData={fetchDbData}
      />

      {/* Floating Utilities */}
      <MobileQuickNav />
      <ScrollToTop />

    </div>
  );
}

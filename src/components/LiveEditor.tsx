import React, { useState, useEffect } from "react";
import {
  saveCabangLomba,
  deleteCabangLomba,
  updateGameSystem,
  saveDocument,
  deleteDocument,
  saveJadwal,
  deleteJadwal,
  saveContact,
  deleteContact,
  saveRegistrationLink,
  saveCountdown,
  saveFaq,
  deleteFaq
} from "../app/actions";
import {
  X,
  Plus,
  Trash2,
  Calendar,
  FileText,
  Phone,
  Link,
  Save,
  CheckCircle,
  AlertCircle,
  Settings,
  Clock,
  Lock,
  Edit,
  Trophy,
  HelpCircle
} from "lucide-react";
import {
  JadwalPertandingan,
  DocumentFile,
  ContactPerson,
  RegistrationLink,
  CabangLomba,
  GameSystem,
  Faq
} from "../types";

interface LiveEditorProps {
  isOpen: boolean;
  onClose: () => void;
  dbData: {
    cabangLomba: CabangLomba[];
    gameSystems: GameSystem[];
    documents: DocumentFile[];
    jadwal: JadwalPertandingan[];
    contacts: ContactPerson[];
    registrationLinks: RegistrationLink[];
    countdownDate: string;
    portalDeadline?: string;
    faqs?: Faq[];
  };
  onRefreshData: () => Promise<void>;
}

type TabType = "sports" | "gamesystem" | "jadwal" | "documents" | "contacts" | "links" | "countdown" | "faqs";

export default function LiveEditor({
  isOpen,
  onClose,
  dbData,
  onRefreshData
}: LiveEditorProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return sessionStorage.getItem("admin_auth") === "true";
    } catch {
      return false;
    }
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const lEmail = email.trim().toLowerCase();
    if (
      (lEmail === "panitia@itn.ac.id" && password === "adminfticup") ||
      (lEmail === "arsellya@gmail.com" && password === "arsellyadwipanitia")
    ) {
      try {
        sessionStorage.setItem("admin_auth", "true");
      } catch (err) {
        console.error("Storage error:", err);
      }
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Email atau Password kepanitiaan salah!");
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem("admin_auth");
    } catch (err) {
      console.error("Storage error:", err);
    }
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  const [activeTab, setActiveTab] = useState<TabType>("sports");
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState<{ status: "success" | "error"; msg: string } | null>(null);

  // Form States
  const [sportForm, setSportForm] = useState<Partial<CabangLomba>>({
    name: "",
    description: "",
    googleFormUrl: "",
    isActive: true
  });
  const [editingSportId, setEditingSportId] = useState<string | null>(null);

  const [editingGameSystemId, setEditingGameSystemId] = useState<string | null>(null);
  const [gameSystemForm, setGameSystemForm] = useState<Partial<GameSystem>>({
    name: "",
    format: "",
    rules: [],
    location: "",
    tmInfo: ""
  });

  const [scheduleForm, setScheduleForm] = useState<Partial<JadwalPertandingan>>({
    lombaName: "",
    date: "",
    time: "",
    location: "",
    description: ""
  });
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

  const [docForm, setDocForm] = useState<Partial<DocumentFile>>({
    title: "",
    description: "",
    filename: "",
    downloadUrl: ""
  });
  const [editingDocId, setEditingDocId] = useState<string | null>(null);

  const [contactForm, setContactForm] = useState<Partial<ContactPerson>>({
    name: "",
    role: "",
    whatsapp: "",
    foto: ""
  });
  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  const [linksForm, setLinksForm] = useState<Record<string, string>>(
    dbData.registrationLinks.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.link }), {})
  );

  const [countdownInput, setCountdownInput] = useState(dbData.countdownDate);
  const [portalDeadlineInput, setPortalDeadlineInput] = useState(dbData.portalDeadline || "08 Juni 2026 Pukul 23:59 WIB");

  const [faqForm, setFaqForm] = useState<Partial<Faq>>({
    question: "",
    answer: "",
    order: 0
  });
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);

  useEffect(() => {
    setCountdownInput(dbData.countdownDate);
    if (dbData.portalDeadline) {
      setPortalDeadlineInput(dbData.portalDeadline);
    }
  }, [dbData.countdownDate, dbData.portalDeadline]);

  if (!isOpen) return null;

  const triggerToast = (status: "success" | "error", msg: string) => {
    setShowToast({ status, msg });
    setTimeout(() => setShowToast(null), 3000);
  };

  // --- CABANG LOMBA CRUD DIRECTIVES ---
  const handleSaveSport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sportForm.name || !sportForm.description) {
      triggerToast("error", "Nama lomba dan deskripsi wajib diisi!");
      return;
    }

    setIsSaving(true);
    try {
      const isEditing = !!editingSportId;
      const res = await saveCabangLomba(
        {
          ...sportForm,
          icon: sportForm.icon || "Trophy",
          playersPerTeam: sportForm.playersPerTeam || "Satu regu prodi",
          requirements: sportForm.requirements || [],
          isActive: sportForm.isActive !== undefined ? sportForm.isActive : true
        },
        isEditing,
        editingSportId
      );

      if (res.success) {
        await onRefreshData();
        triggerToast("success", isEditing ? "Cabang lomba diperbarui!" : "Cabang lomba berhasil ditambahkan!");
        setSportForm({ name: "", description: "", googleFormUrl: "", isActive: true });
        setEditingSportId(null);
      } else {
        triggerToast("error", res.error || "Gagal menyimpan cabang lomba.");
      }
    } catch {
      triggerToast("error", "Terjadi galat jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSport = (item: CabangLomba) => {
    setSportForm({
      name: item.name,
      description: item.description,
      googleFormUrl: item.googleFormUrl || "",
      isActive: item.isActive !== undefined ? item.isActive : true,
      icon: item.icon,
      playersPerTeam: item.playersPerTeam,
      requirements: item.requirements
    });
    setEditingSportId(item.id);
  };

  const handleDeleteSport = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus cabang lomba ini?")) return;
    setIsSaving(true);
    try {
      const res = await deleteCabangLomba(id);
      if (res.success) {
        await onRefreshData();
        triggerToast("success", "Cabang lomba berhasil terhapus!");
        if (editingSportId === id) {
          setSportForm({ name: "", description: "", googleFormUrl: "", isActive: true });
          setEditingSportId(null);
        }
      } else {
        triggerToast("error", res.error || "Gagal menghapus cabang lomba.");
      }
    } catch {
      triggerToast("error", "Koneksi terputus.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- GAME SYSTEM CRUD DIRECTIVES ---
  const handleSaveGameSystem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGameSystemId) return;
    setIsSaving(true);
    try {
      const res = await updateGameSystem(editingGameSystemId, {
        format: gameSystemForm.format,
        location: gameSystemForm.location,
        tmInfo: gameSystemForm.tmInfo,
        rules: Array.isArray(gameSystemForm.rules) 
          ? gameSystemForm.rules 
          : typeof gameSystemForm.rules === "string" 
            ? [gameSystemForm.rules] 
            : []
      });

      if (res.success) {
        await onRefreshData();
        triggerToast("success", "Ketentuan sistem pertandingan berhasil disimpan!");
        setEditingGameSystemId(null);
        setGameSystemForm({ name: "", format: "", rules: [], location: "", tmInfo: "" });
      } else {
        triggerToast("error", res.error || "Gagal merubah sistem pertandingan.");
      }
    } catch {
      triggerToast("error", "Masalah jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditGameSystem = (item: GameSystem) => {
    setGameSystemForm(item);
    setEditingGameSystemId(item.id);
  };

  // --- SCHEDULE CRUD DIRECTIVES ---
  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleForm.lombaName || !scheduleForm.date || !scheduleForm.time || !scheduleForm.location) {
      triggerToast("error", "Harap isi semua kolom formulir jadwal!");
      return;
    }

    setIsSaving(true);
    try {
      const res = await saveJadwal({
        id: editingScheduleId || undefined,
        ...scheduleForm
      });
      if (res.success) {
        await onRefreshData();
        triggerToast("success", "Jadwal berhasil disimpan!");
        setScheduleForm({ lombaName: "", date: "", time: "", location: "" });
        setEditingScheduleId(null);
      } else {
        triggerToast("error", res.error || "Gagal menyimpan jadwal ke database.");
      }
    } catch {
      triggerToast("error", "Galat jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSchedule = (item: JadwalPertandingan) => {
    setScheduleForm(item);
    setEditingScheduleId(item.id);
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus jadwal tanding ini?")) return;
    setIsSaving(true);
    try {
      const res = await deleteJadwal(id);
      if (res.success) {
        await onRefreshData();
        triggerToast("success", "Jadwal berhasil terhapus!");
        if (editingScheduleId === id) {
          setScheduleForm({ lombaName: "", date: "", time: "", location: "" });
          setEditingScheduleId(null);
        }
      } else {
        triggerToast("error", res.error || "Gagal menghapus jadwal.");
      }
    } catch {
      triggerToast("error", "Kesalahan koneksi.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- DOCUMENT CRUD DIRECTIVES ---
  const handleSaveDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title || !docForm.description || !docForm.filename || !docForm.downloadUrl) {
      triggerToast("error", "Semua kolom dokumen wajib diisi!");
      return;
    }

    setIsSaving(true);
    try {
      const res = await saveDocument({
        id: editingDocId || undefined,
        ...docForm
      });
      if (res.success) {
        await onRefreshData();
        triggerToast("success", "Dokumen dirilis ke server!");
        setDocForm({ title: "", description: "", filename: "", downloadUrl: "" });
        setEditingDocId(null);
      } else {
        triggerToast("error", res.error || "Gagal menyimpan berkas.");
      }
    } catch {
      triggerToast("error", "Terjadi galat.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditDoc = (item: DocumentFile) => {
    setDocForm(item);
    setEditingDocId(item.id);
  };

  const handleDeleteDoc = async (id: string) => {
    if (!confirm("Yakin ingin menghapus dokumen unduhan ini?")) return;
    setIsSaving(true);
    try {
      const res = await deleteDocument(id);
      if (res.success) {
        await onRefreshData();
        triggerToast("success", "Dokumen berhasil dihapus!");
        if (editingDocId === id) {
          setDocForm({ title: "", description: "", filename: "", downloadUrl: "" });
          setEditingDocId(null);
        }
      } else {
        triggerToast("error", res.error || "Gagal menghapus.");
      }
    } catch {
      triggerToast("error", "Masalah jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- CONTACT CRUD DIRECTIVES ---
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.role || !contactForm.whatsapp) {
      triggerToast("error", "Seluruh isian kontak person wajib diisi!");
      return;
    }

    setIsSaving(true);
    try {
      const res = await saveContact({
        id: editingContactId || undefined,
        ...contactForm
      });
      if (res.success) {
        await onRefreshData();
        triggerToast("success", "Kontak berhasil diperbarui!");
        setContactForm({ name: "", role: "", whatsapp: "", foto: "" });
        setEditingContactId(null);
      } else {
        triggerToast("error", res.error || "Gagal menyimpan kontak person.");
      }
    } catch {
      triggerToast("error", "Gangguan server.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditContact = (item: ContactPerson) => {
    setContactForm(item);
    setEditingContactId(item.id);
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm("Yakin menghapus kontak pelaksana ini?")) return;
    setIsSaving(true);
    try {
      const res = await deleteContact(id);
      if (res.success) {
        await onRefreshData();
        triggerToast("success", "Kontak terhapus dari daftar.");
        if (editingContactId === id) {
          setContactForm({ name: "", role: "", whatsapp: "", foto: "" });
          setEditingContactId(null);
        }
      } else {
        triggerToast("error", res.error || "Gagal menghapus kontak.");
      }
    } catch {
      triggerToast("error", "Gangguan jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- FORM GOOGLE LINK UPDATE ---
  const handleUpdateLink = async (id: string, newLink: string) => {
    setIsSaving(true);
    try {
      const res = await saveRegistrationLink(id, newLink);
      if (res.success) {
        setLinksForm((prev) => ({ ...prev, [id]: newLink }));
        await onRefreshData();
        triggerToast("success", "Google Form Link disimpan!");
      } else {
        triggerToast("error", res.error || "Gagal menyimpan Link Form.");
      }
    } catch {
      triggerToast("error", "Sinyal putus.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- EVENT COUNTDOWN UPDATE ---
  const handleUpdateCountdown = async () => {
    if (!countdownInput || !portalDeadlineInput) {
      triggerToast("error", "Tanggal target dan batas portal tidak boleh kosong!");
      return;
    }

    setIsSaving(true);
    try {
      const res = await saveCountdown(countdownInput, portalDeadlineInput);
      if (res.success) {
        await onRefreshData();
        triggerToast("success", "Target waktu & batas portal direvisi!");
      } else {
        triggerToast("error", "Koneksi server gagal memperbarui waktu.");
      }
    } catch {
      triggerToast("error", "Gangguan server.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- FAQ CRUD DIRECTIVES ---
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) {
      triggerToast("error", "Pertanyaan dan Jawaban wajib diisi!");
      return;
    }

    setIsSaving(true);
    try {
      const res = await saveFaq({
        id: editingFaqId || undefined,
        question: faqForm.question,
        answer: faqForm.answer,
        order: faqForm.order !== undefined ? Number(faqForm.order) : 0
      });

      if (res.success) {
        await onRefreshData();
        triggerToast("success", editingFaqId ? "FAQ diperbarui!" : "FAQ berhasil ditambahkan!");
        setFaqForm({ question: "", answer: "", order: 0 });
        setEditingFaqId(null);
      } else {
        triggerToast("error", res.error || "Gagal menyimpan FAQ.");
      }
    } catch {
      triggerToast("error", "Koneksi terputus.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditFaq = (item: Faq) => {
    setFaqForm({
      question: item.question,
      answer: item.answer,
      order: item.order
    });
    setEditingFaqId(item.id);
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus FAQ ini?")) return;
    setIsSaving(true);
    try {
      const res = await deleteFaq(id);
      if (res.success) {
        await onRefreshData();
        triggerToast("success", "FAQ berhasil terhapus!");
        if (editingFaqId === id) {
          setFaqForm({ question: "", answer: "", order: 0 });
          setEditingFaqId(null);
        }
      } else {
        triggerToast("error", res.error || "Gagal menghapus FAQ.");
      }
    } catch {
      triggerToast("error", "Kesalahan jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/60 backdrop-blur-sm">
      
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed bottom-6 right-6 z-[110] flex items-center gap-2 px-4 py-3 rounded-xl text-white text-xs font-bold shadow-lg animate-bounce ${
          showToast.status === "success" ? "bg-emerald-600" : "bg-red-600"
        }`}>
          {showToast.status === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{showToast.msg}</span>
        </div>
      )}

      {/* Slide-out Sidebar Drawer */}
      <div className="w-full sm:max-w-xl max-w-full bg-white dark:bg-[#0B0F19] h-full flex flex-col justify-between shadow-2xl border-l border-slate-200 dark:border-slate-800 animate-slide-in overflow-hidden">
        
        {/* Header Drawer */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#121826] flex items-center justify-between">
          <div className="flex items-center text-left">
            <h2 className="font-sans font-extrabold text-xs sm:text-sm md:text-base tracking-widest text-[#003B7A] dark:text-[#60A5FA] uppercase">
              FTI CUP ADMIN
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="px-2.5 py-1 text-[10px] font-bold text-red-650 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 rounded-lg border border-red-200/50 dark:border-red-900/50 transition-all font-mono uppercase"
              >
                Logout
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-350"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isLoggedIn ? (
          /* RE-STYLED LUXURIOUS AUTH PANEL */
          <div className="flex-1 p-8 flex flex-col justify-center bg-[#F8FAFC] dark:bg-[#0B0F19]">
            <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-[#1E293B]/45 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6 max-w-sm mx-auto w-full">
              <div className="text-center space-y-2">
                <h3 className="font-sans font-bold text-lg text-slate-800 dark:text-[#F8FAFC] tracking-tight">Kepanitiaan Resmi</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  Situs manajemen database FTI CUP. Masuk dengan kredensial panitia Anda untuk memperbarui data agenda.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400">Email Panitia</label>
                  <input
                    type="email"
                    required
                    placeholder="nama@itn.ac.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg bg-[#FAFBFD] dark:bg-slate-900 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#003B7A] dark:focus:ring-[#60A5FA] font-medium"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg bg-[#FAFBFD] dark:bg-slate-900 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#003B7A] dark:focus:ring-[#60A5FA]"
                  />
                </div>

                {loginError && (
                  <div className="text-[11px] text-red-700 dark:text-red-400 font-semibold bg-red-50/80 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/45 rounded-lg p-2.5 text-center flex items-center justify-center gap-1.5 animate-pulse">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#003B7A] hover:bg-[#002752] dark:bg-[#2E86DE] dark:hover:bg-[#1D74CD] text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-all shadow-xs active:scale-[0.98] mt-2 cursor-pointer"
                >
                  Masuk Ke Database
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* CONSOLE BODY ONCE AUTHENTICATED SUCCESSFULLY */
          <>
            {/* Tab Selector Segment */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/20 p-2 overflow-x-auto gap-1">
              {([
                { id: "sports", label: "Lomba", icon: Trophy },
                { id: "gamesystem", label: "Aturan", icon: Settings },
                { id: "jadwal", label: "Jadwal", icon: Calendar },
                { id: "documents", label: "Pusat Dokumen", icon: FileText },
                { id: "contacts", label: "Kontak CP", icon: Phone },
                { id: "links", label: "Google Forms", icon: Link },
                { id: "countdown", label: "Waktu Pembukaan", icon: Clock },
                { id: "faqs", label: "FAQ", icon: HelpCircle }
              ] as const).map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 uppercase tracking-wider whitespace-nowrap ${
                      isActive
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Panel Content - Middle Scrollbar Container */}
            <div className="flex-1 p-5 overflow-y-auto space-y-6">

            {/* TAB 0.1: SPORTS (CABANG LOMBA) MANAGEMENT */}
            {activeTab === "sports" && (
              <div className="space-y-6">
                {/* Form to Add/Edit Cabang Lomba */}
                <form onSubmit={handleSaveSport} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      {editingSportId ? "Ubah Cabang Lomba" : "Tambah Cabang Lomba"}
                    </h3>
                    {editingSportId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSportId(null);
                          setSportForm({ name: "", description: "", googleFormUrl: "", isActive: true });
                        }}
                        className="text-[10px] text-red-500 font-bold hover:underline"
                      >
                        Batal Edit
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nama Lomba</label>
                      <input
                        type="text"
                        placeholder="Contoh: Voli, E-Sports, Basket"
                        value={sportForm.name}
                        onChange={(e) => setSportForm({ ...sportForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-250/70 dark:border-slate-800/80 rounded-lg dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Deskripsi Lomba</label>
                      <textarea
                        placeholder="Uraikan detail pertandingan cabang ini..."
                        value={sportForm.description}
                        onChange={(e) => setSportForm({ ...sportForm, description: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-250/70 dark:border-slate-800/80 rounded-lg dark:bg-slate-900 text-slate-800 dark:text-slate-200 h-16 resize-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Link Google Form Pendaftaran</label>
                      <input
                        type="url"
                        placeholder="https://docs.google.com/forms/d/..."
                        value={sportForm.googleFormUrl || ""}
                        onChange={(e) => setSportForm({ ...sportForm, googleFormUrl: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-250/70 dark:border-slate-800/80 rounded-lg dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="sport-is-active-cb"
                        checked={sportForm.isActive !== false}
                        onChange={(e) => setSportForm({ ...sportForm, isActive: e.target.checked })}
                        className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="sport-is-active-cb" className="text-xs font-semibold text-slate-700 dark:text-slate-310">
                        Status Aktif (Tampilkan di halaman utama)
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-2 bg-[#003B7A] hover:bg-[#002752] disabled:bg-blue-300 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{editingSportId ? "Simpan Cabang" : "Sematkan Cabang Baru"}</span>
                  </button>
                </form>

                {/* List of Current Cabang Lomba */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#003B7A] dark:text-[#60A5FA]">Prisma DB Table: CabangLomba ({dbData.cabangLomba.length})</h4>
                  <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950/30">
                    <table className="min-w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          <th className="py-3 px-4">Database ID</th>
                          <th className="py-3 px-4">Sport Name</th>
                          <th className="py-3 px-4">Description</th>
                          <th className="py-3 px-4">Form Registration URL</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dbData.cabangLomba.map((sport) => (
                          <tr key={sport.id} className="border-b border-slate-100 last:border-b-0 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 font-medium">
                            <td className="py-3 px-4 font-mono font-semibold text-slate-400 dark:text-slate-500">{sport.id}</td>
                            <td className="py-3 px-4 text-slate-900 dark:text-[#F8FAFC] font-bold">{sport.name}</td>
                            <td className="py-3 px-4 text-slate-500 truncate max-w-xs">{sport.description}</td>
                            <td className="py-3 px-4 font-mono text-[10px] text-blue-600 truncate max-w-[180px]" title={sport.googleFormUrl || ""}>
                              {sport.googleFormUrl || "-"}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold inline-block ${
                                sport.isActive !== false ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                              }`}>
                                {sport.isActive !== false ? "ACTIVE" : "DISABLED"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleEditSport(sport)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                                  title="Edit Row"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSport(sport.id)}
                                  disabled={isSaving}
                                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                                  title="Delete Row"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 0.2: GAMESYSTEM (SISTEM PERTANDINGAN) MANAGEMENT */}
            {activeTab === "gamesystem" && (
              <div className="space-y-6">
                {/* Edit Form */}
                {editingGameSystemId ? (
                  <form onSubmit={handleSaveGameSystem} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800 space-y-4 text-left">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-355">
                        Atur Sistem: {gameSystemForm.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingGameSystemId(null);
                          setGameSystemForm({ name: "", format: "", rules: [], location: "", tmInfo: "" });
                        }}
                        className="text-[10px] text-red-500 font-bold hover:underline"
                      >
                        Batal
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Format Pertandingan</label>
                        <input
                          type="text"
                          placeholder="Sistem Gugur (Knockout System)"
                          value={gameSystemForm.format || ""}
                          onChange={(e) => setGameSystemForm({ ...gameSystemForm, format: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-slate-250/70 dark:border-slate-800/80 rounded-lg dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Lokasi Laga</label>
                        <input
                          type="text"
                          placeholder="Lapangan Gelanggang ITN Malang Kampus II"
                          value={gameSystemForm.location || ""}
                          onChange={(e) => setGameSystemForm({ ...gameSystemForm, location: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-slate-250/70 dark:border-slate-800/80 rounded-lg dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Jadwal Technical Meeting (TM)</label>
                        <input
                          type="text"
                          placeholder="Akan ditentukan sewaktu pendaftaran berakhir"
                          value={gameSystemForm.tmInfo || ""}
                          onChange={(e) => setGameSystemForm({ ...gameSystemForm, tmInfo: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-slate-250/70 dark:border-slate-800/80 rounded-lg dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Deskripsi Aturan Sistem Pertandingan (Satu baris per poin)</label>
                        <textarea
                          placeholder="Aturan 1&#10;Aturan 2"
                          value={Array.isArray(gameSystemForm.rules) ? gameSystemForm.rules.join("\n") : (gameSystemForm.rules as string) || ""}
                          onChange={(e) => setGameSystemForm({ ...gameSystemForm, rules: e.target.value.split("\n") })}
                          className="w-full px-3 py-2 text-xs border border-slate-250/70 dark:border-slate-800/80 rounded-lg dark:bg-slate-900 text-slate-800 dark:text-slate-200 h-24 resize-none"
                        />
                        <span className="text-[9px] text-slate-400 leading-none block">Pisahkan poin-poin aturan dengan baris baru (ENTER)</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full py-2 bg-[#003B7A] hover:bg-[#002752] disabled:bg-blue-300 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Ketentuan Aturan</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 text-xs text-slate-700 dark:text-blue-300 text-left">
                    Tekan tombol <Edit className="w-3.5 h-3.5 inline pb-0.5" /> edit di samping cabang game di bawah untuk mengubah detail format tanding dan Technical Meeting.
                  </div>
                )}

                {/* List Game Systems */}
                <div className="space-y-4 text-left">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#003B7A] dark:text-[#60A5FA]">Prisma DB Table: GameSystem ({dbData.gameSystems.length})</h4>
                  <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950/30">
                    <table className="min-w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          <th className="py-3 px-4">Database ID (FK)</th>
                          <th className="py-3 px-4">Cabang Name</th>
                          <th className="py-3 px-4">Format Tanding</th>
                          <th className="py-3 px-4">Match Location</th>
                          <th className="py-3 px-4">Technical Meeting Info</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dbData.gameSystems.map((gs) => (
                          <tr key={gs.id} className="border-b border-slate-100 last:border-b-0 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 font-medium">
                            <td className="py-3 px-4 font-mono font-semibold text-slate-400 dark:text-slate-500">{gs.id}</td>
                            <td className="py-3 px-4 text-slate-900 dark:text-[#F8FAFC] font-bold">{gs.name}</td>
                            <td className="py-3 px-4 text-slate-500">{gs.format || "Sistem Gugur (Knockout)"}</td>
                            <td className="py-3 px-4 text-slate-500 font-semibold">{gs.location || "-"}</td>
                            <td className="py-3 px-4 text-slate-400 truncate max-w-[150px]" title={gs.tmInfo || ""}>{gs.tmInfo || "-"}</td>
                            <td className="py-3 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleEditGameSystem(gs)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md inline-flex items-center"
                                title="Edit Row Properties"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 1: SCHEDULES MANAGEMENT */}
          {activeTab === "jadwal" && (
            <div className="space-y-6">
              {/* Add/Edit Schedule Form */}
              <form onSubmit={handleSaveSchedule} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {editingScheduleId ? "Edit Jadwal Lomba" : "Tambah Jadwal Baru"}
                  </h3>
                  {editingScheduleId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingScheduleId(null);
                        setScheduleForm({ lombaName: "", date: "", time: "", location: "" });
                      }}
                      className="text-[10px] text-red-500 font-bold hover:underline"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nama Cabang / Agenda</label>
                    <input
                      type="text"
                      placeholder="Contoh: Voli (Penyisihan Gelombang I)"
                      value={scheduleForm.lombaName}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, lombaName: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-250/70 dark:border-slate-800/80 rounded-lg dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Hari & Tanggal</label>
                      <input
                        type="text"
                        placeholder="Contoh: Senin, 15 Juni 2026"
                        value={scheduleForm.date}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-250/70 dark:border-slate-800/80 rounded-lg dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Jam Tanding</label>
                      <input
                        type="text"
                        placeholder="Contoh: 08:00 WIB - Selesai"
                        value={scheduleForm.time}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-250/70 dark:border-slate-800/80 rounded-lg dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Lokasi Pertandingan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Lapangan Serbaguna Kampus II ITN"
                      value={scheduleForm.location}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-250/70 dark:border-slate-800/80 rounded-lg dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-2 bg-[#003B7A] hover:bg-[#002752] disabled:bg-blue-300 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingScheduleId ? "Perbarui Jadwal" : "Sematkan Jadwal"}</span>
                </button>
              </form>

              {/* Schedules Table/Container inside drawer list */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#003B7A] dark:text-[#60A5FA]">Prisma DB Table: Jadwal ({dbData.jadwal.length})</h4>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950/30">
                  <table className="min-w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-3 px-4">Database ID</th>
                        <th className="py-3 px-4">Cabang Lomba Name</th>
                        <th className="py-3 px-4">Match Date</th>
                        <th className="py-3 px-4">Match Time</th>
                        <th className="py-3 px-4">Match Location</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dbData.jadwal.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100 last:border-b-0 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 font-medium">
                          <td className="py-3 px-4 font-mono font-semibold text-slate-400 dark:text-slate-500">{item.id}</td>
                          <td className="py-3 px-4 text-slate-900 dark:text-[#F8FAFC] font-bold">{item.lombaName}</td>
                          <td className="py-3 px-4 text-slate-500">{item.date}</td>
                          <td className="py-3 px-4 text-slate-500 font-mono text-[10px]">{item.time}</td>
                          <td className="py-3 px-4 text-slate-500 font-semibold">{item.location}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => handleEditSchedule(item)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                                title="Edit Row"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSchedule(item.id)}
                                disabled={isSaving}
                                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                                title="Delete Row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOCUMENTS CENTRE MANAGEMENT */}
          {activeTab === "documents" && (
            <div className="space-y-6">
              <form onSubmit={handleSaveDocument} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {editingDocId ? "Edit Metadata Dokumen" : "Upload Dokumen Baru"}
                  </h3>
                  {editingDocId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDocId(null);
                        setDocForm({ title: "", description: "", filename: "", downloadUrl: "" });
                      }}
                      className="text-[10px] text-red-500 font-bold hover:underline"
                    >
                      Batal
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Judul Dokumen</label>
                    <input
                      type="text"
                      placeholder="Contoh: Official Rulebook Tarik Tambang"
                      value={docForm.title}
                      onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-250/70 dark:border-slate-800/80 rounded-lg dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Rincian Deskripsi</label>
                    <textarea
                      placeholder="Petunjuk draf pinalti, regulasi jaminan, dll."
                      value={docForm.description}
                      onChange={(e) => setDocForm({ ...docForm, description: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-250/70 dark:border-slate-800/80 rounded-lg dark:bg-slate-900 text-slate-800 dark:text-slate-200 h-16 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nama File Fisik</label>
                      <input
                        type="text"
                        placeholder="Rulebook_Tarik_Tambang.docx"
                        value={docForm.filename}
                        onChange={(e) => setDocForm({ ...docForm, filename: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-250/70 dark:border-slate-800/80 rounded-lg dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Download Link (G-Drive/URL)</label>
                      <input
                        type="text"
                        placeholder="https://docs.google.com/..."
                        value={docForm.downloadUrl}
                        onChange={(e) => setDocForm({ ...docForm, downloadUrl: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-250/70 dark:border-slate-800/80 rounded-lg dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-2 bg-[#003B7A] hover:bg-[#002752] disabled:bg-blue-300 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingDocId ? "Simpan Perubahan Berkas" : "Simpan Berkas Publik"}</span>
                </button>
              </form>

              {/* Documents Active List */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#003B7A] dark:text-[#60A5FA]">Prisma DB Table: Document ({dbData.documents.length})</h4>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950/30">
                  <table className="min-w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-3 px-4">Database ID</th>
                        <th className="py-3 px-4">Document Title</th>
                        <th className="py-3 px-4">Description Info</th>
                        <th className="py-3 px-4">Physical Filename</th>
                        <th className="py-3 px-4">Download Destination Link</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dbData.documents.map((doc) => (
                        <tr key={doc.id} className="border-b border-slate-100 last:border-b-0 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 font-medium">
                          <td className="py-3 px-4 font-mono font-semibold text-slate-400 dark:text-slate-500">{doc.id}</td>
                          <td className="py-3 px-4 text-slate-900 dark:text-[#F8FAFC] font-bold">{doc.title}</td>
                          <td className="py-3 px-4 text-slate-500 truncate max-w-xs">{doc.description || "-"}</td>
                          <td className="py-3 px-4 font-mono text-[10px] text-slate-400">{doc.filename}</td>
                          <td className="py-3 px-4 font-mono text-[10px] text-blue-600 truncate max-w-[150px]" title={doc.downloadUrl}>
                            {doc.downloadUrl}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => handleEditDoc(doc)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                                title="Edit Row"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteDoc(doc.id)}
                                disabled={isSaving}
                                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                                title="Delete Row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT PERSON MANAGEMENT */}
          {activeTab === "contacts" && (
            <div className="space-y-6">
              <form onSubmit={handleSaveContact} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {editingContactId ? "Edit Profil Kontak" : "Daftarkan Kontak Baru"}
                  </h3>
                  {editingContactId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingContactId(null);
                        setContactForm({ name: "", role: "", whatsapp: "", foto: "" });
                      }}
                      className="text-[10px] text-red-500 font-bold hover:underline"
                    >
                      Batal
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        placeholder="Ahmad Fauzi"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-250/70 dark:border-slate-800/80 rounded-lg dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Jabatan / CP Lomba</label>
                      <input
                        type="text"
                        placeholder="Koordinator Futsal"
                        value={contactForm.role}
                        onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-250/70 dark:border-slate-800/80 rounded-lg dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">WhatsApp (Format: 628...)</label>
                    <input
                      type="text"
                      placeholder="628123456789"
                      value={contactForm.whatsapp}
                      onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-250/70 dark:border-slate-800/80 rounded-lg dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-2 bg-[#003B7A] hover:bg-[#002752] disabled:bg-blue-300 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingContactId ? "Perbarui Profil Panitia" : "Daftarkan Panitia"}</span>
                </button>
              </form>

              {/* Contacts Active List */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#003B7A] dark:text-[#60A5FA]">Prisma DB Table: Contact ({dbData.contacts.length})</h4>
                <div className="overflow-x-auto border border-slate-200/50 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950/30">
                  <table className="min-w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-3 px-4">Database ID</th>
                        <th className="py-3 px-4">Full Name</th>
                        <th className="py-3 px-4">Role / CP Label</th>
                        <th className="py-3 px-4">WhatsApp Contact</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dbData.contacts.map((c) => (
                        <tr key={c.id} className="border-b border-slate-100 last:border-b-0 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 font-medium">
                          <td className="py-3 px-4 font-mono font-semibold text-slate-400 dark:text-slate-500">{c.id}</td>
                          <td className="py-3 px-4 text-slate-900 dark:text-[#F8FAFC] font-bold">{c.name}</td>
                          <td className="py-3 px-4 text-slate-500 uppercase font-bold text-[10px]">{c.role}</td>
                          <td className="py-3 px-4 text-slate-500 font-mono text-[10px]">{c.whatsapp}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => handleEditContact(c)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                                title="Edit Row"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteContact(c.id)}
                                disabled={isSaving}
                                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                                title="Delete Row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GOOGLE FORM REGISTRATION LINKS */}
          {activeTab === "links" && (
            <div className="space-y-5">
              <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-105 dark:border-blue-900 text-xs text-slate-700 dark:text-blue-300 leading-normal flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#003B7A] shrink-0 mt-0.5" />
                <span>Format form-form ini terhubung langsung ke tombol <strong>Daftar Lomba</strong>. Masukkan alamat URL Google Form Anda dan klik simpan di sebelahnya.</span>
              </div>

              <div className="space-y-4">
                {dbData.registrationLinks.map((link) => (
                  <div key={link.id} className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/50 dark:border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">{link.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 rounded font-bold">ID: {link.id}</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://docs.google.com/forms/..."
                        defaultValue={link.link}
                        id={`input-link-field-${link.id}`}
                        className="flex-1 px-3 py-2 text-xs border border-slate-250/70 dark:border-slate-800/80 rounded-lg dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-blue"
                      />
                      <button
                        onClick={() => {
                          const val = (document.getElementById(`input-link-field-${link.id}`) as HTMLInputElement)?.value || "";
                          handleUpdateLink(link.id, val);
                        }}
                        disabled={isSaving}
                        className="px-3 bg-[#003B7A] hover:bg-[#002752] disabled:bg-blue-350 text-white rounded-lg text-xs font-semibold flex items-center justify-center shadow-xs"
                        title="Simpan Link"
                      >
                        <Save className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PEKAN PEMBUKAAN COUNTDOWN MANAGEMENT */}
          {activeTab === "countdown" && (
            <div className="space-y-5">
              <div className="p-4 bg-[#F8FAFC] dark:bg-[#121826] rounded-xl border border-slate-200 dark:border-[#1E293B]/45 space-y-4 text-left">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#003B7A] dark:text-[#a5ccff]">Waktu & Batas Portal</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 mb-1">Target Countdown (ISO Format)</label>
                    <input
                      type="datetime-local"
                      value={countdownInput.slice(0, 16)} // format datetime-local friendly (YYYY-MM-DDTHH:mm)
                      onChange={(e) => setCountdownInput(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-[#003B7A]"
                    />
                    <span className="block text-[10px] text-slate-400 mt-1">
                      Saat ini: <strong className="font-mono text-slate-600 dark:text-slate-300">{dbData.countdownDate}</strong>
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 mb-1">Batas Akhir Portal (Teks Bebas)</label>
                    <input
                      type="text"
                      value={portalDeadlineInput}
                      onChange={(e) => setPortalDeadlineInput(e.target.value)}
                      placeholder="08 Juni 2026 Pukul 23:59 WIB"
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-[#003B7A] font-medium"
                    />
                    <span className="block text-[10px] text-slate-400 mt-1">
                      Saat ini: <strong className="text-slate-600 dark:text-slate-300">{dbData.portalDeadline || "08 Juni 2026 Pukul 23:59 WIB"}</strong>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleUpdateCountdown}
                  disabled={isSaving}
                  className="w-full py-2.5 bg-[#003B7A] hover:bg-[#002752] dark:bg-[#2E86DE] dark:hover:bg-[#1D74CD] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs mt-2 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Waktu & Batas</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: FAQ MANAGEMENT */}
          {activeTab === "faqs" && (
            <div className="space-y-6">
              {/* Form to Add/Edit FAQ */}
              <form onSubmit={handleSaveFaq} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800 space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {editingFaqId ? "Ubah FAQ" : "Tambah FAQ"}
                  </h3>
                  {editingFaqId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingFaqId(null);
                        setFaqForm({ question: "", answer: "", order: 0 });
                      }}
                      className="text-[10px] text-red-500 font-bold hover:underline"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Pertanyaan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Apakah lomba gratis?"
                      value={faqForm.question}
                      onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-250/70 dark:border-slate-800/80 rounded-lg dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Jawaban</label>
                    <textarea
                      placeholder="Uraikan jawaban..."
                      value={faqForm.answer}
                      onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-250/70 dark:border-slate-800/80 rounded-lg dark:bg-slate-900 text-slate-800 dark:text-slate-200 h-28 resize-y font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Urutan Tampil (Order)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={faqForm.order}
                      onChange={(e) => setFaqForm({ ...faqForm, order: Number(e.target.value) })}
                      className="w-24 px-3 py-2 text-xs border border-slate-250/70 dark:border-slate-800/80 rounded-lg dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-2 bg-[#003B7A] hover:bg-[#002752] dark:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingFaqId ? "Ubah FAQ" : "Sematkan FAQ Baru"}</span>
                </button>
              </form>

              {/* List of Current FAQs */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#003B7A] dark:text-[#60A5FA]">Prisma DB Table: Faq ({(dbData.faqs || []).length})</h4>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950/30">
                  <table className="min-w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-3 px-4 w-20">Row ID</th>
                        <th className="py-3 px-4 w-16">Order</th>
                        <th className="py-3 px-4">Question Text</th>
                        <th className="py-3 px-4">Answer Text</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(dbData.faqs || []).map((faq) => (
                        <tr key={faq.id} className="border-b border-slate-100 last:border-b-0 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 font-medium">
                          <td className="py-3 px-4 font-mono font-semibold text-slate-400 dark:text-slate-500 truncate max-w-[80px]" title={faq.id}>{faq.id}</td>
                          <td className="py-3 px-4 font-mono font-bold text-[#003B7A] dark:text-[#60A5FA]">#{faq.order}</td>
                          <td className="py-3 px-4 text-slate-900 dark:text-[#F8FAFC] font-semibold">{faq.question}</td>
                          <td className="py-3 px-4 text-slate-500 truncate max-w-sm" title={faq.answer}>{faq.answer}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => handleEditFaq(faq)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                                title="Edit Row"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteFaq(faq.id)}
                                disabled={isSaving}
                                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                                title="Delete Row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {(dbData.faqs || []).length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-xs text-slate-400">Belum ada FAQ terdaftar.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
        </>
        )}

        {/* Footer Drawer */}
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-center text-[10px] text-slate-400 font-mono uppercase tracking-wider font-semibold">
          FTI CUP ITN Malang 2026 Admin Panel
        </div>

      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Shield, Calendar, MapPin, Download, ChevronRight, DollarSign, Award } from "lucide-react";

interface HeroProps {
  countdownTarget: string;
}

const ITNLogoHeader = () => (
  <div className="p-3 bg-[#003B7A] dark:bg-[#121826] text-white dark:text-[#60A5FA] rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-all duration-200 ring-2 ring-black/5 dark:ring-[#1E293B]/50">
    <Shield className="w-5 h-5 text-current" strokeWidth={2.5} />
  </div>
);

export default function Hero({ countdownTarget }: HeroProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(countdownTarget) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isOver: false,
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [countdownTarget]);

  const countdownUnits = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];

  return (
    <section
      id="hero-section"
      className="relative min-h-screen pt-36 pb-[64px] md:pb-[80px] lg:pb-[100px] flex items-center justify-center overflow-hidden bg-white dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-200"
    >
      {/* Light Clean Grid Lines (Slight grid accent like Vercel - Disabled in Dark Mode) */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none dark:opacity-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern-hero" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#64748b" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern-hero)" />
        </svg>
      </div>

      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16 z-10">
        <div className="max-w-[850px] mx-auto flex flex-col items-center justify-center text-center space-y-8">
          
          {/* Header/Logo + Subtitle Block */}
          <div className="flex flex-col items-center gap-4">
            <ITNLogoHeader />
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F8FAFC] dark:bg-[#121826] border border-[#E2E8F0] dark:border-[#1E293B]/45 text-[#003B7A] dark:text-[#60A5FA] rounded-md text-xs font-semibold uppercase tracking-wider">
                <span>Keluarga Besar FTI ITN Malang</span>
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-[#64748B] dark:text-[#CBD5E1] uppercase tracking-widest mt-2">
                Fakultas Teknologi Industri
              </h3>
            </div>
          </div>

          {/* Main Hero Header Title: 56px */}
          <h1 className="font-sans text-[30px] sm:text-[36px] md:text-[56px] font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] leading-tight select-none">
            FTI CUP <br className="sm:hidden" />
            <span className="text-[#003B7A] dark:text-[#60A5FA]">
              ITN MALANG 2026
            </span>
          </h1>

          {/* Body Text: 16px */}
          <p className="text-[13px] sm:text-[14px] md:text-base text-[#64748B] dark:text-[#CBD5E1] w-full max-w-[700px] mx-auto leading-relaxed font-normal font-sans">
            Ajang silaturahmi olahraga & e-sports untuk bersatu, mengukir persaudaraan, dan menumbuhkan sportivitas yang sehat serta positif di lingkungan kampus.
          </p>

          {/* Elegant CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full max-w-md mx-auto">
            <a
              id="hero-btn-daftar"
              href="#pendaftaran"
              className="w-full sm:w-auto h-[40px] md:h-[46px] px-4 md:px-5 bg-[#003B7A] hover:bg-[#002752] dark:bg-[#2E86DE] dark:hover:bg-[#2E86DE]/90 text-white rounded-[10px] text-[13px] sm:text-[14px] md:text-[15px] font-semibold tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
            >
              <span>Daftar Sekarang</span>
              <ChevronRight className="w-4 h-4" />
            </a>
            <a
              id="hero-btn-guidebook"
              href="#pusat-dokumen"
              className="w-full sm:w-auto h-[40px] md:h-[46px] px-4 md:px-5 bg-white dark:bg-[#121826] border border-[#E2E8F0] dark:border-[#1E293B]/55 hover:bg-[#F8FAFC] dark:hover:bg-[#1A2338] text-[#0F172A] dark:text-[#F8FAFC] rounded-[10px] text-[13px] sm:text-[14px] md:text-[15px] font-medium tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
            >
              <Download className="w-4 h-4 text-[#003B7A] dark:text-[#60A5FA]" />
              <span>Download Guidebook</span>
            </a>
          </div>

          {/* Premium Mini Information Grid - Centered Horizontal Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 w-full max-w-3xl mx-auto text-left">
            <div className="p-4 bg-white dark:bg-[#121826] border border-[#E2E8F0] dark:border-[#1E293B]/45 rounded-xl flex items-start gap-3">
              <div className="p-2 bg-blue-50 dark:bg-[#1A2338] rounded-lg shrink-0 text-[#003B7A] dark:text-[#60A5FA]">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-[#64748B] dark:text-[#CBD5E1] uppercase tracking-wider block">Lokasi</span>
                <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Kampus 2 ITN Malang</p>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#121826] border border-[#E2E8F0] dark:border-[#1E293B]/45 rounded-xl flex items-start gap-3">
              <div className="p-2 bg-blue-50 dark:bg-[#1A2338] rounded-lg shrink-0 text-[#003B7A] dark:text-[#60A5FA]">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-[#64748B] dark:text-[#CBD5E1] uppercase tracking-wider block">Pelaksanaan</span>
                <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">10 – 13 Juni 2026</p>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#121826] border border-[#E2E8F0] dark:border-[#1E293B]/45 rounded-xl flex items-start gap-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg shrink-0 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-emerald-650 dark:text-emerald-400 uppercase tracking-wider block">Keikutsertaan</span>
                 <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Pendaftaran Gratis</p>
              </div>
            </div>
          </div>

          {/* Grid Layout below for Countdown & Delegasi Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 w-full max-w-4xl mx-auto items-stretch">
            
            {/* Left: Agenda Countdown Card */}
            <div className="p-6 bg-white dark:bg-[#121826] border border-[#E2E8F0] dark:border-[#1E293B]/45 rounded-2xl flex flex-col justify-between relative shadow-xs">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-[#003B7A] dark:bg-[#60A5FA] text-white dark:text-[#0F172A] rounded-full text-[10px] font-semibold tracking-wider uppercase whitespace-nowrap shadow-xs">
                Agenda Pembukaan
              </div>

              <div className="text-center mt-3 mb-5">
                <p className="text-[10px] sm:text-xs text-[#64748B] dark:text-[#CBD5E1] font-semibold uppercase tracking-wider">Event Dimulai Dalam</p>
                <p className="text-[11px] text-[#003B7A] dark:text-[#60A5FA] font-bold mt-1">Rabu, 10 Juni 2026</p>
              </div>

              {/* Grid of countdown dials */}
              <div className="grid grid-cols-4 gap-2.5 font-sans mb-4">
                {countdownUnits.map((unit) => (
                  <div key={unit.label} className="flex flex-col items-center">
                    <div className="w-full aspect-square bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B]/45 rounded-xl flex items-center justify-center shadow-inner relative overflow-hidden">
                      <span className="font-sans text-lg sm:text-xl font-semibold text-[#003B7A] dark:text-[#60A5FA] tracking-tight">
                        {String(unit.value).padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#64748B] dark:text-[#CBD5E1] uppercase tracking-widest mt-2">{unit.label}</span>
                  </div>
                ))}
              </div>

              {timeLeft.isOver ? (
                <div className="text-center text-emerald-600 dark:text-emerald-400 font-semibold text-xs py-2 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-lg">
                  Event FTI CUP Resmi Dimulai
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-[#003B7A] dark:text-[#60A5FA] tracking-widest uppercase bg-[#F8FAFC] dark:bg-[#1A2338] border border-[#E2E8F0] dark:border-[#1E293B]/45 rounded-lg py-2">
                  <Award className="w-3.5 h-3.5 text-[#003B7A] dark:text-[#60A5FA]" />
                  <span>Fair Play & Sportivitas</span>
                </div>
              )}
            </div>

            {/* Right: Delegasi Program Studi Card */}
            <div className="p-6 border border-[#E2E8F0] dark:border-[#1E293B]/45 bg-white dark:bg-[#121826] rounded-2xl text-left flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#1E293B]/45 pb-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#003B7A] dark:bg-[#60A5FA]"></span>
                  <h4 className="text-[11px] font-bold text-[#003B7A] dark:text-[#a5ccff] uppercase tracking-wider">
                    Ketentuan Delegasi Program Studi
                  </h4>
                </div>
                <div className="space-y-2.5 text-xs text-[#64748B] dark:text-[#CBD5E1] leading-relaxed font-sans font-normal">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#003B7A] dark:bg-[#60A5FA] shrink-0"></span>
                    <p>
                      SETIAP PROGRAM STUDI <span className="bg-sky-50 dark:bg-sky-950/40 text-[#003B7A] dark:text-[#60A5FA] px-1.5 py-0.5 rounded font-bold border border-sky-200 dark:border-sky-900/40 inline-block uppercase tracking-wider text-[9px]">WAJIB</span> mengirimkan perwakilan program studi pada FTI CUP 2026.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#003B7A] dark:bg-[#60A5FA] shrink-0"></span>
                    <p>
                      Program studi diperbolehkan mengirimkan lebih dari satu tim sesuai cabang lomba yang diikuti.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#003B7A] dark:bg-[#60A5FA] shrink-0"></span>
                    <p>
                      Delegasi dosen bersifat bebas dan tidak terikat pada program studi tertentu.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2E8F0]/65 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 font-sans italic text-center">
                *Verifikasi administrasi dilakukan saat technical meeting.
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

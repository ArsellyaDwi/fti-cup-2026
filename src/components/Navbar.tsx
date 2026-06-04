import { useState, useEffect } from "react";
import { Sun, Moon, Shield, Settings } from "lucide-react";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onOpenEditor: () => void;
}

const ITNLogo = () => (
  <div className="p-1.5 md:p-2 bg-[#003B7A] dark:bg-[#121826] text-white dark:text-[#60A5FA] rounded-lg md:rounded-xl ring-2 ring-black/5 dark:ring-[#1E293B]/45 flex items-center justify-center shrink-0 transition-all duration-200">
    <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-current" strokeWidth={2.5} />
  </div>
);

export default function Navbar({ darkMode, setDarkMode, onOpenEditor }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Tentang", href: "#tentang" },
    { label: "Cabang", href: "#cabang-lomba" },
    { label: "Sistem Tanding", href: "#sistem-pertandingan" },
    { label: "Dokumen", href: "#pusat-dokumen" },
    { label: "Jadwal", href: "#jadwal" },
    { label: "Pendaftaran", href: "#pendaftaran" },
    { label: "FAQ", href: "#faq" },
    { label: "Kontak", href: "#kontak-person" },
  ];

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 flex items-center ${
        scrolled
          ? "h-[56px] md:h-[72px] lg:h-[80px] bg-white/95 dark:bg-[#0B0F19]/95 border-b border-[#E2E8F0] dark:border-[#131B2E]/35 backdrop-blur-md shadow-xs"
          : "h-[64px] md:h-[80px] bg-white dark:bg-[#0B0F19] border-b border-[#E2E8F0] dark:border-[#131B2E]/35 shadow-xs"
      }`}
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-12 xl:px-16 flex items-center justify-between">
        {/* Brand/Logo */}
        <a id="nav-brand" href="#" className="flex items-center gap-2 md:gap-2.5 group">
          <ITNLogo />
          <div className="flex flex-col">
            <span className="font-sans font-semibold text-[12px] sm:text-base tracking-tight text-[#003B7A] dark:text-[#60A5FA] leading-none transition-colors">
              FTI CUP 2026
            </span>
            <span className="font-sans text-[7px] sm:text-[8px] font-medium tracking-widest text-[#64748B] dark:text-[#CBD5E1] mt-0.5 uppercase">
              ITN MALANG
            </span>
          </div>
        </a>

        {/* Navigation Items - Desktop */}
        <div id="nav-items-desktop" className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => (
            <a
              key={item.href}
              id={`nav-link-${item.href.replace("#", "")}`}
              href={item.href}
              className="px-3 py-1.5 rounded-md text-[13px] xl:text-[14px] font-medium text-[#64748B] dark:text-[#CBD5E1] hover:text-[#003B7A] dark:hover:text-[#60A5FA] hover:bg-[#F8FAFC] dark:hover:bg-[#121826] transition-all font-sans"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Actions Button Panel */}
        <div id="nav-actions" className="flex items-center gap-2 md:gap-2.5">
          {/* Light / Dark Mode Controls */}
          <button
            id="nav-btn-theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 md:p-2 rounded-md border border-[#E2E8F0] dark:border-[#1E293B]/55 text-[#64748B] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#121826] hover:text-[#003B7A] dark:hover:text-[#60A5FA] transition-all cursor-pointer h-8 w-8 md:h-9 md:w-9 flex items-center justify-center shrink-0"
            aria-label="Toggle theme mode"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Moon className="w-3.5 h-3.5 md:w-4 md:h-4" />}
          </button>

          {/* Prisma DB Admin Settings Control */}
          <button
            id="nav-btn-editor-toggle"
            onClick={onOpenEditor}
            className="p-1.5 md:p-2 rounded-md border border-[#E2E8F0] dark:border-[#1E293B]/55 text-[#64748B] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#121826] hover:text-[#003B7A] dark:hover:text-[#60A5FA] transition-all cursor-pointer h-8 w-8 md:h-9 md:w-9 flex items-center justify-center shrink-0"
            title="Open Prisma DB Editor Console"
            aria-label="Open DB Console"
          >
            <Settings className="w-3.5 h-3.5 md:w-4 md:h-4 animate-hover-spin" />
          </button>

          {/* Quick Action Button */}
          <a
            id="nav-btn-register-quick"
            href="#pendaftaran"
            className="px-2.5 md:px-4 h-8 md:h-9 bg-[#003B7A] hover:bg-[#002752] dark:bg-[#2E86DE] dark:hover:bg-[#2E86DE]/90 text-white dark:text-[#F8FAFC] rounded-md text-[12px] sm:text-[13px] md:text-[14px] font-semibold tracking-wide transition-all shadow-xs shrink-0 flex items-center justify-center cursor-pointer transition-colors duration-200"
          >
            Daftar Gratis
          </a>
        </div>
      </div>
    </nav>
  );
}

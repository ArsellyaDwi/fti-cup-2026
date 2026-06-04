import React, { useState, useEffect } from "react";
import {
  CircleHelp,
  Trophy,
  Swords,
  FileText,
  CalendarDays,
  ClipboardPen,
  MessageCircleQuestion,
  Phone
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: "tentang", label: "Tentang", icon: CircleHelp },
  { id: "cabang-lomba", label: "Cabang", icon: Trophy },
  { id: "sistem-pertandingan", label: "Sistem", icon: Swords },
  { id: "pusat-dokumen", label: "Dokumen", icon: FileText },
  { id: "jadwal", label: "Jadwal", icon: CalendarDays },
  { id: "pendaftaran", label: "Daftar", icon: ClipboardPen },
  { id: "faq", label: "FAQ", icon: MessageCircleQuestion },
  { id: "kontak-person", label: "Kontak", icon: Phone },
];

export default function MobileQuickNav() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    // Highly responsive IntersectionObserver
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px", // Focus triggers on the middle screen range
      threshold: 0.05,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    // Fallback: update active section based on proximity if scroll position is at the very bottom
    const handleScrollProximity = () => {
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      if (isAtBottom) {
        setActiveSection("kontak-person"); // the last section
        return;
      }
    };

    window.addEventListener("scroll", handleScrollProximity, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScrollProximity);
    };
  }, []);

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // 56px navbar height offset
      const offset = 66; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div
      id="mobile-quick-navigation"
      className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] sm:w-[85%] max-w-lg h-14 bg-white/95 dark:bg-[#121826]/95 backdrop-blur-md border border-slate-200/50 dark:border-[#1E293B]/60 shadow-lg rounded-2xl flex items-center justify-between px-2.5 z-40 transition-colors duration-200"
    >
      {NAV_ITEMS.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeSection === item.id;

        return (
          <button
            key={item.id}
            id={`btn-mobile-nav-${item.id}`}
            onClick={() => handleScroll(item.id)}
            className={`relative flex flex-col items-center justify-center w-10 h-10 rounded-xl transition-all cursor-pointer ${
              isActive
                ? "text-[#003B7A] dark:text-[#60A5FA] bg-[#F1F5F9] dark:bg-[#1A2338]"
                : "text-slate-400 dark:text-slate-500 hover:text-[#003B7A] dark:hover:text-[#60A5FA]"
            }`}
            title={item.label}
            aria-label={`Scroll to ${item.label}`}
          >
            <IconComponent className="w-[18px] h-[18px]" strokeWidth={2.2} />
            <span className="sr-only">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

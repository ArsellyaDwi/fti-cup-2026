import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { GameSystem } from "../types";

interface RulesAccordionProps {
  systems: GameSystem[];
}

export default function RulesAccordion({ systems }: RulesAccordionProps) {
  const [openId, setOpenId] = useState<string | null>("voli");

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      id="sistem-pertandingan"
      className="py-24 bg-[#F8FAFC] dark:bg-[#0B0F19] border-b border-[#E2E8F0] dark:border-[#131B2E]/30 transition-colors duration-200"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#003B7A] dark:text-[#60A5FA]">
            Regulasi Acara
          </span>
          <h2 className="font-sans text-[22px] sm:text-[26px] md:text-[32px] lg:text-[40px] font-semibold text-[#0F172A] dark:text-[#F8FAFC]/90 tracking-tight">
            Sistem Pertandingan & TM
          </h2>
          <p className="text-[13px] sm:text-[14px] md:text-base text-[#475569] dark:text-[#CBD5E1] font-normal">
            Pilih cabang kompetisi berikut untuk melihat ringkasan sistem pertandingan serta ketentuan delegasi program studi.
          </p>
        </div>

        {/* Accordion List Container */}
        <div id="accordion-list-container" className="space-y-4">
          {systems.map((sys, index) => {
            const isOpen = openId === sys.id;

            return (
              <div
                key={sys.id}
                id={`accordion-item-${sys.id}`}
                className={`border rounded-xl transition-all duration-200 ${
                  isOpen
                    ? "border-[#003B7A] dark:border-[#1E293B] bg-white dark:bg-[#121826] shadow-2xs"
                    : "border-[#E2E8F0] dark:border-[#1E293B]/45 bg-white dark:bg-[#121826]"
                }`}
              >
                {/* Accordion Trigger Header Button */}
                <button
                  id={`accordion-trigger-${sys.id}`}
                  onClick={() => toggleAccordion(sys.id)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-7 h-7 rounded-md bg-blue-50 dark:bg-[#1A2338] border border-[#E2E8F0] dark:border-[#1E293B]/55 flex items-center justify-center font-mono text-[11px] font-semibold text-[#003B7A] dark:text-[#60A5FA]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-sans font-semibold text-[#0F172A] dark:text-[#F8FAFC] text-sm">
                      Sistem Pertandingan {sys.name}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#475569] dark:text-[#CBD5E1] transition-transform duration-250 ${
                      isOpen ? "transform rotate-180 text-blue-600 dark:text-[#60A5FA]" : ""
                    }`}
                  />
                </button>

                {/* Collapsible Content */}
                <div
                  id={`accordion-content-${sys.id}`}
                  className={`transition-all duration-350 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[1000px] border-t border-[#E2E8F0] dark:border-[#1E293B]/45 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-5 text-left">
                    <div className="p-4 bg-[#F8FAFC] dark:bg-[#121826]/35 border border-[#E2E8F0] dark:border-[#1E293B]/45 rounded-lg text-xs leading-relaxed text-[#475569] dark:text-[#CBD5E1] space-y-3 font-sans font-normal">
                      <p>
                        Sistem pertandingan menggunakan sistem gugur (knockout) dan akan dijelaskan lebih lanjut pada saat Technical Meeting (TM). Ketentuan pertandingan dapat berubah menyesuaikan jumlah peserta yang terdaftar.
                      </p>
                      {sys.format && (
                        <div className="pt-2.5 border-t border-[#E2E8F0] dark:border-[#1E293B]/45 space-y-1">
                          <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Format Resmi (Diupdate Panitia):</p>
                          <ul className="list-disc list-inside space-y-1 text-[#475569] dark:text-[#CBD5E1] pl-1">
                            <li>Format Laga: <strong className="text-blue-600 dark:text-[#60A5FA] font-semibold">{sys.format}</strong></li>
                            {sys.location && <li>Tempat Laga: <strong className="text-[#0F172A] dark:text-white font-semibold">{sys.location}</strong></li>}
                            {sys.tmInfo && <li>Technical Meeting: <strong className="text-[#0F172A] dark:text-white font-semibold">{sys.tmInfo}</strong></li>}
                          </ul>
                        </div>
                      )}
                      {sys.rules && sys.rules.length > 0 && typeof sys.rules !== "string" && (
                        <div className="pt-2.5 border-t border-[#E2E8F0] dark:border-[#1E293B]/45 space-y-1">
                          <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Aturan & Ketentuan Teknis:</p>
                          <ul className="list-decimal list-inside space-y-1 text-[#475569] dark:text-[#CBD5E1] pl-1">
                            {sys.rules.map((rule, idx) => (
                              <li key={idx} className="leading-relaxed">{rule}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

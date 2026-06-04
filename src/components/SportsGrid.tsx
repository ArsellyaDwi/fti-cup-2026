import { useState } from "react";
import { motion } from "motion/react";
import {
  Trophy,
  Activity,
  Award,
  Gamepad2,
  Sparkles,
  Dribbble,
  Users,
  ArrowRight
} from "lucide-react";
import { CabangLomba } from "../types";

interface SportsGridProps {
  sports: CabangLomba[];
}

const iconMap: Record<string, any> = {
  Volleyball: Award,
  Basketball: Dribbble,
  Footprints: Trophy,
  Activity: Activity,
  Cable: Users,
  Coins: Sparkles,
  Gamepad2: Gamepad2,
};

export default function SportsGrid({ sports }: SportsGridProps) {
  const [activeCategory, setActiveCategory] = useState<"semua" | "fisik" | "esports">("semua");

  const filteredSports = sports
    .filter((sport) => sport.isActive !== false)
    .filter((sport) => {
      if (activeCategory === "semua") return true;
      if (activeCategory === "esports") return sport.id === "esports";
      return sport.id !== "esports";
    });

  return (
    <section
      id="cabang-lomba"
      className="py-[64px] md:py-[80px] lg:py-[100px] bg-white dark:bg-[#0B0F19] border-b border-[#E2E8F0] dark:border-[#131B2E]/30 transition-colors duration-200"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#003B7A] dark:text-[#60A5FA]">
            Daftar Kegiatan
          </span>
          <h2 className="font-sans text-[22px] sm:text-[26px] md:text-[32px] lg:text-[40px] font-semibold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Cabang Perlombaan
          </h2>
          <p className="text-[13px] sm:text-[14px] md:text-base text-[#475569] dark:text-[#CBD5E1] font-normal leading-relaxed max-w-xl mx-auto">
            Menampilkan cabang perlombaan FTI CUP 2026. Setiap cabang dirancang ramah civitas akademika untuk melatih silaturahmi.
          </p>

          {/* Filtering Tabs */}
          <div id="sports-tabs" className="flex items-center justify-center gap-2.5 pt-6 flex-wrap">
            {(["semua", "fisik", "esports"] as const).map((cat) => (
              <button
                key={cat}
                id={`tab-sport-${cat}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#003B7A] dark:bg-[#1D74CD] text-white border-[#003B7A] dark:border-[#1D74CD] shadow-xs"
                    : "bg-white dark:bg-[#121826] text-[#475569] dark:text-[#CBD5E1] border-[#E2E8F0] dark:border-[#1E293B]/55 hover:bg-[#F8FAFC] dark:hover:bg-[#121826]/80"
                }`}
              >
                {cat === "semua" ? "Semua Cabang" : cat === "fisik" ? "Fisik / Olahraga" : "E-Sports"}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        <div id="sports-grid-container" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-300">
          {filteredSports.map((sport) => {
            const IconComponent = iconMap[sport.icon] || Trophy;

            return (
              <motion.div
                key={sport.id}
                id={`sport-card-${sport.id}`}
                layout="position"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
                className="bg-white dark:bg-[#121826] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B]/45 p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group"
              >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-[#F8FAFC] dark:bg-[#1A2338] text-[#003B7A] dark:text-[#60A5FA] rounded-lg border border-[#E2E8F0] dark:border-[#1E293B]/45 shadow-2xs">
                        <IconComponent className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-[#475569] dark:text-[#CBD5E1]">
                        FTI CUP '26
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <div className="space-y-2 text-left">
                      <h3 className="font-sans font-semibold text-[16px] sm:text-[18px] md:text-xl text-[#0F172A] dark:text-[#F8FAFC] leading-tight">
                        Cabang {sport.name}
                      </h3>
                      <p className="text-[#475569] dark:text-[#CBD5E1] text-[13px] sm:text-[14px] md:text-sm leading-relaxed min-h-[60px] font-sans font-normal">
                        {sport.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bottom */}
                  <div className="space-y-2.5 pt-4 border-t border-[#E2E8F0] dark:border-[#1E293B]/45 mt-4">
                    <a
                      id={`btn-daftar-sport-${sport.id}`}
                      href={sport.googleFormUrl || "#pendaftaran"}
                      target={sport.googleFormUrl ? "_blank" : undefined}
                      rel={sport.googleFormUrl ? "noopener noreferrer" : undefined}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 h-9 rounded-md bg-[#003B7A] hover:bg-[#002752] dark:bg-[#2E86DE] dark:hover:bg-[#2E86DE]/90 text-white text-[12px] sm:text-[13px] font-semibold transition-all shadow-xs shrink-0 cursor-pointer transition-colors"
                    >
                      <span>Daftar Sekarang</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    
                    <a
                      href="#sistem-pertandingan"
                      className="w-full inline-flex items-center justify-center py-1.5 h-8 rounded-md bg-[#F8FAFC] dark:bg-[#121826]/50 hover:bg-[#E2E8F0]/50 dark:hover:bg-[#1A2338] text-[#475569] dark:text-[#CBD5E1] text-[11px] sm:text-[12px] font-medium transition-all"
                    >
                      Sistem Pertandingan
                    </a>
                  </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

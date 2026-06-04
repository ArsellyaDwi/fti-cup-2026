import { Send, Shield, Trophy, Activity, Award, Users } from "lucide-react";
import { RegistrationLink } from "../types";

interface RegistrationCenterProps {
  links: RegistrationLink[];
  portalDeadline?: string;
}

const getSportIcon = (id: string) => {
  switch (id) {
    case "voli":
      return Award;
    case "basket":
      return Trophy;
    case "minisoccer":
      return Trophy;
    case "bulutangkis":
      return Activity;
    case "tariktambang":
      return Users;
    case "tenismeja":
      return Activity;
    case "esports":
      return Trophy;
    default:
      return Shield;
  }
};

export default function RegistrationCenter({ links, portalDeadline }: RegistrationCenterProps) {
  return (
    <section
      id="pendaftaran"
      className="py-[64px] md:py-[80px] lg:py-[100px] bg-white dark:bg-[#0B0F19] border-b border-[#E2E8F0] dark:border-[#131B2E]/30 transition-colors duration-200"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16">
        
        {/* Section Heading - Pendaftaran FTI CUP 2026 */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#003B7A] dark:text-[#60A5FA]">
            Formulir Registrasi
          </span>
          <h2 className="font-sans text-[22px] sm:text-[26px] md:text-[32px] lg:text-[40px] font-semibold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Pendaftaran FTI CUP 2026
          </h2>
          <p className="text-[13px] sm:text-[14px] md:text-base text-[#475569] dark:text-[#CBD5E1] font-normal leading-relaxed">
            Pilih cabang lomba di bawah ini untuk mengisi formulir pendaftaran resmi FTI CUP 2026 secara gratis.
          </p>
        </div>

        {/* Buttons Grid */}
        <div id="pendaftaran-grid-container" className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {links.map((link) => {
            const IconComp = getSportIcon(link.id);
            return (
              <div
                key={link.id}
                id={`registration-card-${link.id}`}
                className="flex flex-col items-center justify-between p-5 bg-[#F8FAFC] dark:bg-[#121826] border border-[#E2E8F0] dark:border-[#1E293B]/45 rounded-xl hover:shadow-xs transition-all text-center"
              >
                <div className="flex flex-col items-center gap-3 w-full mb-4">
                  <div className="p-2.5 bg-white dark:bg-[#1A2338] text-blue-600 dark:text-[#60A5FA] rounded-lg border border-[#E2E8F0] dark:border-[#1E293B]/45">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="font-sans font-semibold text-[14px] sm:text-[15px] text-[#0F172A] dark:text-[#F8FAFC] tracking-tight leading-tight">
                    {link.name}
                  </span>
                </div>
                <a
                  id={`btn-form-link-${link.id}`}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center py-1.5 px-3 bg-[#003B7A] hover:bg-[#002752] dark:bg-[#2E86DE] dark:hover:bg-[#2E86DE]/90 text-white rounded-md text-[12px] sm:text-[13px] font-semibold transition-all cursor-pointer h-8 shadow-2xs"
                >
                  Daftar
                </a>
              </div>
            );
          })}
        </div>

        {/* Deadline Information */}
        {portalDeadline && (
          <div className="mt-12 text-center">
            <p className="text-sm md:text-base text-[#475569] dark:text-[#CBD5E1] font-normal font-sans">
              Batas Akhir Pendaftaran: <span className="font-semibold text-blue-600 dark:text-[#60A5FA]">{portalDeadline}</span>
            </p>
          </div>
        )}

      </div>
    </section>
  );
}

import { Phone } from "lucide-react";
import { ContactPerson } from "../types";

interface ContactPersonsProps {
  contacts: ContactPerson[];
}

export default function ContactPersons({ contacts }: ContactPersonsProps) {
  
  const formatWhatsappForView = (wa: string) => {
    if (wa.startsWith("62")) {
      return `+62 ${wa.slice(2, 5)}-${wa.slice(5, 9)}-${wa.slice(9)}`;
    }
    return wa;
  };

  if (contacts.length === 0) {
    return (
      <section
        id="kontak-person"
        className="py-[64px] md:py-[80px] lg:py-[100px] bg-white dark:bg-[#0B0F19] border-t border-[#E2E8F0] dark:border-[#131B2E]/30 transition-colors duration-200"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#003B7A] dark:text-[#60A5FA]">
              Narahubung Resmi
            </span>
            <h2 className="font-sans text-[22px] sm:text-[26px] md:text-[32px] lg:text-[40px] font-semibold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
              Hubungi Panitia Pelaksana
            </h2>
            <p className="text-[13px] sm:text-[14px] md:text-base text-[#64748B] dark:text-[#CBD5E1] font-normal max-w-xl mx-auto font-sans leading-relaxed">
              Menghadapi pertanyaan seputar bimbingan teknis pendaftaran atau pengisian berkas delegasi? Kami siap membantu kelancaran andil prodi Anda.
            </p>
          </div>

          <div className="text-center py-12 bg-white dark:bg-[#121826] border border-[#E2E8F0] dark:border-[#1E293B]/45 rounded-xl max-w-md mx-auto p-6 space-y-2 shadow-2xs">
            <Phone className="w-8 h-8 text-[#003B7A] dark:text-[#60A5FA] mx-auto opacity-80" strokeWidth={1.5} />
            <h3 className="text-[#0F172A] dark:text-[#F8FAFC] text-[14px] sm:text-[15px] md:text-base font-semibold tracking-tight font-sans">
              Belum Tersedia
            </h3>
            <p className="text-[#64748B] dark:text-[#CBD5E1] text-[13px] sm:text-xs font-sans font-normal">
              Informasi akan diperbarui oleh panitia.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="kontak-person"
      className="py-[64px] md:py-[80px] lg:py-[100px] bg-white dark:bg-[#0B0F19] border-t border-[#E2E8F0] dark:border-[#131B2E]/30 transition-colors duration-200"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#003B7A] dark:text-[#60A5FA]">
            Narahubung Resmi
          </span>
          <h2 className="font-sans text-[22px] sm:text-[26px] md:text-[32px] lg:text-[40px] font-semibold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Hubungi Panitia Pelaksana
          </h2>
          <p className="text-[13px] sm:text-[14px] md:text-base text-[#475569] dark:text-[#CBD5E1] font-normal max-w-xl mx-auto font-sans leading-relaxed">
            Menghadapi pertanyaan seputar bimbingan teknis pendaftaran atau pengisian berkas delegasi? Kami siap membantu kelancaran andil prodi Anda.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div id="contacts-grid-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl xl:max-w-7xl mx-auto">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              id={`contact-card-${contact.id}`}
              className="bg-white dark:bg-[#121826] p-6 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B]/45 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group text-left"
            >
              <div className="space-y-5">
                {/* Avatar Icon or Photo */}
                <div className="flex items-center gap-4">
                  {contact.foto ? (
                    <img
                      src={contact.foto}
                      alt={contact.name}
                      referrerPolicy="no-referrer"
                      className="h-12 w-12 rounded-lg object-cover border border-[#E2E8F0]/65 shrink-0"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-[#003B7A] dark:bg-[#60A5FA] text-white dark:text-[#0F172A] flex items-center justify-center font-sans font-semibold text-sm select-none shadow-xs shrink-0">
                      {contact.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                    </div>
                  )}
                  <div>
                    <h3 className="font-sans font-semibold text-[18px] sm:text-[20px] text-[#0F172A] dark:text-[#F8FAFC] leading-tight">
                      {contact.name}
                    </h3>
                    <p className="text-[#475569] dark:text-[#CBD5E1] text-xs font-semibold mt-1 uppercase tracking-wider">
                      {contact.role}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-[#E2E8F0] dark:bg-[#1E293B]/60"></div>

                {/* Info Text Links */}
                <div className="space-y-2.5 text-sm sm:text-base text-[#475569] dark:text-[#CBD5E1] font-medium font-normal font-sans">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600 dark:text-[#60A5FA] shrink-0" />
                    <span>WhatsApp: <strong className="font-mono text-[#0F172A] dark:text-[#F8FAFC] font-semibold">{formatWhatsappForView(contact.whatsapp)}</strong></span>
                  </div>
                </div>
              </div>

              {/* Instant Social Actions Group */}
              <div className="pt-5 mt-5 border-t border-[#E2E8F0]/55 dark:border-[#1E293B]/45">
                <a
                  id={`btn-wa-contact-${contact.id}`}
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 h-9 sm:h-10 rounded-md bg-emerald-600 hover:bg-[#059669] text-white text-[12px] sm:text-[13px] font-semibold transition-all cursor-pointer shadow-xs"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px] text-white shrink-0">
                    <path d="M12.031 2C6.469 2 2 6.47 2 12.029c0 1.905.518 3.68 1.417 5.214L2 22l4.903-1.286c1.472.802 3.158 1.258 4.954 1.258C17.432 21.972 22 17.502 22 11.944 22 6.386 17.531 2 12.031 2zM17.49 16.29c-.23.633-1.127 1.185-1.84 1.343-.483.107-1.11.193-3.235-.693-2.716-1.134-4.444-3.896-4.58-4.079-.136-.182-1.102-1.467-1.102-2.798 0-1.332.698-1.986.947-2.253.25-.267.545-.333.726-.333.18 0 .363.003.522.012.167.01.393-.037.616.497.23.553.79 1.93.858 2.073.068.14.113.307.02.494-.09.187-.136.303-.27.46-.135.158-.284.354-.407.476-.136.136-.28.283-.114.566.166.28.738 1.218 1.583 1.97.108.098.243.204.385.31C11.58 15.352 12.35 15.7 12.63 15.82a.498.498 0 00.566-.05c.16-.14.69-.806.873-1.082.18-.276.363-.23.61-.137.248.093 1.57.738 1.84.872.27.135.45.2.518.318.068.118.068.683-.162 1.317z" />
                  </svg>
                  <span>Kirim WA</span>
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

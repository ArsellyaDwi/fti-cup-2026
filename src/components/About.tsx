import { ShieldCheck, Users, Award } from "lucide-react";

export default function About() {
  const pillars = [
    {
      title: "Sportivitas",
      description: "Menjunjung tinggi kejujuran, fair play, dan rasa hormat terhadap seluruh peserta maupun panitia.",
      icon: ShieldCheck,
      color: "bg-[#F8FAFC] dark:bg-[#121826] text-blue-600 dark:text-[#60A5FA] border border-[#E2E8F0] dark:border-[#1E293B]/45",
    },
    {
      title: "Solidaritas",
      description: "Mempererat hubungan antar mahasiswa Fakultas Teknologi Industri melalui kompetisi yang sehat dan positif.",
      icon: Users,
      color: "bg-[#F8FAFC] dark:bg-[#121826] text-blue-600 dark:text-[#60A5FA] border border-[#E2E8F0] dark:border-[#1E293B]/45",
    },
    {
      title: "Kebersamaan",
      description: "Membangun suasana kekeluargaan, kolaboratif, dan penuh semangat selama berlangsungnya kegiatan FTI CUP.",
      icon: Award,
      color: "bg-[#F8FAFC] dark:bg-[#121826] text-blue-600 dark:text-[#60A5FA] border border-[#E2E8F0] dark:border-[#1E293B]/45",
    },
  ];

  return (
    <section
      id="tentang"
      className="py-[64px] md:py-[80px] lg:py-[100px] bg-[#F8FAFC] dark:bg-[#0B0F19] border-y border-[#E2E8F0] dark:border-[#131B2E]/30 transition-colors duration-200"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16">
        
         {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#003B7A] dark:text-[#60A5FA]">
            Profil Kegiatan
          </span>
          <h2 className="font-sans text-[22px] sm:text-[26px] md:text-[32px] lg:text-[40px] font-semibold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Tentang FTI CUP 2026
          </h2>
          <p className="text-[13px] sm:text-[14px] md:text-base text-[#475569] dark:text-[#CBD5E1] font-normal font-sans">
            Menyatukan keluarga besar Fakultas Teknologi Industri ITN Malang dalam harmoni persaudaraan dan sportivitas.
          </p>
        </div>

        {/* Content Layout Grid: Text & Pillars */}
        <div className="space-y-12">
          
          {/* Block: Description Text */}
          <div className="space-y-6 text-[#475569] dark:text-[#CBD5E1] text-[13px] sm:text-[14px] md:text-base leading-relaxed text-justify font-normal font-sans w-full">
            <p>
              FTI CUP 2026 merupakan kegiatan olahraga & e-sports yang diselenggarakan oleh Fakultas Teknologi Industri (FTI) Institut Teknologi Nasional Malang sebagai sarana untuk mempererat kebersamaan, meningkatkan sportivitas, serta membangun semangat kompetitif yang positif di lingkungan kampus.
            </p>
            <p>
              Kegiatan ini menjadi wadah bagi mahasiswa dan dosen untuk berpartisipasi dalam berbagai cabang perlombaan, menjalin silaturahmi, serta memperkuat hubungan antar program studi dan civitas akademika Fakultas Teknologi Industri.
            </p>
            <p>
              Peserta terdiri dari mahasiswa aktif Fakultas Teknologi Industri (FTI) ITN Malang Kampus 2, serta dosen ITN Malang Kampus 1 dan Kampus 2. Setiap program studi di lingkungan FTI wajib mengirimkan perwakilan terbaiknya sebagai bentuk partisipasi dan memperluas sinergi internal prodi masing-masing.
            </p>
          </div>

          {/* Core Pillars: Horizontal layout underneath */}
          <div className="space-y-4 pt-6 border-t border-[#E2E8F0] dark:border-[#131B2E]/35">
            <h3 className="font-sans text-xs font-extrabold uppercase tracking-widest text-slate-400 text-left">
              Pilar Utama Kegiatan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {pillars.map((pillar) => {
                const IconComp = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="p-5 bg-white dark:bg-[#121826] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B]/45 flex flex-col gap-3 hover:shadow-xs transition-colors text-left"
                  >
                    <div className={`p-2.5 w-10 h-10 rounded-lg ${pillar.color} flex items-center justify-center shrink-0`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-sans font-semibold text-[16px] sm:text-[18px] md:text-lg text-[#0F172A] dark:text-[#F8FAFC] tracking-wider uppercase">
                        {pillar.title}
                      </h4>
                      <p className="text-[13px] sm:text-xs text-[#475569] dark:text-[#CBD5E1] leading-relaxed font-sans font-normal">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

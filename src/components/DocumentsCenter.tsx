import { Download, FileText, Clock } from "lucide-react";
import { DocumentFile } from "../types";

interface DocumentsCenterProps {
  documents: DocumentFile[];
}

export default function DocumentsCenter({ documents }: DocumentsCenterProps) {
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  const getFileBadge = (filename: string) => {
    const ext = filename.split(".").pop()?.toUpperCase() || "PDF";
    return {
      ext,
      color: ext === "PDF" 
        ? "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/30" 
        : "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-[#60A5FA] border-blue-100 dark:border-blue-900/30"
    };
  };

  if (documents.length === 0) {
    return (
      <section
        id="pusat-dokumen"
        className="py-[64px] md:py-[80px] lg:py-[100px] bg-white dark:bg-[#0B0F19] border-b border-[#E2E8F0] dark:border-[#131B2E]/30 transition-colors duration-200"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#003B7A] dark:text-[#60A5FA]">
              Administrasi Kegiatan
            </span>
            <h2 className="font-sans text-[22px] sm:text-[26px] md:text-[32px] lg:text-[40px] font-semibold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
              Dokumen Acara & Undangan
            </h2>
            <p className="text-[13px] sm:text-[14px] md:text-base text-[#475569] dark:text-[#CBD5E1] font-normal leading-relaxed max-w-xl mx-auto">
              Unduh seluruh berkas administrasi pelaksana, guidebook silaturahmi kompetisi, jadwal tanding keseluruhan, poster, dan surat undangan resmi.
            </p>
          </div>

          <div className="text-center py-12 bg-[#F8FAFC] dark:bg-[#121826] border border-[#E2E8F0] dark:border-[#1E293B]/45 rounded-xl max-w-md mx-auto p-6 space-y-2 shadow-2xs">
            <FileText className="w-8 h-8 text-blue-600 dark:text-[#60A5FA] mx-auto opacity-80" strokeWidth={1.5} />
            <h3 className="text-[#0F172A] dark:text-[#F8FAFC] text-[14px] sm:text-[15px] md:text-base font-semibold tracking-tight font-sans">
              Belum Tersedia
            </h3>
            <p className="text-[#475569] dark:text-[#CBD5E1] text-[13px] sm:text-xs font-sans font-normal">
              Informasi akan diperbarui oleh panitia.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="pusat-dokumen"
      className="py-[64px] md:py-[80px] lg:py-[100px] bg-white dark:bg-[#0B0F19] border-b border-[#E2E8F0] dark:border-[#131B2E]/30 transition-colors duration-200"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#003B7A] dark:text-[#60A5FA]">
            Administrasi Kegiatan
          </span>
          <h2 className="font-sans text-[22px] sm:text-[26px] md:text-[32px] lg:text-[40px] font-semibold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Dokumen Acara & Undangan
          </h2>
          <p className="text-[13px] sm:text-[14px] md:text-base text-[#475569] dark:text-[#CBD5E1] font-normal max-w-xl mx-auto leading-relaxed">
            Unduh seluruh berkas administrasi pelaksana, guidebook silaturahmi kompetisi, jadwal tanding keseluruhan, poster, dan surat undangan resmi.
          </p>
        </div>

        {/* Documents Grid */}
        <div id="documents-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc) => {
            const badge = getFileBadge(doc.filename);
            return (
              <div
                key={doc.id}
                id={`document-card-${doc.id}`}
                className="bg-white dark:bg-[#121826] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B]/45 p-6 shadow-xs hover:shadow-sm transition-all flex flex-col md:flex-row items-stretch gap-6 relative overflow-hidden group"
              >
                {/* Visual Accent - Single Blue Bar */}
                <div className="absolute top-0 left-0 w-1 h-full bg-[#003B7A] dark:bg-[#60A5FA]"></div>

                {/* Left: Document Icon & Extension Badge */}
                <div className="flex flex-col items-center justify-center gap-2.5 self-center md:self-start">
                  <div className="p-4 bg-[#F8FAFC] dark:bg-[#121826] text-[#003B7A] dark:text-[#60A5FA] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B]/45 shadow-2xs">
                    <FileText className="w-10 h-10 shrink-0" strokeWidth={1.5} />
                  </div>
                  <span className={`px-2.5 py-1 border text-[10px] font-semibold rounded-md ${badge.color}`}>
                    .{badge.ext}
                  </span>
                </div>

                {/* Right: Informational Content */}
                <div className="space-y-4 flex-1 flex flex-col justify-between text-left">
                  <div className="space-y-2">
                    <h3 className="font-sans font-semibold text-lg sm:text-xl text-[#0F172A] dark:text-[#F8FAFC] leading-snug">
                      {doc.title}
                    </h3>
                    <p className="text-[#475569] dark:text-[#CBD5E1] text-sm leading-relaxed font-normal font-sans">
                      {doc.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#475569] dark:text-[#CBD5E1] pt-1 font-sans">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-[#60A5FA]" />
                      <span>Diperbarui: {formatDate(doc.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Actions Link */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]/70 dark:border-[#1E293B]/45">
                    <span className="text-xs font-mono text-[#475569] dark:text-[#CBD5E1] truncate max-w-[150px] sm:max-w-xs">
                      {doc.filename}
                    </span>
                    <a
                      id={`btn-download-${doc.id}`}
                      href={doc.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 h-8 rounded-md bg-[#003B7A] hover:bg-[#002752] dark:bg-[#2E86DE] dark:hover:bg-[#2E86DE]/90 text-white text-[12px] sm:text-[13px] font-semibold shadow-xs transition-all cursor-pointer transition-colors duration-200"
                    >
                      <Download className="w-3.5 h-3.5" strokeWidth={2.5} />
                      <span>Unduh</span>
                    </a>
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

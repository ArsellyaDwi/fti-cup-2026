import { useState } from "react";
import { Calendar, Clock, MapPin, Search, List, CalendarDays, Compass } from "lucide-react";
import { JadwalPertandingan } from "../types";

interface SchedulesProps {
  schedules: JadwalPertandingan[];
}

export default function Schedules({ schedules }: SchedulesProps) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"timeline" | "table">("timeline");

  const filteredSchedules = schedules.filter((s) =>
    s.lombaName.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase())
  );

  if (schedules.length === 0) {
    return (
      <section
        id="jadwal"
        className="py-[64px] md:py-[80px] lg:py-[100px] bg-[#F8FAFC] dark:bg-[#0B0F19] border-b border-[#E2E8F0] dark:border-[#131B2E]/30 transition-colors duration-200"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#003B7A] dark:text-[#60A5FA]">
              Agenda Kegiatan
            </span>
            <h2 className="font-sans text-[22px] sm:text-[26px] md:text-[32px] lg:text-[40px] font-semibold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
              Jadwal Pertandingan & Lokasi
            </h2>
            <p className="text-[13px] sm:text-[14px] md:text-base text-[#475569] dark:text-[#CBD5E1] font-normal leading-relaxed">
              Ikuti jalannya kompetisi! Temukan tanggal pelaksanaan, jam tanding, serta lokasi tribun pertandingan FTI CUP yang berlokasi di Kampus 2 ITN Malang.
            </p>
          </div>

          <div className="text-center py-12 bg-white dark:bg-[#121826] border border-[#E2E8F0] dark:border-[#1E293B]/45 rounded-xl max-w-md mx-auto p-6 space-y-2 shadow-2xs">
            <Calendar className="w-8 h-8 text-blue-600 dark:text-[#60A5FA] mx-auto opacity-80" strokeWidth={1.5} />
            <h3 className="text-[#0F172A] dark:text-[#F8FAFC] text-[14px] sm:text-[15px] md:text-base font-semibold tracking-tight">
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
      id="jadwal"
      className="py-[64px] md:py-[80px] lg:py-[100px] bg-[#F8FAFC] dark:bg-[#0B0F19] border-b border-[#E2E8F0] dark:border-[#131B2E]/30 transition-colors duration-200"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#003B7A] dark:text-[#60A5FA]">
            Agenda Kegiatan
          </span>
          <h2 className="font-sans text-[22px] sm:text-[26px] md:text-[32px] lg:text-[40px] font-semibold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Jadwal Pertandingan & Lokasi
          </h2>
          <p className="text-[13px] sm:text-[14px] md:text-base text-[#475569] dark:text-[#CBD5E1] font-normal leading-relaxed">
            Ikuti jalannya kompetisi! Temukan tanggal pelaksanaan, jam tanding, serta lokasi tribun pertandingan FTI CUP yang berlokasi di Kampus 2 ITN Malang.
          </p>
        </div>

        {/* Toolbar: Search & View switcher */}
        <div className="max-w-xl mx-auto mb-12 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#475569] dark:text-[#CBD5E1]">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              id="schedule-search-input"
              type="text"
              placeholder="Cari nama lomba atau lokasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#121826] border border-[#E2E8F0] dark:border-[#1E293B]/55 rounded-lg text-xs text-[#0F172A] dark:text-[#F8FAFC] placeholder-[#475569]/70 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-[#1D74CD] transition-all"
            />
          </div>

          <div className="flex gap-1 shrink-0 p-1 bg-white dark:bg-[#121826] border border-[#E2E8F0] dark:border-[#1E293B]/55 rounded-lg">
            <button
              id="btn-schedule-view-timeline"
              onClick={() => setViewMode("timeline")}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === "timeline"
                  ? "bg-[#F8FAFC] dark:bg-[#1A2338] text-blue-600 dark:text-[#60A5FA] shadow-2xs border border-[#E2E8F0] dark:border-[#1E293B]/55"
                  : "text-[#475569] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]"
              }`}
              title="Tampilan lini masa"
            >
              <CalendarDays className="w-4 h-4" />
            </button>
            <button
              id="btn-schedule-view-table"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-[#F8FAFC] dark:bg-[#1A2338] text-blue-600 dark:text-[#60A5FA] shadow-2xs border border-[#E2E8F0] dark:border-[#1E293B]/55"
                  : "text-[#475569] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]"
              }`}
              title="Tampilan tabel terstruktur"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Empty Search Fallback */}
        {filteredSchedules.length === 0 && (
          <div className="text-center py-16 bg-[#F8FAFC] dark:bg-[#121826]/30 border border-dashed border-[#E2E8F0] dark:border-[#1E293B]/45 rounded-xl max-w-lg mx-auto p-4">
            <Compass className="w-8 h-8 text-[#475569] dark:text-[#CBD5E1] mx-auto mb-3" />
            <p className="text-[#0F172A] dark:text-[#F8FAFC] text-xs font-semibold uppercase tracking-wider">Jadwal Tidak Ditemukan</p>
            <p className="text-[#475569] dark:text-[#CBD5E1] text-xs mt-1">Silakan coba kata kunci pencarian yang lain</p>
          </div>
        )}

        {/* CONDITIONAL RENDERING: Timeline vs Table */}
        {filteredSchedules.length > 0 && viewMode === "timeline" ? (
          /* TIMELINE VIEW */
          <div className="relative border-l border-[#E2E8F0] dark:border-[#1E293B]/45 max-w-5xl mx-auto pl-6 sm:pl-10 space-y-6 text-left">
            {filteredSchedules.map((item) => (
              <div
                key={item.id}
                id={`schedule-timeline-item-${item.id}`}
                className="relative group"
              >
                {/* Timeline node bullet dot */}
                <span className="absolute -left-[31px] sm:-left-[45px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-[#121826] border-2 border-[#003B7A] dark:border-[#1E293B]/80 shadow-xs"></span>

                 <div className="bg-white dark:bg-[#121826] hover:bg-white/90 dark:hover:bg-[#121826]/80 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B]/45 p-5 shadow-xs transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E2E8F0]/50 dark:border-[#1E293B]/45 pb-2.5">
                    <h3 className="font-sans font-semibold text-[15px] sm:text-base text-[#0F172A] dark:text-[#F8FAFC] break-words whitespace-normal text-wrap leading-snug">
                      {item.lombaName}
                    </h3>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#F8FAFC] dark:bg-[#1A2338] text-blue-600 dark:text-[#60A5FA] font-mono text-[9px] font-semibold rounded border border-[#E2E8F0] dark:border-[#1E293B]/45 self-start sm:self-center shrink-0">
                      <Calendar className="w-3 h-3 text-blue-600 dark:text-[#60A5FA] shrink-0" />
                      <span className="break-words whitespace-normal text-wrap text-[10px]">{item.date}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] sm:text-xs text-[#475569] dark:text-[#CBD5E1] font-normal font-sans">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="break-words whitespace-normal text-wrap">{item.time}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="break-words whitespace-normal text-wrap">{item.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          filteredSchedules.length > 0 && (
            /* TABLE VIEW */
            <div className="max-w-6xl mx-auto overflow-hidden border border-[#E2E8F0] dark:border-[#1E293B]/45 rounded-xl shadow-2xs bg-white dark:bg-[#121826] text-left">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] dark:bg-[#161F30] border-b border-[#E2E8F0] dark:border-[#1E293B]/45 text-[10px] font-semibold uppercase tracking-wider text-[#475569] dark:text-[#CBD5E1]">
                      <th className="py-4 px-5 min-w-[120px]">Cabang Lomba</th>
                      <th className="py-4 px-5 min-w-[100px]">Hari & Tanggal</th>
                      <th className="py-4 px-5 min-w-[80px]">Waktu</th>
                      <th className="py-4 px-5 min-w-[150px]">Tempat Pelaksanaan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B]/45 text-xs text-[#475569] dark:text-[#CBD5E1]">
                    {filteredSchedules.map((item) => (
                      <tr
                        key={item.id}
                        id={`schedule-table-row-${item.id}`}
                        className="hover:bg-[#F8FAFC] dark:hover:bg-[#161F30]/40 transition-colors"
                      >
                        <td className="py-4 px-5 font-sans font-semibold text-[#0F172A] dark:text-[#F8FAFC] break-words whitespace-normal text-wrap min-w-[120px]">
                          {item.lombaName}
                        </td>
                        <td className="py-4 px-5 font-semibold text-blue-600 dark:text-[#60A5FA] break-words whitespace-normal text-wrap min-w-[100px]">
                          {item.date}
                        </td>
                        <td className="py-4 px-5 font-mono break-words whitespace-normal text-wrap min-w-[80px]">
                          {item.time}
                        </td>
                        <td className="py-4 px-5 flex items-start gap-1.5 font-medium break-words whitespace-normal text-wrap min-w-[150px]">
                          <MapPin className="w-3.5 h-3.5 text-[#475569] mt-0.5 shrink-0" />
                          <span className="break-words whitespace-normal text-wrap">{item.location}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

      </div>
    </section>
  );
}

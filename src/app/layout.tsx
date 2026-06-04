import React from "react";
import "../index.css";

export const metadata = {
  title: "FTI CUP ITN Malang 2026 — Web Resmi Kompetisi Olahraga & E-Sports",
  description: "Website resmi kompetisi olahraga dan e-sports FTI CUP ITN Malang 2026, menyajikan informasi kompetisi, jadwal, sistem pertandingan, pusat dokumen, dan pendaftaran.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased text-[#0F172A] bg-white dark:bg-[#0B0F19]">
        {children}
      </body>
    </html>
  );
}

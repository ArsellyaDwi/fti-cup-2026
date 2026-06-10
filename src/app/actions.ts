"use server";

import { prisma } from "../lib/db";
import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

// Seeder to bootstrap database on startup or fallback
async function ensureDbSeeded() {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not defined! Using local file data fallback.");
    return;
  }

  try {
    const countCabang = await prisma.cabangLomba.count();
    if (countCabang === 0) {
      console.log("Database is empty. Seeding data from db.json...");
      const fileExists = await fs.access(DB_PATH).then(() => true).catch(() => false);
      if (!fileExists) {
        console.warn("db.json backup path not found - cannot seed.");
        return;
      }
      
      const content = await fs.readFile(DB_PATH, "utf-8");
      const seed = JSON.parse(content);
      
      // Seed Cabang Lomba
      for (const item of seed.cabangLomba || []) {
        await prisma.cabangLomba.create({
          data: {
            id: item.id,
            name: item.name,
            icon: item.icon,
            description: item.description,
            playersPerTeam: item.playersPerTeam || "Satu regu prodi",
            requirements: JSON.stringify(item.requirements || [])
          }
        });
      }

      // Seed Game Systems
      for (const item of seed.gameSystems || []) {
        await prisma.gameSystem.create({
          data: {
            id: item.id,
            name: item.name,
            rules: JSON.stringify(item.rules || [])
          }
        });
      }

      // Seed Registration Links
      for (const item of seed.registrationLinks || []) {
        await prisma.registrationLink.create({
          data: {
            id: item.id,
            name: item.name,
            link: item.link
          }
        });
      }

      // Seed Settings (Countdown)
      await prisma.setting.create({
        data: {
          key: "countdownDate",
          value: seed.countdownDate || "2026-06-10T08:00:00"
        }
      });

      await prisma.setting.create({
        data: {
          key: "portalDeadline",
          value: "08 Juni 2026 Pukul 23:59 WIB"
        }
      });

      console.log("Successfully loaded seeds to Neon PG database.");
    }

    // Seeding FAQs
    console.log("Synchronizing FAQs...");
    const defaultFaqs = [
      {
        id: "faq-1",
        question: "Siapa saja yang dapat mengikuti FTI CUP 2026?",
        answer: "FTI CUP 2026 dapat diikuti oleh:\n• Mahasiswa aktif ITN Malang Kampus 2.\n• Dosen ITN Malang Kampus 1 dan Kampus 2.",
        order: 1
      },
      {
        id: "faq-2",
        question: "Program studi apa saja yang termasuk dalam Fakultas Teknologi Industri (FTI)?",
        answer: "Program Studi S1:\n• Teknik Mesin\n• Teknik Elektro\n• Teknik Industri\n• Teknik Kimia\n• Teknik Informatika\n• Bisnis Digital\n\nProgram Studi D3:\n• Teknik Mesin\n• Teknik Listrik",
        order: 2
      },
      {
        id: "faq-3",
        question: "Apakah setiap program studi wajib mengikuti FTI CUP?",
        answer: "Ya.\n\nSetiap program studi di lingkungan Fakultas Teknologi Industri (FTI) WAJIB mengirimkan minimal 1 tim atau perwakilan pada cabang lomba yang dipertandingkan sebagai bentuk partisipasi dalam kegiatan fakultas.",
        order: 3
      },
      {
        id: "faq-4",
        question: "Apakah ada konsekuensi jika program studi tidak mengirimkan perwakilan?",
        answer: "Ya.\n\nProgram studi yang tidak mengirimkan perwakilan pada cabang perlombaan akan mendapatkan konsekuensi sesuai ketentuan dan kebijakan yang ditetapkan oleh panitia serta pimpinan fakultas.\n\nInformasi lebih lanjut akan disampaikan melalui koordinasi resmi fakultas.",
        order: 4
      },
      {
        id: "faq-5",
        question: "Apakah satu program studi boleh mengirimkan lebih dari satu tim?",
        answer: "Boleh.\n\nSetiap program studi dapat mengirimkan lebih dari satu tim sesuai kebutuhan dan cabang perlombaan yang diikuti.",
        order: 5
      },
      {
        id: "faq-6",
        question: "Apakah peserta dalam satu tim harus berasal dari program studi yang sama?",
        answer: "Tidak harus.\n\nPeserta diperbolehkan membentuk tim lintas program studi selama memenuhi ketentuan peserta yang berlaku.\n\nUntuk kategori mahasiswa, seluruh anggota tim harus merupakan mahasiswa aktif ITN Malang Kampus 2.\n\nUntuk kategori dosen, peserta dapat berasal dari dosen ITN Malang Kampus 1 maupun Kampus 2.",
        order: 6
      },
      {
        id: "faq-7",
        question: "Apakah ada biaya pendaftaran?",
        answer: "Tidak.\n\nSeluruh cabang perlombaan FTI CUP 2026 dapat diikuti secara GRATIS tanpa biaya pendaftaran.",
        order: 7
      },
      {
        id: "faq-8",
        question: "Apa saja cabang lomba yang dipertandingkan?",
        answer: "• Voli\n• Basket\n• Mini Soccer\n• Bulutangkis\n• Tarik Tambang\n• Tenis Meja\n• E-Sports",
        order: 8
      },
      {
        id: "faq-9",
        question: "Apa benefit yang diperoleh peserta?",
        answer: "Peserta akan mendapatkan:\n• Pengalaman kompetisi dan sportivitas.\n• Kesempatan memperluas relasi antar program studi.\n• Sertifikat penghargaan bagi pemenang.\n• Trofi atau penghargaan untuk juara setiap cabang lomba.\n• Penghargaan Juara Favorit.\n• Penghargaan Supporter Terheboh.\n• Berbagai penghargaan menarik lainnya yang telah disiapkan panitia.",
        order: 9
      },
      {
        id: "faq-10",
        question: "Kapan pelaksanaan FTI CUP 2026?",
        answer: "FTI CUP 2026 akan dilaksanakan pada:\n12, 13, 15, dan 20 Juni 2026\n\nLokasi:\nKampus 2 Institut Teknologi Nasional Malang.",
        order: 10
      },
      {
        id: "faq-11",
        question: "Bagaimana cara melakukan pendaftaran?",
        answer: "Pendaftaran dilakukan melalui Google Form resmi yang tersedia pada masing-masing cabang lomba di website FTI CUP 2026.",
        order: 11
      },
      {
        id: "faq-12",
        question: "Kapan sistem pertandingan diumumkan?",
        answer: "Sistem pertandingan akan dijelaskan lebih lanjut pada saat Technical Meeting (TM) dan dapat menyesuaikan jumlah peserta yang terdaftar pada masing-masing cabang lomba.",
        order: 12
      }
    ];

    for (const item of defaultFaqs) {
      await prisma.faq.upsert({
        where: { id: item.id },
        update: {
          question: item.question,
          answer: item.answer,
          order: item.order
        },
        create: item
      });
    }
  } catch (err) {
    console.error("Failed to seed database:", err);
  }
}

// 1. Get complete context combined from DB or local JSON
export async function getDbData() {
  await ensureDbSeeded();

  try {
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL is not set. Reading from fallback file.");
      const fileContent = await fs.readFile(DB_PATH, "utf-8");
      const data = JSON.parse(fileContent);
      return {
        cabangLomba: data.cabangLomba?.map((item: any) => ({
          ...item,
          requirements: item.requirements || []
        })) || [],
        gameSystems: data.gameSystems?.map((item: any) => ({
          ...item,
          rules: item.rules || []
        })) || [],
        documents: data.documents || [],
        jadwal: data.jadwal || [],
        contacts: data.contacts || [],
        registrationLinks: data.registrationLinks || [],
        faqs: data.faqs || [],
        countdownDate: data.countdownDate || "2026-06-10T08:00:00",
        portalDeadline: data.portalDeadline || "08 Juni 2026 Pukul 23:59 WIB"
      };
    }

    const [
      cabangLombaRaw,
      gameSystemsRaw,
      documents,
      jadwal,
      contacts,
      registrationLinks,
      faqs,
      countdownSetting,
      portalDeadlineSetting
    ] = await Promise.all([
      prisma.cabangLomba.findMany(),
      prisma.gameSystem.findMany(),
      prisma.document.findMany(),
      prisma.jadwal.findMany(),
      prisma.contact.findMany(),
      prisma.registrationLink.findMany(),
      prisma.faq.findMany({ orderBy: { order: "asc" } }),
      prisma.setting.findUnique({ where: { key: "countdownDate" } }),
      prisma.setting.findUnique({ where: { key: "portalDeadline" } })
    ]);

    const cabangLomba = cabangLombaRaw.map(item => ({
      ...item,
      requirements: JSON.parse(item.requirements || "[]")
    }));

    const gameSystems = gameSystemsRaw.map(item => ({
      ...item,
      rules: JSON.parse(item.rules || "[]")
    }));

    return {
      cabangLomba,
      gameSystems,
      documents,
      jadwal,
      contacts,
      registrationLinks,
      faqs,
      countdownDate: countdownSetting ? countdownSetting.value : "2026-06-10T08:00:00",
      portalDeadline: portalDeadlineSetting ? portalDeadlineSetting.value : "08 Juni 2026 Pukul 23:59 WIB"
    };
  } catch (err) {
    console.error("Prisma aggregate fetch failed, using fallback:", err);
    try {
      const fileContent = await fs.readFile(DB_PATH, "utf-8");
      const data = JSON.parse(fileContent);
      return data;
    } catch {
      throw new Error("Failed to load database content");
    }
  }
}

// Helper to save database backup locally (syncs changes to DB_PATH)
async function writeBackup(data: any) {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write offline fallback file:", err);
  }
}

// 2. Full bulk save database (for system restore / backup sync)
export async function bulkSaveDbData(data: any) {
  if (!process.env.DATABASE_URL) {
    await writeBackup(data);
    return { success: true };
  }

  try {
    if (data.cabangLomba) {
      await prisma.cabangLomba.deleteMany({});
      for (const item of data.cabangLomba) {
        await prisma.cabangLomba.create({
          data: {
            id: item.id,
            name: item.name,
            icon: item.icon,
            description: item.description,
            playersPerTeam: item.playersPerTeam || "Satu regu prodi",
            requirements: JSON.stringify(item.requirements || []),
            googleFormUrl: item.googleFormUrl || "",
            isActive: item.isActive !== undefined ? item.isActive : true
          }
        });
      }
    }

    if (data.gameSystems) {
      await prisma.gameSystem.deleteMany({});
      for (const item of data.gameSystems) {
        await prisma.gameSystem.create({
          data: {
            id: item.id,
            name: item.name,
            rules: JSON.stringify(item.rules || []),
            format: item.format || "Sistem Gugur (Knockout System)",
            location: item.location || "Kampus II ITN Malang",
            tmInfo: item.tmInfo || "Akan dijelaskan lebih lanjut saat Technical Meeting (TM)"
          }
        });
      }
    }

    if (data.documents) {
      await prisma.document.deleteMany({});
      for (const item of data.documents) {
        await prisma.document.create({
          data: {
            id: item.id,
            title: item.title,
            description: item.description,
            filename: item.filename,
            downloadUrl: item.downloadUrl,
            updatedAt: item.updatedAt
          }
        });
      }
    }

    if (data.jadwal) {
      await prisma.jadwal.deleteMany({});
      for (const item of data.jadwal) {
        await prisma.jadwal.create({
          data: {
            id: item.id,
            lombaName: item.lombaName,
            date: item.date,
            time: item.time,
            location: item.location,
            description: item.description || ""
          }
        });
      }
    }

    if (data.contacts) {
      await prisma.contact.deleteMany({});
      for (const item of data.contacts) {
        await prisma.contact.create({
          data: {
            id: item.id,
            name: item.name,
            role: item.role,
            whatsapp: item.whatsapp,
            foto: item.foto || ""
          }
        });
      }
    }

    if (data.registrationLinks) {
      await prisma.registrationLink.deleteMany({});
      for (const item of data.registrationLinks) {
        await prisma.registrationLink.create({
          data: {
            id: item.id,
            name: item.name,
            link: item.link
          }
        });
      }
    }

    if (data.faqs) {
      await prisma.faq.deleteMany({});
      for (const item of data.faqs) {
        await prisma.faq.create({
          data: {
            id: item.id || "faq_" + Math.random().toString(36).substring(2, 10),
            question: item.question,
            answer: item.answer,
            order: item.order !== undefined ? Number(item.order) : 0
          }
        });
      }
    }

    if (data.countdownDate) {
      await prisma.setting.upsert({
        where: { key: "countdownDate" },
        update: { value: data.countdownDate },
        create: { key: "countdownDate", value: data.countdownDate }
      });
    }

    const updated = await getDbData();
    await writeBackup(updated);
    return { success: true };
  } catch (err) {
    console.error("Bulk save mutation failed:", err);
    return { success: false, error: "Database bulk save failed" };
  }
}

// 3. Cabang Lomba CRUDS
export async function saveCabangLomba(body: any, isEditing: boolean, editingId?: string | null) {
  if (!process.env.DATABASE_URL) {
    const backup = await getDbData();
    if (isEditing && editingId) {
      backup.cabangLomba = backup.cabangLomba.map((item: any) =>
        item.id === editingId ? { ...item, ...body } : item
      );
    } else {
      const newId = body.id || "cl_" + Date.now();
      backup.cabangLomba.push({ id: newId, ...body });
    }
    await writeBackup(backup);
    return { success: true };
  }

  try {
    if (isEditing && editingId) {
      await prisma.cabangLomba.update({
        where: { id: editingId },
        data: {
          name: body.name,
          icon: body.icon,
          description: body.description,
          playersPerTeam: body.playersPerTeam,
          requirements: JSON.stringify(body.requirements),
          googleFormUrl: body.googleFormUrl || "",
          isActive: body.isActive
        }
      });
    } else {
      const id = body.id || "cl_" + Date.now();
      await prisma.cabangLomba.create({
        data: {
          id,
          name: body.name,
          icon: body.icon,
          description: body.description,
          playersPerTeam: body.playersPerTeam,
          requirements: JSON.stringify(body.requirements),
          googleFormUrl: body.googleFormUrl || "",
          isActive: body.isActive
        }
      });
    }

    const updated = await getDbData();
    await writeBackup(updated);
    return { success: true };
  } catch (err) {
    console.error("saveCabangLomba action failure:", err);
    return { success: false, error: "Failed to save Cabang Lomba details" };
  }
}

export async function deleteCabangLomba(id: string) {
  if (!process.env.DATABASE_URL) {
    const backup = await getDbData();
    backup.cabangLomba = backup.cabangLomba.filter((item: any) => item.id !== id);
    await writeBackup(backup);
    return { success: true };
  }

  try {
    await prisma.cabangLomba.delete({ where: { id } });
    const updated = await getDbData();
    await writeBackup(updated);
    return { success: true };
  } catch (err) {
    console.error("deleteCabangLomba action failure:", err);
    return { success: false, error: "Failed to delete Cabang Lomba" };
  }
}

// 4. Game Systems CRUDS
export async function updateGameSystem(id: string, body: any) {
  if (!process.env.DATABASE_URL) {
    const backup = await getDbData();
    backup.gameSystems = backup.gameSystems.map((item: any) =>
      item.id === id ? { ...item, ...body } : item
    );
    await writeBackup(backup);
    return { success: true };
  }

  try {
    await prisma.gameSystem.update({
      where: { id },
      data: {
        name: body.name,
        format: body.format,
        location: body.location,
        tmInfo: body.tmInfo,
        rules: typeof body.rules === "string" ? body.rules : JSON.stringify(body.rules)
      }
    });

    const updated = await getDbData();
    await writeBackup(updated);
    return { success: true };
  } catch (err) {
    console.error("updateGameSystem action failure:", err);
    return { success: false, error: "Failed to update Game System rules" };
  }
}

// 5. Documents CRUDS
export async function saveDocument(body: any) {
  const id = body.id || "doc_" + Date.now();
  const docData = {
    title: body.title || "",
    description: body.description || "",
    filename: body.filename || "",
    downloadUrl: body.downloadUrl || "",
    updatedAt: new Date().toISOString()
  };

  if (!process.env.DATABASE_URL) {
    const backup = await getDbData();
    const existsIdx = backup.documents.findIndex((item: any) => item.id === id);
    if (existsIdx !== -1) {
      backup.documents[existsIdx] = { id, ...docData };
    } else {
      backup.documents.push({ id, ...docData });
    }
    await writeBackup(backup);
    return { success: true };
  }

  try {
    await prisma.document.upsert({
      where: { id },
      update: docData,
      create: { id, ...docData }
    });

    const updated = await getDbData();
    await writeBackup(updated);
    return { success: true };
  } catch (err) {
    console.error("saveDocument action failure:", err);
    return { success: false, error: "Failed to upsert Document" };
  }
}

export async function deleteDocument(id: string) {
  if (!process.env.DATABASE_URL) {
    const backup = await getDbData();
    backup.documents = backup.documents.filter((item: any) => item.id !== id);
    await writeBackup(backup);
    return { success: true };
  }

  try {
    await prisma.document.delete({ where: { id } });
    const updated = await getDbData();
    await writeBackup(updated);
    return { success: true };
  } catch (err) {
    console.error("deleteDocument action failure:", err);
    return { success: false, error: "Failed to delete Document" };
  }
}

// 6. Schedules CRUDS
export async function saveJadwal(body: any) {
  const id = body.id || "j_" + Date.now();
  const scheduleData = {
    lombaName: body.lombaName || "",
    date: body.date || "",
    time: body.time || "",
    location: body.location || "",
    description: body.description || ""
  };

  if (!process.env.DATABASE_URL) {
    const backup = await getDbData();
    const existsIdx = backup.jadwal.findIndex((item: any) => item.id === id);
    if (existsIdx !== -1) {
      backup.jadwal[existsIdx] = { id, ...scheduleData };
    } else {
      backup.jadwal.push({ id, ...scheduleData });
    }
    await writeBackup(backup);
    return { success: true };
  }

  try {
    await prisma.jadwal.upsert({
      where: { id },
      update: scheduleData,
      create: { id, ...scheduleData }
    });

    const updated = await getDbData();
    await writeBackup(updated);
    return { success: true };
  } catch (err) {
    console.error("saveJadwal action failure:", err);
    return { success: false, error: "Failed to upsert Schedule" };
  }
}

export async function deleteJadwal(id: string) {
  if (!process.env.DATABASE_URL) {
    const backup = await getDbData();
    backup.jadwal = backup.jadwal.filter((item: any) => item.id !== id);
    await writeBackup(backup);
    return { success: true };
  }

  try {
    await prisma.jadwal.delete({ where: { id } });
    const updated = await getDbData();
    await writeBackup(updated);
    return { success: true };
  } catch (err) {
    console.error("deleteJadwal action failure:", err);
    return { success: false, error: "Failed to delete Schedule" };
  }
}

// 7. Contacts CRUDS
export async function saveContact(body: any) {
  const id = body.id || "c_" + Date.now();
  const contactData = {
    name: body.name || "",
    role: body.role || "",
    whatsapp: body.whatsapp || "",
    foto: body.foto || ""
  };

  if (!process.env.DATABASE_URL) {
    const backup = await getDbData();
    const existsIdx = backup.contacts.findIndex((item: any) => item.id === id);
    if (existsIdx !== -1) {
      backup.contacts[existsIdx] = { id, ...contactData };
    } else {
      backup.contacts.push({ id, ...contactData });
    }
    await writeBackup(backup);
    return { success: true };
  }

  try {
    await prisma.contact.upsert({
      where: { id },
      update: contactData,
      create: { id, ...contactData }
    });

    const updated = await getDbData();
    await writeBackup(updated);
    return { success: true };
  } catch (err) {
    console.error("saveContact action failure:", err);
    return { success: false, error: "Failed to upsert Contact person info" };
  }
}

export async function deleteContact(id: string) {
  if (!process.env.DATABASE_URL) {
    const backup = await getDbData();
    backup.contacts = backup.contacts.filter((item: any) => item.id !== id);
    await writeBackup(backup);
    return { success: true };
  }

  try {
    await prisma.contact.delete({ where: { id } });
    const updated = await getDbData();
    await writeBackup(updated);
    return { success: true };
  } catch (err) {
    console.error("deleteContact action failure:", err);
    return { success: false, error: "Failed to delete Contact person" };
  }
}

// 8. Registration Links
export async function saveRegistrationLink(id: string, link: string) {
  if (!process.env.DATABASE_URL) {
    const backup = await getDbData();
    backup.registrationLinks = backup.registrationLinks.map((item: any) =>
      item.id === id ? { ...item, link } : item
    );
    await writeBackup(backup);
    return { success: true };
  }

  try {
    await prisma.registrationLink.update({
      where: { id },
      data: { link }
    });

    const updated = await getDbData();
    await writeBackup(updated);
    return { success: true };
  } catch (err) {
    console.error("saveRegistrationLink action failure:", err);
    return { success: false, error: "Failed to update Google Form link" };
  }
}

// 9. Settings (Countdown targets / portal deadlines)
export async function saveCountdown(countdownDate?: string, portalDeadline?: string) {
  if (!process.env.DATABASE_URL) {
    const backup = await getDbData();
    if (countdownDate) backup.countdownDate = countdownDate;
    if (portalDeadline) backup.portalDeadline = portalDeadline;
    await writeBackup(backup);
    return { success: true };
  }

  try {
    if (countdownDate) {
      await prisma.setting.upsert({
        where: { key: "countdownDate" },
        update: { value: countdownDate },
        create: { key: "countdownDate", value: countdownDate }
      });
    }
    if (portalDeadline) {
      await prisma.setting.upsert({
        where: { key: "portalDeadline" },
        update: { value: portalDeadline },
        create: { key: "portalDeadline", value: portalDeadline }
      });
    }

    const updated = await getDbData();
    await writeBackup(updated);
    return { success: true };
  } catch (err) {
    console.error("saveCountdown action failure:", err);
    return { success: false, error: "Failed to save countdown configurations" };
  }
}

// 10. FAQS CRUDS
export async function saveFaq(body: any) {
  const id = body.id || "faq_" + Math.random().toString(36).substring(2, 10);
  const faqData = {
    question: body.question || "",
    answer: body.answer || "",
    order: body.order !== undefined ? Number(body.order) : 0
  };

  if (!process.env.DATABASE_URL) {
    const backup = await getDbData();
    const existsIdx = backup.faqs.findIndex((item: any) => item.id === id);
    if (existsIdx !== -1) {
      backup.faqs[existsIdx] = { id, ...faqData };
    } else {
      backup.faqs.push({ id, ...faqData });
    }
    // Sort faqs by order field
    backup.faqs.sort((a: any, b: any) => Number(a.order || 0) - Number(b.order || 0));
    await writeBackup(backup);
    return { success: true };
  }

  try {
    await prisma.faq.upsert({
      where: { id },
      update: faqData,
      create: { id, ...faqData }
    });

    const updated = await getDbData();
    await writeBackup(updated);
    return { success: true };
  } catch (err) {
    console.error("saveFaq action failure:", err);
    return { success: false, error: "Failed to upsert FAQ entry" };
  }
}

export async function deleteFaq(id: string) {
  if (!process.env.DATABASE_URL) {
    const backup = await getDbData();
    backup.faqs = backup.faqs.filter((item: any) => item.id !== id);
    await writeBackup(backup);
    return { success: true };
  }

  try {
    await prisma.faq.delete({ where: { id } });
    const updated = await getDbData();
    await writeBackup(updated);
    return { success: true };
  } catch (err) {
    console.error("deleteFaq action failure:", err);
    return { success: false, error: "Failed to delete FAQ entry" };
  }
}

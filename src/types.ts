export interface CabangLomba {
  id: string;
  name: string;
  icon: string;
  description: string;
  playersPerTeam: string;
  requirements: string[];
  googleFormUrl?: string;
  isActive?: boolean;
}

export interface DocumentFile {
  id: string;
  title: string;
  description: string;
  filename: string;
  downloadUrl: string;
  updatedAt: string;
}

export interface JadwalPertandingan {
  id: string;
  lombaName: string;
  date: string;
  time: string;
  location: string;
  description?: string;
}

export interface ContactPerson {
  id: string;
  name: string;
  role: string;
  whatsapp: string;
  foto?: string;
}

export interface RegistrationLink {
  id: string;
  name: string;
  link: string;
}

export interface GameSystem {
  id: string;
  name: string;
  rules: string[];
  format?: string;
  location?: string;
  tmInfo?: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  order: number;
}


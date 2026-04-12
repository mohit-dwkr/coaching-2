export interface Batch {
  id: string;
  className: string;
  subjects: string[];
  timing: string;
  fees: number;
}

export interface Topper {
  id: string;
  name: string;
  marks: string;
  year: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  className: string;
  subject: string;
  pdfUrl: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
}

export interface Faculty {
  id: string;
  name: string;
  subject: string;
  experience: string;
}

const KEYS = {
  batches: "academic_batches",
  toppers: "academic_toppers",
  gallery: "academic_gallery",
  materials: "academic_materials",
  inquiries: "academic_inquiries",
  faculty: "academic_faculty",
} as const;

const defaultBatches: Batch[] = [
  { id: "1", className: "10th", subjects: ["Mathematics", "Science", "English"], timing: "6:00 AM – 8:00 AM", fees: 2500 },
  { id: "2", className: "12th Science", subjects: ["Physics", "Chemistry", "Mathematics"], timing: "4:00 PM – 6:30 PM", fees: 3500 },
  { id: "3", className: "12th Commerce", subjects: ["Accounts", "Economics", "Business Studies"], timing: "8:00 AM – 10:00 AM", fees: 3000 },
  { id: "4", className: "9th", subjects: ["Mathematics", "Science", "SST"], timing: "10:00 AM – 12:00 PM", fees: 2000 },
  { id: "5", className: "11th Science", subjects: ["Physics", "Chemistry", "Biology"], timing: "2:00 PM – 4:00 PM", fees: 3000 },
  { id: "6", className: "8th", subjects: ["Mathematics", "Science"], timing: "12:00 PM – 1:30 PM", fees: 1800 },
];

const defaultToppers: Topper[] = [
  { id: "1", name: "Priya Sharma", marks: "98.6%", year: "2024" },
  { id: "2", name: "Arjun Patel", marks: "97.2%", year: "2024" },
  { id: "3", name: "Sneha Gupta", marks: "96.8%", year: "2023" },
  { id: "4", name: "Rahul Verma", marks: "95.4%", year: "2023" },
  { id: "5", name: "Ananya Singh", marks: "97.8%", year: "2024" },
  { id: "6", name: "Vikram Joshi", marks: "96.2%", year: "2022" },
];

const defaultMaterials: StudyMaterial[] = [
  { id: "1", title: "Trigonometry Notes", className: "10th", subject: "Mathematics", pdfUrl: "#" },
  { id: "2", title: "Chemical Reactions", className: "10th", subject: "Science", pdfUrl: "#" },
  { id: "3", title: "Mechanics Chapter 1", className: "12th Science", subject: "Physics", pdfUrl: "#" },
  { id: "4", title: "Organic Chemistry Basics", className: "12th Science", subject: "Chemistry", pdfUrl: "#" },
];

export const defaultFaculty: Faculty[] = [
  { id: "1", name: "Dr. Rajesh Kumar", subject: "Mathematics", experience: "18 years" },
  { id: "2", name: "Prof. Meena Iyer", subject: "Physics", experience: "15 years" },
  { id: "3", name: "Mr. Suresh Nair", subject: "Chemistry", experience: "12 years" },
  { id: "4", name: "Mrs. Kavita Desai", subject: "Biology", experience: "10 years" },
];

function get<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function set<T>(key: string, v: T) {
  localStorage.setItem(key, JSON.stringify(v));
}

export const getBatches = () => get<Batch[]>(KEYS.batches, defaultBatches);
export const setBatches = (d: Batch[]) => set(KEYS.batches, d);
export const getToppers = () => get<Topper[]>(KEYS.toppers, defaultToppers);
export const setToppers = (d: Topper[]) => set(KEYS.toppers, d);
export const getGallery = () => get<GalleryImage[]>(KEYS.gallery, []);
export const setGallery = (d: GalleryImage[]) => set(KEYS.gallery, d);
export const getMaterials = () => get<StudyMaterial[]>(KEYS.materials, defaultMaterials);
export const setMaterials = (d: StudyMaterial[]) => set(KEYS.materials, d);
export const getInquiries = () => get<Inquiry[]>(KEYS.inquiries, []);
export const setInquiries = (d: Inquiry[]) => set(KEYS.inquiries, d);
export const getFaculty = () => get<Faculty[]>(KEYS.faculty, defaultFaculty);
export const setFaculty = (d: Faculty[]) => set(KEYS.faculty, d);
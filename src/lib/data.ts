// 1. Interfaces: Inhe rehne dena zaroori hai taaki Typescript ko 
// pata rahe ki Supabase se kaisa data aayega.

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

// NOTE: Maine saare defaultBatches, localStorage functions (get/set) 
// aur KEYS delete kar diye hain kyunki aap direct Supabase queries use karenge.
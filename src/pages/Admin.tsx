import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Image,
  FileText,
  Trophy,
  Inbox,
  Home,
  GraduationCap,
  User,
  Menu,
  X,
  AppWindow,
  LogOut
} from "lucide-react";

import { supabase } from"@/supabaseClient";
import BatchManager from "@/components/admin/BatchManager";
import GalleryManager from "@/components/admin/GalleryManager";
import StudyMaterialManager from "@/components/admin/StudyMaterialManager";
import TopperManager from "@/components/admin/TopperManager";
import InquiryInbox from "@/components/admin/InquiryInbox";
import FacultyManager from "@/components/admin/facultyManager";
import HeroManager from "@/components/admin/HeroManager";
import VideosManager from "@/components/admin/VideosManager";
import StudentManager from "@/components/admin/StudentManager";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  { id: "batches", label: "Manage Batches", icon: BookOpen },
  { id: "gallery", label: "Gallery Photos", icon: Image },
  { id: "material", label: "Study Material", icon: FileText },
  { id: "toppers", label: "Toppers & Results", icon: Trophy },
  { id: "inbox", label: "Student Inquiries", icon: Inbox },
  { id: "faculty", label: "Faculty Management", icon: User },
  { id: "Hero", label: "Hero Management", icon: AppWindow },
  { id: "videos", label: "Videos Management", icon: AppWindow },
  { id: "students", label: "Students Management", icon: AppWindow },
] as const;

type Tab = (typeof tabs)[number]["id"];

const panels: Record<Tab, React.FC> = {
  batches: BatchManager,
  gallery: GalleryManager,
  material: StudyMaterialManager,
  toppers: TopperManager,
  inbox: InquiryInbox,
  faculty: FacultyManager,
  Hero: HeroManager,
  videos: VideosManager,
  students: StudentManager,
};

export default function Admin() {
  const [active, setActive] = useState<Tab>("batches");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const Panel = panels[active];

  // 🔐 Protect Admin Route
  useEffect(() => {
    const checkUser = async () => {
   const { data } = await supabase.auth.getUser();

if (!data.user) {
  navigate("/admin-login");
  return;
}

const { data: adminData, error } = await supabase
  .from("admins")
  .select("email")
  .eq("email", data.user.email)
  .maybeSingle();

if (error || !adminData) {
  navigate("/admin-login");
} else {
  setLoading(false);
}
    }
    checkUser();
  }, [navigate]);

  // 🔓 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-500 font-semibold">
        Checking Authentication...
      </div>
    );
  }

  const handleTabChange = (id: Tab) => {
    setActive(id);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden">

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[60] lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 bg-white border-r flex flex-col
        transition-transform duration-300 lg:translate-x-0 lg:static lg:w-64
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 flex items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {tabs.map((t) => {
            const IsActive = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition ${
                  IsActive
                    ? "bg-primary text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <t.icon className="h-5 w-5" />
                {t.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-sm font-semibold text-red-600 hover:bg-red-50 px-4 py-3 rounded-lg"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="bg-white border-b h-16 flex items-center justify-between px-6">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <h1 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Dashboard / {active}
          </h1>

          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-slate-500" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          <div className="p-6 max-w-[1400px] mx-auto">
            <Panel />
          </div>
        </main>
      </div>
    </div>
  );
}
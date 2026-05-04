import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import StudyMaterialSection from "@/components/StudyMaterialSection";
import NotificationSection from "@/components/NotificationSection";
import Payment from "@/components/Payment";
import { CreditCard, Loader2 } from "lucide-react";
import {
  LogOut, User, LayoutDashboard,
  BookOpen, Bell, GraduationCap, Info,
  Clock, CheckCircle2, AlertCircle, Menu, Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // Dashboard function ke andar states ke sath add karein
  const [activeTab, setActiveTab] = useState("study"); // Default tab "study" rahegi

  const [isEditingClass, setIsEditingClass] = useState(false);
  const [newClass, setNewClass] = useState("");

  const [totalNotes, setTotalNotes] = useState(0);
  const [currentSubNotes, setCurrentSubNotes] = useState(0);

  // Jab profile load ho, tab newClass state ko initial value dein
  useEffect(() => {
    if (profile?.class) {
      setNewClass(profile.class);
    }
  }, [profile]);


  const handleUpdateClass = async () => {
    try {
      const { error } = await supabase
        .from("student_approvals")
        .update({ class: newClass })
        .eq("email", profile.email);

      if (error) throw error;

      // Local state update karein taaki UI turant change ho jaye
      setProfile({ ...profile, class: newClass });
      setIsEditingClass(false);
      alert("Class updated successfully!");
    } catch (error) {
      alert("Error updating class: " + error.message);
    }
  };

  useEffect(() => {
    if (status === "denied") {
      const handleRevoke = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem("pending_reg");
        window.location.replace("/userlogin");
      };
      handleRevoke();
    }
  }, [status]);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    // 1. Agar session hi nahi hai, to seedha login par bhejo
    if (!session) {
      window.location.replace("/userlogin");
      return;
    }

    const userEmail = session.user.email;

    // 2. Database se user ka current status check karo
    const { data: existingProfile, error } = await supabase
      .from("student_approvals")
      .select("*")
      .eq("email", userEmail)
      .maybeSingle();

    // LocalStorage se temporary data uthao (jo Login form se aaya tha)
    const pendingInfo = JSON.parse(localStorage.getItem("pending_reg") || "{}");

    if (!existingProfile) {
      /** * CASE 1: NEW USER 
       * Row nahi hai, matlab user ne pehli baar magic link se login kiya hai.
       */
      if (pendingInfo.name) {
        const { data: newRow } = await supabase
          .from("student_approvals")
          .insert([{
            name: pendingInfo.name,
            email: userEmail,
            mobile: pendingInfo.mobile,
            class: pendingInfo.class,
            status: "pending"
          }])
          .select()
          .single();

        setProfile(newRow);
        setStatus("pending");
        localStorage.removeItem("pending_reg"); // Data use ho gaya, ab hata do
      } else {
        // Agar LocalStorage mein bhi data nahi hai, matlab unauthorized access
        await supabase.auth.signOut();
        window.location.replace("/userlogin");
      }

    } else if (existingProfile.status === "denied") {
      /** * CASE 2: DENIED USER 
       * Agar user ne login form dobara fill kiya hai (pendingInfo exist karta hai),
       * to status ko "denied" se badal kar "pending" kar do.
       */
      if (pendingInfo.name) {
        const { data: updatedRow } = await supabase
          .from("student_approvals")
          .update({
            name: pendingInfo.name,
            mobile: pendingInfo.mobile,
            class: pendingInfo.class,
            status: "pending"
          })
          .eq("email", userEmail)
          .select()
          .single();

        setProfile(updatedRow);
        setStatus("pending");
        localStorage.removeItem("pending_reg");
      } else {
        // Agar user sirf login karne ki koshish kar raha hai bina form fill kiye
        await supabase.auth.signOut();
        window.location.replace("/userlogin?error=denied");
      }

    } else {
      /** * CASE 3: APPROVED YA PENDING 
       * User already system mein hai, bas profile state set kardo.
       */
      setProfile(existingProfile);
      setStatus(existingProfile.status);

      // Agar login form se koi purana data pada ho, to clean kar do
      localStorage.removeItem("pending_reg");
    }

    setLoading(false);
  };

  // 🔄 Loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <div className="absolute h-16 w-16 border-4 border-blue-100 rounded-full border-t-transparent animate-[spin_2s_linear_infinite]" />
        </div>
        <p className="mt-6 text-slate-500 font-bold text-sm tracking-[0.2em] uppercase animate-pulse">Verifying...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* --- DASHBOARD SUB-BAR --- */}
      <div className="bg-gray-900 border-b border-slate-200 mt-16 sticky top-16 z-40">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-blue-600 h-5 w-5" />
            <h1 className="font-black text-white tracking-tight text-lg uppercase">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-lg font-bold text-white leading-none">{profile?.name}</p>

            </div>

            {/* Profile Avatar Trigger */}
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold border-2 border-white shadow-md hover:scale-105 transition-transform"
            >
              {profile?.name?.charAt(0) || "S"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row min-h-[calc(100vh-128px)]">

        {/* --- LEFT SIDEBAR --- */}
        <aside className="w-full md:w-72 bg-gray-900 border-r border-slate-200 p-6 flex flex-col gap-8">
          <div>
            <h2 className="text-xl font-black text-blue-500 tracking-tighter mb-1">TOPPERS ACADEMY</h2>
            <p className="text-[10px] font-bold text-white uppercase tracking-widest">Student Portal</p>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black text-white uppercase mb-4 tracking-[0.15em]">Study Overview</p>
              <div className="space-y-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-white">
                  <p className="text-[10px] font-bold text-blue-700 uppercase">Total Notes</p>
                  <p className="text-xl font-black text-slate-800">{totalNotes}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-700 uppercase">Subject Notes</p>
                  <p className="text-xl font-black text-slate-800">{currentSubNotes}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black text-white uppercase mb-4 tracking-[0.15em]">Quick Access</p>
              <nav className="space-y-2">

                <button
                  onClick={() => setActiveTab("study")}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === "study"
                    ? "bg-blue-700 text-white shadow-sm"
                    : "text-white opacity-50 hover:opacity-100"
                    }`}
                >
                  <BookOpen size={18} /> Study Material
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === "notifications"
                    ? "bg-blue-700 text-white shadow-sm" // Orange theme for notification
                    : "text-white opacity-50 hover:opacity-100"
                    }`}
                >
                  <Bell size={18} /> Notifications
                </button>

                <button
                  onClick={() => setActiveTab("payment")}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === "payment"
                    ? "bg-blue-700 text-white shadow-sm" // Orange theme for notification
                    : "text-white opacity-50 hover:opacity-100"
                    }`}
                >
                  <CreditCard size={18} /> Pay Your Fess
                </button>

              </nav>

            </div>

            <div className="mt-auto pt-6 border-t border-slate-100">
              <p className="text-[10px] font-black text-white uppercase mb-4 tracking-[0.15em]">Recent Activity</p>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 opacity-40">
                    <div className="h-2 w-2 rounded-full bg-slate-300" />
                    <div className="h-3 w-24 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 p-6 md:p-10">

          {/* Status Display - Center Section */}
          <AnimatePresence>
            {status === "pending" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto mt-20 text-center"
              >
                <div className="bg-white p-10 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.04)] border border-white">
                  <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Clock size={40} className="animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Verification in Progress</h3>
                  <p className="text-slate-500 font-medium mb-8">
                    Hello <span className="text-slate-700 font-bold">{profile?.name}</span>, your request has been sent to our team. Please wait while we verify your details for Class <span className="text-slate-700 font-bold">{profile?.class}th</span>. After Approval Your Study Mterial Will Be Visible Here
                  </p>
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 text-amber-700 rounded-full font-bold text-sm border border-amber-100">
                    <AlertCircle size={16} /> Approval Status: PENDING
                  </div>
                </div>
              </motion.div>
            )}

            {status === "approved" && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {activeTab === "study" ? (
                  <StudyMaterialSection
                    userClass={profile?.class || ""}
                    onTotalCount={(count) => setTotalNotes(count)}
                    onSubjectCount={(count) => setCurrentSubNotes(count)}
                  />
                ) : activeTab === "notifications" ? (
                  <NotificationSection profile={profile} />
                ) :  (
                  <Payment />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* --- PROFILE SIDE DRAWER --- */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-[70] shadow-2xl p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="font-black text-2xl text-slate-900 tracking-tight">Your Profile</h3>
                <button onClick={() => setIsProfileOpen(false)} className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">✕</button>
              </div>

              <div className="text-center mb-10">
                <div className="h-24 w-24 rounded-[2.5rem] bg-blue-600 text-white flex items-center justify-center text-3xl font-black mx-auto mb-4 shadow-xl shadow-blue-100">
                  {profile?.name?.charAt(0)}
                </div>
                <h4 className="text-xl font-black text-slate-900 leading-tight">{profile?.name}</h4>
                <div className={`mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {status === 'approved' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {status}
                </div>
              </div>

              <div className="space-y-4 mb-10">
                {/* Name, Email, Mobile logic as is... */}

                {/* Email Address */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                  <p className="text-sm font-bold text-slate-800">{profile?.email}</p>
                </div>

                {/* Mobile Number */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mobile Number</p>
                  <p className="text-sm font-bold text-slate-800">{profile?.mobile}</p>
                </div>

                {/* Class Section (With Edit/Save Logic) */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Class</p>

                  {isEditingClass ? (
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={newClass}
                        onChange={(e) => setNewClass(e.target.value)}
                        className="flex-1 bg-white border border-blue-200 rounded-lg px-2 py-1 text-sm font-bold focus:outline-none focus:ring-2 ring-blue-500"
                        placeholder="Enter Class"
                      />
                      <button
                        onClick={handleUpdateClass}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-bold text-slate-800">Class {profile?.class}</p>
                      <button
                        onClick={() => setIsEditingClass(true)}
                        className="text-blue-600 text-[10px] font-black uppercase hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  localStorage.removeItem("pending_reg");
                  window.location.href = "/userlogin";
                }}
                className="w-full p-4 rounded-2xl bg-red-50 text-red-600 font-bold flex items-center justify-center gap-3 hover:bg-red-100 transition-all active:scale-[0.98]"
              >
                <LogOut size={20} /> Logout Account
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}



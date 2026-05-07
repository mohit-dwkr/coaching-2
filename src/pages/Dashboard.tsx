import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import StudyMaterialSection from "@/components/StudyMaterialSection";
import NotificationSection from "@/components/NotificationSection";
import Payment from "@/components/Payment";
import { toast } from "sonner";
import {
  CreditCard,
  Loader2,
  LogOut,
  LayoutDashboard,
  BookOpen,
  Bell,
  Clock,
  Edit3,
  Save,
  X,
  Menu,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState<string | null>(null);

  const [profile, setProfile] = useState<any>(null);

  const [isProfileOpen, setIsProfileOpen] =
    useState(false);

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState("study");

  // Edit
  const [isEditing, setIsEditing] =
    useState(false);

  const [saving, setSaving] = useState(false);

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    mobile: "",
    class: "",
  });

  // Notes Count
  const [totalNotes, setTotalNotes] =
    useState(0);

  const [currentSubNotes, setCurrentSubNotes] =
    useState(0);

  // ✅ Sync edit data
  useEffect(() => {
    if (!profile) return;

    setEditData({
      name: profile.name || "",
      email: profile.email || "",
      mobile: profile.mobile || "",
      class: profile.class || "",
    });
  }, [profile]);

  // ✅ INITIALIZE USER
  useEffect(() => {
    let mounted = true;

    const initializeUser = async () => {
      try {
        // SESSION
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session?.user) {
          window.location.replace("/userlogin");
          return;
        }

        const userId = session.user.id;

        // FETCH PROFILE
        const {
          data: profileData,
          error: profileError,
        } = await supabase
          .from("student_approvals")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        // NO PROFILE
        if (!profileData) {
          await supabase.auth.signOut();

          toast.error(
            "Profile not found. Please login again."
          );

          window.location.replace("/userlogin");

          return;
        }

        // DENIED USER
        if (profileData.status === "denied") {
          await supabase.auth.signOut();

          toast.error(
            "Your access has been denied. Please re-apply."
          );

          window.location.replace("/userlogin");

          return;
        }

        // VALID USER
        if (mounted) {
          setProfile(profileData);
          setStatus(profileData.status);
        }
      } catch (err: any) {
        console.error(
          "Dashboard Init Error:",
          err?.message
        );

        await supabase.auth.signOut();

        window.location.replace("/userlogin");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeUser();

    return () => {
      mounted = false;
    };
  }, []);


  useEffect(() => {
    if (!profile?.user_id) return;

    const channel = supabase
      .channel("student-approval-realtime")

      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "student_approvals",
          filter: `user_id=eq.${profile.user_id}`,
        },

        async (payload) => {
          console.log(
            "Realtime profile update:",
            payload
          );

          const updatedProfile = payload.new;

          const previousStatus = status;
          const newStatus = payload.new.status;

          // Update state instantly
          setProfile((prev: any) => ({
            ...prev,
            ...updatedProfile,
          }));

          setStatus(newStatus);

          // ✅ APPROVED
          if (
            previousStatus !== "approved" &&
            newStatus === "approved"
          ) {
            toast.success(
              "Your account has been approved!"
            );
          }

          // ✅ DENIED
          if (
            previousStatus !== "denied" &&
            newStatus === "denied"
          ) {
            toast.error(
              "Your access has been denied."
            );


            await supabase.auth.signOut();

            window.location.replace("/userlogin");
          }
        }
      )

      .subscribe((status) => {
        console.log(
          "Realtime subscription status:",
          status
        );
      });

    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.user_id]);


  // ✅ PROFILE UPDATE
  const handleUpdateProfile = async () => {
    if (saving) return;

    // Validation
    if (editData.name.trim().length < 3) {
      return toast.error("Name too short");
    }

    if (
      !/^[0-9]{10}$/.test(
        editData.mobile.trim()
      )
    ) {
      return toast.error("Enter valid mobile number");
    }

    if (!editData.class.trim()) {
      return toast.error("Enter class");
    }

    setSaving(true);

    try {
      const updatedPayload = {
        name: editData.name.trim(),
        mobile: editData.mobile.trim(),
        class: editData.class.trim(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("student_approvals")
        .update(updatedPayload)
        .eq("user_id", profile.user_id);

      if (error) throw error;

      setProfile((prev: any) => ({
        ...prev,
        ...updatedPayload,
      }));

      setIsEditing(false);

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.message ||
        "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ✅ LOGOUT
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();

      window.location.replace("/userlogin");
    } catch (error) {
      console.error(error);

      toast.error("Logout failed");
    }
  };

  // ✅ LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />

        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
          Verifying...
        </p>
      </div>
    );
  }


  // Google Image Logic
  const userAvatar = profile?.user_id ? `https://lh3.googleusercontent.com/d/${profile.user_id}` : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">

      {/* ================= SIDEBAR DESKTOP ================= */}
      <aside className="hidden md:flex w-72 bg-slate-900 flex-col gap-8 shadow-sm fixed left-0 top-0 h-screen p-6 overflow-y-auto">

        <div>
          <h2 className="text-xl font-black text-white ">
            TOPPERS <span className="text-blue-600">ACADEMY</span>
          </h2>

          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Student Dashboard
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3">

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-600 uppercase">
                Total Notes
              </p>

              <p className="text-2xl font-black text-slate-900">
                {totalNotes}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <p className="text-[10px] font-bold text-blue-600 uppercase">
                Subject Notes
              </p>

              <p className="text-2xl font-black text-slate-900">
                {currentSubNotes}
              </p>
            </div>
          </div>

          <nav className="space-y-2 py-8">
            {[
              {
                id: "study",
                icon: BookOpen,
                label: "Study Material",
              },
              {
                id: "notifications",
                icon: Bell,
                label: "Notifications",
              },
              {
                id: "payment",
                icon: CreditCard,
                label: "Fee Payment",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.id
                    ? "bg-blue-700 text-white shadow-md shadow-slate-200"
                    : "text-white"
                  }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* ================= MOBILE SIDEBAR ================= */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-[80] md:hidden"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed left-0 top-0 h-full w-[82%] max-w-[300px] bg-slate-900 z-[90] p-6 shadow-2xl md:hidden overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-xl font-black text-white">
                    TOPPERS{" "}
                    <span className="text-blue-600">
                      ACADEMY
                    </span>
                  </h2>

                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Student Dashboard
                  </p>
                </div>

                <button
                  onClick={() =>
                    setIsSidebarOpen(false)
                  }
                >
                  <X className="text-slate-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-600 uppercase">
                      Total Notes
                    </p>

                    <p className="text-2xl font-black text-slate-900">
                      {totalNotes}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-600 uppercase">
                      Subject Notes
                    </p>

                    <p className="text-2xl font-black text-slate-900">
                      {currentSubNotes}
                    </p>
                  </div>
                </div>

                <nav className="space-y-2 py-8">
                  {[
                    {
                      id: "study",
                      icon: BookOpen,
                      label: "Study Material",
                    },
                    {
                      id: "notifications",
                      icon: Bell,
                      label: "Notifications",
                    },
                    {
                      id: "payment",
                      icon: CreditCard,
                      label: "Fee Payment",
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.id
                          ? "bg-blue-700 text-white shadow-md shadow-slate-200"
                          : "text-white "
                        }`}
                    >
                      <tab.icon size={18} />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ================= RIGHT SIDE ================= */}
      <div className="flex-1 md:ml-72">

        {/* TOPBAR */}
        <div className="bg-slate-900 border-b border-slate-800 h-16 sticky top-0 z-40 flex items-center justify-between px-4 md:px-8">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            {/* MOBILE MENU */}
            <button
              onClick={() =>
                setIsSidebarOpen(true)
              }
              className="md:hidden text-white"
            >
              <Menu size={24} />
            </button>

            <div className="flex items-center gap-2">
              <LayoutDashboard className="text-blue-500 h-5 w-5" />

              <h1 className="font-black text-white tracking-tight text-lg uppercase italic">
                Dashboard
              </h1>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            <div className="hidden md:block text-right">
              <p className="text-sm font-bold text-white leading-none">
                {profile?.name}
              </p>

              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                Class {profile?.class}th
              </p>
            </div>

            <button
              onClick={() =>
                setIsProfileOpen(true)
              }
              className="h-10 w-10 rounded-full bg-blue-600 overflow-hidden text-white flex items-center justify-center font-bold border-2 border-slate-700 hover:scale-105 transition-transform"
            >
              {profile?.name?.charAt(0) || "S"}
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="p-6 md:p-10">
          <AnimatePresence mode="wait">
            {status === "pending" ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto mt-12 text-center bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Clock size={32} className="animate-spin-slow" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Pending Approval</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                  Welcome, <span className="text-blue-600 font-bold">{profile?.name}</span>! Our team is verifying your profile for Class {profile?.class}.
                </p>
              </motion.div>
            ) : (
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {activeTab === "study" && <StudyMaterialSection userClass={profile?.class || ""} onTotalCount={setTotalNotes} onSubjectCount={setCurrentSubNotes} />}
                {activeTab === "notifications" && <NotificationSection profile={profile} />}
                {activeTab === "payment" && <Payment />}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* --- SIDE PROFILE DRAWER --- */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProfileOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed right-0 top-0 h-full w-[82%] max-w-sm bg-white z-[70] shadow-2xl p-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-xl text-slate-900 uppercase tracking-tighter">Student Profile</h3>
                <button onClick={() => setIsProfileOpen(false)} className="text-slate-400 hover:text-slate-900"><X size={24} /></button>
              </div>

              {/* Avatar & Status Section */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full bg-blue-600 border-4 border-slate-100 shadow-inner flex items-center justify-center text-white text-3xl font-black overflow-hidden mb-3">
                  {profile?.name?.charAt(0)}
                </div>
                <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                  {status}
                </div>
              </div>

              {/* Information Fields */}
              {/* Information Fields */}
              <div className="space-y-4">
                {[
                  { label: "Full Name", key: "name" },
                  { label: "Contact Email", key: "email" },
                  { label: "Mobile Number", key: "mobile" },
                  { label: "Standard / Class", key: "class" },
                ].map((field) => (
                  <div key={field.key} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{field.label}</p>

                    {/* Yahan change hai: isEditing true ho AUR field email NA ho, tabhi input dikhao */}
                    {isEditing && field.key !== "email" ? (
                      <input
                        type="text"
                        value={editData[field.key as keyof typeof editData]}
                        onChange={(e) => setEditData({ ...editData, [field.key]: e.target.value })}
                        className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-2 ring-blue-100"
                      />
                    ) : (
                      /* Email ke liye ya normal mode ke liye sirf text dikhega */
                      <p className={`text-sm font-bold ${field.key === "email" && isEditing ? 'text-slate-400' : 'text-slate-800'}`}>
                        {profile?.[field.key] || "Not Set"}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom Action Buttons */}
              <div className="mt-8 space-y-3">
                {isEditing ? (
                  <button
                    onClick={handleUpdateProfile}
                    className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100"
                  >
                    <Save size={18} /> SAVE CHANGES
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black flex items-center justify-center gap-2 hover:bg-slate-800"
                  >
                    <Edit3 size={18} /> EDIT PROFILE
                  </button>
                )}

                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = "/userlogin";
                  }}
                  className="w-full py-4 rounded-2xl bg-red-50 text-red-600 font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
                >
                  <LogOut size={18} /> LOGOUT
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  User,
  Mail,
  Smartphone,
  GraduationCap,
  ArrowRight,
  Loader2,
  KeyRound,
  ArrowLeft,
} from "lucide-react";

export default function UserLogin() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    class: "",
  });

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const [step, setStep] = useState<"details" | "otp">("details");

  // ✅ SESSION CHECK
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          setCheckingSession(false);
          return;
        }

        const userId = session.user.id;

        const { data: profile } = await supabase
          .from("student_approvals")
          .select("status")
          .eq("user_id", userId)
          .maybeSingle();

        // No profile -> logout
        if (!profile) {
          await supabase.auth.signOut();
          setCheckingSession(false);
          return;
        }

        // Denied user -> logout
        if (profile.status === "denied") {
          await supabase.auth.signOut();
          setCheckingSession(false);
          return;
        }

        // Approved/Pending -> dashboard
        window.location.replace("/dashboard");
      } catch (error) {
        console.error(error);
        setCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  // ✅ SEND OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    const email = form.email.trim().toLowerCase();
    const name = form.name.trim();
    const mobile = form.mobile.trim();
    const studentClass = form.class.trim();

    // Validation
   if (!/\S+@\S+\.\S+/.test(email)) {
  toast.error("Enter valid email");
  return;
}

if (name.length < 3) {
  toast.error("Name is too short");
  return;
}

if (!/^[0-9]{10}$/.test(mobile)) {
  toast.error("Enter valid 10 digit mobile number");
  return;
}

if (!studentClass) {
  toast.error("Enter class");
  return;
}

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,

          data: {
            name,
            mobile,
            student_class: studentClass,
          },

          emailRedirectTo:
            window.location.origin + "/dashboard",
        },
      });

      if (error) throw error;

      setStep("otp");
    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.message ||
        "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ VERIFY OTP
  const handleVerifyOTP = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (loading || otp.length !== 6) return;

    setLoading(true);

    try {
      const email = form.email.trim().toLowerCase();

      // ✅ FIXED TYPE
      const {
        data: { session },
        error: verifyError,
      } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (verifyError) throw verifyError;

      if (!session?.user) {
        throw new Error("Session not created");
      }

      const user = session.user;

      const userId = user.id;

      // ✅ FETCH EXISTING PROFILE
      const {
        data: existingProfile,
        error: fetchError,
      } = await supabase
        .from("student_approvals")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // ✅ NEW USER
      if (!existingProfile) {
        const { error: insertError } = await supabase
          .from("student_approvals")
          .insert([
            {
              user_id: userId,
              name: form.name.trim(),
              email,
              mobile: form.mobile.trim(),
              class: form.class.trim(),
              status: "pending",
            },
          ]);

        if (insertError) throw insertError;
      }

      // ✅ DENIED USER REAPPLY
      else if (existingProfile.status === "denied") {
        const { error: updateError } = await supabase
          .from("student_approvals")
          .update({
            name: form.name.trim(),
            mobile: form.mobile.trim(),
            class: form.class.trim(),
            status: "pending",
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        if (updateError) throw updateError;
      }

      // ✅ SMALL DELAY TO PREVENT RACE CONDITION
      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      window.location.replace("/dashboard");
    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.message ||
        "Invalid OTP or something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOADER
  if (checkingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs">
          Verifying Session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden px-4 font-sans">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-60" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-100 rounded-full blur-[120px] opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] z-10"
      >
        <div className="bg-white/80 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white">

          <AnimatePresence mode="wait">
            {step === "details" ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white mb-5 shadow-lg shadow-blue-100">
                    <User size={28} />
                  </div>

                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    Login Dashboard
                  </h2>

                  <p className="text-slate-500 mt-2 text-sm font-medium">
                    Enter details to receive 6-digit OTP
                  </p>
                </div>

                <form
                  onSubmit={handleSendOTP}
                  className="space-y-4"
                >
                  {/* SAME DESIGN */}

                  {/* KEEP ALL YOUR EXISTING INPUT UI SAME */}
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input placeholder="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="login-input w-full pl-12 pr-4 h-14 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium" />
                  </div>

                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input type="email" placeholder="Email Address" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="login-input w-full pl-12 pr-4 h-14 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium" />
                  </div>

                  <div className="relative group">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input placeholder="Mobile Number" required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="login-input w-full pl-12 pr-4 h-14 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium" />
                  </div>

                  <div className="relative group">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input type="number" placeholder="Class (e.g. 10)" required value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} className="login-input w-full pl-12 pr-4 h-14 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium" />
                  </div>

                  <button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black text-lg shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 mt-4 active:scale-95">
                    {loading ? <Loader2 className="animate-spin" /> : <>Get OTP <ArrowRight size={20} /></>}
                  </button>
                </form>
              </motion.div>
            ) : (
              // --- STEP 2: OTP VERIFICATION ---
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => setStep("details")} className="mb-6 flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-blue-600 transition-colors">
                  <ArrowLeft size={16} /> Edit Details
                </button>

                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500 text-white mb-5 shadow-lg shadow-green-100">
                    <KeyRound size={28} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Verify OTP</h2>
                  <p className="text-slate-500 mt-2 text-sm font-medium">Enter the 6-digit code sent to <br /><span className="text-slate-900 font-bold">{form.email}</span></p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="0 0 0 0 0 0"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center text-3xl font-black tracking-[0.5em] h-20 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-green-50 focus:border-green-200 outline-none transition-all text-slate-800 placeholder:text-slate-200"
                  />

                  <button type="submit" disabled={loading || otp.length < 6} className="w-full h-14 rounded-2xl bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-black text-lg shadow-xl shadow-green-100 transition-all flex items-center justify-center gap-2 active:scale-95">
                    {loading ? <Loader2 className="animate-spin" /> : <>Verify & Login <ArrowRight size={20} /></>}
                  </button>

                  <p className="text-center text-xs text-slate-400 font-medium">
                    Didn't receive the code? Check your spam folder or <span onClick={() => setStep("details")} className="text-blue-600 cursor-pointer font-bold hover:underline">try again</span>.
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center mt-10 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
            Secured Access • Toppers Academy
          </p>
        </div>
      </motion.div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { motion } from "framer-motion";
import { User, Mail, Smartphone, GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import { MailCheck, ArrowLeft, ExternalLink } from "lucide-react";


export default function UserLogin() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    class: "",
  });

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

useEffect(() => {
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      const { data } = await supabase
        .from("student_approvals")
        .select("status")
        .eq("email", session.user.email)
        .maybeSingle();

    if (data) {
  if (data.status === "denied") {
    // 🔥 allow user to re-request (form dikhana hai)
    setCheckingSession(false);
  } else {
    window.location.href = "/dashboard";
  }
} else {
        // user exist nahi karta → fresh start
        await supabase.auth.signOut();
        setCheckingSession(false);
      }
    } else {
      setCheckingSession(false);
    }
  };

  checkSession();

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      if (session?.user) {
        window.location.href = "/dashboard";
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);

const handleSubmit = async (e: any) => {
  e.preventDefault();
  setLoading(true);

  try {
    const email = form.email.toLowerCase();

    // 🔍 check existing user
    const { data: existing } = await supabase
      .from("student_approvals")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      if (existing.status === "denied") {
        // 🔥 re-request (update)
        await supabase
          .from("student_approvals")
          .update({
            name: form.name,
            mobile: form.mobile,
            class: form.class,
            status: "pending",
          })
          .eq("email", email);
      }
      // अगर pending/approved है → kuch nahi
    } else {
      // 🆕 new user → store for insert (dashboard me use hoga)
      localStorage.setItem("pending_reg", JSON.stringify({
        ...form,
        email
      }));
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/dashboard",
      },
    });

    if (error) throw error;

    setSent(true);
  } catch (err: any) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

  // 🔄 Session check loading
if (checkingSession) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Main Spinner */}
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        
        {/* Subtle Outer Ring for extra polish */}
        <div className="absolute h-16 w-16 border-4 border-blue-100 rounded-full border-t-transparent animate-[spin_2s_linear_infinite]" />
      </div>
      
      {/* Loading Text */}
      <p className="mt-6 text-slate-500 font-bold text-sm tracking-[0.2em] uppercase animate-pulse">
        Verifying...
      </p>
    </div>
  );
}

  // 📩 Email sent screen
  if (sent) {
    return (
     <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden px-4">
    {/* Background Decorative Blobs (Same as login for consistency) */}
    <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-60" />
    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-100 rounded-full blur-[120px] opacity-60" />

    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[450px] z-10"
    >
      <div className="bg-white/80 backdrop-blur-2xl p-10 mt-16 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-white text-center">
        
        {/* Animated Icon Section */}
        <div className="relative inline-flex mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 rounded-3xl bg-blue-500 text-white flex items-center justify-center shadow-xl shadow-green-100 relative z-10"
          >
            <MailCheck size={40} />
          </motion.div>
          {/* Decorative rings behind icon */}
          <div className="absolute inset-0 w-20 h-20 bg-green-200 rounded-3xl animate-ping opacity-20" />
        </div>

        {/* Text Content */}
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4">
          Check your email 📩
        </h2>
        
        <p className="text-slate-600 text-base leading-relaxed mb-8">
          A login link has been sent to <br />
          <span className="font-bold text-sm md:text-lg text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg break-all">
            {form.email}
          </span>
        </p>

        {/* Action Buttons/Links */}
        <div className="space-y-4">
          <a 
            href="https://mail.google.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
          >
            Open Gmail <ExternalLink size={18} />
          </a>
          
          <button 
            onClick={() => window.location.reload()} // Ya aapki custom reset logic
            className="text-slate-400 hover:text-blue-600 font-bold text-sm transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} /> Try another email
          </button>
        </div>

        {/* Help Note */}
        <div className="mt-10 p-4 bg-yellow-50/50 rounded-2xl border border-yellow-100/50">
          <p className="text-xs text-yellow-700 font-medium leading-normal">
            <b>Note:</b> If you don't see the email, please check your <b>Spam</b> or <b>Promotions</b> folder.
          </p>
        </div>
 {/* Footer Branding */}
      <p className="text-center  text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
        Secured Access • Toppers Academy
      </p>
      </div>

     
    </motion.div>
  </div>
  
    );
  }

  return (
   <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden px-4 mt-16 font-sans">
    {/* Decorative Background Blobs */}
    <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-60" />
    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-100 rounded-full blur-[120px] opacity-60" />

    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[420px] z-10"
    >
      <div className="bg-white/80 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white mb-5 shadow-lg shadow-blue-100">
            <User size={28} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Login to Dashboard</h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">Enter your details to access the dashboard</p>
        </div>

        {/* Form Section - Logic Same, Style New */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Name Input */}
          <div className="space-y-1.5">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input
                placeholder="Full Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full pl-12 pr-4 h-14 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-12 pr-4 h-14 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Mobile Input */}
          <div className="space-y-1.5">
            <div className="relative group">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input
                placeholder="Mobile Number"
                required
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className="w-full pl-12 pr-4 h-14 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

         {/* Class Input */}
<div className="space-y-1.5">
  <div className="relative group">
    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
    <input
      type="number"
      placeholder="Your Class (e.g. 10)"
      required
      value={form.class}
      onChange={(e) => setForm({ ...form, class: e.target.value })}
      onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
      className="w-full pl-12 pr-4 h-14 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
    />
  </div>
</div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black text-lg shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 group mt-4 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Sending Login Mail...
              </>
            ) : (
              <>
                Login
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Bottom Note */}
        <p className="text-center mt-8 text-slate-500 text-xs font-semibold uppercase tracking-widest">
          Toppers Academy • Student Portal
        </p>
      </div>
    </motion.div>
  </div>
  );
}
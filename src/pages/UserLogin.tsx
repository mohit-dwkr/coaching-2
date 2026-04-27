import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";

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
    return <div style={{ textAlign: "center", marginTop: "100px" }}>Loading...</div>;
  }

  // 📩 Email sent screen
  if (sent) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Check your email 📩</h2>
        <p>Magic link sent to <b>{form.email}</b></p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto" }}>
      <h2>Login / Get Access</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Mobile"
          required
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
        />

        <input
          placeholder="Class"
          required
          value={form.class}
          onChange={(e) => setForm({ ...form, class: e.target.value })}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Login"}
        </button>
      </form>
    </div>
  );
}
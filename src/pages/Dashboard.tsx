import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import StudyMaterialSection from "@/components/StudyMaterialSection";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

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
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  // 🟡 Pending UI
  if (status === "pending") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center">
          
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            Welcome {profile?.name}
          </h2>

          <div className="space-y-2 text-gray-600 text-sm">
            <p><b>Email:</b> {profile?.email}</p>
            <p><b>Mobile:</b> {profile?.mobile}</p>
            <p><b>Class:</b> {profile?.class}</p>
          </div>

          <div className="mt-6">
            <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-semibold">
              Approval Pending
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Wait for admin approval to access study material
          </p>

        </div>
      </div>
    );
  }

  // 🟢 Approved (MAIN 🔥)
  if (status === "approved") {
    return (
      <div>
        {/* Top Bar */}
        <div className="bg-white shadow p-4 flex justify-between items-center">
          <h2 className="font-bold text-lg text-blue-600">
            Welcome {profile?.name}
          </h2>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/userlogin";
            }}
            className="text-sm text-red-500 font-semibold"
          >
            Logout
          </button>
        </div>

        {/* Study Material */}
        <StudyMaterialSection />
      </div>
    );
  }

  return null;
}
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, Loader2, ChevronDown, ChevronUp, Lock, Send, User, Phone, GraduationCap, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Make sure this import exists
import { supabase } from "@/supabaseClient";

export default function StudyMaterialSection() {
  // --- New States for Access Control ---
  const [accessStatus, setAccessStatus] = useState<string | null>(null); // 'pending', 'approved', 'denied', or null
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentForm, setStudentForm] = useState({ name: "", mobile: "", class: "" });

  // --- Your Existing States ---
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [showMorePdfs, setShowMorePdfs] = useState(false); 
  const [videos, setVideos] = useState<any[]>([]);
  const [showAllVideos, setShowAllVideos] = useState(false);

  // --- Logic 1: Check Access First ---
  useEffect(() => {
    const savedMobile = localStorage.getItem("student_mobile");
    if (savedMobile) {
      checkAccess(savedMobile);
    } else {
      setIsCheckingAccess(false);
    }
  }, []);

  const checkAccess = async (mobile: string) => {
    try {
      setIsCheckingAccess(true);
      const { data, error } = await supabase
        .from('student_approvals')
        .select('status')
        .eq('mobile', mobile)
        .single();

      if (data) {
        setAccessStatus(data.status);
        localStorage.setItem("student_mobile", mobile);
        if (data.status === 'approved') {
          fetchContent(); // Sirf approved hone par data fetch karega
        }
      }
    } catch (err) {
      console.error("Access Check Error:", err);
    } finally {
      setIsCheckingAccess(false);
    }
  };

  // --- Logic 2: Handle Form Submit ---
  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('student_approvals').insert([studentForm]);
      if (error) {
        if (error.code === '23505') {
          checkAccess(studentForm.mobile);
        } else throw error;
      } else {
        localStorage.setItem("student_mobile", studentForm.mobile);
        setAccessStatus('pending');
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Logic 3: Your Existing Fetch Function ---
  async function fetchContent() {
    try {
      setLoading(true);
      const { data: matData, error: matError } = await supabase
        .from("Coaching_StudyMaterial")
        .select("*")
        .order("created_at", { ascending: false });

      if (matData) {
        setMaterials(matData);
        const uniqueClasses = [...new Set(matData.map((m: any) => m.student_class))] as string[];
        if (uniqueClasses.length > 0) {
          setSelectedClass(uniqueClasses[0]);
          const firstSubject = matData.find((m: any) => m.student_class === uniqueClasses[0])?.subject;
          setSelectedSubject(firstSubject || "");
        }
      }

      const { data: vidData, error: vidError } = await supabase
        .from('video_lectures')
        .select('*')
        .order('created_at', { ascending: false });

      if (vidData) setVideos(vidData);
    } catch (err) {
      console.error("Content Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }

  // --- Your Existing Filter Logic ---
  const classes = [...new Set(materials.map((m) => m.student_class))] as string[];
  const subjectsForClass = [...new Set(materials.filter((m) => m.student_class === selectedClass).map((m) => m.subject))] as string[];
  const handleClassChange = (c: string) => {
    setSelectedClass(c);
    const firstSubject = materials.find(m => m.student_class === c)?.subject;
    setSelectedSubject(firstSubject ?? "");
    setShowMorePdfs(false); 
  };
  const filtered = materials.filter(m => m.student_class === selectedClass && m.subject === selectedSubject);
  const visiblePdfs = showMorePdfs ? filtered : filtered.slice(0, 6);
  const visibleVideos = showAllVideos ? videos : videos.slice(0, 8);

  // --- RENDER LOGIC ---

  if (isCheckingAccess) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  // 1. If Denied
  if (accessStatus === 'denied') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <XCircle size={80} className="text-red-500 mb-4" />
        <h2 className="text-3xl font-black text-slate-800 uppercase">Access Revoked</h2>
        <p className="text-slate-500 max-w-md mt-2 font-medium">"Your access has been revoked. Please contact the academy for further information.</p>

<Button 
          variant="outline"
          className="mt-8 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold px-8 rounded-full"
          onClick={() => {
            localStorage.removeItem("student_mobile"); // Browser se data delete
            setAccessStatus(null); // State reset taaki form dikhe
            setStudentForm({ name: "", mobile: "", class: "" }); // Form fields khali
          }}
        >
          Try Again
        </Button>

      </div>
    );
  }

  // 2. If Pending
  if (accessStatus === 'pending') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <div className="p-5 bg-yellow-50 text-yellow-600 rounded-full mb-6 animate-pulse border-2 border-yellow-200">
          <Clock size={60} />
        </div>
        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Approval Pending</h2>
        <p className="text-slate-500 max-w-sm mt-3 font-medium">"Your request has been submitted. Once approved by the admin, all materials will be visible here."</p>
        <Button onClick={() => checkAccess(localStorage.getItem("student_mobile") || "")} className="mt-8 bg-yellow-500 hover:bg-yellow-600 px-10 rounded-full font-bold h-12">
          Check Status Again
        </Button>
      </div>
    );
  }

  // 3. If No Request Found (Show Form)
if (accessStatus !== 'approved') {
  return (
    // Responsive Padding: Mobile pe p-4, Tablet/Laptop pe p-20
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 md:p-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        // Responsive Width & Corners: Mobile pe w-full, Laptop pe max-w-md
        className="max-w-md w-full bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl p-6 md:p-10 border border-slate-100 my-8"
      >
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex p-4 bg-green-50 text-blue-600 rounded-3xl mb-4 border border-green-100">
            <Lock size={32} />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase">Unlock Material</h2>
          <p className="text-xs md:text-sm text-slate-500 font-bold mt-2">Enter details to request for study material</p>
        </div>

        <form onSubmit={handleRequestAccess} className="space-y-4 md:space-y-5">
          {/* Full Name Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <Input 
                required 
                placeholder="Student Name" 
                className="pl-12 h-12 md:h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-blue-500" 
                value={studentForm.name} 
                onChange={(e) => setStudentForm({...studentForm, name: e.target.value})} 
              />
            </div>
          </div>

          {/* Mobile Number Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <Input 
                required 
                type="tel" 
                placeholder="Mobile Number" 
                className="pl-12 h-12 md:h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-blue-500" 
                value={studentForm.mobile} 
                onChange={(e) => setStudentForm({...studentForm, mobile: e.target.value})} 
              />
            </div>
          </div>

          {/* Class Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Class</label>
            <div className="relative">
              <GraduationCap className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <Input 
                required 
                placeholder="e.g. 10th Standard" 
                className="pl-12 h-12 md:h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-blue-500" 
                value={studentForm.class} 
                onChange={(e) => setStudentForm({...studentForm, class: e.target.value})} 
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            disabled={isSubmitting} 
            className="w-full h-12 md:h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-green-100 transition-all active:scale-95 text-base mt-2"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Send size={18} className="mr-2" /> SEND ACCESS REQUEST
              </>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

  // 4. APPROVED (Your Original UI)
  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {loading && <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>}
      
      {/* --- Section 1: PDF Materials (Your Original Code) --- */}
      <section id="material" className="relative py-8 mt-10 md:py-20 h-auto overflow-y-visible">
        <div className="container mx-auto px-4 pt-20 md:pt-0">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10 px-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Study <span className="text-primary">Material</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto px-4 pb-20">
            <div className="mb-8 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Step 1: Select Your Class</p>
              <div className="flex flex-wrap justify-center gap-2">
                {classes.map((c: string) => (
                  <button key={c} onClick={() => handleClassChange(c)} className={`px-5 py-2 rounded-xl font-bold transition-all ${selectedClass === c ? "bg-primary text-white shadow-md" : "bg-white border text-slate-500 hover:bg-slate-50"}`}>
                    Class {c}
                  </button>
                ))}
              </div>
            </div>

            {selectedClass && (
              <div className="mb-12 text-center animate-in fade-in duration-300">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Step 2: Choose Subject</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {subjectsForClass.map((s: string) => (
                    <button key={s} onClick={() => setSelectedSubject(s)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${selectedSubject === s ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {visiblePdfs.map((m: any) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} whileHover={{ y: -2 }} className="group relative bg-white border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                    <div className="flex items-center gap-4 w-full relative z-10">
                      <div className="h-12 w-12 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-inner">
                        <FileText size={24} />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-extrabold text-slate-800 truncate text-sm md:text-base">{m.title}</p>
                          <span className="hidden md:inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase">PDF</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">{m.subject}</span>
                          <span className="text-[14px] font-medium text-gray-500 flex items-center gap-1">
                            <span className="h-1 w-1 rounded-full bg-slate-300" /> Class {m.student_class}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto relative z-10">
                      <Button asChild className="w-full sm:w-auto rounded-xl font-bold bg-slate-900 hover:bg-blue-600 text-white h-11 px-6">
                        <a href={m.file_url} target="_blank" rel="noreferrer" className="flex items-center justify-center">
                          <Download className="h-4 w-4 mr-2 stroke-[3px]" /> Download Notes
                        </a>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filtered.length > 6 && (
              <div className="mt-8 text-center">
                <Button onClick={() => setShowMorePdfs(!showMorePdfs)} variant="outline" className="rounded-full px-8 font-bold border-2 border-green-300 hover:border-green-500 hover:text-green-600 transition-all flex items-center mx-auto gap-2">
                  {showMorePdfs ? <><ChevronUp className="h-4 w-4" /> Show Less</> : <><ChevronDown className="h-4 w-4" /> Show More Notes ({filtered.length - 6}+)</>}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- Section 2: Video Lectures (Your Original Code) --- */}
      <section className="py-20 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Video <span className="text-blue-700">Lectures</span>
            </h2>
            <div className="h-1.5 w-20 bg-blue-700 mt-4 rounded-full mx-auto mb-12"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
            {visibleVideos.map((vid) => (
              <a key={vid.id} href={`https://www.youtube.com/watch?v=${vid.youtube_id}`} target="_blank" rel="noopener noreferrer" className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col">
                <div className="aspect-video relative overflow-hidden bg-slate-200">
                  <img src={`https://img.youtube.com/vi/${vid.youtube_id}/maxresdefault.jpg`} alt={vid.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e: any) => { e.target.src = `https://img.youtube.com/vi/${vid.youtube_id}/0.jpg` }} />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/40 transition-all">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[12px] border-l-blue-700 border-b-[6px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-grow">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest px-2 py-1 bg-blue-50 rounded-md">{vid.subject}</span>
                  <h3 className="font-extrabold text-slate-800 text-base mt-3 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors">{vid.title}</h3>
                </div>
              </a>
            ))}
          </div>

          {videos.length > 8 && (
            <div className="mt-16 text-center">
              <button onClick={() => setShowAllVideos(!showAllVideos)} className="px-10 py-4 bg-green-600 text-white font-bold text-sm rounded-full hover:bg-green-800 shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center mx-auto gap-2 mb-16">
                {showAllVideos ? <><ChevronUp className="h-5 w-5" /> Show Less Lectures</> : <><ChevronDown className="h-5 w-5" /> Show More Lectures ({videos.length - 8}+)</>}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
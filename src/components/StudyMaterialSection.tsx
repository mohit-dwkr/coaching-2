import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabaseClient";

export default function StudyMaterialSection() {

  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [showMorePdfs, setShowMorePdfs] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [showAllVideos, setShowAllVideos] = useState(false);

  // ✅ ONLY FETCH CONTENT (no auth logic)
  useEffect(() => {
    fetchContent();
  }, []);

  const handleDownload = async (filePath: string) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      alert("Please login first");
      return;
    }

    const { data: urlData, error } = await supabase
      .storage
      .from("coaching-2_private")
      .createSignedUrl(filePath, 60);

    if (urlData?.signedUrl) {
      window.open(urlData.signedUrl, '_blank');
    } else {
      console.error("Error generating URL:", error);
      alert("Something Went Wrong, please try again.");
    }
  };

  async function fetchContent() {
    try {
      setLoading(true);

      const { data: matData } = await supabase
        .from("Coaching-2_StudyMaterial")
        .select("*")
        .order("created_at", { ascending: false });

      if (matData) {
        setMaterials(matData);

        const uniqueClasses = [...new Set(matData.map((m: any) => m.student_class))] as string[];

        if (uniqueClasses.length > 0) {
          setSelectedClass(uniqueClasses[0]);

          const firstSubject = matData.find(
            (m: any) => m.student_class === uniqueClasses[0]
          )?.subject;

          setSelectedSubject(firstSubject || "");
        }
      }

      const { data: vidData } = await supabase
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

  const classes = [...new Set(materials.map((m) => m.student_class))] as string[];

  const subjectsForClass = [
    ...new Set(
      materials
        .filter((m) => m.student_class === selectedClass)
        .map((m) => m.subject)
    ),
  ] as string[];

  const handleClassChange = (c: string) => {
    setSelectedClass(c);

    const firstSubject = materials.find(m => m.student_class === c)?.subject;
    setSelectedSubject(firstSubject ?? "");

    setShowMorePdfs(false);
  };

  const filtered = materials.filter(
    m => m.student_class === selectedClass && m.subject === selectedSubject
  );

  const visiblePdfs = showMorePdfs ? filtered : filtered.slice(0, 6);
  const visibleVideos = showAllVideos ? videos : videos.slice(0, 8);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <div className="bg-[#F8FAFC] min-h-screen">

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>

        {/* ✅ Study Material UI SAME */}
        <section id="material" className="relative py-8 mt-10 md:py-20 h-auto overflow-y-visible">
          <div className="container mx-auto px-4 pt-20 md:pt-0">
            <div className="text-center mb-10 px-4">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                Study <span className="text-primary">Material</span>
              </h2>
            </div>

            <div className="max-w-4xl mx-auto px-4 pb-20">

              {/* Class */}
              <div className="mb-8 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">
                  Step 1: Select Your Class
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {classes.map((c: string) => (
                    <button key={c} onClick={() => handleClassChange(c)}
                      className={`px-5 py-2 rounded-xl font-bold transition-all ${
                        selectedClass === c
                          ? "bg-primary text-white shadow-md"
                          : "bg-white border text-slate-500 hover:bg-slate-50"
                      }`}>
                      Class {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              {selectedClass && (
                <div className="mb-12 text-center animate-in fade-in duration-300">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">
                    Step 2: Choose Subject
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {subjectsForClass.map((s: string) => (
                      <button key={s} onClick={() => setSelectedSubject(s)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                          selectedSubject === s
                            ? "bg-slate-800 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PDFs */}
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {visiblePdfs.map((m: any) => (
                    <motion.div key={m.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative bg-white border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md">

                      <div className="flex items-center gap-4 w-full">
                        <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                          <FileText size={24} />
                        </div>

                        <div className="flex-1 text-left">
                          <p className="font-extrabold text-slate-800">{m.title}</p>
                          <p className="text-sm text-gray-500">
                            {m.subject} • Class {m.student_class}
                          </p>
                        </div>
                      </div>

                      <Button onClick={() => handleDownload(m.file_url)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>

                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filtered.length > 6 && (
                <div className="mt-8 text-center">
                  <Button onClick={() => setShowMorePdfs(!showMorePdfs)}>
                    {showMorePdfs ? "Show Less" : "Show More"}
                  </Button>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* ✅ Video UI SAME */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-6 max-w-7xl">

            <h2 className="text-3xl md:text-5xl font-black text-center mb-12">
              Video Lectures
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {visibleVideos.map((vid) => (
                <a key={vid.id}
                  href={`https://www.youtube.com/watch?v=${vid.youtube_id}`}
                  target="_blank"
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm">

                  <img
                    src={`https://img.youtube.com/vi/${vid.youtube_id}/0.jpg`}
                    alt={vid.title}
                  />

                  <div className="p-4">
                    <p className="font-bold">{vid.title}</p>
                  </div>

                </a>
              ))}
            </div>

          </div>
        </section>

      </motion.div>
    </div>
  );
}
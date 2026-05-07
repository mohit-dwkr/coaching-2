import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, Loader2, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabaseClient";
import { useQuery } from "@tanstack/react-query";

// 1. Interface definition
interface StudyMaterialProps {
  userClass: string;
  onTotalCount?: (count: number) => void;
  onSubjectCount?: (count: number) => void;
}

export default function StudyMaterialSection({ userClass, onTotalCount, onSubjectCount }: StudyMaterialProps) {

  // ✅ States jo UI toggle ke liye chahiye
  const [selectedSubject, setSelectedSubject] = useState("");
  
  // ✅ Pagination States
  const [pdfPage, setPdfPage] = useState(1);
  const [videoPage, setVideoPage] = useState(1);
  const itemsPerPagePdf = 5;
  const itemsPerPageVideo = 8;

  // ✅ REACT QUERY: Data fetch aur Cache ek saath
  const { data: allContent, isLoading } = useQuery({
    queryKey: ["study-materials", userClass], 
    queryFn: async () => {
      // 1. PDF Materials Fetching
      const { data: matData } = await supabase
        .from("Coaching-2_StudyMaterial")
        .select("*")
        .eq("student_class", userClass)
        .order("created_at", { ascending: false });

      // 2. Video Fetching
      const { data: vidData } = await supabase
        .from('video_lectures')
        .select('*')
        .or(`student_class.eq.${userClass},student_class.eq.All`)
        .order('created_at', { ascending: false });

      // Dashboard counts logic
      if (matData) {
        onTotalCount?.(matData.length);
        if (matData.length > 0 && !selectedSubject) {
          const firstSub = matData[0].subject;
          setSelectedSubject(firstSub);
          onSubjectCount?.(matData.filter(m => m.subject === firstSub).length);
        }
      }
      return { materials: matData || [], videos: vidData || [] };
    },
    staleTime: 1000 * 60 * 30, // 30 Min Cache
    gcTime: 1000 * 60 * 60,    // 1 Hour Memory
  });

  const materials = allContent?.materials || [];
  const videos = allContent?.videos || [];

useEffect(() => {
  // Agar materials load ho chuke hain (cache se ya fetch se) 
  // aur abhi koi subject selected nahi hai (mtlb user just tab switch karke aaya hai)
  if (materials.length > 0 && !selectedSubject) {
    const firstSub = materials[0].subject;
    setSelectedSubject(firstSub);
  }
}, [materials, selectedSubject]);

  const handleSubjectChange = (sub: string) => {
    setSelectedSubject(sub);
    setPdfPage(1); // Subject change par page reset
    const count = materials.filter(m => m.subject === sub).length;
    onSubjectCount?.(count);
  };

  const handleDownload = async (filePath: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("Please login first");
      return;
    }

    const { data: urlData } = await supabase
      .storage
      .from("coaching-2_private")
      .createSignedUrl(filePath, 300);

    if (urlData?.signedUrl) {
      window.open(urlData.signedUrl, '_blank');
    } else {
      alert("Something Went Wrong, please try again.");
    }
  };

  // ✅ Filter logic
  const subjectsForClass = [...new Set(materials.map((m) => m.subject))] as string[];
  const filteredMaterials = materials.filter(m => m.subject === selectedSubject);

  // ✅ PDF Pagination Calculations
  const totalPdfPages = Math.ceil(filteredMaterials.length / itemsPerPagePdf);
  const currentPdfs = filteredMaterials.slice((pdfPage - 1) * itemsPerPagePdf, pdfPage * itemsPerPagePdf);

  // ✅ Video Pagination Calculations
  const totalVideoPages = Math.ceil(videos.length / itemsPerPageVideo);
  const currentVideos = videos.slice((videoPage - 1) * itemsPerPageVideo, videoPage * itemsPerPageVideo);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>

        <section id="material" className="relative  h-auto overflow-y-visible">
          <div className="container mx-auto px-4 pt-8 md:pt-0">
            <div className="text-center mb-10 px-4">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                Study <span className="text-primary">Material</span>
              </h2>
            </div>

            <div className="max-w-4xl mx-auto px-4 pb-20">

              {/* Subject Selection */}
              {userClass && (
                <div className="mb-12 text-center">
                  <p className="text-[10px] font-bold text-slate-600 uppercase mb-4 tracking-widest">
                    Select Subject for Class {userClass}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {subjectsForClass.map((s: string) => (
                      <button 
                        key={s} 
                        onClick={() => handleSubjectChange(s)} 
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${selectedSubject === s ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PDFs List */}
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {currentPdfs.map((m: any) => (
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
                          <p className="text-sm text-gray-800">{m.subject} <span className="text-sm text-gray-500">• Class {m.student_class}</span> </p>
                        </div>
                      </div>
                      <Button onClick={() => handleDownload(m.file_url)}>
                        <Download className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* PDF Pagination Controls */}
              {totalPdfPages > 1 && (
                <div className="mt-10 flex flex-wrap justify-center items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPdfPage(p => Math.max(1, p - 1))} disabled={pdfPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPdfPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPdfPage(i + 1)}
                      className={`h-9 w-9 rounded-lg text-sm font-bold transition-all ${pdfPage === i + 1 ? "bg-primary text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setPdfPage(p => Math.min(totalPdfPages, p + 1))} disabled={pdfPage === totalPdfPages}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* Video UI */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-6 max-w-7xl">
            <h2 className="text-3xl md:text-5xl font-black text-center mb-12">Video <span className="text-blue-700">Lectures</span> </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentVideos.map((vid) => (
                <a key={vid.id}
                  href={`https://www.youtube.com/watch?v=${vid.youtube_id}`}
                  target="_blank"
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                  <img src={`https://img.youtube.com/vi/${vid.youtube_id}/0.jpg`} alt={vid.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <p className="font-bold text-slate-800 line-clamp-2">{vid.title}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Video Pagination Controls */}
            {totalVideoPages > 1 && (
              <div className="mt-12 flex flex-wrap justify-center items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setVideoPage(p => Math.max(1, p - 1))} disabled={videoPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalVideoPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setVideoPage(i + 1)}
                    className={`h-9 w-9 rounded-lg text-sm font-bold transition-all ${videoPage === i + 1 ? "bg-primary text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <Button variant="outline" size="sm" onClick={() => setVideoPage(p => Math.min(totalVideoPages, p + 1))} disabled={videoPage === totalVideoPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </section>

      </motion.div>
    </div>
  );
}
import { motion, AnimatePresence } from "framer-motion";
import { Clock, BookOpen, IndianRupee, Loader2, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

export default function BatchCards() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchBatches() {
      try {
        const { data, error } = await supabase
          .from("Coaching_Batches")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setBatches(data);
        }
      } catch (err) {
        console.error("Error fetching batches:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBatches();
  }, []);

  if (loading) {
    return (
      <div className=" flex justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const displayedBatches = showAll ? batches : batches.slice(0, 6);

const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;
const academicSession = `${currentYear}-${nextYear.toString().slice(-2)}`;

  return (
    <section id="batches" className="relative py-56 pb-20 bg-[#f8faff] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-500 text-white text-sm font-bold mb-6 border border-blue-500 shadow-sm transition-all hover:bg-blue-600">
  {/* Live Blinking Dot */}
  <span className="relative flex h-2.5 w-2.5">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
  </span>
  
 <span className="tracking-wide uppercase">
    Admissions Open {new Date().getFullYear()}-{ (new Date().getFullYear() + 1).toString().slice(-2) }
  </span>
  
  <Sparkles className="w-4 h-4 animate-pulse" />
</div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
            Our <span className=" text-blue-600">Premium Batches</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed">
           "High-Performance Courses for Navodaya Entrance Preparation with Expert Guidance and Proven Results"
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
  <AnimatePresence mode="popLayout">
    {displayedBatches.map((b, i) => (
      <motion.div
        key={b.id}
        layout
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
        whileHover={{ 
          y: -12, 
          transition: { duration: 0.3, ease: "easeOut" } 
        }}
        transition={{ duration: 0.5, delay: i * 0.1 }}
        className="group relative bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/50 p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] hover:shadow-[0_40px_80px_-30px_rgba(59,130,246,0.25)] transition-all duration-500 overflow-hidden"
      >
        {/* Background Animated Glow (Only visible on hover) */}
        <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_50%)] from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Top Header: Badge & Icon */}
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative px-6 py-2 rounded-2xl bg-black text-white text-[12px] font-black tracking-[0.2em] md:uppercase shadow-sm">
               {b.class_name}
            </div>
          </div>
          {/* <motion.div 
            whileHover={{ rotate: 15 }}
            className="w-12 h-12 rounded-2xl bg-white shadow-inner border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:bg-primary/5 transition-all duration-300"
          >
            <BookOpen className="w-6 h-6" />
          </motion.div> */}
        </div>

        {/* Title */}
        <h3 className="relative z-10 text-xl font-black text-gray-800 mb-6 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
          <span className="text-sm font-medium">Subject - </span>{b.subjects}
        </h3>

        {/* Info Blocks */}
        <div className="relative z-10 space-y-4 mb-10">
          <div className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-white/50 border border-white shadow-sm group-hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Timing</span>
              <span className="text-sm font-bold text-gray-700">{b.start_time} - {b.end_time}</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 px-2">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Course Fee</span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="bg-primary/10 p-1 rounded-md">
                  <IndianRupee className="w-4 h-4 text-primary font-bold" />
                </div>
                <span className="text-3xl font-black text-gray-900 tracking-tighter">{b.price}</span>
                <span className="text-gray-500 text-xs font-bold ml-1">/month</span>
              </div>
            </div>
            
            {/* Visual Element: Sparkle or Small tag */}
            <div className="h-10 w-10 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center group-hover:border-primary/50 group-hover:rotate-45 transition-all duration-700">
               <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Button 
          className="relative z-10 w-full h-16 rounded-[1.5rem] bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] hover:shadow-primary/40 transition-all duration-500 group-hover:scale-[1.03] active:scale-95" 
          asChild
        >
          <a href="#contact" className="flex items-center justify-center gap-3">
            Enroll Now
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.span>
          </a>
        </Button>

        {/* Animated Border Gradient */}
        <div className="absolute inset-0 rounded-[2.5rem] p-[2px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
           <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-r from-primary via-blue-400 to-purple-500 animate-[gradient_3s_linear_infinite]" 
                style={{ backgroundSize: '200% 200%' }} />
           <div className="absolute inset-[2px] bg-white rounded-[2.4rem]" />
        </div>
      </motion.div>
    ))}
  </AnimatePresence>
</div>

        {batches.length > 6 && (
          <div className="mt-16 text-center">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setShowAll(!showAll)}
              className="h-14 rounded-2xl px-10 border-2 border-gray-200 text-gray-700 font-bold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300 shadow-sm"
            >
              {showAll ? (
                <>Show Less <ChevronUp className="ml-2 h-5 w-5" /></>
              ) : (
                <>Show All Batches <ChevronDown className="ml-2 h-5 w-5" /></>
              )}
            </Button>
          </div>
        )}

        {!loading && batches.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-medium">No active batches at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
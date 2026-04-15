import { motion } from "framer-motion";
import { User, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient"; // Path check kar lein
import { BookOpen } from "lucide-react";
export default function FacultySection() {
  const [facultyData, setFacultyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Supabase se faculty data fetch karne ka logic
  useEffect(() => {
    async function fetchFaculty() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("Coaching_Faculty")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) setFacultyData(data);
      } catch (err) {
        console.error("Faculty fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFaculty();
  }, []);

  if (loading) {
    return (
      <div className=" flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section id="faculty" className="py-24 bg-gradient-to-b from-white to-[#f0f7ff] relative overflow-hidden">
      {/* Modern Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
        <div className="absolute top-10 left-[10%] w-72 h-72 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-[10%] w-96 h-96 bg-blue-400/10 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="px-4 py-1.5 rounded-full bg-blue-500 text-white text-[10px] font-black tracking-widest uppercase mb-4 inline-block shadow-lg shadow-primary/20"
          >
            World-Class Mentors
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mt-4">
            Meet <span className="text-blue-600">Our Faculty</span>
          </h2>
          <p className="mt-6 text-gray-500 max-w-2xl mx-auto md:text-lg text-sm leading-relaxed font-medium">
           "Learn from Highly Experienced Educators Dedicated to Your Navodaya Success"
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {facultyData.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -15 }}
              className="group relative"
            >
              {/* Main Card */}
              <div className="relative bg-white rounded-[3rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 group-hover:border-blue-400 transition-all duration-500 z-10 overflow-hidden">

                {/* Image Wrapper */}
                <div className="relative aspect-[1/1.1] rounded-[2.5rem] overflow-hidden bg-gray-100">
                  {f.image_url ? (
                    <img
                      src={f.image_url}
                      alt={f.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <User className="h-20 w-20 text-gray-400" />
                    </div>
                  )}

                  {/* Glassmorphism Experience Tag */}
                  <div className="absolute top-4 left-4">
                    <div className="px-4 py-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold shadow-xl">
                      {f.experience_years}Y+ EXPERIENCE
                    </div>
                  </div>

                  {/* Social Media Overlay (Modern Touch) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-400 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-8">
                    <div className="flex gap-3 translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="p-3 rounded-full bg-white text-blue-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer shadow-lg">
                        <BookOpen className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Area */}
                <div className="pt-6 pb-4 px-4 text-center">
                  <h3 className="text-xl font-black text-gray-800 tracking-tight mb-1 group-hover:text-blue-600 transition-colors">
                    {f.name}
                  </h3>
                  <p className="text-blue-600 text-xs font-black uppercase tracking-[0.15em] opacity-80">
                    {f.subject}
                  </p>

                  {/* Decorative line */}
                  <div className="w-10 h-1 bg-gray-100 mx-auto mt-4 rounded-full group-hover:w-20 group-hover:bg-blue-600 transition-all duration-500" />
                </div>
              </div>

              {/* Background Shadow Glow (Decorative) */}
              <div className="absolute -inset-2 bg-gradient-to-r from-primary to-blue-500 rounded-[3.5rem] opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 -z-10" />
            </motion.div>
          ))}
        </div>

        {!loading && facultyData.length === 0 && (
          <p className="text-center text-muted-foreground mt-10">No faculty members added yet.</p>
        )}
      </div>
    </section>
  );
}
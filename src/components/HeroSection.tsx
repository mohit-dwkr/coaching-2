import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Users, Trophy, Clock } from "lucide-react";
import { supabase } from "@/supabaseClient";
import { useQuery } from "@tanstack/react-query";

const stats = [
  { icon: Users, value: "4000+", label: "Students Taught" },
  { icon: Trophy, value: "400+", label: "District Selections" },
  { icon: Clock, value: "40+", label: "Years of Excellence (Since-1985)" },
];

export default function HeroSection() {

  // ✅ Fetch + Cache (1 hour)
  const { data } = useQuery({
    queryKey: ["hero"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Coaching-2_Hero")
        .select("heading, subheading, highlight_word, image_url")
        .limit(1);

      if (error) throw error;
      return data?.[0] || null;
    },
    staleTime: 1000 * 60 * 60,   // 1 hour
    gcTime: 1000 * 60 * 60 * 2 
  });

  const heroData = data;

  const renderHeading = () => {
    const rawHeading = heroData?.heading || "Where Excellence Meets Ambition";
    const highlightWord = heroData?.highlight_word || ""; 
    const words = rawHeading.split(/\s+/).filter(Boolean);

    return words.map((word, index) => {
      const isHighlighted =
        word.toLowerCase().replace(/[^\w]/g, '') ===
        highlightWord.toLowerCase().replace(/[^\w]/g, '');

      return (
        <span key={index}>
          <span className={isHighlighted ? "text-blue-600" : ""}>
            {word}
          </span>
          {index !== words.length - 1 && " "}
          {index === 1 && <br className="hidden md:block" />}
        </span>
      );
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="home" className="relative w-full h-screen min-h-[700px] flex items-center overflow-visible">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={(heroData?.image_url || "/hero.png") + "?width=1200&quality=70"}
          alt="Classroom Background"
          loading="eager"
          className="w-full h-full object-cover object-[85%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center md:items-start md:text-left">
        <motion.div
          key="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight text-white drop-shadow-md">
              {renderHeading()}
            </h1>

            <p className="mt-5 text-sm md:text-lg text-gray-100 max-w-xl mx-auto md:mx-0 leading-relaxed drop-shadow-sm">
              {heroData?.subheading || "Empowering K-12 students with expert coaching..."}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full md:w-auto justify-center md:justify-start">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg w-full md:w-auto py-6" asChild>
                <a href="#contact">Apply for Admission</a>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/85 hover:text-black w-full md:w-auto py-6" asChild>
                <a href="#batches">Explore Batches</a>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="absolute bottom-0 left-0 w-full translate-y-1/2 z-20">
        <div className="container mx-auto px-0 md:px-4">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible gap-4 pb-10 md:pb-0 px-4 md:px-0 no-scrollbar"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex-shrink-0 w-[85vw] md:w-full flex items-center gap-4 bg-white rounded-2xl p-5 md:p-6 shadow-2xl border border-gray-100 
                           transition-all duration-300 ease-in-out cursor-default
                           md:hover:-translate-y-3 md:hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] group"
              >
                <div className="flex-shrink-0 p-3 rounded-xl bg-blue-600/10 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <s.icon className="h-6 w-6 md:h-7 md:w-7" />
                </div>
                <div className="text-left">
                  <div className="text-2xl md:text-3xl font-black text-gray-900 leading-none">
                    {s.value}
                  </div>
                  <div className="text-[10px] md:text-xs text-gray-500 font-bold uppercase mt-1 tracking-widest">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
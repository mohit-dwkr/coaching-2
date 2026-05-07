import { motion } from "framer-motion";
import { Award, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabaseClient";
import { useQuery } from "@tanstack/react-query";

type TopperType = {
  id: string;
  name: string;
  image_url: string;
  percentage: number;
  student_class: string;
  batch_year: string;
};

export default function ToppersSection() {
  const [page, setPage] = useState(0);
  const [toppers, setToppers] = useState<TopperType[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // ✅ Scroll detect (only once)
  useEffect(() => {
    const section = document.getElementById("results");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(section);

   return () => {
  if (section) observer.unobserve(section);
};
  }, []);

  // ✅ Fetch + cache
  const {
    data = [],
    isError,
  } = useQuery<TopperType[]>({
    queryKey: ["toppers", page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Coaching-2_Toppers")
        .select("id, name, image_url, percentage, student_class, batch_year")
        .order("created_at", { ascending: false })
        .range(page * 8, page * 8 + 7);

      if (error) throw error;
      return data ?? [];
    },
    enabled: isVisible,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
    placeholderData: (prev) => prev,
  });

  // ✅ Error UI
  if (isError) {
    return <p className="text-center py-10 text-red-500">Error loading toppers</p>;
  }

  // ✅ Append safely (no duplicates)
  useEffect(() => {
    if (data.length > 0) {
      setToppers((prev) => {
        const ids = new Set(prev.map((item) => item.id));
        const newItems = data.filter((item) => !ids.has(item.id));
        return [...prev, ...newItems];
      });
    }
  }, [data]);

  // ✅ Reset fix
  useEffect(() => {
    if (page === 0 && data.length > 0) {
      setToppers(data);
    }
  }, [page, data]);

  const hasMore = data.length === 8;
const displayedToppers = toppers;
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleShowLess = () => {
    setPage(0);
    document
      .getElementById("results")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="results" className="py-36 bg-white relative overflow-hidden">

      <div className="container mx-auto px-4 relative z-10">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {displayedToppers.map((t, i) => (
            <motion.div key={t.id} className="group relative">

              <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                {t.image_url ? (
                  <img
                    src={t.image_url + "?width=400&quality=70"}
                    alt={t.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Award className="h-16 w-16 text-yellow-500/30" />
                )}
              </div>

              <div className="p-3 text-center">
                <h3>{t.name}</h3>
                <p>Class {t.student_class}</p>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Buttons */}
        {toppers.length > 8 && (
          <div className="mt-14 text-center">
            {hasMore ? (
              <Button onClick={handleLoadMore}>
                Load More <ChevronDown />
              </Button>
            ) : (
              <Button onClick={handleShowLess}>
                Show Less <ChevronUp />
              </Button>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
import { motion } from "framer-motion";
import { ImageIcon, ChevronDown, ChevronUp, Images } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabaseClient";
import { useQuery } from "@tanstack/react-query";

type GalleryType = {
  id: string;
  image_url: string;
  caption: string;
};

export default function GallerySection() {
  const [page, setPage] = useState(0);
  const [gallery, setGallery] = useState<GalleryType[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // ✅ Scroll detect (only once)
  useEffect(() => {
    const section = document.getElementById("gallery");
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
      observer.unobserve(section);
    };
  }, []);

  // ✅ Fetch + cache
  const {
    data = [],
    isError,
  } = useQuery<GalleryType[]>({
    queryKey: ["gallery", page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Coaching-2_Gallery")
        .select("id, image_url, caption")
        .order("created_at", { ascending: false })
        .range(page * 6, page * 6 + 5);

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
    return (
      <p className="text-center py-10 text-red-500">
        Error loading gallery
      </p>
    );
  }

  // ✅ Append safely (no duplicates)
  useEffect(() => {
    if (data.length > 0) {
      setGallery((prev) => {
        const ids = new Set(prev.map((item) => item.id));
        const newItems = data.filter((item) => !ids.has(item.id));
        return [...prev, ...newItems];
      });
    }
  }, [data]);

  // ✅ Reset fix
  useEffect(() => {
    if (page === 0 && data.length > 0) {
      setGallery(data);
    }
  }, [page, data]);

  const hasMore = data.length === 6;
const displayedImages = gallery;
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleShowLess = () => {
    setPage(0);
    document
      .getElementById("gallery")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="gallery" className="py-10 bg-white relative overflow-hidden">

      <div className="container mx-auto px-4 relative z-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {gallery.length > 0 ? (
            displayedImages.map((img, i) => (
              <motion.div key={img.id} className="group relative aspect-[4/3] overflow-hidden">

                <img
                  src={img.image_url + "?width=400&quality=70"}
                  alt={img.caption}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />

              </motion.div>
            ))
          ) : (
            <p>No photos available</p>
          )}
        </div>

        {/* Buttons */}
        {gallery.length > 6 && (
          <div className="mt-10 flex justify-center">
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
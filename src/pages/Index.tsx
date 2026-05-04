import { supabase } from "@/supabaseClient";
import { useQuery } from "@tanstack/react-query"; // React Query import kiya
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BatchCards from "@/components/BatchCards";
import FacultySection from "@/components/FacultySection";
import ToppersSection from "@/components/ToppersSection";
import GallerySection from "@/components/GallerySection";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Loader2 } from "lucide-react";

// 1. Fetcher function: Isme wahi logic hai jo aapke useEffect mein tha
const fetchAllAcademyData = async () => {
  const [heroRes, batchRes, facultyRes, topperRes, galleryRes] = await Promise.all([
    supabase.from("Coaching-2_Hero").select("*").limit(1),
    supabase.from("Coaching-2_Batches").select("*").order("created_at", { ascending: false }),
    supabase.from("Coaching-2_Faculty").select("*").order("created_at", { ascending: false }),
    supabase.from("Coaching-2_Toppers").select("*").order("created_at", { ascending: false }),
    supabase.from("Coaching-2_Gallery").select("*").order("created_at", { ascending: false })
  ]);

  return {
    hero: heroRes.data || [],
    batches: batchRes.data || [],
    faculty: facultyRes.data || [],
    toppers: topperRes.data || [],
    gallery: galleryRes.data || []
  };
};

const Index = () => {
  // 2. useQuery hook ka use: Ye automatic caching handle karega
  const { data, isLoading } = useQuery({
    queryKey: ["academyHomeData"], // Cache ki unique ID
    queryFn: fetchAllAcademyData,
    staleTime: 1000 * 60 * 30, // 30 minutes tak cache "fresh" rahega
    gcTime: 1000 * 60 * 60,    // 1 ghante tak memory mein rahega
    refetchOnWindowFocus: false, // Baar-baar tab switch karne par fetch nahi karega
  });

  // 3. Loading Screen
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center gap-4 bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-gray-500 font-bold animate-pulse tracking-widest">LOADING TOPPERS ACADEMY...</p>
      </div>
    );
  }

  // 4. Render UI
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* data object ab directly useQuery se aa raha hai */}
      <HeroSection data={data?.hero[0]} />
      <BatchCards data={data?.batches} />
      <FacultySection data={data?.faculty} />
      <ToppersSection data={data?.toppers} />
      <GallerySection data={data?.gallery} />
      <Testimonials />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
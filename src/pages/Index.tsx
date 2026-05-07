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

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <HeroSection />
      <BatchCards />
      <FacultySection />
      <ToppersSection />
      <GallerySection />

      <Testimonials />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
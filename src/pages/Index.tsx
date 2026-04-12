import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BatchCards from "@/components/BatchCards";
import FacultySection from "@/components/FacultySection";
import ToppersSection from "@/components/ToppersSection";
import GallerySection from "@/components/GallerySection";
// import StudyMaterialSection from "@/components/StudyMaterialSection";
import ContactSection from "@/components/ContactSection";
import Testimonials from "@/components/Testimonials";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";
import HomeScrollingSection from "../components/HomeScrollingSection";

const Index = () => (
  <>
    <Navbar />
    <HeroSection />
    <HomeScrollingSection/>
    <BatchCards />
    <FacultySection />
    <ToppersSection />
    <GallerySection />
    {/* <StudyMaterialSection /> */}
    <Testimonials />
    <ContactSection />
    <Footer />
    <WhatsAppButton />
  </>
);

export default Index;

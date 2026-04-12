import React from 'react';
import { Quote, Star, ArrowRight, ExternalLink } from 'lucide-react';

interface Testimonial {
  name: string;
  rank: string;
  review: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Vaibhav Sj",
    rank: "7 months ago",
    review: "Best coaching in Datia… my child has selected in sainik school through this institution… thanku sir.",
    image: "V"
  },
  {
    name: "Nakul Yadav",
    rank: "1 year ago",
    review: "Harikamlash Academy provided the best faculty those helps to clear the jnv exam they have proper notes and guidance my 2 daughter and 1son also clear the jnv exam.",
    image: ""
  },
  {
    name: "Mithlesh Bhagat",
    rank: "2 years ago",
    review: "Best Coaching Institute by Bhanu Srivastava Sir for Navodaya Vidyalaya and Sainik School Entrance Exam.  With his guidance and hard work many students have achieved there goals.",
    image: ""
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50/30 overflow-hidden">
      <div className="container mx-auto px-6">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-4 py-1.5 mb-4 text-[11px] font-black tracking-[0.2em] text-white uppercase bg-yellow-400 rounded-full">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 ">
            What <span className="text-blue-500 italic font-serif">Parents</span> Say
          </h2>
         
        </div>

        {/* Testimonials Cards Wrapper */}

 <div className="flex items-center justify-center mb-9 gap-2 bg-white shadow-sm border border-slate-100 w-fit px-4 py-2 rounded-full mx-auto">
            <img
              src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" className="w-4 h-4" alt="Google" />
            <span className="text-xs font-bold text-slate-600 tracking-tight">5/5 Ratings on Google</span>
          </div>

       <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto pb-5 no-scrollbar snap-x snap-mandatory pt px-4">
  {testimonials.map((t, i) => (
    <div
      key={i}
      className="min-w-[80vw] md:min-w-0 max-w-[380px] mx-auto snap-center group relative pt-10"
    >
      {/* Profile Image - Chhota aur Compact */}
<div className="absolute top-0 left-1/2 -translate-x-1/2 z-30">
  <div className="w-20 h-20 rounded-full border-[5px] border-white bg-slate-100 shadow-lg group-hover:shadow-primary/20 group-hover:scale-105 transition-all duration-500 overflow-hidden">
    
    {t.image && t.image.startsWith("http") ? (
      <img 
        src={t.image} 
        alt={t.name} 
        className="w-full h-full object-cover" 
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-slate-700">
        {t.name?.charAt(0).toUpperCase()}
      </div>
    )}

  
        </div>
        {/* Floating Quote */}
        <div className="absolute -bottom-1 -right-0 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center shadow-md scale-90 group-hover:scale-110 transition-transform">
           <Quote className="w-3.5 h-3.5 fill-current rotate-180" />
        </div>
      </div>

      {/* Main Card Content - Chhota Padding aur New Shadow */}
      <div className="bg-white border border-slate-100/80 rounded-[2.5rem] p-6 md:p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.15)] group-hover:-translate-y-2 transition-all duration-500 h-full flex flex-col pt-14 relative overflow-hidden">
        
        {/* Background Subtle Gradient Effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Stars - Chhote Size mein */}
        <div className="flex justify-center gap-0.5 mb-4 mt-3">
          {[...Array(5)].map((_, starIdx) => (
            <Star key={starIdx} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        {/* Review Text - Font size chhota kiya gaya hai */}
        <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed mb-6 flex-grow line-clamp-4">
          "{t.review}"
        </p>

        {/* User Info - Compact */}
        <div className="mt-auto border-t border-slate-50 pt-5">
          <h4 className="font-bold text-slate-900 text-lg tracking-tight mb-0.5 uppercase">
            {t.name}
          </h4>
          <p className="text-[8px] text-primary font-extrabold uppercase tracking-[0.15em]">
            {t.rank}
          </p>
        </div>

        {/* Google Logo - Subtle aur Corner mein */}
        <img
          src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png"
          className="absolute top-5 right-6 w-3.5 h-3.5 group-hover:grayscale-0 transition-all  group-hover:opacity-100"
          alt="G"
        />
      </div>
    </div>
  ))}
</div>

        {/* Footer Buttons */}
        <div className="mt- flex flex-col items-center gap-8">
          {/* Mobile swipe indicator */}
          <div className="flex md:hidden items-center gap-2 text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-widest animate-pulse">Swipe to read more</span>
            <ArrowRight className="w-4 h-4" />
          </div>

          <button
            className="flex items-center gap-4 bg-blue-600 text-white px-4 py-2 mt-2
             rounded-full font-bold hover:bg-blue-700 transition-all group shadow-2xl shadow-slate-200 active:scale-95"
            onClick={() => window.open('https://www.google.com/maps/place/Navodaya+coaching/@25.6600345,78.4500277,17z/data=!3m1!4b1!4m6!3m5!1s0x397713043d171677:0xf0b3679d7c749e62!8m2!3d25.6600345!4d78.4526026!16s%2Fg%2F11s460h43_?entry=ttu&g_ep=EgoyMDI2MDMyMi4wIKXMDSoASAFQAw%3D%3D', '_blank')}
          >
            <div className="bg-white p-1 rounded-full">
              <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" className="w-5 h-5" alt="G" />
            </div>
            <span className="text-[12px]">See All Reviews On Google</span>
            <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </button>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default Testimonials;
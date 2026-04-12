import React from 'react';
// Banner assets (Aap apne banners ka path yahan daal dein)
import banner1 from '../assets/banner1.jpeg'; 
import banner2 from '../assets/banner2.jpeg';
import banner3 from '../assets/banner3.jpeg';
import banner4 from '../assets/banner4.jpeg';
import banner5 from '../assets/banner5.jpeg';
import banner6 from '../assets/banner6.jpeg';
import banner7 from '../assets/banner7.jpeg';

// 1. Students ki jagah Banners ki list
const HomeBannerList = [
  { bannerImg: banner1, title: "Admission Open" },
  { bannerImg: banner2, title: "Navodaya Batch" },
  { bannerImg: banner3, title: "Sainik School Prep" },
  { bannerImg: banner4, title: "Expert Faculty" },
  { bannerImg: banner5, title: "Expert Faculty" },
  { bannerImg: banner6, title: "Expert Faculty" },
  { bannerImg: banner7, title: "Expert Faculty" },
];

const HomeScrollingSection = () => {
  const homeDuplicatedData = [...HomeBannerList, ...HomeBannerList];

  return (
    <section className="py-40 bg-white overflow-hidden home-banner-slider">
      {/* Agar aapko heading chahiye toh rakhein, warna delete kar dein */}
      <div className="container mx-auto px-4 mb-8 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
           Our <span className='text-blue-600 font-black'>Highlights</span> 
        </h2>

        <p className='py-4 pb-0 text-sm'>"Posters, banners, and academy highlights."</p>
      </div>

      <div className="relative flex">
        {/* Banner speed thodi slow rakhi hai taaki log padh sakein */}
        <div className="flex animate-scroll whitespace-nowrap gap-6 py-4 hover:[animation-play-state:paused]">
          {homeDuplicatedData.map((banner, idx) => (
            <div 
              key={`home-banner-${idx}`} 
              // Width badha di hai (600px) taaki banner jaisa dikhe
              className="w-[350px] md:w-[600px] aspect-[16/9] bg-gray-100 rounded-3xl shadow-xl overflow-hidden flex-shrink-0 transition-all duration-500 hover:scale-[1.02]"
            >
              {/* Full Image Banner */}
              <img 
                src={banner.bannerImg} 
                alt={banner.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeScrollingSection;
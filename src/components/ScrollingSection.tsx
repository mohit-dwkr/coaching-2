import React from 'react';
import student1 from '../assets/student1.jpeg';
import student2 from '../assets/student2.jpeg';
import student3 from '../assets/student3.jpeg';
import student4 from '../assets/student4.jpeg';
import student5 from '../assets/student5.jpeg';
import student6 from '../assets/student6.jpeg';
import student7 from '../assets/student7.jpeg';
import student8 from '../assets/student8.jpeg';

// Yahan apni images aur details add karein
const courses = [
  { img: student1, name: "gopal Parihar ", desc: "Consistency and hard work led to a brilliant 99.8 percentile." },
  { img: student2, name: "Naina Prajapati", desc: "Mastered concepts with daily practice and expert guidance." },
  { img: student3, name: "Krishna Sharma", desc: "Balanced board exams and entrance prep like a pro." },
  { img: student4, name: "Yuvraj Yadav", desc: "Strong foundation helped in cracking complex problems easily." },
  { img: student5, name: "Richa Gautam", desc: "Smart revision strategies for the final push before exams." },
  { img: student6, name: "Abhayraj gurjar", desc: "Smart revision strategies for the final push before exams." },
  { img: student7, name: "Devansi gupta", desc: "Smart revision strategies for the final push before exams." },
  { img: student8, name: "Zara Khan ", desc: "Smart revision strategies for the final push before exams." },
];

const ScrollingSection = () => {
  // Loop ko seamless banane ke liye hum list ko double kar dete hain
  const duplicatedCourses = [...courses, ...courses];

  return (
    <section className="py-52 bg-white overflow-hidden pb-0">
      <div className="container mx-auto px-4 mb-4 text-center shadow-sm">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
        2026   <span className='text-blue-600'>Toppers</span> 
        </h2>
        <div className="h-1.5 w-20 bg-blue-600 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Main Slider Container */}
      <div className="relative flex">
        {/* Scrolling Wrapper */}
        <div className="flex animate-scroll whitespace-nowrap gap-8 py-4 hover:[animation-play-state:paused]">
          {duplicatedCourses.map((item, index) => (
            <div 
              key={index} 
              className="w-[320px] md:w-[400px] bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden flex-shrink-0 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image Section - Height Increased for Bigger Look */}
              <div className="h-64 md:h-96 w-full overflow-hidden">
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                />
              </div>

              {/* Detail Section */}
              <div className="p-4 justify-center justify-items-center">
                {/* Topper Name - Made Larger */}
                <h3 className="text-xl font-black text-gray-800 mb-2 whitespace-normal leading-tight " >
                  {item.name}
                </h3>
                {/* Description - Made Smaller and Subtle */}
                {/* <p className="text-gray-500 text-sm font-medium whitespace-normal line-clamp-2 leading-relaxed">
                  {item.desc}
                </p> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScrollingSection;
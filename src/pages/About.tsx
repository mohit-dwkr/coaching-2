import React, { useState } from 'react';
import { Target, Users, Award, BookOpen, Quote, Languages } from 'lucide-react';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import ScrollingSection from '@/components/ScrollingSection';
import teacher from '../assets/teacher.jpeg';
import FacultySection from '@/components/FacultySection';

const About = () => {
  const [language, setLanguage] = useState('en');

  const t = {
    en: {
      heroTag: "About Harikamlansh Academy",
      heroTitle: "Empowering Students For,",
      heroSpan: "Navodaya & Sainik School",
      heroDesc: "Harikamlansh Academy is more than a coaching institute. It's a platform where concepts meet clarity and dreams transform into reality through disciplined guidance.",
      journeyTitle: "Our Journey Since 1985",
      journeyP1: "Founded in 1985, Harikamlansh Academy (formerly known as Navodaya Entrance Exam Coaching) has built a 40-year legacy of excellence in competitive school admissions. Our mission goes beyond just clearing exams; we focus on concept-based learning and self-study mastery to make students bold and proficient in Math, Reasoning, and Language. Our results speak for our dedication",
      journeyP2: "achieving an incredible milestone where 20 out of 80 district selections came from our institute alone, out of 5,000 total applicants. Today, we bring this unmatched expertise and proven success ratio to students across India through our specialized Online Mode, providing expert guidance for Navodaya, Sainik School, Shramodaya, and Rashtriya Military School entrance exams to help every aspirant secure their dream seat.",
      awardTitle: "Guided by President Awarded Teacher",
      awardName: "Shri Mahesh Shrivastava Acharya",
      awardExp: "40+ Years of unmatched teaching expertise.",
      stats: [
        { label: "Students Trained", value: "4,000+" },
        { label: "Success Rate", value: "100%" },
        { label: "Expert Faculty", value: "3+" },
        { label: "Years Excellence", value: "40+" },
      ],
      directorName: "Dr. Bhanu Prakash",
      directorTitle: "Founder & Managing Director",
      directorMsg: "Message From Director",
      directorQuote: '"At Harikamlansh Academy, we don\'t just prepare you for exams; we prepare you for life. We focus on building a foundation so strong that no competition feels too difficult."',
      // scrollingHeading: "Our Achievement Gallery",
      // facultyHeading: "Meet Our Expert Faculty",
      // facultySub: "Learn from Highly Experienced Educators Dedicated to Your Navodaya Success",
      coursesTitle: "Our Offered Courses",
      courseList: [
        "Navodaya Entrance Exam",
        "Sainik School Entrance Exam",
        "Shramodaya School Entrance Exam",
        "Rashtriya Military School Entrance"
      ]
    },
    hi: {
      heroTag: "हरिकमलंश एकेडमी के बारे में",
      heroTitle: "छात्रों को सशक्त बनाना,",
      heroSpan: "नवोदय और सैनिक स्कूल के लिए",
      heroDesc: "हरिकमलंश एकेडमी सिर्फ एक कोचिंग संस्थान नहीं है। यह एक ऐसा मंच है जहां अवधारणाएं स्पष्टता से मिलती हैं और अनुशासित मार्गदर्शन के माध्यम से सपने हकीकत में बदलते हैं।",
      journeyTitle: "1985 से हमारी यात्रा",
      journeyP1: "1985 में स्थापित, हरिकमलंश एकेडमी (जिसे पहले नवोदय प्रवेश परीक्षा कोचिंग के रूप में जाना जाता था) ने प्रतिस्पर्धी स्कूल प्रवेश में उत्कृष्टता की 40 साल की विरासत बनाई है। हमारा मिशन केवल परीक्षा पास करना नहीं है; हम छात्रों को गणित, तर्क और भाषा में निडर और कुशल बनाने के लिए अवधारणा-आधारित शिक्षा और स्व-अध्ययन पर ध्यान केंद्रित करते हैं।",
      journeyP2: "हमने एक अविश्वसनीय मील का पत्थर हासिल किया है जहां जिले के कुल 80 चयनों में से 20 हमारे संस्थान से थे। आज, हम अपने विशेष ऑनलाइन मोड के माध्यम से पूरे भारत में नवोदय, सैनिक स्कूल, श्रमोदय और राष्ट्रीय सैन्य स्कूल के लिए विशेषज्ञ मार्गदर्शन प्रदान कर रहे हैं ताकि हर आकांक्षी अपनी सपनों की सीट सुरक्षित कर सके।",
      awardTitle: "राष्ट्रपति पुरस्कृत शिक्षक द्वारा मार्गदर्शित",
      awardName: "श्री महेश श्रीवास्तव आचार्य",
      awardExp: "40+ वर्षों का बेजोड़ शिक्षण अनुभव।",
      stats: [
        { label: "प्रशिक्षित छात्र", value: "10,000+" },
        { label: "सफलता दर", value: "95%" },
        { label: "विशेषज्ञ संकाय", value: "50+" },
        { label: "उत्कृष्टता के वर्ष", value: "14+" },
      ],
      directorName: "डॉ. भानु प्रकाश",
      directorTitle: "संस्थापक और प्रबंध निदेशक",
      directorMsg: "निर्देशक का संदेश",
      directorQuote: '"हरिकमलंश एकेडमी में, हम आपको केवल परीक्षाओं के लिए तैयार नहीं करते हैं; हम आपको जीवन के लिए तैयार करते हैं। हमारा ध्यान एक ऐसी नींव बनाने पर है जो इतनी मजबूत हो कि कोई भी प्रतियोगिता कठिन न लगे।"',
      // scrollingHeading: "हमारी उपलब्धियों की झलक",
      facultyHeading: "हमारे विशेषज्ञ शिक्षकों से मिलें",
      facultySub: "आपकी नवोदय सफलता के लिए समर्पित अत्यधिक अनुभवी शिक्षकों से सीखें",
      coursesTitle: "हमारे द्वारा प्रदान किए जाने वाले पाठ्यक्रम",
      courseList: [
        "नवोदय प्रवेश परीक्षा",
        "सैनिक स्कूल प्रवेश परीक्षा",
        "श्रमोदय स्कूल प्रवेश परीक्षा",
        "राष्ट्रीय सैन्य स्कूल प्रवेश"
      ]
    }
  };

  const content = t[language];
  const statsIcons = [<Users />, <Target />, <Award />, <BookOpen />];

  return (
    <>
      <div className="fixed top-20 right-4 -z-50">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full font-medium shadow-2xl hover:bg-blue-800 transition-all border-2 border-white"
        >
          <Languages size={18} />
          {language === 'en' ? 'हिन्दी' : 'English'}
        </button>
      </div>

      <div className="min-h-screen bg-white mt-32 pb-0 overflow-x-hidden">
        {/* 1. Hero Section */}
        <section className="container mx-auto px-4 mb-24 relative text-center max-w-4xl">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-white uppercase bg-blue-600 rounded-full">
            {content.heroTag}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-[1.2]">
            {content.heroTitle} <br />
            <span className="text-yellow-400 md:text-5xl">
              {content.heroSpan}
            </span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-10">{content.heroDesc}</p>
        </section>

        {/* 2. Journey Section */}
        <section className="py-24 bg-blue-50 overflow-hidden mb-14 text-center">
          <div className="container mx-auto px-6 max-w-7xl">
            <h2 className="text-4xl md:text-4xl font-black text-gray-900">{content.journeyTitle}</h2>
            <div className="h-2 w-32 bg-blue-600 mx-auto mt-6 rounded-full mb-16"></div>
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-3/5 space-y-8 text-left">
                <div className="space-y-6 text-gray-700 text-lg md:text-xl font-medium">
                  <p>{content.journeyP1}</p>
                  <p>{content.journeyP2}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-blue-100 flex gap-5">
                  <div className="bg-blue-600 p-3 rounded-2xl text-white text-3xl shrink-0">🎖️</div>
                  <div>
                    <h4 className="font-extrabold text-base md:text-xl text-gray-900">{content.awardTitle}</h4>
                    <p className="text-blue-600 font-bold uppercase text-xs tracking-wide">{content.awardName}</p>
                    <p className="text-gray-500 text-xs italic">{content.awardExp}</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-2/5 flex justify-center">
                <div className="w-[280px] h-[280px] md:w-[350px] md:h-[350px] rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl">
                  <img src={teacher} alt="Teacher" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Stats */}
        <section className="container mx-auto px-4 mb-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {content.stats.map((stat, i) => (
              <div key={i} className="p-6 md:p-8 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm text-center md:text-left">
                <h3 className="text-2xl md:text-4xl font-black text-slate-900">{stat.value}</h3>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Director Section */}
        <section className="container mx-auto px-4 mb-0 h-auto">
          <div className="bg-blue-950 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden max-w-7xl  mx-auto text-white">
            <div className="grid md:grid-cols-5 gap-8 items-center relative z-10">
              <div className="md:col-span-2 mx-auto">
                <img src="/Director.jpeg" alt="Director" className="w-full max-w-[300px] rounded-2xl shadow-xl aspect-[4/5] object-cover border-white" />
              </div>
              <div className="md:col-span-3 text-center md:text-left">
                <div className="border-l-4 border-white pl-6 mb-8 hidden md:block">
                  <h4 className="text-4xl font-extrabold">{content.directorName}</h4>
                  <p className="text-white font-bold tracking-widest uppercase text-xs mt-2">{content.directorTitle}</p>
                </div>
                <div className="md:hidden mb-6">
                   <h4 className="text-2xl font-extrabold">{content.directorName}</h4>
                   <p className="text-white font-bold uppercase text-[10px]">{content.directorTitle}</p>
                </div>
                <h2 className="text-xl md:text-2xl font-black mb-2 text-white">{content.directorMsg}</h2>
                <p className="text-base md:text-xl text-slate-300 italic leading-relaxed">{content.directorQuote}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Headings For External Sections */}
        <div className="text-center py-10">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">{content.scrollingHeading}</h2>
            <ScrollingSection lang={language} />
        </div>

        <div className="text-center py-10">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">{content.facultyHeading}</h2>
            <p className="text-slate-500 max-w-2xl mx-auto px-4">{content.facultySub}</p>
            <FacultySection lang={language} />
        </div>

        {/* 5. Courses Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-black text-slate-900">
                {content.coursesTitle.split(' ')[0]} <span className='text-blue-600'>{content.coursesTitle.split(' ').slice(1).join(' ')}</span>
              </h2>
              <hr className="mt-4 border-t-2 border-yellow-400 opacity-100" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.courseList.map((course, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <span className="text-lg font-bold text-slate-700">{course}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Toppers Section (Hindi Always) */}
        <section className="py-20 bg-white text-center">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900">चयनित विद्यार्थियों की सूची</h2>
            <p className="text-slate-500 mt-2 font-medium mb-12">हमारे गौरवशाली छात्र जिन्होंने सफलता प्राप्त की</p>
            <div className="bg-slate-50 rounded-[2rem] border p-6 md:p-8 mb-10">
                <div className="space-y-4">
                  {[
                    { name: "पूजा राजपूत", detail: "d/o जसवंत सिंह राजपूत, मरसेनी", year: "2015-16" },
                    { name: "कुणाल राजपूत", detail: "d/o जसवंत सिंह राजपूत, मरसेनी", year: "2015-16" },
                    { name: "नैंसी यादव", detail: "d/o पवन यादव, दतिया", year: "2017-18" },
                    { name: "आरती राजपूत", detail: "d/o जसवंत सिंह, दतिया", year: "2017-18" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-white rounded-xl border text-left">
                      <div><p className="font-bold text-slate-900 text-lg">{item.name}</p><p className="text-sm text-slate-500">{item.detail}</p></div>
                      <span className="bg-yellow-100 text-yellow-500 text-xs font-bold px-3 py-1 rounded-full">{item.year}</span>
                    </div>
                  ))}
                </div>
            </div>
            <button onClick={() => window.location.href = '/studentlist'} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-lg">
              पूरी सूची देखें (See More) →
            </button>
          </div>
        </section>

        <Testimonials />
        <Footer />
      </div>
    </>
  );
};

export default About;
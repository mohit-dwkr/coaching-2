import React from 'react';

const StudentList = () => {
  const list2015 = [
    "1. पूजा राजपूत - d/o जसवंत सिंह राजपूत, मरसेनी",
    "2. कुणाल राजपूत - d/o जसवंत सिंह राजपूत, मरसेनी",
    "3. जीतेंद्र दांगी - d/o अरविन्द दांगी, इमलिया",
    "4. राजरतन गौतम - s/o भीमशरण गौतम, रावरी",
    "5. नवजीत सिंह - d/o उत्तमचन्द्र सिंह, महावीर वाटिका",
    "6. हिमांशी यादव - s/o ठाकुर यादव, पट्ठापुरा",
    "7. दीप्ति दुबे - s/o संतोष दुबे, पटेल नगर",
    "8. प्रिंसी यादव - s/o पवन यादव, भांडेरी फाटक",
    "9. तनुज भारती - s/o कमलेश भारती, मुरेरा",
    "10. संजय जाटव - s/o मंशा राम जाटव, राजघाट तिराहा",
    "11. राजीव सेन - s/o रामजी सेन, उपरायं",
    "12. सौम्या पुरोहित - d/o राकेश पुरोहित, बड़ौनी",
    "13. नयनदीप गौतम - s/o चंदन गौतम, लाला का ताल",
    "14. साहिल गौतम - s/o प्रताप गौतम, खल्कापुरा"
  ];

  const list2017 = [
    "1. नैंसी यादव - d/o पवन यादव, दतिया",
    "2. आरती राजपूत - d/o जसवंत सिंह, दतिया",
    "3. सेजल दांगी - d/o कमल दांगी, दतिया",
    "4. राधिका गौतम - d/o गोविंद गौतम, गुरुकुल तिराहा",
    "5. अंशिका गौतम - d/o भीमसेन गौतम, रावरी",
    "6. नैंसी गौतम - d/o राजेंद्र गौतम, रावरी",
    "7. समीक्षा राजा - d/o शंकर सिंह परमार, उपरायं",
    "8. कनक सोनकिया - d/o आदित्य सोनकिया, राजघाट",
    "9. आदित्यराज - s/o साहब सिंह यादव, भागौर",
    "10. प्रताप सिंह - s/o प्रेमनारायण सिंह राजपूत, दतिया",
    "11. अखिल अहिरवार - s/o प्रेमनारायण अहिरवार, दतिया",
    "12. प्रतीक माधव - s/o प्रवीण सिंह, दतिया",
    "13. अग्रिका नायक - d/o दिनेश नायक, पवैया का बाग",
    "14. अंजलि वंशकार - d/o दिनेश वंशकार, सेरसा",
    "15. कृष्णा कमरिया - s/o रामस्वरूप यादव, दतिया",
    "16. प्रिंस प्रजापति - s/o मंशाराम प्रजापति, भांडेरी फाटक",
    "17. मुस्कान अहिरवार - d/o विनोद अहिरवार, दतिया",
    "18. मोनेश विश्वकर्मा - s/o राजेश विश्वकर्मा, दतिया"
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-black text-center text-slate-900 mb-16 underline decoration-yellow-400 underline-offset-8">चयनित विद्यार्थियों की गौरवशाली सूची</h1>

        {/* 2017-18 List */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold bg-yellow-400 text-white px-6 py-3 rounded-t-2xl inline-block">वर्ष 2017 – 18 में चयनित विद्यार्थी</h2>
          <div className="bg-white border-2 border-yellow-400 p-6 rounded-b-2xl rounded-tr-2xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
              {list2017.map((name, index) => (
                <div key={index} className="p-3 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2015-16 List */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold bg-blue-700 text-white px-6 py-3 rounded-t-2xl inline-block">वर्ष 2015 – 16 में चयनित विद्यार्थी</h2>
          <div className="bg-white border-2 border-blue-700 p-6 rounded-b-2xl rounded-tr-2xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
              {list2015.map((name, index) => (
                <div key={index} className="p-3 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
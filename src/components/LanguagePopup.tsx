import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export default function LanguagePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasChosen = sessionStorage.getItem('language_chosen');
    if (!hasChosen) {
      setIsOpen(true);
    }
  }, []);

 const handleSelection = (lang: 'en' | 'hi') => {
    sessionStorage.setItem('language_chosen', 'true');

    if (lang === 'en') {
      // 1. Google ki set ki hui cookies ko clear karne ki koshish
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=/en/en; path=/;"; // Force English cookie
      
      // 2. Agar dropdown mil jaye toh reset karein
      const selectField = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (selectField) {
        selectField.value = ''; // Google mein empty string matlab 'Original'
        selectField.dispatchEvent(new Event("change", { bubbles: true }));
      }
      
      // 3. Sabse zaruri: Page ko reload karein taaki Google ka translation state clean ho jaye
      setIsOpen(false);
      window.location.reload(); 
      return;
    }

    // Hindi trigger logic
    const triggerGoogleTranslate = (targetLang: string) => {
      const selectField = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      
      if (selectField) {
        selectField.value = targetLang;
        selectField.dispatchEvent(new Event("change", { bubbles: true }));
        selectField.dispatchEvent(new Event("input", { bubbles: true }));
        setIsOpen(false); 
      } else {
        // Agar engine load nahi hua toh 500ms baad fir koshish karein
        setTimeout(() => triggerGoogleTranslate(targetLang), 500);
      }
    };

    // Translation trigger karein
    triggerGoogleTranslate(lang);

    // Popup ko band karne ke liye state update
    setTimeout(() => {
      setIsOpen(false);
    }, 800);
  };

  // 🔥 CRITICAL: Ye line add karna zaroori hai taaki state 'false' hote hi popup screen se hat jaye
  if (!isOpen) return null;
  return (
    /* 1. Yahan 'notranslate' class add ki hai taaki popup khud translate na ho */
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 notranslate">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center relative border-4 border-yellow-500 animate-in fade-in zoom-in duration-300">
        <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Languages className="h-10 w-10 text-yellow-600" />
        </div>

        <h2 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tighter">
          SELECT LANGUAGE
        </h2>
        <p className="text-slate-500 text-sm mb-8 font-semibold uppercase tracking-widest">
          वेबसाइट की भाषा चुनें
        </p>

        <div className="flex flex-col gap-4">
          <Button 
            onClick={() => handleSelection('hi')}
            className="h-16 rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-white font-black text-xl shadow-[0_4px_0_rgb(202,138,4)] active:translate-y-1 active:shadow-none transition-all"
          >
            हिंदी में देखें
          </Button>
          
          <Button 
            variant="ghost"
            onClick={() => handleSelection('en')}
            className="h-12 rounded-xl text-slate-400 font-bold hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            Continue in English
          </Button>
        </div>
      </div>
    </div>
  );
}
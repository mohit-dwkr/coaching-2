import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Loader2, CheckCircle2 } from "lucide-react"; 
import { supabase } from "@/supabaseClient"; 
import { useToast } from "@/hooks/use-toast";
import React from "react";

export default function ContactSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from("Coaching_Contactform")
        .insert([
          {
            name: form.name,
            email: form.email,
            phone: form.phone,
            message: form.message,
          },
        ]);

      if (error) throw error;
      
      toast({
        title: "Inquiry Sent!",
        description: "We'll get back to you soon.",
        className: "bg-blue-600 text-white border-none max-w-[300px] p-4 shadow-2xl",
      });

      setForm({ name: "", email: "", phone: "", message: "" });
      setCategory("");
      setSelectedClass("");
      setDisplaySubject("");

    } catch (error: any) {
      toast({
        title: "Error sending inquiry",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [category, setCategory] = React.useState(""); 
  const [selectedClass, setSelectedClass] = React.useState("");
  const [displaySubject, setDisplaySubject] = useState("");
  
  return (
    <section id="contact" className="py-24 bg-slate-50/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-wider text-white uppercase bg-blue-500 rounded-full">
            Admission Open 2026-27
          </span>
          <h2 className="text-3xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            Apply for <span className="text-blue-600">Admission</span>
          </h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-md">
           "Fill the digital enrollment form below to secure your seat for the 2026-27 session. Our team will contact you."
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto items-start">
          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-500/5 border border-slate-100"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Your Name *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-slate-50 border-slate-200 focus:bg-white transition-all h-12"
                  disabled={isSubmitting}
                />
                <Input
                  placeholder="Phone Number *"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="bg-slate-50 border-slate-200 focus:bg-white transition-all h-12"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-4">
                <select 
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSelectedClass("");
                    setDisplaySubject(""); 
                    setForm({ ...form, email: "" }); 
                  }}
                  className="w-full p-3 h-12 rounded-md border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="">Select Class/Courses</option>
                  <option value="school">School Classes (5th - 12th)</option>
                  <option value="competitive">Competitive Exams</option>
                </select>

                {category === "school" && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4">
                    <select 
                      value={selectedClass}
                      onChange={(e) => {
                          setSelectedClass(e.target.value);
                          setDisplaySubject(""); 
                      }}
                      className="p-3 h-12 rounded-md border border-slate-200 bg-slate-50 text-sm outline-none"
                    >
                      <option value="">Select Class</option>
                      {[5,6,7,8,9,10,11,12].map(num => (
                        <option key={num} value={num}>{num}th Standard</option>
                      ))}
                    </select>

                    <select 
                      disabled={!selectedClass}
                      value={displaySubject} 
                      onChange={(e) => {
                        const sub = e.target.value;
                        setDisplaySubject(sub); 
                        setForm({ ...form, email: `Class ${selectedClass}: ${sub}` }); 
                      }}
                      className="p-3 h-12 rounded-md border border-slate-200 bg-slate-50 text-sm outline-none disabled:opacity-50"
                    >
                      {/* <option value="">Select Subject/Exam</option>
                       <option value="Navodaya entrance exam">Navodaya Entrance Exam</option>
                       <option value="Sainik school entrance">Sainik School Entrance Exam</option>
                       <option value="Shramodaya school entrance exam">Shramodaya School Entrance Exam</option>
                       <option value="Rastriya military school entrance exam">Rastriya Military School Entrance Exam</option>
                   */}
                      <option value="Mathematics">Mathematics</option>
                      <option value="Science">Science</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="All Subjects">All Subjects</option>
                    </select>
                  </motion.div>
                )}

                {category === "competitive" && (
                  <motion.select 
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    value={displaySubject} 
                    onChange={(e) => {
                      const exam = e.target.value;
                      setDisplaySubject(exam);
                      setForm({ ...form, email: `Competitive: ${exam}` });
                    }}
                    className="w-full p-3 h-12 rounded-md border border-slate-200 bg-slate-50 text-sm outline-none"
                  >
                    <option value="">Select Target Exam</option>
                    <option value="Navodaya entrance exam">Navodaya Entrance Exam</option>
                       <option value="Sainik school entrance">Sainik School Entrance Exam</option>
                       <option value="Shramodaya school entrance exam">Shramodaya School Entrance Exam</option>
                       <option value="Rastriya military school entrance xam">Rastriya Military School Entrance Exam</option>
                  </motion.select>
                )}
              </div>

              <Textarea
                placeholder="Briefly describe your goals or questions"
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="bg-slate-50 border-slate-200 focus:bg-white transition-all"
                disabled={isSubmitting}
              />

              <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-xl text-lg font-semibold transition-all shadow-lg shadow-blue-200" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...</>
                ) : (
                  "Submit Admission Form"
                )}
              </Button>
              <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest font-bold">
                ✓ Secured Academic Portal
              </p>
            </form>
          </motion.div>

          {/* Info + Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col h-full"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 mb-8">
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 text-blue-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Visit Us</p>
                  <p className="text-sm font-semibold text-slate-800 leading-tight">Rajghat colony Datia (MP) – 475661</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 text-blue-600">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Call Support</p>
                  <p className="text-sm font-semibold text-slate-800">+91 9630955951</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0 text-purple-600">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Mail Inquiry</p>
                  <p className="text-sm font-semibold text-slate-800">diwakarmohit0007@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden border-4 border-white shadow-2xl h-full min-h-[250px] relative">
              <iframe
                title="Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3596.339613280743!2d78.45260259999999!3d25.660034500000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397713043d171677%3A0xf0b3679d7c749e62!2sNavodaya%20coaching!5e0!3m2!1sen!2sin!4v1774426357072!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.2)' }}
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


 
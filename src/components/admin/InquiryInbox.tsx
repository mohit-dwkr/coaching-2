import { useState, useEffect } from "react";
import { Mail, Phone, Calendar, MessageSquare, Trash2, User, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/supabaseClient";

export default function InquiryInbox() {
  const [inquiries, setInquiriesState] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("Coaching_Contactform")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInquiriesState(data || []);
    } catch (error: any) {
      toast.error("Error fetching inquiries: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDelete = async (id: string | number) => {
    try {
      const { error } = await supabase
        .from("Coaching_Contactform")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setInquiriesState(inquiries.filter((q) => q.id !== id));
      toast.error("Inquiry deleted");
    } catch (error: any) {
      toast.error("Failed to delete: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-slate-500 text-sm">Loading inquiries...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 px-4 md:px-0">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-5 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Student Inquiries</h2>
          <p className="text-slate-500 text-xs md:text-sm mt-1">Manage and respond to potential student leads</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-2xl font-bold text-xs md:text-sm self-start sm:self-auto">
          Total: {inquiries.length}
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="text-center py-16 md:py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 px-6">
          <div className="bg-white h-14 w-14 md:h-16 md:w-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Mail className="h-6 w-6 md:h-8 md:w-8 text-slate-300" />
          </div>
          <h3 className="text-slate-800 font-bold text-lg">Your inbox is empty</h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm mt-1">
            When students fill out the contact form, their messages will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {inquiries.map((q) => (
            <Card key={q.id} className="group border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="flex flex-row min-h-full">
                  {/* Sidebar strip - Hamesha left mein rahega */}
                  <div className="w-1 md:w-1.5 bg-primary/20 group-hover:bg-primary transition-colors shrink-0" />
                  
                  <div className="p-4 md:p-6 flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Student Info */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                            <User className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-base md:text-lg leading-tight truncate">{q.name}</h4>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mt-1">
                              <Calendar className="h-3 w-3" /> {new Date(q.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 md:gap-4 text-[11px] md:text-sm font-medium">
                          <a 
                            href={`mailto:${q.email}`} 
                            className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors bg-slate-50 px-2.5 py-1.5 rounded-lg truncate max-w-full"
                          >
                            <Mail className="h-3.5 w-3.5 text-primary shrink-0" /> <span className="truncate">{q.email || "No Email"}</span>
                          </a>
                          <a 
                            href={`tel:${q.phone}`} 
                            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors bg-slate-50 px-2.5 py-1.5 rounded-lg"
                          >
                            <Phone className="h-3.5 w-3.5 text-blue-600 shrink-0" /> {q.phone}
                          </a>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 justify-start sm:justify-end lg:justify-center pt-2 lg:pt-0 border-t lg:border-none border-slate-50">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-xl border-slate-200 h-9 text-xs hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 flex-1 sm:flex-none"
                          onClick={() => window.open(`https://wa.me/${q.phone.replace(/\D/g,'')}`, '_blank')}
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> WhatsApp
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(q.id)}
                          className="rounded-xl h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 shrink-0"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Message Box */}
                    {q.message && (
                      <div className="mt-4 p-3 md:p-4 bg-slate-50/80 rounded-2xl border border-slate-100 relative">
                        <MessageSquare className="h-3.5 w-3.5 text-slate-300 absolute -top-1.5 -left-1 bg-white rounded-full p-0.5" />
                        <p className="text-slate-700 text-xs md:text-sm leading-relaxed italic">
                          "{q.message}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
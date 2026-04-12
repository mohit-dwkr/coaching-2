import React, { useState, useEffect } from 'react';
import { supabase } from "@/supabaseClient";
import { 
  CheckCircle, 
  Trash2, 
  Users, 
  Search, 
  Loader2, 
  Phone, 
  GraduationCap, 
  UserPlus 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const StudentManager = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('student_approvals')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setStudents(data || []);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  // 1. Approve Function
  const approveStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('student_approvals')
        .update({ status: 'approved' })
        .eq('id', id);
      if (error) throw error;
      setStudents(students.map(s => s.id === id ? { ...s, status: 'approved' } : s));
    } catch (err: any) {
      alert("Approval failed: " + err.message);
    }
  };

  // 2. Delete Function (Pending ya Approved dono ke liye)
  const deleteRequest = async (id: string) => {
    if(!window.confirm("Are You Sure Want to Cancel Student Access ?")) return;
    
    try {
      const { error } = await supabase
        .from('student_approvals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      // List se turant hatane ke liye state update
      setStudents(students.filter(s => s.id !== id));
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.mobile.includes(searchTerm)
  );

  const pending = filtered.filter(s => s.status === 'pending');
  const approved = filtered.filter(s => s.status === 'approved');

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
            <Users className="text-blue-600" size={32} />
            STUDENT <span className="text-blue-600">MANAGER</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm">Manage Student Study Material Access</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Search by name or mobile..." 
            className="pl-10 bg-white border-slate-200 h-12 rounded-xl focus-visible:ring-blue-600" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT: PENDING REQUESTS --- */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-bold text-slate-700 uppercase text-xs tracking-[0.2em] mb-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            Pending Requests ({pending.length})
          </h2>
          
          {pending.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-dashed border-slate-300 text-center">
              <UserPlus className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-slate-400 text-sm font-medium">No pending requests</p>
            </div>
          ) : (
            pending.map(s => (
              <div key={s.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-slate-900 text-lg">{s.name}</p>
                    <div className="flex gap-4 mt-1 text-slate-500 text-xs font-bold">
                      <span className="flex items-center gap-1"><Phone size={12} className="text-blue-600"/> {s.mobile}</span>
                      <span className="flex items-center gap-1"><GraduationCap size={14} className="text-blue-600"/> Class {s.class}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => approveStudent(s.id)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-11">
                    <CheckCircle size={18} className="mr-2"/> Approve
                  </Button>
                  <Button onClick={() => deleteRequest(s.id)} variant="outline" className="border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 rounded-xl h-11 px-4">
                    <Trash2 size={18}/>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

       {/* --- RIGHT: APPROVED STUDENTS (Exactly Same Logic, Improved Responsiveness) --- */}
       <div className="lg:col-span-7 space-y-4">
          <h2 className="font-bold text-slate-700 uppercase text-[10px] tracking-[0.2em] mb-4 flex items-center gap-2 px-1">
            <div className="h-2 w-2 rounded-full bg-blue-600" />
            Approved Access ({approved.length})
          </h2>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left table-fixed"> {/* table-fixed ensures no overflow */}
              <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400">
                <tr>
                  {/* Column widths fixed for mobile compatibility */}
                  <th className="p-3 sm:p-5 w-[60%] sm:w-auto">Student Lists</th>
                  {/* <th className="p-3 sm:p-5 text-right  sm:w-24">Action</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {approved.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="p-10 text-center text-slate-400 italic text-sm">
                      No approved students yet
                    </td>
                  </tr>
                ) : (
                  approved.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      
                      {/* 1. Combined Info & Class Column */}
                      <td className="p-3 sm:p-5">
                        <div className="flex flex-col gap-1">
                          <p className="font-bold text-slate-900 text-sm truncate uppercase tracking-tight">
                            {s.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                              <Phone size={10} className="text-blue-500" /> {s.mobile}
                            </span>
                            {/* Class badge moved inside for better mobile fitting */}
                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black border border-blue-100 uppercase">
                              Class: {s.class}
                            </span>
                          </div>
                        </div>
                      </td>
<hr className='hr-2'/>
                      {/* 2. Action Column (Small & Centered) */}
                      <td className="p-3 sm:p-5 text-center align-middle">
                        <button 
                          onClick={() => deleteRequest(s.id)} 
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Cancel Access"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default StudentManager;
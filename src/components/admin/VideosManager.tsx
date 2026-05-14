import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from "@/supabaseClient";
import { Trash2, Plus, Youtube, Loader2, ExternalLink, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {toast} from "sonner"

const VideosManager = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isAllClasses, setIsAllClasses] = useState(false);

  // Filter States
  const [filterClass, setFilterClass] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");

  const [newVideo, setNewVideo] = useState({
    title: "",
    youtube_id: "",
    subject: "",
    student_class: ""
  });

  const fetchVideos = async () => {
    try {
      setFetching(true);
      const { data, error } = await supabase
        .from('video_lectures')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (err) {
      toast.error("Error fetching videos: " + err.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // --- Filtering Logic ---
  const availableClasses = useMemo(() => {
    return [...new Set(videos.map(v => v.student_class))].filter(c => c !== "All");
  }, [videos]);

  const filteredVideos = useMemo(() => {
    return videos.filter(v => {
      const matchClass = filterClass === "all" || v.student_class === filterClass;
      const matchSubject = filterSubject === "all" || v.subject === filterSubject;
      return matchClass && matchSubject;
    });
  }, [videos, filterClass, filterSubject]);

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.youtube_id || !newVideo.subject || !newVideo.student_class) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from('video_lectures').insert([newVideo]);
      if (error) throw error;

      toast.success("Video Added Successfully!");
      setNewVideo({ title: "", youtube_id: "", subject: "", student_class: "" });
      setIsAllClasses(false);
      fetchVideos();
    } catch (err) {
      toast.error("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      const { error } = await supabase.from('video_lectures').delete().eq('id', id);
      if (error) throw error;
      setVideos(videos.filter(v => v.id !== id));
    } catch (err) {
      toast.error("Error deleting: " + err.message);
    }
  };

  const handleUrlChange = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : url;
    setNewVideo({ ...newVideo, youtube_id: id });
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 mt-5 md:mt-10">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
          <Youtube size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 leading-tight">Video Manager</h2>
          <p className="text-xs text-slate-500">Manage your Youtube lectures</p>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleAddVideo} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200 items-end">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Title</label>
          <Input placeholder="Video Title" value={newVideo.title} onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })} className="bg-white h-9 text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">YouTube Link/ID</label>
          <Input placeholder="Paste URL here" value={newVideo.youtube_id} onChange={(e) => handleUrlChange(e.target.value)} className="bg-white h-9 text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Subject</label>
          <Input placeholder="e.g. Physics" value={newVideo.subject} onChange={(e) => setNewVideo({ ...newVideo, subject: e.target.value })} className="bg-white h-9 text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Class</label>
          <div className="flex gap-2">
            <Input 
              placeholder="10" 
              disabled={isAllClasses} 
              value={isAllClasses ? "All" : newVideo.student_class}
              onChange={(e) => /^[0-9\b]+$/.test(e.target.value) || e.target.value === "" ? setNewVideo({...newVideo, student_class: e.target.value}) : null}
              className="bg-white h-9 text-sm"
            />
            <div className="flex items-center gap-1 bg-white px-2 rounded-md border border-slate-200 shrink-0">
              <input type="checkbox" id="allClasses" checked={isAllClasses} onChange={(e) => { setIsAllClasses(e.target.checked); setNewVideo({...newVideo, student_class: e.target.checked ? "All" : ""}); }} className="w-3.5 h-3.5" />
              <label htmlFor="allClasses" className="text-[10px] font-bold text-slate-600 uppercase cursor-pointer">All</label>
            </div>
          </div>
        </div>
        <Button disabled={loading} className="bg-blue-600 hover:bg-blue-700 h-9 font-bold text-sm w-full">
          {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus size={16} className="mr-1" />} Add Video
        </Button>
      </form>

      {/* --- Filter UI Section --- */}
      <div className="flex flex-col gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-500">
          <Filter size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Quick Filters</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Class Filter Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
            <button onClick={() => {setFilterClass("all"); setFilterSubject("all");}} className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${filterClass === "all" ? "bg-white shadow-sm text-blue-600" : "text-slate-500"}`}>All Classes</button>
            <button onClick={() => setFilterClass("All")} className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${filterClass === "All" ? "bg-white shadow-sm text-blue-600" : "text-slate-500"}`}>Global (All)</button>
            {availableClasses.sort((a,b) => a-b).map(c => (
              <button key={c} onClick={() => setFilterClass(c)} className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${filterClass === c ? "bg-white shadow-sm text-blue-600" : "text-slate-500"}`}>Class {c}</button>
            ))}
          </div>

          {/* Subject Filter Tabs */}
          {filterClass !== "all" && (
            <div className="flex bg-blue-50 p-1 rounded-xl border border-blue-100 overflow-x-auto no-scrollbar">
              <button onClick={() => setFilterSubject("all")} className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${filterSubject === "all" ? "bg-blue-600 text-white" : "text-blue-600"}`}>All Subjects</button>
              {[...new Set(videos.filter(v => v.student_class === filterClass).map(v => v.subject))].map(s => (
                <button key={s} onClick={() => setFilterSubject(s)} className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${filterSubject === s ? "bg-blue-600 text-white" : "text-blue-600"}`}>{s}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- List Section --- */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Results ({filteredVideos.length})</h3>
        
        {fetching ? (
          <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-slate-300" /></div>
        ) : filteredVideos.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-sm italic">No videos found matching these filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredVideos.map((vid) => (
              <div key={vid.id} className="group bg-white border border-slate-200 p-3 md:p-4 rounded-2xl flex flex-col md:flex-row md:items-center gap-4 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all">
                
                {/* Thumbnail */}
                <div className="relative shrink-0 overflow-hidden rounded-xl border border-slate-100 aspect-video w-full md:w-40 bg-slate-100">
                  <img src={`https://img.youtube.com/vi/${vid.youtube_id}/mqdefault.jpg`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="thumbnail" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <div className="p-2 bg-white/90 rounded-full text-red-600 shadow-lg"><Youtube size={16} /></div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${vid.student_class === 'All' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-100 text-orange-600 border-purple-100'}`}>
                      CLASS {vid.student_class}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded text-[10px] font-bold uppercase tracking-wider">
                      {vid.subject}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm md:text-base leading-snug truncate group-hover:text-blue-600 transition-colors">
                    {vid.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                    ID: {vid.youtube_id} 
                    <a href={`https://youtube.com/watch?v=${vid.youtube_id}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline inline-flex items-center gap-0.5 font-bold">
                      Open <ExternalLink size={10} />
                    </a>
                  </p>
                </div>

                {/* Action */}
                <div className="flex md:flex-col gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                  <button onClick={() => handleDelete(vid.id)} className="flex-1 md:flex-none p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center justify-center gap-2 md:gap-0">
                    <Trash2 size={18} />
                    <span className="md:hidden text-xs font-bold uppercase">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideosManager;
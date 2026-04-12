import React, { useState, useEffect } from 'react';
import { supabase } from "@/supabaseClient";
import { Trash2, Plus, Youtube, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const VideosManager = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [newVideo, setNewVideo] = useState({
    title: "",
    youtube_id: "",
    subject: ""
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
      alert("Error fetching videos: " + err.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.youtube_id || !newVideo.subject) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('video_lectures')
        .insert([newVideo]);

      if (error) throw error;

      alert("Video Added Successfully!");
      setNewVideo({ title: "", youtube_id: "", subject: "" });
      fetchVideos();
    } catch (err) {
      alert("Error adding video: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      const { error } = await supabase
        .from('video_lectures')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setVideos(videos.filter(v => v.id !== id));
    } catch (err) {
      alert("Error deleting: " + err.message);
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
          <h2 className="text-xl font-bold text-slate-800 leading-tight">Video Manager</h2>
          <p className="text-xs text-slate-500">Add or remove lectures</p>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleAddVideo} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Title</label>
          <Input 
            placeholder="Video Title" 
            value={newVideo.title}
            onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
            className="bg-white h-9 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Link/ID</label>
          <Input 
            placeholder="YouTube Link" 
            value={newVideo.youtube_id}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="bg-white h-9 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Subject</label>
          <Input 
            placeholder="e.g. Physics" 
            value={newVideo.subject}
            onChange={(e) => setNewVideo({...newVideo, subject: e.target.value})}
            className="bg-white h-9 text-sm"
          />
        </div>
        <div className="flex items-end mt-2 md:mt-0">
          <Button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 h-9 font-bold text-sm">
            {loading ? <Loader2 className="animate-spin" /> : <><Plus size={16} className="mr-1" /> Add</>}
          </Button>
        </div>
      </form>

      {/* --- Responsive List --- */}
      <div className="rounded-xl border border-slate-100">
        {/* Desktop Header */}
        <div className="hidden md:grid md:grid-cols-12 bg-slate-800 text-white p-4 text-xs font-bold uppercase tracking-wider">
          <div className="col-span-2">Thumbnail</div>
          <div className="col-span-5">Video Details</div>
          <div className="col-span-3">Subject</div>
          <div className="col-span-2 text-center">Action</div>
        </div>

        <div className="divide-y divide-slate-100">
          {fetching ? (
            <div className="p-10 text-center text-slate-400">Loading...</div>
          ) : videos.length === 0 ? (
            <div className="p-10 text-center text-slate-400">No videos found.</div>
          ) : (
            videos.map((vid) => (
              <div key={vid.id} className="flex flex-col md:grid md:grid-cols-12 md:items-center p-4 hover:bg-slate-50 transition-colors gap-4">
                
                {/* Thumbnail */}
                <div className="md:col-span-2">
                  <img 
                    src={`https://img.youtube.com/vi/${vid.youtube_id}/mqdefault.jpg`} 
                    className="rounded-lg shadow-sm border w-full md:w-32 aspect-video object-cover" 
                    alt="thumb"
                  />
                </div>

                {/* Details */}
                <div className="md:col-span-5 space-y-1">
                  <p className="font-bold text-slate-800 text-sm md:text-base leading-tight">{vid.title}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    ID: {vid.youtube_id} 
                    <a href={`https://youtube.com/watch?v=${vid.youtube_id}`} target="_blank" rel="noreferrer">
                      <ExternalLink size={12} className="text-blue-500" />
                    </a>
                  </p>
                </div>

                {/* Subject */}
                <div className="md:col-span-3">
                  <div className="flex items-center gap-2">
                    <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase">Subject:</span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[11px] font-bold uppercase border border-blue-100">
                      {vid.subject}
                    </span>
                  </div>
                </div>

                {/* Delete Button */}
                <div className="md:col-span-2 flex md:justify-center border-t md:border-t-0 pt-3 md:pt-0">
                  <button 
                    onClick={() => handleDelete(vid.id)}
                    className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 md:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100 md:border-0"
                  >
                    <Trash2 size={18} />
                    <span className="md:hidden font-bold text-xs uppercase">Delete Video</span>
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VideosManager;
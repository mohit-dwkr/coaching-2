import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { 
  Send, Trash2, Edit3, Plus, 
  Users, User, Calendar, MessageSquare, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationSectionManager = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetClass, setTargetClass] = useState('');
  const [isAll, setIsAll] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Coaching-2_Notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setNotifications(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      message,
      target_class: isAll ? 'All' : targetClass,
    };

    if (editingId) {
      const { error } = await supabase
        .from('Coaching-2_Notifications')
        .update(payload)
        .eq('id', editingId);
      if (!error) alert('Notification Updated!');
    } else {
      const { error } = await supabase
        .from('Coaching-2_Notifications')
        .insert([payload]);
      if (!error) alert('Notification Sent!');
    }

    resetForm();
    fetchNotifications();
  };

  const deleteNotification = async (id: string) => {
    if (window.confirm('Kya aap ise sach mein delete karna chahte hain?')) {
      const { error } = await supabase
        .from('Coaching-2_Notifications')
        .delete()
        .eq('id', id);
      
      if (!error) fetchNotifications();
    }
  };

  const startEdit = (notif: any) => {
    setEditingId(notif.id);
    setTitle(notif.title);
    setMessage(notif.message);
    if (notif.target_class === 'All') {
      setIsAll(true);
      setTargetClass('');
    } else {
      setIsAll(false);
      setTargetClass(notif.target_class);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setTitle('');
    setMessage('');
    setTargetClass('');
    setIsAll(false);
    setEditingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-blue-900">Notification Center</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Admin Control Panel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Create/Edit Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-blue-100/50 border border-blue-50 sticky top-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              {editingId ? <Edit3 size={20} className="text-blue-600"/> : <Plus size={20} className="text-blue-600"/>}
              {editingId ? 'Edit Notification' : 'Create New Broadcast'}
            </h2>

            <div className="space-y-5">
              {/* Target Class Logic */}
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <input 
                    type="checkbox" 
                    id="allStudents"
                    checked={isAll}
                    onChange={(e) => setIsAll(e.target.checked)}
                    className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                  />
                  <label htmlFor="allStudents" className="font-bold text-blue-900 cursor-pointer text-sm">
                    Send to All Students
                  </label>
                </div>

                <div className={`transition-opacity ${isAll ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                  <label className="text-[10px] font-black text-blue-400 uppercase ml-1">Specific Class (Numbers only)</label>
                  <input 
                    type="number"
                    placeholder="e.g. 10"
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    disabled={isAll}
                    onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                    className="w-full mt-1 p-3 bg-white border border-blue-200 rounded-xl outline-none focus:border-blue-500 font-bold"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Notification Title</label>
                <input 
                  type="text"
                  placeholder="Enter catchy title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Detailed Message</label>
                <textarea 
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 h-32 resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Send size={18} /> {editingId ? 'Update Now' : 'Send Notification'}
                </button>
                {editingId && (
                  <button 
                    type="button"
                    onClick={resetForm}
                    className="p-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Right: History List */}
        <div className="lg:col-span-7">
          <div className="space-y-4">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Sent History</h2>
            
            <AnimatePresence>
              {notifications.map((notif) => (
                <motion.div 
                  layout
                  key={notif.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white border border-slate-100 rounded-3xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        notif.target_class === 'All' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {notif.target_class === 'All' ? <Users size={12} className="inline mr-1"/> : <User size={12} className="inline mr-1"/>}
                        {notif.target_class === 'All' ? 'All Classes' : `Class ${notif.target_class}`}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                        <Calendar size={12} />
                        {new Date(notif.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(notif)} className="p-2 text-blue-400 hover:bg-blue-50 rounded-full transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => deleteNotification(notif.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-black text-slate-800 text-lg group-hover:text-blue-600 transition-colors truncate">
                    {notif.title}
                  </h3>
                  
                  <div className="mt-2 text-slate-500 text-sm flex items-start gap-2">
                    <MessageSquare size={14} className="mt-1 flex-shrink-0 text-slate-300" />
                    <p className="line-clamp-2 md:line-clamp-none leading-relaxed italic">
                      "{notif.message}"
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {notifications.length === 0 && !loading && (
              <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold">No notifications sent yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSectionManager;
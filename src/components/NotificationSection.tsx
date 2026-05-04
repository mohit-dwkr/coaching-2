import React, { useEffect, useState } from 'react'
import { supabase } from '@/supabaseClient' 
import { X, Bell, Clock, Megaphone, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query' // React Query Import

interface Notification {
  id: string
  created_at: string
  title: string
  message: string
  target_class: string
}

const NotificationSection = ({ profile }: { profile?: any }) => {
  const [dismissedIds, setDismissedIds] = useState<string[]>([])

  useEffect(() => {
    // LocalStorage se wo IDs uthao jo student ne hide kar di hain
    const savedDismissed = JSON.parse(localStorage.getItem('dismissed_notifications') || '[]')
    setDismissedIds(savedDismissed)
  }, [])

  // ✅ REACT QUERY: Data fetch aur Cache logic
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', profile?.class],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Coaching-2_Notifications')
        .select('*')
        .or(`target_class.eq.All,target_class.eq.${profile?.class}`)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data as Notification[]) || []
    },
    staleTime: 1000 * 60 * 15, // 10 Minutes Cache
    gcTime: 1000 * 60 * 30,    // 30 Minutes Memory
  })

  // Student side se hide karne ka function
  const handleDismiss = (id: string) => {
    const updatedDismissed = [...dismissedIds, id]
    setDismissedIds(updatedDismissed)
    localStorage.setItem('dismissed_notifications', JSON.stringify(updatedDismissed))
  }

  // Notifications filter karna (jo dismiss nahi hui hain)
  const visibleNotifications = notifications.filter(n => !dismissedIds.includes(n.id))

  if (isLoading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin text-blue-600" size={24} />
        <p className="font-bold text-slate-400 animate-pulse text-sm">Checking for updates...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-100">
          <Bell className="text-white" size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800">Notice Board</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Updates for Class {profile?.class}</p>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        <AnimatePresence mode='popLayout'>
          {visibleNotifications.length > 0 ? (
            visibleNotifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white border border-slate-100 p-5 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all group"
              >
                {/* Cross Button to Hide */}
                <button
                  onClick={() => handleDismiss(notif.id)}
                  className="absolute top-4 right-4 p-1.5 bg-slate-50 text-slate-400 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <X size={14} />
                </button>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${notif.target_class === 'All' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                      {notif.target_class === 'All' ? 'Everyone' : `Class ${notif.target_class}`}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                      <Clock size={12} />
                      {new Date(notif.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg leading-tight">{notif.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{notif.message}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200"
            >
              <Megaphone className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-slate-400 font-bold text-sm">No new notices today</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default NotificationSection
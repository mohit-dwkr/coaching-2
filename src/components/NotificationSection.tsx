import React, { useEffect, useState } from 'react'
import { supabase } from '@/supabaseClient' 
import { Bell, Clock, Megaphone, Loader2 } from 'lucide-react'
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

const visibleNotifications = notifications

  if (isLoading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin text-blue-600" size={24} />
        <p className="font-bold text-slate-400 animate-pulse text-sm">Checking for updates...</p>
      </div>
    )
  }

return (
  <div className="max-w-2xl mx-auto p-4 w-full overflow-x-hidden">
    {/* Header */}
    <div className="flex items-center gap-3 mb-8 w-full overflow-hidden">
      <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-100 shrink-0">
        <Bell className="text-white" size={20} />
      </div>

      <div className="min-w-0 flex-1 overflow-hidden">
        <h2 className="text-xl font-black text-slate-800 truncate">
          Notice Board
        </h2>

        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
          Updates for Class {profile?.class}
        </p>
      </div>
    </div>

    {/* Notifications List */}
    <div className="space-y-4 w-full overflow-x-hidden">
      <AnimatePresence mode="popLayout">
        {visibleNotifications.length > 0 ? (
          visibleNotifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="
                relative
                bg-white
                border
                border-slate-100
                p-4 sm:p-5
                rounded-[1.5rem]
                shadow-sm
                hover:shadow-md
                transition-all
                group
                w-full
                max-w-full
                overflow-hidden
                break-words
              "
            >

              {/* Content */}
              <div className="flex flex-col gap-2 min-w-0 w-full overflow-hidden pr-8">
                {/* Top badges */}
                <div className="flex flex-wrap items-center gap-2 w-full overflow-hidden">
                  <span
                    className={`
                      text-[10px]
                      font-black
                      px-2
                      py-0.5
                      rounded-md
                      uppercase
                      shrink-0
                      whitespace-nowrap
                      ${
                        notif.target_class === "All"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-blue-100 text-blue-600"
                      }
                    `}
                  >
                    {notif.target_class === "All"
                      ? "Everyone"
                      : `Class ${notif.target_class}`}
                  </span>

                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 shrink-0 whitespace-nowrap">
                    <Clock size={12} />
                    {new Date(notif.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="
                    font-bold
                    text-slate-800
                    text-base
                    sm:text-lg
                    leading-tight
                    break-words
                    whitespace-pre-wrap
                    overflow-wrap-anywhere
                    w-full
                  "
                >
                  {notif.title}
                </h3>

                {/* Message */}
                <p
                  className="
                    text-slate-600
                    text-sm
                    leading-relaxed
                    break-words
                    whitespace-pre-wrap
                    overflow-wrap-anywhere
                    w-full
                    max-w-full
                  "
                >
                  {notif.message}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="
              text-center
              py-16
              bg-slate-50
              rounded-[2rem]
              border-2
              border-dashed
              border-slate-200
              w-full
              overflow-hidden
            "
          >
            <Megaphone
              className="mx-auto text-slate-300 mb-2"
              size={32}
            />

            <p className="text-slate-400 font-bold text-sm">
              No new notices today
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
)
}
export default NotificationSection
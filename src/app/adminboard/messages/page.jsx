'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);
    
    async function fetchMessages() {
        setLoading(true);
        
        const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

        if (error) {
        console.error("Supabase Fetch Error:", error);
        } else {
        console.log("Fetched Messages:", data); // Check your Browser Console (F12)
        setMessages(data || []);
        }
        setLoading(false);
    }

  async function toggleReadStatus(id, currentStatus) {
    await supabase
      .from('contact_messages')
      .update({ is_read: !currentStatus })
      .eq('id', id);
    fetchMessages(); // Refresh list
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Customer Inquiries</h1>
      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`p-6 bg-[#131315] border rounded-xl ${m.is_read ? 'border-white/5' : 'border-purple-500/50'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{m.name}</h3>
                <p className="text-sm text-gray-400">{m.email}</p>
              </div>
              <button 
                onClick={() => toggleReadStatus(m.id, m.is_read)}
                className={`text-xs px-3 py-1 rounded ${m.is_read ? 'bg-gray-800' : 'bg-purple-600'}`}
              >
                {m.is_read ? 'Mark Unread' : 'Mark Read'}
              </button>
            </div>
            <p className="mt-4 text-gray-300 bg-black/30 p-4 rounded">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
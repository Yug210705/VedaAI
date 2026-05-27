'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Topbar from '@/components/Topbar';
import { Plus, Search, MoreVertical, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, WS_URL } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/Toaster';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const router = useRouter();

  const handleDelete = async (id: string) => {
    await api.deleteAssignment(id);
    fetchAssignments();
  };

  const handleRenameSubmit = async (id: string) => {
    if (editTitle.trim()) {
      await api.updateAssignment(id, { title: editTitle.trim() });
      fetchAssignments();
    }
    setEditingId(null);
  };

  const fetchAssignments = async () => {
    try {
      const data = await api.getAssignments();
      setAssignments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();

    // WebSocket for real-time status updates
    try {
      const ws = new WebSocket(WS_URL);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'GENERATION_COMPLETED' || data.type === 'GENERATION_FAILED') {
            fetchAssignments();
          }
        } catch (e) {
          // ignore parsing error
        }
      };
      
      ws.onerror = () => {
        // Silently ignore connection errors during UI development if backend is not running
      };
      
      return () => {
        if (ws.readyState === 1) {
          ws.close();
        }
      };
    } catch (e) {
      return () => {};
    }
  }, []);

  return (
    <div className="h-full flex flex-col md:pb-4 bg-[#d0d3d8] md:bg-background overflow-hidden md:overflow-visible">
      {/* Desktop Topbar Container */}
      <div className="hidden md:block">
        <Topbar title="Assignments" showBack={true} />
      </div>
      
      {/* Mobile Topbar Container */}
      <div className="md:hidden">
        <Topbar title="Assignments" showBack={false} />
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      ) : assignments.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="flex-1 flex flex-col relative overflow-hidden"
        >
          <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 text-center pt-6 md:pt-8 pb-40 md:pb-8">
            {/* Custom Illustration */}
            <div className="relative w-[280px] h-[280px] mx-auto -mb-20 md:mb-2 -mt-28 md:-mt-10 transform scale-[0.45] md:scale-100 origin-center">
              <div className="absolute inset-0 m-auto w-[240px] h-[240px] bg-[#f0f2f5] rounded-full"></div>
              
              <div className="absolute top-[40px] right-[40px] w-[50px] h-[24px] bg-white rounded-md shadow-sm flex items-center p-1.5 gap-1.5 z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-[#c084fc]"></div>
                <div className="w-6 h-3 rounded-sm bg-gray-200"></div>
              </div>

              <div className="absolute right-[25px] top-[140px] w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></div>

              <svg className="absolute left-[35px] bottom-[70px] w-7 h-7 text-[#4078c0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3 L14 10 L21 12 L14 14 L12 21 L10 14 L3 12 L10 10 Z" fill="currentColor" stroke="none" />
              </svg>

              <svg className="absolute left-[10px] top-[40px] w-[80px] h-[80px] text-[#1f2937]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M 10 70 C 40 90, 60 40, 30 40 C 10 40, 10 60, 40 60 C 60 60, 80 40, 90 20" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <div className="absolute top-[45%] left-1/2 -translate-x-[60%] -translate-y-1/2 w-[100px] h-[130px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-4 flex flex-col z-20">
                <div className="w-[40px] h-[6px] bg-[#1a1a1a] rounded-full mb-4"></div>
                <div className="w-full h-[5px] bg-[#f1f5f9] rounded-full mb-3"></div>
                <div className="w-[85%] h-[5px] bg-[#f1f5f9] rounded-full mb-3"></div>
                <div className="w-[60%] h-[5px] bg-[#f1f5f9] rounded-full mb-3"></div>
                <div className="w-full h-[5px] bg-[#f1f5f9] rounded-full mb-3"></div>
                <div className="w-[70%] h-[5px] bg-[#f1f5f9] rounded-full"></div>
              </div>

              <div className="absolute top-[40%] left-[35%] w-[130px] h-[130px] z-30">
                <div className="absolute top-0 left-0 w-[90px] h-[90px] rounded-full border-[8px] border-[#f8fafc] bg-white/70 backdrop-blur-[4px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex items-center justify-center z-10">
                   <div className="relative z-20">
                     <div className="absolute w-[35px] h-[5px] bg-[#ff4b4b] rounded-full -rotate-45 -translate-x-1/2 -translate-y-1/2"></div>
                     <div className="absolute w-[35px] h-[5px] bg-[#ff4b4b] rounded-full rotate-45 -translate-x-1/2 -translate-y-1/2"></div>
                   </div>
                </div>
                <div className="absolute top-[72px] left-[72px] w-[22px] h-[55px] bg-[#e2e8f0] rounded-full -rotate-45 origin-top z-0 shadow-sm border-[2px] border-white/50">
                  <div className="absolute bottom-0 w-full h-[18px] bg-[#cbd5e1] rounded-b-full"></div>
                </div>
              </div>
            </div>

            <h2 className="text-[17px] md:text-[22px] font-bold text-[#1a1a1a] mb-2 md:mb-3 tracking-tight">No assignments yet</h2>
            <p className="text-[#6b7280] text-[11.5px] md:text-[15px] leading-relaxed mb-5 md:mb-8 font-medium px-4 md:px-4 max-w-[270px] md:max-w-[420px] mx-auto">
              Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
            </p>

            <Link href="/assignments/create" className="w-full max-w-[250px] md:max-w-[340px]">
              <button className="bg-[#1c1c1c] w-full text-white px-5 py-3 md:py-4 rounded-[100px] flex items-center justify-center gap-3 font-semibold text-[12.5px] md:text-[15px] shadow-sm hover:bg-black transition-all">
                <Plus className="w-[16px] h-[16px] md:w-5 md:h-5" strokeWidth={1.5} />
                Create Your First Assignment
              </button>
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col relative overflow-hidden">
          
          {/* Mobile Subheader (Back Button & Title) */}
          <div className="md:hidden flex items-center px-4 pt-0 pb-1.5">
            <button onClick={() => router.back()} className="w-9 h-9 md:w-11 md:h-11 bg-black/[0.04] rounded-full flex items-center justify-center shrink-0 transition-colors hover:bg-black/10">
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-[#1a1a1a]" strokeWidth={2.5} />
            </button>
            <h1 className="flex-1 text-center text-[15px] font-extrabold text-[#1a1a1a] pr-9 tracking-tight">Assignments</h1>
          </div>

          {/* Header & Subtitle */}
          <div className="hidden md:flex flex-col px-4 md:px-8 pt-2 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              <h1 className="text-[20px] font-bold text-[#1a1a1a]">Assignments</h1>
            </div>
            <p className="text-[13px] text-[#888] font-medium ml-4">Manage and create assignments for your classes.</p>
          </div>

          {/* Filter & Search Bar */}
          <div className="px-4 md:px-8 pb-3">
            <div className="bg-white rounded-full h-[46px] flex items-center px-5 border border-gray-200">
              <button className="flex items-center gap-2.5 text-[#888] border-r border-gray-200 pr-4 shrink-0 hover:text-gray-600 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-[16px] h-[16px]" strokeWidth="2">
                  <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" strokeLinejoin="round" />
                </svg>
                <span className="text-[13px] font-medium">Filter</span>
              </button>
              <div className="flex items-center gap-2.5 pl-4 flex-1">
                <Search className="w-[15px] h-[15px] text-[#888]" strokeWidth={2.5} />
                <input type="text" placeholder="Search Name" className="w-full bg-transparent text-[13px] font-medium text-[#1a1a1a] outline-none placeholder:text-[#888]" />
              </div>
            </div>
          </div>

          {/* Assignments List */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-32 hide-scrollbar relative z-0">
            <motion.div 
              initial="hidden" animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.08 } }
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
            >
              {assignments.map(a => (
                <motion.div 
                  key={a._id} 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } }
                  }}
                  whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.06)' }}
                  className="bg-[#f8f9fa] rounded-[16px] md:rounded-[20px] p-3.5 px-4 md:p-5 shadow-sm border border-gray-100 flex flex-col relative gap-2 md:gap-3 cursor-pointer group"
                >
                  <div className="flex justify-between items-start">
                    {editingId === a._id ? (
                      <input
                        autoFocus
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleRenameSubmit(a._id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit(a._id)}
                        className="font-extrabold text-[15px] md:text-[18px] text-[#1a1a1a] tracking-tight leading-tight pr-4 border-b-2 border-green-500 outline-none bg-transparent w-full"
                      />
                    ) : (
                      <h3 
                        className="font-extrabold text-[15px] md:text-[18px] text-[#1a1a1a] tracking-tight leading-tight pr-4 cursor-pointer hover:underline decoration-2 underline-offset-4 truncate"
                        onClick={() => router.push(`/assignments/${a._id}`)}
                      >
                        {a.title}
                      </h3>
                    )}
                    
                    <div className="relative shrink-0">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === a._id ? null : a._id);
                        }}
                        className="text-[#1a1a1a] hover:text-gray-600 -mt-1 -mr-2 p-1.5 rounded-full hover:bg-gray-200 transition-colors relative z-20"
                      >
                        <MoreVertical className="w-[18px] h-[18px]" strokeWidth={2.5} />
                      </button>

                      <AnimatePresence>
                      {openDropdownId === a._id && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(null);
                            }} 
                          />
                          <motion.div 
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className="absolute right-0 top-8 w-44 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 py-2 z-50 font-bold text-[13px] overflow-hidden"
                          >
                            <Link 
                              href={`/assignments/${a._id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="block w-full text-left px-5 py-2.5 hover:bg-gray-50 text-gray-800 transition-colors"
                            >
                              View Assignment
                            </Link>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdownId(null);
                                setEditingId(a._id);
                                setEditTitle(a.title);
                              }}
                              className="w-full text-left px-5 py-2.5 hover:bg-gray-50 text-gray-800 transition-colors"
                            >
                              Rename
                            </button>
                            <button 
                              onClick={async (e) => {
                                e.stopPropagation();
                                setOpenDropdownId(null);
                                try {
                                  await api.archiveAssignment(a._id);
                                  toast.success('Assignment archived');
                                  fetchAssignments();
                                } catch (err) { toast.error('Failed to archive assignment'); }
                              }}
                              className="w-full text-left px-5 py-2.5 hover:bg-gray-50 text-gray-800 transition-colors"
                            >
                              Archive
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdownId(null);
                                handleDelete(a._id);
                                toast.success('Assignment moved to bin');
                              }}
                              className="w-full text-left px-5 py-2.5 hover:bg-red-50 text-red-500 transition-colors"
                            >
                              Delete
                            </button>
                          </motion.div>
                        </>
                      )}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-[10px] md:text-[13px] tracking-tight mt-1 md:mt-auto">
                    <span className="font-extrabold text-[#1a1a1a] whitespace-nowrap">Assigned on : <span className="text-gray-500 font-medium ml-0.5">{new Date(a.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}</span></span>
                    <span className="font-extrabold text-[#1a1a1a] whitespace-nowrap">Due : <span className="text-gray-500 font-medium ml-0.5">21-06-2025</span></span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}

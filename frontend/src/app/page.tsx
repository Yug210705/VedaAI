'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Grid3X3, ArrowUpRight, 
  ChevronRight, MoreVertical, Sparkles, Plus, Users, Edit2, Archive, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { toast } from '@/components/Toaster';
import Topbar from '@/components/Topbar';

interface User {
  displayName?: string;
  [key: string]: string | number | boolean | null | undefined;
}

interface Assignment {
  _id?: string;
  title?: string;
  status?: 'GENERATING' | 'ACTIVE' | string;
  totalCount?: number;
  submittedCount?: number;
  class?: string;
  subject?: string;
  additionalInfo?: string;
  createdAt?: string;
  dueDate?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export default function Dashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const hasInitialized = useRef(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const close = (e: any) => {
      if (!e.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentsData, userData] = await Promise.all([
        api.getAssignments(),
        api.getUser()
      ]);
      setAssignments(assignmentsData);
      setUser(userData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchData();
    }
  }, []);

  const displayAssignments = assignments.slice(0, 5);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      
      <div className="hidden md:block">
        <Topbar title="Home" showBack={false} />
      </div>
      <div className="md:hidden">
        <Topbar title="Home" showBack={false} />
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="flex-1 overflow-y-auto px-5 pb-[140px] pt-2 md:px-8 md:pb-8 md:pt-4 hide-scrollbar">
        
        {loading ? (
          <div className="flex-1 flex items-center justify-center h-full min-h-[400px]">
            <div className="w-8 h-8 border-4 border-[#ff512f] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
        {/* Greeting Section */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="relative flex items-center justify-center shrink-0">
              <div className="w-2.5 h-2.5 bg-[#48c774] rounded-full shadow-[0_0_8px_rgba(72,199,116,0.8)] z-10"></div>
              <div className="absolute inset-0 bg-[#48c774] rounded-full animate-ping opacity-30"></div>
            </div>
            <h1 className="text-[18px] md:text-[20px] font-extrabold text-[#1a1a1a] tracking-tight">Hi {user?.displayName ? user.displayName.split(' ')[0] : 'There'} 👋</h1>
          </div>
          <p className="text-[#6b7280] text-[12px] md:text-[13px] ml-4 font-medium">
            Welcome Back, Ready to create your next assignment?
          </p>
        </div>

        {/* Top Metrics Row */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 xl:flex xl:flex-row gap-3 md:gap-4 mb-6 md:mb-8 pb-1"
        >
          
          {/* Card 1: Assignments Reviewed */}
          <motion.div variants={itemVariants} whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} className="col-span-1 bg-[#2d2d2d] rounded-[20px] md:rounded-[24px] px-3.5 md:px-5 py-4 md:p-6 text-white flex flex-col xl:flex-row items-center justify-between xl:flex-1 shadow-sm relative overflow-hidden h-[145px] md:h-[155px]">
            <h3 className="font-semibold text-[10.5px] md:text-[13px] text-gray-200 leading-snug xl:leading-relaxed z-10 text-center xl:text-left xl:max-w-[45%] mt-1">
              Assignments Reviewed
            </h3>
            
            {/* Arc Progress */}
            <div className="relative w-[80px] md:w-[90px] xl:w-[160px] h-[50px] md:h-[55px] xl:h-[85px] mt-2 xl:mt-0 xl:-translate-y-1.5 transform origin-bottom xl:origin-right mb-1">
              <svg className="absolute top-0 left-0 w-full h-full overflow-visible" viewBox="0 0 100 58" preserveAspectRatio="xMidYMax meet">
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#3d3d3d" strokeWidth="16" strokeLinecap="round" />
                <path 
                  d="M 10 50 A 40 40 0 0 1 90 50" 
                  fill="none" 
                  stroke="#ff512f" 
                  strokeWidth="16" 
                  strokeLinecap="round" 
                  strokeDasharray="125.66"
                  strokeDashoffset={125.66 * (1 - (assignments.length / Math.max(10, Math.ceil(assignments.length / 10) * 10)))}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute bottom-[2px] translate-y-1 left-1/2 -translate-x-1/2 flex flex-col items-center w-full">
                <span className="text-[20px] xl:text-[30px] font-black leading-none tracking-tighter text-white">{assignments.length}</span>
                <span className="hidden xl:block text-[11px] text-gray-400 font-medium mt-0.5">Total</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Time Saved By AI */}
          <motion.div variants={itemVariants} whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} className="col-span-1 bg-[#2d2d2d] rounded-[20px] md:rounded-[24px] px-3 py-4 md:p-6 text-white flex flex-col items-center justify-center xl:flex-1 shadow-sm relative h-[145px] md:h-[155px]">
            <h3 className="w-full text-center font-semibold text-[10.5px] md:text-[13px] text-gray-200 mb-2 md:mb-3">Time Saved By AI</h3>
            <span className="text-[22px] md:text-[34px] font-black text-white tracking-tighter leading-none mb-1.5 md:mb-2 mt-2">{(assignments.length * 1.5).toFixed(1)} hrs</span>
            <div className="flex items-center justify-center gap-1.5 text-[9px] md:text-[11px] font-semibold text-gray-400 tracking-wide text-center mt-3">
              {assignments.length > 0 ? (
                <>
                  <span className="md:hidden">+{((assignments.length * 0.4)).toFixed(1)} hrs</span>
                  <span className="hidden md:inline">+{((assignments.length * 0.4)).toFixed(1)} hrs from last month</span>
                </>
              ) : '0 hrs'} <ArrowUpRight className="hidden md:block w-3 h-3 md:w-3.5 md:h-3.5 text-white stroke-[3]" />
            </div>
          </motion.div>

          {/* Card 3: Total Assignments Graded + Avatar */}
          <motion.div variants={itemVariants} whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }} className="col-span-2 bg-white rounded-[20px] md:rounded-[24px] pl-5 pr-3 py-4 md:pl-6 md:pr-4 flex flex-row items-center justify-between xl:flex-[1.2] shadow-sm relative h-[130px] md:h-[155px] overflow-hidden">
            <div className="flex flex-col items-start justify-center h-full pt-1 max-w-[150px] md:max-w-none">
              <h3 className="font-extrabold text-[13px] md:text-[14px] text-[#1a1a1a] mb-2 md:mb-4 leading-tight">Total Assignments Graded</h3>
              <span className="text-[34px] md:text-[42px] font-black text-[#1a1a1a] tracking-tighter leading-none">{assignments.length || 128}</span>
              <p className="text-[11px] md:text-[12px] font-medium text-[#828282] mt-2 md:mt-2 leading-snug">Submitted, pending evaluation</p>
            </div>
            
            <div className="flex items-center justify-center w-[85px] h-[85px] md:w-[110px] md:h-[110px] rounded-full bg-[#f8f9fa] shrink-0 relative mr-1 md:mr-2">
               <img src="https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Teacher&backgroundColor=transparent" alt="AI Avatar" className="w-[85%] h-[85%] object-cover z-10" />
               <div className="absolute top-2 left-2 w-1.5 h-1.5 md:w-2 md:h-2 bg-[#ff512f] rounded-full opacity-80"></div>
               <div className="absolute bottom-2 right-2 w-1.5 h-1.5 md:w-1.5 md:h-1.5 bg-[#ff512f] rounded-full opacity-80"></div>
               <div className="absolute top-1/2 -right-1 w-1.5 h-1.5 md:w-2 md:h-2 bg-[#ff512f] rounded-full opacity-80"></div>
               <div className="absolute -left-1 bottom-1/3 w-1.5 h-1.5 md:w-1.5 md:h-1.5 bg-[#ff512f] rounded-full opacity-80"></div>
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Assignments Header */}
        <div className="mb-5 flex items-center justify-between gap-2 pr-12 md:pr-0">
          <div className="flex items-center gap-2 shrink-1 min-w-0">
            <div className="relative flex items-center justify-center shrink-0">
              <div className="w-2.5 h-2.5 bg-[#48c774] rounded-full shadow-[0_0_8px_rgba(72,199,116,0.8)] z-10"></div>
              <div className="absolute inset-0 bg-[#48c774] rounded-full animate-ping opacity-30"></div>
            </div>
            <h2 className="text-[15px] md:text-[16px] font-extrabold text-[#1a1a1a] tracking-tight truncate leading-tight">Recent Assignments</h2>
          </div>
          <button className="bg-white hover:bg-gray-50 border border-gray-100 px-3 md:px-4 py-1.5 rounded-full text-[11px] md:text-[12px] font-bold text-[#1a1a1a] shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
            View All <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 stroke-[3] md:ml-0.5" />
          </button>
        </div>

        {/* Recent Assignments Grid */}
        {displayAssignments.length === 0 ? (
          <div className="bg-white rounded-[20px] md:rounded-[24px] p-6 md:p-8 text-center text-gray-500 font-semibold shadow-sm mb-6 md:mb-8 text-[13px] md:text-[15px]">
            You don&apos;t have any assignments yet. Create one to get started!
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 md:mb-8"
          >
            {displayAssignments.map((assignment: any, index: number) => {
              const status = assignment.status === 'GENERATING' ? 'Generating' : 'Active';
              const isActive = status.toLowerCase() === 'active';
              
              const totalCount = assignment.totalCount || 50;
              const submittedCount = assignment.submittedCount !== undefined ? assignment.submittedCount : 0;
              const progressPercentage = totalCount > 0 ? (submittedCount / totalCount) * 100 : 0;

              return (
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                  key={assignment._id || index} 
                  className="dropdown-container bg-white rounded-[24px] p-5 md:p-6 pb-6 md:pb-7 shadow-sm flex flex-col justify-between min-h-[170px] md:h-[180px] cursor-pointer transition-all relative overflow-visible"
                  onClick={() => router.push(`/assignments/${assignment._id || '1'}`)}
                >
                  <div className="flex justify-between items-center mb-2 gap-2">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-1">
                      <h3 className="font-extrabold text-[15px] md:text-[16px] text-[#1a1a1a] tracking-tight leading-none truncate">
                        {assignment.title}
                      </h3>
                      <span className={clsx(
                        "px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold tracking-wide shrink-0",
                        isActive ? "bg-[#dcfce7] text-[#16a34a]" : "bg-gray-100 text-gray-500"
                      )}>
                        {isActive ? 'Active' : 'Closed'}
                      </span>
                    </div>
                    <div className="relative z-20">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === (assignment._id || String(index)) ? null : (assignment._id || String(index)));
                        }}
                        className="text-gray-400 hover:text-gray-700 transition-colors p-1 shrink-0 -mr-2 rounded-full hover:bg-gray-50"
                      >
                        <MoreVertical className="w-[18px] h-[18px]" />
                      </button>
                      
                      <AnimatePresence>
                        {activeDropdown === (assignment._id || String(index)) && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 py-1.5 z-[100]"
                          >
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setActiveDropdown(null);
                                router.push(`/assignments/${assignment._id || '1'}`);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[13px] font-semibold text-gray-700 flex items-center gap-2"
                            >
                              <Edit2 className="w-3.5 h-3.5" /> Edit details
                            </button>
                            <button 
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setActiveDropdown(null);
                                try {
                                  await api.archiveAssignment(assignment._id);
                                  toast.success('Assignment archived');
                                  fetchData();
                                } catch (err) { toast.error('Failed to archive'); }
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[13px] font-semibold text-gray-700 flex items-center gap-2"
                            >
                              <Archive className="w-3.5 h-3.5" /> Archive
                            </button>
                            <button 
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setActiveDropdown(null);
                                try {
                                  await api.deleteAssignment(assignment._id);
                                  toast.success('Assignment moved to bin');
                                  fetchData();
                                } catch (err) { toast.error('Failed to delete'); }
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-red-50 text-[13px] font-semibold text-red-600 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-[11px] md:text-[12px] font-medium text-[#9ca3af] mb-4 min-w-0 truncate">
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    <span className="shrink-0">{assignment.class || 'Class 10-A'}</span> <span className="mx-1 text-[9px] md:text-[10px] shrink-0">•</span> <span className="truncate">{assignment.subject || (assignment.additionalInfo || 'Science')}</span>
                  </div>
                  
                  <div className="flex justify-between items-end mt-auto pb-3 gap-2">
                    <div className="flex items-baseline gap-1.5 shrink-0">
                      <div className="flex items-baseline text-[#1a1a1a]">
                        <span className="text-[24px] md:text-[28px] font-black tracking-tighter leading-none">{submittedCount}</span>
                        <span className="text-[13px] md:text-[15px] font-bold text-[#9ca3af] tracking-tight ml-[1px]">/{totalCount}</span>
                      </div>
                      <span className="text-[10px] md:text-[11px] font-bold text-[#6b7280] tracking-wide">Submitted</span>
                    </div>
                    <div className="text-right flex flex-col justify-end gap-1.5">
                      <span className="text-[9.5px] md:text-[11px] font-bold text-[#9ca3af] tracking-wide whitespace-nowrap truncate leading-normal">
                        <span className="text-[#1a1a1a]">Assigned :</span> {assignment.createdAt ? new Date(assignment.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-') : new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}
                      </span>
                      <span className="text-[9.5px] md:text-[11px] font-bold text-[#9ca3af] tracking-wide whitespace-nowrap truncate leading-normal">
                        <span className="text-[#1a1a1a]">Due :</span> {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('en-GB').replace(/\//g, '-') : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Progress Bar */}
                  <div className="absolute bottom-5 left-6 right-6 h-[4.5px] bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#ff512f] rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Bottom Banners Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4"
        >
          
          {/* Left Card: AI Assignment Grading */}
          <motion.div variants={itemVariants} whileHover={{ y: -4, boxShadow: '0 15px 35px rgba(255,81,47,0.15)' }} className="bg-white rounded-[20px] md:rounded-[24px] p-5 md:p-6 shadow-sm border border-[#ff512f] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-4 relative h-auto md:h-[130px] min-h-[150px] md:min-h-0 cursor-pointer group">
            <div className="flex flex-col justify-center w-full md:max-w-[55%]">
               <h3 className="text-[15px] md:text-[16px] font-extrabold text-[#1a1a1a] tracking-tight">AI Assignment Grading</h3>
              <p className="text-[12.5px] md:text-[11.5px] font-medium text-[#828282] mt-1.5 leading-relaxed">
                Create assignments and automatically evaluate student responses.
              </p>
            </div>
            <Link href="/assignments/create" className="w-full md:w-auto shrink-0 md:mr-2">
              <button className="bg-[#1c1c1c] w-full justify-center text-white px-5 md:px-4 py-3.5 md:py-2.5 rounded-full flex items-center gap-2 font-semibold text-[13.5px] md:text-[12px] shadow-sm hover:bg-black transition-all">
                <Plus className="w-4 h-4 md:w-3.5 md:h-3.5 text-gray-300" strokeWidth={2.5} />
                Create Assignment
              </button>
            </Link>
          </motion.div>

          {/* Right Card: AI Exam Grading */}
          <motion.div variants={itemVariants} whileHover={{ y: -4, boxShadow: '0 15px 35px rgba(0,0,0,0.06)' }} className="bg-white rounded-[20px] md:rounded-[24px] p-5 md:p-6 shadow-sm border border-gray-100 flex flex-row items-center justify-between gap-3 md:gap-4 relative h-auto md:h-[130px] min-h-[140px] md:min-h-0 cursor-pointer group" onClick={() => toast.info('AI Exam Grading module coming soon!')}>
            <div className="flex flex-col justify-center max-w-[80%] md:max-w-[75%]">
               <h3 className="text-[15px] md:text-[16px] font-extrabold text-[#1a1a1a] tracking-tight">AI Exam Grading</h3>
              <p className="text-[12.5px] md:text-[11.5px] font-medium text-[#828282] mt-1.5 leading-relaxed">
                Automatically evaluate exam papers, generate instant scores, and provide detailed feedback and performance insights.
              </p>
            </div>
            <button 
              onClick={() => toast.info('AI Exam Grading module coming soon!')}
              className="shrink-0 mr-2 bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#1a1a1a] w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </motion.div>

        </motion.div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}

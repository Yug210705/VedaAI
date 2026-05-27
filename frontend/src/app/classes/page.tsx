'use client';

import React, { useState, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import { 
  MoreVertical, Users, TrendingUp, Plus, ChevronRight, BookOpen, GraduationCap, Clock, Edit2, Archive, Trash2
} from 'lucide-react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/Toaster';
import Modal from '@/components/Modal';
import { api } from '@/lib/api';

export default function MyClassesPage() {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
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

  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      const data = await api.getClasses();
      setClasses(data);
    } catch (error) {
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const totalStudents = classes.reduce((sum, c) => sum + (c.studentsCount || 0), 0);
  const avgOverall = classes.length ? Math.round(classes.reduce((sum, c) => sum + parseInt(c.avgScore || '0'), 0) / classes.length) : 0;
  const totalPending = classes.reduce((sum, c) => sum + (c.activeTasks || 0), 0);

  return (
    <div className="h-full flex flex-col pb-4">
      <Topbar title="My Classes" showBack={true} />
      <div className="flex-1 flex flex-col relative bg-[#eef0f3] ml-[11px] mr-4 rounded-[16px] overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 pb-[140px] md:p-8 hide-scrollbar">
        
        {/* Summary Banner */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          
          {/* Hero Card */}
          <div className="bg-[#ff6230] rounded-[24px] p-6 md:p-8 flex-1 text-white relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[120px] h-[120px] bg-white/10 rounded-full translate-y-1/2 -translate-x-1/3"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="w-5 h-5 text-white/80" />
                <span className="text-[12px] font-bold text-white/80 uppercase tracking-wider">Teaching Overview</span>
              </div>
              <h2 className="text-[28px] font-black tracking-tight mb-4 leading-tight">You have {classes.length} active<br/>classes this semester</h2>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-white text-[#ff6230] px-5 py-2.5 rounded-full flex items-center gap-2 font-bold text-[13px] shadow-sm hover:bg-gray-50 transition-all"
              >
                <Plus className="w-4 h-4" strokeWidth={3} />
                Add New Class
              </button>
            </div>
          </div>

          {/* Stats Column */}
          <div className="flex flex-col gap-4 w-full md:w-[260px] shrink-0">
            <div className="bg-white rounded-[24px] p-5 shadow-sm flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-[#eef0f3] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-[#4f4f4f]" strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">Total Students</span>
                <p className="text-[28px] font-black text-[#1a1a1a] leading-none tracking-tighter">{totalStudents}</p>
              </div>
            </div>
            <div className="bg-[#2d2d2d] rounded-[24px] p-5 shadow-sm flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Avg Score</span>
                <p className="text-[28px] font-black text-white leading-none tracking-tighter">{avgOverall}<span className="text-[16px] text-gray-400 ml-0.5">%</span></p>
              </div>
            </div>
            <div className="bg-white rounded-[24px] p-5 shadow-sm flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-[#fff0eb] flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-[#ff6230]" strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">Pending Tasks</span>
                <p className="text-[28px] font-black text-[#ff6230] leading-none tracking-tighter">{totalPending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#48c774] rounded-full"></div>
            <h2 className="text-[18px] font-extrabold text-[#1a1a1a] tracking-tight">All Classes</h2>
          </div>
          <span className="text-[12px] font-bold text-[#9ca3af]">{classes.length} Classes</span>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <div 
              key={cls._id || cls.id}
              onClick={() => router.push(`/classes/${cls._id || cls.id}`)}
              className="bg-white rounded-[24px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col h-[240px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all cursor-pointer relative group dropdown-container"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="font-extrabold text-[18px] text-[#1a1a1a] tracking-tight mb-2">
                    {cls.name}
                  </h3>
                  <span className="bg-[#f8f9fa] border border-gray-100 text-[#4f4f4f] px-3 py-1 rounded-full text-[11px] font-bold tracking-wide">
                    {cls.subject}
                  </span>
                </div>
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveDropdown(activeDropdown === (cls._id || cls.id) ? null : (cls._id || cls.id));
                    }}
                    className="text-gray-400 hover:bg-gray-50 hover:text-gray-800 transition-colors -mr-2 p-1.5 rounded-full relative z-20"
                  >
                    <MoreVertical className="w-[18px] h-[18px]" />
                  </button>
                  
                  {activeDropdown === (cls._id || cls.id) && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveDropdown(null);
                          setEditingClass(cls);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[13px] font-semibold text-gray-700 flex items-center gap-2"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit Class
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveDropdown(null);
                          toast.success('Class archived');
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
                            await api.deleteClass(cls._id || cls.id);
                            toast.success('Class deleted');
                            fetchClasses();
                          } catch (err) {
                            toast.error('Failed to delete class');
                          }
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-[13px] font-semibold text-red-600 flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 mb-auto">
                <div className="flex flex-col items-center bg-[#f8f9fa] border border-gray-50 rounded-2xl py-3 px-2">
                  <span className="text-[20px] font-black text-[#1a1a1a] leading-none mb-1">{cls.studentsCount || 0}</span>
                  <span className="text-[10px] font-bold text-[#828282] uppercase tracking-wider flex items-center gap-1">
                    <Users className="w-3 h-3" /> Students
                  </span>
                </div>
                <div className="flex flex-col items-center bg-[#f8f9fa] border border-gray-50 rounded-2xl py-3 px-2">
                  <span className={clsx(
                    "text-[20px] font-black leading-none mb-1",
                    parseInt(cls.avgScore || '0') >= 80 ? "text-[#16a34a]" : parseInt(cls.avgScore || '0') >= 70 ? "text-[#f59e0b]" : "text-[#dc2626]"
                  )}>
                    {cls.avgScore || '0%'}
                  </span>
                  <span className="text-[10px] font-bold text-[#828282] uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Avg
                  </span>
                </div>
                <div className="flex flex-col items-center bg-[#f8f9fa] border border-gray-50 rounded-2xl py-3 px-2">
                  <span className="text-[20px] font-black text-[#1a1a1a] leading-none mb-1">{cls.activeTasks || 0}</span>
                  <span className="text-[10px] font-bold text-[#828282] uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Tasks
                  </span>
                </div>
              </div>

              {/* Footer / Status */}
              <div className="pt-4 border-t border-[#eef0f3] flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className={clsx(
                    "w-2 h-2 rounded-full",
                    (cls.activeTasks || 0) > 0 ? "bg-[#ff512f]" : "bg-[#16a34a]"
                  )}></div>
                  <span className="text-[12px] font-bold text-[#6b7280]">
                    {(cls.activeTasks || 0) > 0 
                      ? `${cls.activeTasks} Active` 
                      : 'All caught up!'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-[#9ca3af]">
                  <Clock className="w-3 h-3" />
                  Upcoming
                </div>
              </div>
            </div>
          ))}
        </div>

        </div>
      </div>
      <Modal isOpen={isAddModalOpen || !!editingClass} onClose={() => { setIsAddModalOpen(false); setEditingClass(null); }} title={editingClass ? "Edit Class" : "Create New Class"}>
        <form key={editingClass ? editingClass._id : 'new'} className="space-y-4" onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const name = formData.get('name');
          const subject = formData.get('subject');
          
          try {
            if (editingClass) {
              await api.updateClass(editingClass._id || editingClass.id, { name, subject });
              setEditingClass(null);
              toast.success('Class updated successfully!');
            } else {
              await api.createClass({ name, subject });
              setIsAddModalOpen(false);
              toast.success('Class created successfully!');
            }
            fetchClasses();
          } catch (err) {
            toast.error(editingClass ? 'Failed to update class' : 'Failed to create class');
          }
        }}>
          <div>
            <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Class Name</label>
            <input name="name" required type="text" defaultValue={editingClass?.name || ''} placeholder="e.g. 10-A Science" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Subject</label>
            <input name="subject" required type="text" defaultValue={editingClass?.subject || ''} placeholder="e.g. Physics" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
          </div>
          <div className="pt-4 border-t border-gray-100">
            <button type="submit" className="w-full bg-[#ff6230] text-white font-bold text-[14px] px-6 py-3.5 rounded-xl hover:bg-[#ff7a50] transition-colors shadow-sm">
              {editingClass ? 'Save Changes' : 'Create Class'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import { 
  Users, Plus, MoreVertical, Edit2, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { toast } from '@/components/Toaster';
import Modal from '@/components/Modal';
import { api } from '@/lib/api';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      const data = await api.getStudents();
      setStudents(data);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();

    const closeDropdown = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener('click', closeDropdown);
    return () => window.removeEventListener('click', closeDropdown);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      rollNumber: formData.get('rollNumber'),
      grade: formData.get('grade'),
    };

    try {
      if (editingStudent) {
        await api.updateStudent(editingStudent._id, data);
        toast.success('Student updated');
      } else {
        await api.createStudent(data);
        toast.success('Student added');
      }
      setIsModalOpen(false);
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      toast.error('Failed to save student');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this student?')) return;
    try {
      await api.deleteStudent(id);
      toast.success('Student removed');
      fetchStudents();
    } catch (err) {
      toast.error('Failed to remove student');
    }
  };

  return (
    <div className="h-full flex flex-col pb-4">
      <Topbar title="Students" showBack={false} />
      <div className="flex-1 flex flex-col relative bg-[#f8f9fa] md:mx-3 md:rounded-[24px] overflow-hidden md:shadow-sm md:border border-gray-100">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 xl:p-10 pb-[140px] hide-scrollbar">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-[18px] md:text-[22px] font-extrabold text-[#1a1a1a] tracking-tight mb-1">Student Roster</h2>
              <p className="text-[12px] md:text-[14px] text-gray-500 font-medium">Manage the students enrolled in your organization.</p>
            </div>
            <button 
              onClick={() => { setEditingStudent(null); setIsModalOpen(true); }}
              className="bg-[#1a1a1a] text-white font-bold text-[13px] px-5 py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-black transition-all shadow-[0_4px_14px_rgba(0,0,0,0.15)] active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Student
            </button>
          </div>

          <div className="bg-white rounded-[20px] shadow-sm border border-gray-100">
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 p-4 md:px-6 md:py-4 bg-[#f8f9fa] border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider rounded-t-[20px]">
              <div>Student</div>
              <div>Roll Number</div>
              <div>Grade</div>
              <div className="text-right">Actions</div>
            </div>

            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="p-8 text-center text-gray-400 font-medium">Loading students...</div>
              ) : students.length === 0 ? (
                <div className="p-8 text-center text-gray-400 font-medium">No students added yet.</div>
              ) : (
                students.map((student) => (
                  <div key={student._id} className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_auto] gap-4 p-4 md:px-6 items-start md:items-center hover:bg-gray-50 transition-colors dropdown-container relative last:rounded-b-[20px]">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200 flex items-center justify-center font-bold text-blue-600 shrink-0">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[14px] text-[#1a1a1a] truncate">{student.name}</div>
                        <div className="text-[12px] text-gray-500 truncate">{student.email}</div>
                      </div>
                    </div>
                    <div className="w-full md:w-auto flex justify-between md:block items-center">
                      <span className="md:hidden text-[11px] font-bold text-gray-400 uppercase">Roll No</span>
                      <span className="font-semibold text-[13px] text-gray-700">{student.rollNumber}</span>
                    </div>
                    <div className="w-full md:w-auto flex justify-between md:block items-center">
                      <span className="md:hidden text-[11px] font-bold text-gray-400 uppercase">Grade</span>
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-[12px] font-bold">Grade {student.grade}</span>
                    </div>
                    
                    <div className="absolute top-4 right-4 md:static">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === student._id ? null : student._id);
                        }}
                        className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === student._id && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-4 top-10 w-36 bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-xl py-1 z-50"
                          >
                            <button 
                              onClick={() => { setActiveDropdown(null); setEditingStudent(student); setIsModalOpen(true); }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[13px] font-semibold text-gray-700 flex items-center gap-2"
                            >
                              <Edit2 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button 
                              onClick={() => { setActiveDropdown(null); handleDelete(student._id); }}
                              className="w-full text-left px-4 py-2 hover:bg-red-50 text-[13px] font-semibold text-red-600 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingStudent(null); }} title={editingStudent ? "Edit Student" : "Add New Student"}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Full Name</label>
            <input name="name" required defaultValue={editingStudent?.name || ''} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-black/5" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Email Address</label>
            <input name="email" type="email" required defaultValue={editingStudent?.email || ''} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-black/5" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Roll Number</label>
              <input name="rollNumber" required defaultValue={editingStudent?.rollNumber || ''} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-black/5" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Grade / Year</label>
              <input name="grade" required defaultValue={editingStudent?.grade || ''} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-black/5" />
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-[#1a1a1a] text-white font-bold text-[14px] px-6 py-3 rounded-xl hover:bg-black transition-all">
              {editingStudent ? "Save Changes" : "Add Student"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

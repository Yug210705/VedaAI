'use client';

import React from 'react';
import { Mail, Phone, MapPin, Calendar, BookOpen, Clock, Building2, GraduationCap, Edit, KeyRound } from 'lucide-react';
import Topbar from '@/components/Topbar';

export default function ProfilePage() {
  return (
    <div className="h-full flex flex-col relative w-full overflow-hidden">
      <Topbar title="My Profile" showBack />
      
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-10">
        <div className="max-w-[1000px] mx-auto px-4 md:px-8 mt-4">
          
          {/* Header Card / Cover */}
          <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 mb-8 relative">
            {/* Cover Photo */}
            <div className="h-[200px] w-full bg-gradient-to-r from-orange-400 to-[#ff512f] relative">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            </div>
            
            {/* Profile Info */}
            <div className="px-8 pb-8 pt-20 relative flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
              
              {/* Avatar absolute positioning */}
              <div className="absolute -top-[70px] left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0">
                <div className="w-[140px] h-[140px] rounded-[32px] bg-white p-2 shadow-xl border border-gray-50">
                  <div className="w-full h-full rounded-[24px] overflow-hidden bg-[#fce3c7]">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Madhur" alt="Madhur Rastogi" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-start md:pl-[170px] mt-4 md:mt-0 w-full text-center md:text-left">
                <h1 className="text-[28px] font-black text-[#1a1a1a] tracking-tight">Madhur Rastogi</h1>
                <p className="text-[15px] font-medium text-[#6b7280] mt-1 flex items-center justify-center md:justify-start gap-2">
                  <GraduationCap className="w-4 h-4" /> Senior Science Teacher
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-center">
                <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200 text-[#1a1a1a] font-semibold text-[13px] hover:bg-gray-50 transition-colors shadow-sm w-full md:w-auto">
                  <KeyRound className="w-4 h-4 text-gray-500" strokeWidth={2.5} />
                  Change Password
                </button>
                <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1c1c1c] border border-[#333] text-white font-semibold text-[13px] hover:bg-black transition-colors shadow-[0_4px_14px_rgba(0,0,0,0.25)] w-full md:w-auto">
                  <Edit className="w-4 h-4" strokeWidth={2.5} />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column - Personal Info */}
            <div className="md:col-span-1 space-y-8">
              
              {/* About Card */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                <h3 className="text-[16px] font-extrabold text-[#1a1a1a] tracking-tight mb-5 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#ff512f]"></div>
                  Personal Details
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-gray-400">
                      <Mail className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email Address</span>
                      <span className="text-[14px] font-semibold text-[#2d2d2d]">madhur.r@school.edu</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-gray-400">
                      <Phone className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Phone Number</span>
                      <span className="text-[14px] font-semibold text-[#2d2d2d]">+91 98765 43210</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-gray-400">
                      <MapPin className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Location</span>
                      <span className="text-[14px] font-semibold text-[#2d2d2d]">Mumbai, India</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column - Work Info */}
            <div className="md:col-span-2 space-y-8">
              
              {/* Work Information Card */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                <h3 className="text-[16px] font-extrabold text-[#1a1a1a] tracking-tight mb-5 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#48c774]"></div>
                  Professional Summary
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">Department</span>
                    </div>
                    <p className="text-[15px] font-black text-[#1a1a1a]">Science Faculty</p>
                  </div>
                  
                  <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">Date Joined</span>
                    </div>
                    <p className="text-[15px] font-black text-[#1a1a1a]">August 14, 2019</p>
                  </div>

                  <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">Total Classes</span>
                    </div>
                    <p className="text-[15px] font-black text-[#1a1a1a]">5 Sections</p>
                  </div>

                  <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">Status</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <p className="text-[15px] font-black text-[#1a1a1a]">Active</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

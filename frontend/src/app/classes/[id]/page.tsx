'use client';

import React, { useState, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import { 
  Users, TrendingUp, BookOpen, Clock, Award, Target, 
  ChevronRight, Mail, MoreVertical, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import clsx from 'clsx';
import { useParams, useRouter } from 'next/navigation';
import { toast } from '@/components/Toaster';
import { api } from '@/lib/api';

// Dummy data store
const classesData: Record<string, any> = {
  '1': {
    name: 'Class 10-A', subject: 'Science', students: 34, avgScore: 82, activeAssignments: 2,
    totalAssignments: 12, nextClass: 'Today, 10:30 AM', topScore: 96, lowestScore: 42,
    teacher: 'Madhur Rastogi', schedule: 'Mon, Wed, Fri — 10:30 AM',
    studentList: [
      { name: 'Aarav Sharma', roll: '001', score: 96, grade: 'A', status: 'active', submitted: 12 },
      { name: 'Simran Kaur', roll: '002', score: 88, grade: 'A', status: 'active', submitted: 11 },
      { name: 'Rohan Gupta', roll: '003', score: 82, grade: 'B', status: 'active', submitted: 12 },
      { name: 'Priya Patel', roll: '004', score: 79, grade: 'B', status: 'active', submitted: 10 },
      { name: 'Karan Singh', roll: '005', score: 75, grade: 'B', status: 'active', submitted: 12 },
      { name: 'Ananya Reddy', roll: '006', score: 91, grade: 'A', status: 'active', submitted: 12 },
      { name: 'Dev Mehta', roll: '007', score: 68, grade: 'C', status: 'active', submitted: 9 },
      { name: 'Ishita Verma', roll: '008', score: 85, grade: 'A', status: 'active', submitted: 11 },
      { name: 'Arjun Nair', roll: '009', score: 72, grade: 'B', status: 'active', submitted: 12 },
      { name: 'Meera Joshi', roll: '010', score: 42, grade: 'D', status: 'at-risk', submitted: 7 },
      { name: 'Vivek Kumar', roll: '011', score: 63, grade: 'C', status: 'active', submitted: 10 },
      { name: 'Neha Agarwal', roll: '012', score: 87, grade: 'A', status: 'active', submitted: 12 },
    ],
    recentAssignments: [
      { title: 'Assignment on Motion', status: 'Graded', submitted: 34, total: 34, avgScore: 78 },
      { title: 'Quiz on Electricity', status: 'Graded', submitted: 32, total: 34, avgScore: 85 },
      { title: 'Lab Report: Magnetism', status: 'Active', submitted: 28, total: 34, avgScore: null },
    ]
  },
  '2': {
    name: 'Class 9-B', subject: 'Mathematics', students: 41, avgScore: 76, activeAssignments: 1,
    totalAssignments: 8, nextClass: 'Today, 1:00 PM', topScore: 94, lowestScore: 38,
    teacher: 'Madhur Rastogi', schedule: 'Tue, Thu — 1:00 PM',
    studentList: [
      { name: 'Rahul Verma', roll: '001', score: 94, grade: 'A', status: 'active', submitted: 8 },
      { name: 'Sneha Das', roll: '002', score: 81, grade: 'A', status: 'active', submitted: 7 },
      { name: 'Amit Yadav', roll: '003', score: 72, grade: 'B', status: 'active', submitted: 8 },
      { name: 'Pooja Tiwari', roll: '004', score: 65, grade: 'C', status: 'active', submitted: 6 },
      { name: 'Rajesh Kumar', roll: '005', score: 38, grade: 'D', status: 'at-risk', submitted: 4 },
      { name: 'Kavita Sharma', roll: '006', score: 88, grade: 'A', status: 'active', submitted: 8 },
    ],
    recentAssignments: [
      { title: 'Algebra Practice Set', status: 'Graded', submitted: 39, total: 41, avgScore: 74 },
      { title: 'Geometry Worksheet', status: 'Active', submitted: 30, total: 41, avgScore: null },
    ]
  },
  '3': {
    name: 'Class 11-Science', subject: 'Physics', students: 28, avgScore: 88, activeAssignments: 0,
    totalAssignments: 15, nextClass: 'Tomorrow, 9:00 AM', topScore: 98, lowestScore: 55,
    teacher: 'Madhur Rastogi', schedule: 'Mon, Wed, Fri — 9:00 AM',
    studentList: [
      { name: 'Aditya Mishra', roll: '001', score: 98, grade: 'A', status: 'active', submitted: 15 },
      { name: 'Riya Chopra', roll: '002', score: 92, grade: 'A', status: 'active', submitted: 15 },
      { name: 'Varun Sinha', roll: '003', score: 85, grade: 'A', status: 'active', submitted: 14 },
      { name: 'Nisha Pandey', roll: '004', score: 78, grade: 'B', status: 'active', submitted: 13 },
      { name: 'Suresh Rao', roll: '005', score: 55, grade: 'C', status: 'at-risk', submitted: 10 },
    ],
    recentAssignments: [
      { title: 'Kinematics Problem Set', status: 'Graded', submitted: 28, total: 28, avgScore: 86 },
      { title: 'Wave Optics Lab', status: 'Graded', submitted: 27, total: 28, avgScore: 90 },
    ]
  },
  '4': {
    name: 'Class 8-C', subject: 'Science', students: 39, avgScore: 71, activeAssignments: 3,
    totalAssignments: 10, nextClass: 'Wed, 11:15 AM', topScore: 89, lowestScore: 35,
    teacher: 'Madhur Rastogi', schedule: 'Mon, Wed — 11:15 AM',
    studentList: [
      { name: 'Tanvi Bhatt', roll: '001', score: 89, grade: 'A', status: 'active', submitted: 10 },
      { name: 'Harsh Jain', roll: '002', score: 74, grade: 'B', status: 'active', submitted: 9 },
      { name: 'Divya Saxena', roll: '003', score: 62, grade: 'C', status: 'active', submitted: 8 },
      { name: 'Mohit Gupta', roll: '004', score: 35, grade: 'D', status: 'at-risk', submitted: 5 },
    ],
    recentAssignments: [
      { title: 'Cell Biology Quiz', status: 'Active', submitted: 25, total: 39, avgScore: null },
      { title: 'Ecosystem Diagram', status: 'Active', submitted: 18, total: 39, avgScore: null },
      { title: 'Periodic Table Test', status: 'Active', submitted: 12, total: 39, avgScore: null },
    ]
  },
  '5': {
    name: 'Class 12-Science', subject: 'Chemistry', students: 25, avgScore: 91, activeAssignments: 0,
    totalAssignments: 18, nextClass: 'Thu, 8:30 AM', topScore: 99, lowestScore: 68,
    teacher: 'Madhur Rastogi', schedule: 'Tue, Thu — 8:30 AM',
    studentList: [
      { name: 'Sakshi Rawat', roll: '001', score: 99, grade: 'A', status: 'active', submitted: 18 },
      { name: 'Kunal Deshmukh', roll: '002', score: 93, grade: 'A', status: 'active', submitted: 18 },
      { name: 'Pallavi Iyer', roll: '003', score: 87, grade: 'A', status: 'active', submitted: 17 },
      { name: 'Deepak Chauhan', roll: '004', score: 68, grade: 'C', status: 'active', submitted: 14 },
    ],
    recentAssignments: [
      { title: 'Organic Chemistry Test', status: 'Graded', submitted: 25, total: 25, avgScore: 88 },
      { title: 'Electrochemistry Lab', status: 'Graded', submitted: 24, total: 25, avgScore: 92 },
    ]
  }
};

function getGradeColor(grade: string) {
  switch (grade) {
    case 'A': return 'text-[#16a34a] bg-[#dcfce7]';
    case 'B': return 'text-[#2563eb] bg-[#dbeafe]';
    case 'C': return 'text-[#f59e0b] bg-[#fef3c7]';
    case 'D': return 'text-[#dc2626] bg-[#fee2e2]';
    default: return 'text-[#6b7280] bg-[#f3f4f6]';
  }
}

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;
  
  const [realClass, setRealClass] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const data = await api.getClass(classId);
        setRealClass(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (classesData[classId]) {
      setRealClass(classesData[classId]);
      setLoading(false);
    } else {
      fetchClass();
    }
  }, [classId]);

  if (loading) {
    return (
      <div className="h-full flex flex-col pb-4">
        <Topbar title="Loading Class..." showBack={true} />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#ff512f] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const baseCls = classesData['1'];
  const cls = realClass ? { ...baseCls, ...realClass } : baseCls;

  const gradeA = cls.studentList.filter((s: any) => s.grade === 'A').length;
  const gradeB = cls.studentList.filter((s: any) => s.grade === 'B').length;
  const gradeC = cls.studentList.filter((s: any) => s.grade === 'C').length;
  const gradeD = cls.studentList.filter((s: any) => s.grade === 'D').length;
  const atRisk = cls.studentList.filter((s: any) => s.status === 'at-risk').length;

  return (
    <div className="h-full flex flex-col pb-4">
      <Topbar title={cls.name} showBack={true} />
      <div className="flex-1 flex flex-col relative bg-[#eef0f3] ml-[11px] mr-4 rounded-[16px] overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 hide-scrollbar">

        {/* Header Info */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          
          {/* Class Info Hero */}
          <div className="bg-[#2d2d2d] rounded-[24px] p-6 md:p-8 flex-1 text-white relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-[180px] h-[180px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/15 text-white/90 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide">{cls.subject}</span>
              <span className="bg-[#48c774]/20 text-[#48c774] px-3 py-1 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#48c774]"></div>
                Active
              </span>
            </div>
            <h1 className="text-[32px] font-black tracking-tight mt-3 mb-2">{cls.name}</h1>
            <p className="text-[13px] font-medium text-gray-400 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> {cls.schedule}
            </p>
            <p className="text-[13px] font-medium text-gray-400 mt-1">Next class: <span className="text-white font-bold">{cls.nextClass}</span></p>
          </div>

          {/* Stat Tiles */}
          <div className="grid grid-cols-2 gap-4 w-full md:w-[340px] shrink-0">
            <div className="bg-white rounded-[20px] p-5 shadow-sm flex flex-col items-center justify-center">
              <span className="text-[32px] font-black text-[#1a1a1a] tracking-tighter leading-none">{cls.students}</span>
              <span className="text-[11px] font-bold text-[#9ca3af] mt-1 uppercase tracking-wider">Students</span>
            </div>
            <div className="bg-white rounded-[20px] p-5 shadow-sm flex flex-col items-center justify-center">
              <span className={clsx("text-[32px] font-black tracking-tighter leading-none", cls.avgScore >= 80 ? "text-[#16a34a]" : cls.avgScore >= 70 ? "text-[#f59e0b]" : "text-[#dc2626]")}>{cls.avgScore}%</span>
              <span className="text-[11px] font-bold text-[#9ca3af] mt-1 uppercase tracking-wider">Avg Score</span>
            </div>
            <div className="bg-white rounded-[20px] p-5 shadow-sm flex flex-col items-center justify-center">
              <span className="text-[32px] font-black text-[#ff6230] tracking-tighter leading-none">{cls.topScore}%</span>
              <span className="text-[11px] font-bold text-[#9ca3af] mt-1 uppercase tracking-wider">Top Score</span>
            </div>
            <div className="bg-white rounded-[20px] p-5 shadow-sm flex flex-col items-center justify-center">
              <span className="text-[32px] font-black text-[#9ca3af] tracking-tighter leading-none">{cls.lowestScore}%</span>
              <span className="text-[11px] font-bold text-[#9ca3af] mt-1 uppercase tracking-wider">Lowest</span>
            </div>
          </div>
        </div>

        {/* Grade Distribution Bar */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm mb-8">
          <h3 className="text-[16px] font-extrabold text-[#1a1a1a] tracking-tight mb-5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#48c774]"></div>
            Grade Distribution
          </h3>
          <div className="flex gap-3 mb-4">
            <div className="flex-1 bg-[#16a34a] h-[38px] rounded-xl flex items-center justify-center text-white font-black text-[13px]" style={{ flex: gradeA }}>A ({gradeA})</div>
            {gradeB > 0 && <div className="flex-1 bg-[#2563eb] h-[38px] rounded-xl flex items-center justify-center text-white font-black text-[13px]" style={{ flex: gradeB }}>B ({gradeB})</div>}
            {gradeC > 0 && <div className="flex-1 bg-[#f59e0b] h-[38px] rounded-xl flex items-center justify-center text-white font-black text-[13px]" style={{ flex: gradeC }}>C ({gradeC})</div>}
            {gradeD > 0 && <div className="flex-1 bg-[#dc2626] h-[38px] rounded-xl flex items-center justify-center text-white font-black text-[13px]" style={{ flex: gradeD }}>D ({gradeD})</div>}
          </div>
          {atRisk > 0 && (
            <div className="flex items-center gap-2 bg-[#fee2e2] rounded-xl px-4 py-2.5">
              <AlertCircle className="w-4 h-4 text-[#dc2626]" strokeWidth={2.5} />
              <span className="text-[12px] font-bold text-[#dc2626]">{atRisk} student{atRisk > 1 ? 's' : ''} at risk — scoring below 50%</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          
          {/* Students Table */}
          <div className="xl:col-span-2 bg-white rounded-[24px] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[16px] font-extrabold text-[#1a1a1a] tracking-tight flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ff6230]"></div>
                Students ({cls.studentList.length})
              </h3>
            </div>
            
            {/* Horizontal Scroll Wrapper */}
            <div className="overflow-x-auto w-full hide-scrollbar">
              <div className="min-w-[550px]">
                {/* Table Header */}
                <div className="grid grid-cols-[2fr_0.7fr_0.7fr_0.7fr_0.8fr] gap-3 pb-3 border-b border-[#eef0f3] mb-2">
                  <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">Name</span>
                  <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider text-center">Roll</span>
                  <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider text-center">Score</span>
                  <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider text-center">Grade</span>
                  <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider text-center">Submitted</span>
                </div>

                {/* Student Rows */}
                <div className="space-y-1 max-h-[400px] overflow-y-auto hide-scrollbar">
              {cls.studentList.map((student: any, index: number) => (
                <div 
                  key={index} 
                  className={clsx(
                    "grid grid-cols-[2fr_0.7fr_0.7fr_0.7fr_0.8fr] gap-3 py-3 px-2 rounded-xl hover:bg-[#f8f9fa] transition-colors cursor-pointer items-center",
                    student.status === 'at-risk' && "bg-[#fff5f5]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#eef0f3] shrink-0">
                      <img 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}&backgroundColor=eef0f3&textColor=4f4f4f&fontSize=38`} 
                        alt={student.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <span className="text-[13px] font-bold text-[#1a1a1a] block">{student.name}</span>
                      {student.status === 'at-risk' && (
                        <span className="text-[10px] font-bold text-[#dc2626] flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> At Risk
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[13px] font-semibold text-[#6b7280] text-center">{student.roll}</span>
                  <span className={clsx(
                    "text-[14px] font-black text-center",
                    student.score >= 80 ? "text-[#16a34a]" : student.score >= 60 ? "text-[#f59e0b]" : "text-[#dc2626]"
                  )}>{student.score}%</span>
                  <div className="flex justify-center">
                    <span className={clsx(
                      "px-2.5 py-0.5 rounded-full text-[11px] font-black",
                      getGradeColor(student.grade)
                    )}>{student.grade}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-[#6b7280] text-center">{student.submitted}/{cls.totalAssignments}</span>
                </div>
              ))}
                </div>
              </div>
            </div>
          </div>

          {/* Assignments Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-[24px] p-6 shadow-sm">
              <h3 className="text-[16px] font-extrabold text-[#1a1a1a] tracking-tight mb-5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#2563eb]"></div>
                Assignments
              </h3>
              <div className="space-y-3">
                {cls.recentAssignments.map((a: any, i: number) => (
                  <div key={i} className="bg-[#eef0f3] rounded-2xl p-4 hover:bg-[#e5e8ec] transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-[13px] font-bold text-[#1a1a1a] leading-tight pr-2">{a.title}</h4>
                      <span className={clsx(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0",
                        a.status === 'Graded' ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#fff0eb] text-[#ff6230]"
                      )}>
                        {a.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-semibold text-[#6b7280]">{a.submitted}/{a.total} submitted</span>
                      {a.avgScore !== null && (
                        <span className={clsx(
                          "text-[13px] font-black",
                          a.avgScore >= 80 ? "text-[#16a34a]" : a.avgScore >= 60 ? "text-[#f59e0b]" : "text-[#dc2626]"
                        )}>Avg: {a.avgScore}%</span>
                      )}
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 h-[3px] bg-white rounded-full overflow-hidden">
                      <div 
                        className={clsx("h-full rounded-full", a.status === 'Graded' ? "bg-[#16a34a]" : "bg-[#ff6230]")}
                        style={{ width: `${(a.submitted / a.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#ff6230] rounded-[24px] p-6 shadow-sm text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <h4 className="text-[14px] font-bold mb-3 relative z-10">Quick Actions</h4>
              <div className="space-y-2 relative z-10">
                <button 
                  onClick={() => router.push('/assignments/create')}
                  className="w-full bg-white text-[#ff6230] px-4 py-2.5 rounded-full text-[12px] font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Create Assignment
                </button>
                <button 
                  onClick={() => {
                    window.location.href = `mailto:?bcc=students@school.edu&subject=Update regarding ${cls.name}&body=Hello students,`;
                  }}
                  className="w-full bg-white/20 text-white px-4 py-2.5 rounded-full text-[12px] font-bold hover:bg-white/30 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Email Students
                </button>
              </div>
            </div>
          </div>
        </div>

        </div>
      </div>
    </div>
  );
}

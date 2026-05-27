'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Topbar from '@/components/Topbar';
import { Download, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import clsx from 'clsx';

export default function AssignmentOutput() {
  const { id } = useParams();
  const router = useRouter();
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Carousel & Selection States
  const [currentPaperIndex, setCurrentPaperIndex] = useState(0);
  const [selectedPapers, setSelectedPapers] = useState<Set<number>>(new Set());

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchAssignment();
    
    // Check for WebSocket updates to auto-refresh if it was generating
    const ws = new WebSocket('ws://localhost:5000');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'GENERATION_COMPLETED' && data.assignmentId === id) {
        fetchAssignment();
      }
    };
    
    return () => {
      ws.close();
    };
  }, [id]);

  const fetchAssignment = async () => {
    try {
      const data = await api.getAssignment(id as string);
      setAssignment(data);
      
      // Initialize selected papers from backend if they exist
      if (data.samplePapers) {
        const initialSelected = new Set<number>();
        data.samplePapers.forEach((paper: any, idx: number) => {
          if (paper.isSelected) initialSelected.add(idx);
        });
        setSelectedPapers(initialSelected);
      }
    } catch (error) {
      console.error(error);
      setAssignment(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const toggleSelection = () => {
    const newSelection = new Set(selectedPapers);
    if (newSelection.has(currentPaperIndex)) {
      newSelection.delete(currentPaperIndex);
      showToast('Deselected', 'error');
    } else {
      newSelection.add(currentPaperIndex);
      showToast('Selected', 'success');
    }
    setSelectedPapers(newSelection);
  };

  const nextPaper = () => {
    if (assignment?.samplePapers && currentPaperIndex < assignment.samplePapers.length - 1) {
      setCurrentPaperIndex(prev => prev + 1);
    }
  };

  const prevPaper = () => {
    if (currentPaperIndex > 0) {
      setCurrentPaperIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-gray-500">Assignment not found</p>
        <button onClick={() => router.back()} className="mt-4 text-orange-500 hover:underline">Go Back</button>
      </div>
    );
  }

  if (assignment.status === 'GENERATING') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500"></div>
        <h2 className="text-2xl font-bold text-gray-800">Generating Question Paper with AI...</h2>
        <p className="text-gray-500 max-w-md">Our AI is currently crafting multiple sample papers based on your requirements. This page will automatically update when they're ready.</p>
      </div>
    );
  }

  // Ensure we fallback properly if generatedQuestions doesn't exist
  const generatedQuestions = assignment?.generatedQuestions || [];

  return (
    <div className="h-full flex flex-col relative print:bg-white print:p-0 bg-background overflow-hidden">
      
      {/* Toast Notification */}
      {toast && (
        <div className={clsx(
          "fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-full shadow-lg font-bold text-white transition-all animate-in fade-in slide-in-from-top-4",
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        )}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      <div className="print:hidden">
        <Topbar title="Assignment Details" showBack />
      </div>

      <div className="flex-1 overflow-y-auto pb-8 print:overflow-visible px-2 md:px-4 relative flex flex-col items-center pt-4 md:pt-6">
        
        {/* Outer Dark Wrapper */}
        <div className="w-full max-w-[850px] bg-[#2d2d2d] rounded-[20px] md:rounded-[32px] p-2 md:p-4 print:p-0 print:bg-transparent shadow-xl print:shadow-none">
          
          {/* Header inside Dark Container */}
          <div className="text-white px-3 pt-3 md:px-6 md:pt-4 pb-3 md:pb-4 print:hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-[12px] md:text-[14px] font-bold leading-relaxed text-white max-w-xl">
              Certainly! Here is your customized Question Paper for your {assignment?.studentClass || ''} classes:
            </p>
            <button 
              onClick={handlePrint}
              className="flex items-center justify-center w-full md:w-auto px-4 py-3 md:py-2.5 bg-white text-gray-900 rounded-[12px] md:rounded-full text-[13px] font-bold hover:bg-gray-100 transition-colors shadow-sm flex-shrink-0"
            >
              <Download className="w-[16px] h-[16px] md:w-4 md:h-4 mr-2" strokeWidth={2.5} />
              <span>Download as PDF</span>
            </button>
          </div>

          {/* Paper Container */}
          <div className="flex flex-col items-center w-full">
            <div className="w-full min-h-[800px] md:min-h-[1123px] print:w-auto print:min-h-0 h-max bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] print:shadow-none rounded-[16px] md:rounded-[24px] print:rounded-none p-5 sm:p-8 md:p-[60px] text-[#222] font-sans relative overflow-hidden print:overflow-visible">
            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-[16px] md:text-[22px] font-bold tracking-tight mb-1">Delhi Public School, Sector-4, Bokaro</h1>
              <h3 className="text-[13px] md:text-[16px] font-semibold">Class: {assignment?.studentClass || '5th'}</h3>
            </div>

            <div className="flex flex-col sm:flex-row justify-between font-semibold text-[12px] md:text-[14px] mb-4 gap-1.5 md:gap-2">
              <span>Time Allowed: 45 minutes</span>
              <span>Maximum Marks: {assignment.totalMarks || 0}</span>
            </div>

            <div className="mb-6 text-[12px] md:text-[14px] font-semibold italic text-[#444]">
              All questions are compulsory unless stated otherwise.
            </div>

            <div className="space-y-2 font-semibold text-[12px] md:text-[14px] mb-8 md:mb-12">
              <p>Name: <span className="inline-block border-b border-gray-400 w-32 md:w-48"></span></p>
              <p>Roll Number: <span className="inline-block border-b border-gray-400 w-32 md:w-48"></span></p>
              <p>Class: {assignment?.studentClass || '5th'} Section: <span className="inline-block border-b border-gray-400 w-24 md:w-32"></span></p>
            </div>

            {generatedQuestions.length === 0 ? (
              <p className="text-center text-gray-400 italic text-[12px] md:text-[14px]">No AI generated questions found for this assignment.</p>
            ) : (
              Array.from(new Set(generatedQuestions.map((q: any) => q.type))).map((type: any, typeIdx) => {
                const questionsOfType = generatedQuestions.filter((q: any) => q.type === type);
                const sectionLetter = String.fromCharCode(65 + typeIdx); // A, B, C...
                return (
                  <div key={typeIdx} className="mb-8 md:mb-10">
                    <h3 className="text-center text-[14px] md:text-[18px] font-bold mb-3 md:mb-4">Section {sectionLetter}</h3>
                    <h4 className="font-bold text-[13px] md:text-[15px] mb-1">{type}</h4>
                    <p className="text-[11px] md:text-[13px] italic text-[#666] mb-4">Attempt all questions. Each question carries marks as indicated.</p>
                    <div className="space-y-5 md:space-y-4 text-[12px] md:text-[14px] leading-relaxed font-medium">
                      {questionsOfType.map((q: any, idx: number) => {
                        const absoluteIdx = generatedQuestions.findIndex((gq: any) => gq === q);
                        return (
                          <div key={idx} className="mb-4">
                            <div className="flex items-start gap-2 md:gap-3">
                              <span className="shrink-0 pt-0.5 md:pt-0">{absoluteIdx + 1}.</span>
                              <span className="flex-1">
                                <span className={clsx(
                                  "px-1.5 py-0.5 rounded text-[10px] md:text-[10px] font-bold mr-2 uppercase tracking-wide align-middle inline-block -translate-y-px",
                                  q.difficulty?.toLowerCase() === 'easy' ? 'bg-green-100 text-green-700' :
                                  (q.difficulty?.toLowerCase() === 'moderate' || q.difficulty?.toLowerCase() === 'medium') ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                )}>
                                  {q.difficulty || 'Moderate'}
                                </span>
                                {q.text}
                              </span>
                              <span className="font-bold shrink-0 ml-2 md:ml-4 pt-0.5 md:pt-0">[{q.marks} Marks]</span>
                            </div>
                            {q.options && q.options.length > 0 && (
                              <div className="grid grid-cols-2 gap-2 mt-2 pl-6">
                                {q.options.map((opt: string, oIdx: number) => (
                                  <p key={oIdx}>{String.fromCharCode(97 + oIdx)}) {opt}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}

            {generatedQuestions.length > 0 && (
              <>
                <div className="mt-8 mb-12 font-bold text-[12px] md:text-[14px] text-left">
                  End of Question Paper
                </div>

                <div className="pt-6 mt-12 border-t border-gray-200 print:break-before-page">
                  <h3 className="text-[14px] md:text-[16px] font-bold mb-6">Answer Key:</h3>
                  <div className="space-y-6 text-[12px] md:text-[13px] leading-relaxed">
                    {generatedQuestions.map((q: any, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <span className="font-bold">{idx + 1}.</span>
                        <p>{q.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

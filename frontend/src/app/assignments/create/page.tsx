'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';
import { UploadCloud, Calendar, Plus, X, Mic, ArrowRight, ArrowLeft, Loader2, Download, Save, ChevronDown } from 'lucide-react';
import { useAssignmentStore } from '@/store/useStore';
import { api, WS_URL } from '@/lib/api';
import clsx from 'clsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const QUESTION_TYPE_OPTIONS = [
  'Multiple Choice Questions',
  'Short Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems'
];

function CustomSelect({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex-1 w-full min-w-0" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex items-center justify-between w-full min-w-0 truncate bg-white border rounded-[12px] md:rounded-[16px] px-3 py-2 md:px-4 md:py-3.5 text-[12px] md:text-[13px] font-bold outline-none transition-all shadow-sm cursor-pointer select-none",
          isOpen ? "border-orange-400 ring-1 ring-orange-400/20 text-[#1a1a1a]" : "border-gray-200 text-[#4f4f4f] hover:border-gray-300"
        )}
      >
        <span className="truncate">{value}</span>
        <ChevronDown className={clsx("w-4 h-4 shrink-0 ml-2 transition-transform duration-200", isOpen ? "rotate-180 text-orange-500" : "text-gray-400")} />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-[12px] md:rounded-[16px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col py-1.5">
            {QUESTION_TYPE_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(option);
                  setIsOpen(false);
                }}
                className={clsx(
                  "px-4 py-2.5 text-left text-[12px] md:text-[13px] transition-colors w-full truncate select-none",
                  value === option 
                    ? "bg-orange-50/50 text-orange-600 font-bold" 
                    : "text-[#4f4f4f] font-semibold hover:bg-gray-50"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


export default function CreateAssignment() {
  const router = useRouter();
  const store = useAssignmentStore();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [createdAssignmentId, setCreatedAssignmentId] = useState<string | null>(null);
  
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  const totalQuestions = store.questionTypes.reduce((acc, curr) => acc + (curr.count || 0), 0);
  const totalMarks = store.questionTypes.reduce((acc, curr) => acc + ((curr.count || 0) * (curr.marks || 0)), 0);

  const handleNext = () => {
    if (step === 1) {
      if (!store.title || !store.dueDate || !store.subject || !store.studentClass) {
        setError('Title, Subject, Class and Due Date are required');
        return;
      }
      if (store.questionTypes.length === 0) {
        setError('Please add at least one question type');
        return;
      }
      for (const qt of store.questionTypes) {
        if (qt.count <= 0 || qt.marks <= 0) {
          setError('Count and marks must be positive numbers');
          return;
        }
      }
      setError('');
      setStep(2);
    }
  };

  const generateAI = async () => {
    if (!store.title || !store.subject || !store.studentClass || !store.dueDate) {
      setError('Title, Subject, Class and Due Date are required');
      return;
    }
    if (store.questionTypes.length === 0) {
      setError('Please add at least one question type');
      return;
    }
    for (const qt of store.questionTypes) {
      if (qt.count <= 0 || qt.marks <= 0) {
        setError('Count and marks must be positive numbers');
        return;
      }
    }

    setIsGenerating(true);
    setError('');
    
    try {
      let fileData = '';
      let fileMimeType = '';
      
      if (selectedFile) {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(selectedFile);
        });
        const dataUrl = await base64Promise;
        fileData = dataUrl.split(',')[1];
        fileMimeType = selectedFile.type;
      }
      
      const response = await api.createAssignment({
        title: store.title || `${store.subject} Assignment`,
        subject: store.subject,
        studentClass: store.studentClass,
        dueDate: store.dueDate,
        questionTypes: store.questionTypes,
        totalQuestions,
        totalMarks,
        additionalInfo: store.additionalInfo,
        fileData,
        fileMimeType
      });
      
      setCreatedAssignmentId(response._id);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError('Failed to dispatch generation job.');
      setStep(1);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (step === 2 && createdAssignmentId) {
      const ws = new WebSocket(WS_URL);
      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'GENERATION_COMPLETED' && data.assignmentId === createdAssignmentId) {
            const assignment = await api.getAssignment(createdAssignmentId);
            setGeneratedQuestions(assignment.generatedQuestions || []);
            setStep(3);
          } else if (data.type === 'GENERATION_FAILED' && data.assignmentId === createdAssignmentId) {
            setError('AI Generation Failed. Please check the document and try again.');
            setStep(1);
          }
        } catch (err) {}
      };
      return () => ws.close();
    }
  }, [step, createdAssignmentId]);

  const handleSaveAndAssign = async () => {
    // The paper is already saved by the backend worker. We just navigate.
    router.push('/assignments');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full flex flex-col relative w-full bg-[#f8f9fa] md:bg-transparent">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}} />
      
      <Topbar title="Assignment" showBack />
      
      {step === 1 && (
        <div className="flex-1 overflow-y-auto pb-[140px] md:pb-8 pt-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex flex-col px-4 md:px-8 w-full max-w-4xl mx-auto">
              <div className="mb-4 md:mb-6 pt-2 md:-ml-2">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 rounded-full"></div>
                  <h1 className="text-[18px] md:text-[20px] font-bold text-[#1a1a1a]">Create Assignment</h1>
                </div>
                <p className="text-[12px] md:text-[13px] font-medium text-[#828282] ml-4 md:ml-5">
                  Set up a new assignment for your students
                </p>
              </div>

              <div className="bg-white rounded-[24px] md:rounded-[32px] p-5 md:p-10 shadow-sm border border-gray-50 w-full">
                <div className="mb-6 md:mb-10">
                  <h2 className="text-[16px] md:text-[18px] font-bold text-[#2d2d2d]">Assignment Details</h2>
                  <p className="text-[12px] md:text-[13px] font-medium text-[#828282] mt-1">Basic information about your assignment</p>
                </div>
                
                <div className="space-y-6 md:space-y-8">
                  <div 
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        setSelectedFile(e.dataTransfer.files[0]);
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
                  >
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      accept="image/jpeg, image/png, application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                        }
                      }}
                    />
                    
                    {selectedFile ? (
                      <div className="flex flex-col items-center text-center px-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 md:mb-3">
                          <svg className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                          </svg>
                        </div>
                        <p className="text-[13px] md:text-[14px] font-bold text-[#1a1a1a] truncate max-w-[280px] z-10 relative">{selectedFile.name}</p>
                        <p className="text-[11px] md:text-[12px] font-medium text-emerald-600 mt-0.5 md:mt-1 z-10 relative">Ready to process • {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                        <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedFile(null); }}
                          className="mt-2 text-[12px] font-bold text-red-500 hover:text-red-600 transition-colors z-20 relative"
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-6 h-6 md:w-8 md:h-8 text-gray-400 group-hover:text-gray-600 mb-2 md:mb-3" />
                        <h3 className="text-[13px] md:text-[14px] font-bold text-gray-700">Choose a file or drag & drop</h3>
                        <p className="text-[10px] md:text-xs font-medium text-gray-400 mt-1 mb-3 md:mb-4">JPEG, PNG, upto 10MB</p>
                        <button className="px-4 md:px-5 py-1.5 md:py-2 bg-white border border-gray-200 rounded-full text-[11px] md:text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors pointer-events-none">
                          Browse Files
                        </button>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <div>
                      <label className="block text-[12px] md:text-[13px] font-bold text-[#2d2d2d] mb-2 md:mb-3">Subject</label>
                      <input 
                        type="text"
                        placeholder="e.g. Science"
                        className="w-full bg-transparent border border-gray-200 rounded-[12px] md:rounded-[16px] px-4 py-3 md:px-5 md:py-3.5 text-[13px] md:text-[14px] font-medium text-[#4f4f4f] outline-none focus:border-orange-300 transition-all"
                        value={store.subject}
                        onChange={(e) => store.setSubject(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] md:text-[13px] font-bold text-[#2d2d2d] mb-2 md:mb-3">Class</label>
                      <input 
                        type="text"
                        placeholder="e.g. 5th"
                        className="w-full bg-transparent border border-gray-200 rounded-[12px] md:rounded-[16px] px-4 py-3 md:px-5 md:py-3.5 text-[13px] md:text-[14px] font-medium text-[#4f4f4f] outline-none focus:border-orange-300 transition-all"
                        value={store.studentClass}
                        onChange={(e) => store.setStudentClass(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] md:text-[13px] font-bold text-[#2d2d2d] mb-2 md:mb-3">Due Date</label>
                      <div className="relative">
                        <DatePicker
                          selected={store.dueDate ? new Date(store.dueDate) : null}
                          onChange={(date: Date | null) => {
                            if (date) {
                              const tzOffset = date.getTimezoneOffset() * 60000;
                              const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().split('T')[0];
                              store.setDueDate(localISOTime);
                            } else {
                              store.setDueDate('');
                            }
                          }}
                          dateFormat="dd-MM-yyyy"
                          placeholderText="DD-MM-YYYY"
                          className="w-full bg-transparent border border-gray-200 rounded-[12px] md:rounded-[16px] px-4 py-3 md:px-5 md:py-3.5 text-[13px] md:text-[14px] font-medium text-[#4f4f4f] outline-none focus:border-orange-300 transition-all"
                          wrapperClassName="w-full"
                        />
                        <Calendar className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 pointer-events-none" strokeWidth={2} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <label className="block text-[12px] md:text-[13px] font-bold text-[#2d2d2d]">Question Type</label>
                      <div className="hidden md:flex gap-12 text-xs font-bold text-gray-400 mr-2 uppercase tracking-wider">
                        <span>No. of Questions</span>
                        <span>Marks</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {store.questionTypes.map((qt, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-2.5 md:gap-4 w-full bg-gray-50/50 md:bg-transparent p-3 md:p-0 rounded-[16px] md:rounded-none border border-gray-100 md:border-none shadow-sm md:shadow-none mb-2 md:mb-0">
                          <div className="flex items-center justify-between w-full md:flex-1 gap-2 min-w-0">
                            <CustomSelect 
                              value={qt.type}
                              onChange={(val) => store.updateQuestionType(index, { type: val })}
                            />
                            
                            <button 
                              onClick={() => store.removeQuestionType(index)}
                              className="md:hidden p-1.5 bg-white rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm border border-gray-100 shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
                            <div className="flex flex-col gap-1 md:gap-1.5 flex-1 md:flex-none">
                              <span className="md:hidden text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-1">Questions</span>
                              <div className="flex items-center justify-between md:justify-center gap-0.5 md:gap-1 bg-white border border-gray-200 rounded-[12px] md:rounded-[16px] px-2 py-1.5 md:px-3 md:py-2 shadow-sm w-full md:w-auto">
                                <button 
                                  onClick={() => store.updateQuestionType(index, { count: Math.max(1, qt.count - 1) })}
                                  className="text-gray-400 hover:text-gray-700 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center font-bold text-[15px] md:text-lg"
                                >−</button>
                                <input 
                                  type="number" 
                                  value={qt.count || ''}
                                  onChange={(e) => store.updateQuestionType(index, { count: parseInt(e.target.value) || 0 })}
                                  className="w-6 md:w-8 text-center text-[13px] md:text-[14px] font-bold text-[#1a1a1a] outline-none appearance-none bg-transparent"
                                />
                                <button 
                                  onClick={() => store.updateQuestionType(index, { count: qt.count + 1 })}
                                  className="text-gray-400 hover:text-gray-700 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center font-bold text-[15px] md:text-lg"
                                >+</button>
                              </div>
                            </div>

                            <div className="flex flex-col gap-1 md:gap-1.5 flex-1 md:flex-none">
                              <span className="md:hidden text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-1">Marks Each</span>
                              <div className="flex items-center justify-between md:justify-center gap-0.5 md:gap-1 bg-white border border-gray-200 rounded-[12px] md:rounded-[16px] px-2 py-1.5 md:px-3 md:py-2 shadow-sm w-full md:w-auto">
                                <button 
                                  onClick={() => store.updateQuestionType(index, { marks: Math.max(1, qt.marks - 1) })}
                                  className="text-gray-400 hover:text-gray-700 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center font-bold text-[15px] md:text-lg"
                                >−</button>
                                <input 
                                  type="number" 
                                  value={qt.marks || ''}
                                  onChange={(e) => store.updateQuestionType(index, { marks: parseInt(e.target.value) || 0 })}
                                  className="w-6 md:w-8 text-center text-[13px] md:text-[14px] font-bold text-[#1a1a1a] outline-none appearance-none bg-transparent"
                                />
                                <button 
                                  onClick={() => store.updateQuestionType(index, { marks: qt.marks + 1 })}
                                  className="text-gray-400 hover:text-gray-700 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center font-bold text-[15px] md:text-lg"
                                >+</button>
                              </div>
                            </div>
                            
                            <button 
                              onClick={() => store.removeQuestionType(index)}
                              className="hidden md:block p-1 text-gray-400 hover:text-red-500 transition-colors ml-2"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => store.addQuestionType({ type: 'Multiple Choice Questions', count: 1, marks: 1 })}
                      className="mt-4 md:mt-5 flex items-center gap-2 text-[12px] md:text-sm font-bold text-gray-500 hover:text-orange-500 transition-colors"
                    >
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </div>
                      Add Question Type
                    </button>
                  </div>

                  <div className="flex flex-col items-end text-[11px] md:text-[13px] text-gray-500 font-medium space-y-0.5 md:space-y-1 pt-3 md:pt-4 border-t border-gray-100">
                    <p>Total Questions: <span className="text-[#1a1a1a] font-bold ml-1">{totalQuestions}</span></p>
                    <p>Total Marks: <span className="text-[#1a1a1a] font-bold ml-1">{totalMarks}</span></p>
                  </div>

                  <div className="mt-2 md:mt-0">
                    <label className="block text-[12px] md:text-[13px] font-bold text-[#2d2d2d] mb-2 md:mb-3">Extra Prompt for Gemini</label>
                    <div className="relative">
                      <textarea 
                        placeholder="e.g Make the questions slightly more challenging..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-[16px] px-4 py-3.5 md:px-5 md:py-4 pb-12 text-[13px] md:text-[14px] font-medium text-[#4f4f4f] outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 transition-all min-h-[90px] md:min-h-[100px] resize-none shadow-inner"
                        value={store.additionalInfo}
                        onChange={(e) => store.setAdditionalInfo(e.target.value)}
                        disabled={isGenerating}
                      />
                      <button 
                        onClick={generateAI}
                        disabled={isGenerating}
                        className="absolute bottom-2.5 right-2.5 md:bottom-3 md:right-3 w-[32px] h-[32px] md:w-[38px] md:h-[38px] bg-[#1c1c1c] text-white hover:bg-black rounded-full shadow-md transition-all active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:active:scale-100 z-10"
                      >
                        {isGenerating ? (
                          <div className="w-3.5 h-3.5 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-[15px] h-[15px] md:w-[18px] md:h-[18px] -translate-x-[1.5px] translate-y-[1px] md:-translate-x-[2px] md:translate-y-[1.5px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                          </svg>
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] md:text-[11px] text-[#a0a0a0] font-medium mt-1.5 md:mt-2 ml-1">
                      Click on the arrow and wait for few seconds
                    </p>
                  </div>

                  {error && <p className="text-red-500 text-sm font-bold text-center bg-red-50 py-3 rounded-xl">{error}</p>}
                </div>
              </div>
            </div>
          </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-[20px] md:text-2xl font-bold text-[#1a1a1a] mb-2">Generating Question Paper...</h2>
          <p className="text-[13px] md:text-[15px] text-gray-500 max-w-md font-medium leading-relaxed">
            Our AI is currently analyzing your requirements and crafting the perfect questions. This usually takes about 10-20 seconds. Please do not close this page.
          </p>
        </div>
      )}
      {step === 3 && (
        <div className="flex-1 flex flex-col items-center overflow-y-auto bg-gray-50 md:bg-[#eef0f3] pt-4 md:pt-10 pb-[140px] md:pb-24 px-3 md:px-0 relative md:ml-[11px] md:mr-4 md:rounded-[16px]">
          
          <div className="w-full max-w-[794px] bg-[#2d2d2d] rounded-2xl md:rounded-t-[24px] md:rounded-b-[8px] p-4 md:p-6 mb-4 mt-2 print:hidden flex flex-col items-start md:flex-row md:items-center justify-between gap-4">
            <p className="text-[12px] md:text-[15px] font-medium leading-relaxed text-white/90 max-w-xl">
              Certainly! Here is your generated Question Paper.
            </p>
            <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
              <button 
                onClick={handleSaveAndAssign}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 flex-1 md:flex-none px-4 md:px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-[13px] font-bold transition-colors shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save & Assign'}</span>
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center justify-center w-8 h-8 md:w-auto md:h-auto md:px-5 md:py-2.5 bg-white/10 md:bg-white text-white md:text-gray-900 rounded-full text-[13px] font-bold hover:bg-white/20 md:hover:bg-gray-100 transition-colors shadow-sm flex-shrink-0"
              >
                <Download className="w-[14px] h-[14px] md:w-4 md:h-4" strokeWidth={2.5} />
                <span className="hidden md:inline">Download</span>
              </button>
            </div>
          </div>

          <div id="print-area" className="flex flex-col items-center w-full">
            <div className="w-full max-w-[794px] min-h-[1123px] h-max bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl md:rounded-[24px] p-6 sm:p-10 md:p-[60px] text-[#222] font-sans relative overflow-hidden">
              <div className="text-center mb-6 md:mb-8">
                <h1 className="text-[15px] md:text-[22px] font-bold tracking-tight mb-1">Delhi Public School, Sector-4, Bokaro</h1>
                <h3 className="text-[12px] md:text-[16px] font-semibold">Class: {store.studentClass || '5th'}</h3>
              </div>

              <div className="flex flex-col sm:flex-row justify-between font-semibold text-[10px] md:text-[14px] mb-4 gap-1 md:gap-2">
                <span>Time Allowed: 45 minutes</span>
                <span>Maximum Marks: {totalMarks}</span>
              </div>

              <div className="mb-6 text-[10px] md:text-[14px] font-semibold italic text-[#444]">
                All questions are compulsory unless stated otherwise.
              </div>

              <div className="space-y-2 font-semibold text-[10px] md:text-[14px] mb-8 md:mb-12">
                <p>Name: _____________________</p>
                <p>Roll Number: _____________________</p>
                <p>Class: {store.studentClass || '5th'} Section: _____________________</p>
              </div>

              {Array.from(new Set(generatedQuestions.map(q => q.type))).map((type: any, typeIdx) => {
                const questionsOfType = generatedQuestions.filter(q => q.type === type);
                const sectionLetter = String.fromCharCode(65 + typeIdx); // A, B, C...
                return (
                  <div key={typeIdx} className="mb-8">
                    <h3 className="text-center text-[12px] md:text-[18px] font-bold mb-4">Section {sectionLetter}</h3>
                    <h4 className="font-bold text-[11px] md:text-[15px] mb-1">{type}</h4>
                    <p className="text-[9px] md:text-[13px] italic text-[#666] mb-4">Attempt all questions. Each question carries marks as indicated.</p>
                    <div className="space-y-4 text-[10px] md:text-[14px] leading-relaxed font-medium">
                      {questionsOfType.map((q: any, idx: number) => {
                        const absoluteIdx = generatedQuestions.findIndex(gq => gq === q);
                        return (
                          <div key={idx} className="mb-4">
                            <div className="flex items-start gap-2">
                              <span className="shrink-0">{absoluteIdx + 1}.</span>
                              <span className="flex-1">
                                <span className={clsx(
                                  "px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-bold mr-2 uppercase tracking-wide align-middle inline-block -translate-y-px",
                                  q.difficulty?.toLowerCase() === 'easy' ? 'bg-green-100 text-green-700' :
                                  (q.difficulty?.toLowerCase() === 'moderate' || q.difficulty?.toLowerCase() === 'medium') ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                )}>
                                  {q.difficulty || 'Moderate'}
                                </span>
                                {q.text}
                              </span>
                              <span className="font-bold shrink-0 ml-4">[{q.marks} Marks]</span>
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
              })}

              <div className="mt-8 mb-12 font-bold text-[10px] md:text-[14px] text-left">
                End of Question Paper
              </div>

              {/* Answer Key */}
              <div className="pt-6 mt-12 border-t border-gray-200 print:break-before-page">
                <h3 className="text-[12px] md:text-[16px] font-bold mb-6">Answer Key:</h3>
                <div className="space-y-6 text-[10px] md:text-[13px] leading-relaxed">
                  {generatedQuestions.map((q, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="font-bold">{idx + 1}.</span>
                      <p>{q.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => { setStep(1); store.resetForm(); }}
            className="fixed top-6 left-6 md:left-[270px] w-11 h-11 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:text-[#ff6230] transition-colors z-50 print:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

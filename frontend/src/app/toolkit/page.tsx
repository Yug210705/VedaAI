'use client';

import React, { useState } from 'react';
import Topbar from '@/components/Topbar';
import { BookOpen, ListChecks, Mail, Users, Sparkles, ChevronRight, X, Copy, CheckCircle2, HelpCircle, FileText, Flame, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import Modal from '@/components/Modal';

const TOOLS = [
  {
    id: 'lesson-plan',
    title: 'Lesson Plan Generator',
    description: 'Instantly generate a structured 45-minute lesson plan tailored to your curriculum.',
    icon: BookOpen,
    gradient: 'from-[#FF6B6B] to-[#FF8E53]',
    glow: 'group-hover:shadow-[0_0_40px_rgba(255,107,107,0.3)]',
    iconBg: 'bg-[#FF6B6B]/10',
    iconColor: 'text-[#FF6B6B]',
    inputs: [
      { name: 'subject', label: 'Subject', type: 'text', placeholder: 'e.g. Science' },
      { name: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g. Photosynthesis' },
      { name: 'grade', label: 'Grade Level', type: 'text', placeholder: 'e.g. 8th Grade' }
    ]
  },
  {
    id: 'rubric',
    title: 'Grading Rubric Creator',
    description: 'Create standardized, highly detailed rubrics for subjective assignments or projects.',
    icon: ListChecks,
    gradient: 'from-[#4D72FF] to-[#6EA4FF]',
    glow: 'group-hover:shadow-[0_0_40px_rgba(77,114,255,0.3)]',
    iconBg: 'bg-[#4D72FF]/10',
    iconColor: 'text-[#4D72FF]',
    inputs: [
      { name: 'assignment', label: 'Assignment Type', type: 'text', placeholder: 'e.g. Historical Essay' },
      { name: 'marks', label: 'Maximum Marks', type: 'number', placeholder: 'e.g. 50' }
    ]
  },
  {
    id: 'email',
    title: 'Parent Email Drafter',
    description: 'Draft professional, empathetic emails regarding student progress in seconds.',
    icon: Mail,
    gradient: 'from-[#9D50FF] to-[#D18CFF]',
    glow: 'group-hover:shadow-[0_0_40px_rgba(157,80,255,0.3)]',
    iconBg: 'bg-[#9D50FF]/10',
    iconColor: 'text-[#9D50FF]',
    inputs: [
      { name: 'student', label: 'Student Name', type: 'text', placeholder: 'e.g. Rahul Sharma' },
      { name: 'tone', label: 'Tone', type: 'select', options: ['Positive & Encouraging', 'Constructive & Concerned', 'Informational'] },
      { name: 'message', label: 'Key Message', type: 'textarea', placeholder: 'e.g. Rahul has been distracted in class recently.' }
    ]
  },
  {
    id: 'differentiation',
    title: 'Differentiated Instruction',
    description: 'Adapt a specific topic for gifted vs. struggling students with actionable strategies.',
    icon: Users,
    gradient: 'from-[#00C9A7] to-[#84F0D1]',
    glow: 'group-hover:shadow-[0_0_40px_rgba(0,201,167,0.3)]',
    iconBg: 'bg-[#00C9A7]/10',
    iconColor: 'text-[#00C9A7]',
    inputs: [
      { name: 'topic', label: 'Topic to Teach', type: 'text', placeholder: 'e.g. Fractions' },
      { name: 'classContext', label: 'Class Context', type: 'textarea', placeholder: 'e.g. Mixed ability classroom with 3 advanced learners.' }
    ]
  },
  {
    id: 'quiz',
    title: 'Quiz Generator',
    description: 'Generate a 10-question multiple choice quiz on any topic in seconds.',
    icon: HelpCircle,
    gradient: 'from-[#F53844] to-[#42378F]',
    glow: 'group-hover:shadow-[0_0_40px_rgba(245,56,68,0.3)]',
    iconBg: 'bg-[#F53844]/10',
    iconColor: 'text-[#F53844]',
    inputs: [
      { name: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g. The Solar System' },
      { name: 'difficulty', label: 'Difficulty', type: 'select', options: ['Easy', 'Medium', 'Hard'] }
    ]
  },
  {
    id: 'report-card',
    title: 'Report Card Comments',
    description: 'Draft personalized, professional report card comments based on student performance.',
    icon: FileText,
    gradient: 'from-[#FFB75E] to-[#ED8F03]',
    glow: 'group-hover:shadow-[0_0_40px_rgba(255,183,94,0.3)]',
    iconBg: 'bg-[#FFB75E]/10',
    iconColor: 'text-[#FFB75E]',
    inputs: [
      { name: 'student', label: 'Student Name', type: 'text', placeholder: 'e.g. Sarah Jones' },
      { name: 'strengths', label: 'Strengths', type: 'textarea', placeholder: 'e.g. Great at math, participates well.' },
      { name: 'weaknesses', label: 'Areas for Improvement', type: 'textarea', placeholder: 'e.g. Needs to focus during silent reading.' }
    ]
  },
  {
    id: 'icebreakers',
    title: 'Classroom Icebreakers',
    description: 'Discover fun, engaging activities to start your class and build community.',
    icon: Flame,
    gradient: 'from-[#00F2FE] to-[#4FACFE]',
    glow: 'group-hover:shadow-[0_0_40px_rgba(0,242,254,0.3)]',
    iconBg: 'bg-[#00F2FE]/10',
    iconColor: 'text-[#00F2FE]',
    inputs: [
      { name: 'grade', label: 'Grade Level', type: 'text', placeholder: 'e.g. 5th Grade' },
      { name: 'duration', label: 'Duration (mins)', type: 'number', placeholder: 'e.g. 10' }
    ]
  },
  {
    id: 'project-ideas',
    title: 'Project Idea Generator',
    description: 'Brainstorm creative, hands-on project-based learning ideas for your students.',
    icon: Lightbulb,
    gradient: 'from-[#FA709A] to-[#FEE140]',
    glow: 'group-hover:shadow-[0_0_40px_rgba(250,112,154,0.3)]',
    iconBg: 'bg-[#FA709A]/10',
    iconColor: 'text-[#FA709A]',
    inputs: [
      { name: 'subject', label: 'Subject', type: 'text', placeholder: 'e.g. History' },
      { name: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g. Ancient Egypt' }
    ]
  }
];

// Mock Generation Logic
const generateMockOutput = (toolId: string, formData: any) => {
  switch (toolId) {
    case 'lesson-plan':
      return `## Lesson Plan: ${formData.topic || 'Topic'} (${formData.grade || 'Grade'})
### Subject: ${formData.subject || 'Subject'}
**Duration:** 45 Minutes

**1. Objectives (5 mins)**
- Students will understand the core concepts of the topic.
- Students will be able to apply the knowledge to real-world scenarios.

**2. Introduction / Hook (10 mins)**
- Begin with a thought-provoking question related to the topic.
- Show a brief 2-minute video clip or physical prop to anchor attention.

**3. Main Activity (20 mins)**
- Direct instruction breaking down the core mechanics.
- Group students into pairs to complete a collaborative worksheet.
- Teacher circulates the room to provide guided support.

**4. Assessment & Closing (10 mins)**
- Exit ticket: Ask students to write down one thing they learned and one question they still have.
- Brief recap of the day's main takeaways.`;

    case 'rubric':
      return `## Grading Rubric: ${formData.assignment || 'Assignment'}
**Total Marks:** ${formData.marks || 50}

| Criteria | Excellent (100%) | Good (75%) | Needs Improvement (50%) |
|----------|-----------------|------------|------------------------|
| **Understanding** | Deep comprehension of concepts, flawless execution. | General understanding, minor errors. | Misunderstands core concepts. |
| **Organization** | Logically structured, smooth transitions. | Mostly structured, some jarring jumps. | Unstructured, difficult to follow. |
| **Creativity** | Highly original approach, unique insights. | Standard approach, expected insights. | Lacks originality or effort. |
| **Formatting** | Perfect grammar, adheres to all guidelines. | Few grammatical errors, mostly follows rules. | Many errors, ignores guidelines. |`;

    case 'email':
      return `Subject: Update on ${formData.student || 'Student'}'s Progress in Class

Dear Parent/Guardian,

I hope this email finds you well. I am writing to share a brief update regarding ${formData.student || 'Student'}'s recent performance and behavior in class.

${formData.message || '[Insert key message here]'}

Please let me know if you would be available for a brief phone call this week to discuss strategies to ensure ${formData.student || 'Student'} continues to succeed. 

Thank you for your ongoing support at home.

Warm regards,
[Your Name]
Teacher, VedaAI`;

    case 'differentiation':
      return `## Differentiated Strategies: ${formData.topic || 'Topic'}

**Context:** ${formData.classContext || 'Standard classroom'}

### For Struggling Students (Scaffolding)
- **Visual Aids:** Use heavy visual diagramming to break down the concept before introducing text.
- **Chunking:** Break the assignment into 3 smaller milestones with check-ins after each.
- **Peer Pairing:** Pair them with a strong, empathetic peer for the activity.

### For Gifted Students (Extension)
- **Real-world Application:** Ask them to not just solve the problem, but write a word problem applying it to a real-world scenario (e.g. engineering or finance).
- **Leadership Role:** Have them teach the concept back to a small group of peers.
- **Advanced Materials:** Provide an article from a higher grade level that explores the topic in depth.`;

    case 'quiz':
      return `## Multiple Choice Quiz: ${formData.topic || 'Topic'}
**Difficulty:** ${formData.difficulty || 'Medium'}

**1. What is the primary function of ${formData.topic || 'this topic'}?**
A) To increase efficiency
B) To provide structure
C) To facilitate communication
D) To generate energy
*(Answer: A)*

**2. Which of the following is a key characteristic?**
A) Flexibility
B) Rigidity
C) Transparency
D) Opacity
*(Answer: C)*

*(Note: In the full AI version, 10 highly accurate questions would be generated here based on real curriculum data.)*`;

    case 'report-card':
      return `## Report Card Comment for ${formData.student || 'Student'}

${formData.student || 'Student'} is a wonderful addition to the classroom. They have shown tremendous aptitude this term, specifically demonstrating strengths such as: ${formData.strengths || 'great participation'}. 

To continue progressing, I would encourage ${formData.student || 'Student'} to focus on ${formData.weaknesses || 'staying focused during silent reading'}. With a little more attention in this area, they will see even greater success. 

Overall, it has been a pleasure teaching ${formData.student || 'Student'} this term!`;

    case 'icebreakers':
      return `## Icebreaker Activities for ${formData.grade || 'your class'}
**Duration:** ~${formData.duration || 10} minutes

**Activity 1: Two Truths and a Tale**
Have each student write down two true facts about themselves and one believable lie. Students take turns sharing, and the class votes on which statement is the lie. 
*Why it works:* Encourages active listening and builds community quickly.

**Activity 2: The "Would You Rather" Stand-Up**
Ask a series of "Would You Rather" questions (e.g. "Would you rather have super speed or ability to fly?"). Have students move to the left side of the room for Option A, and the right side for Option B.
*Why it works:* Gets students moving and energized before a long lesson.`;

    case 'project-ideas':
      return `## Project-Based Learning: ${formData.topic || 'Topic'} (${formData.subject || 'Subject'})

**Project Idea 1: The Interactive Museum Exhibit**
Students will work in groups to design a "museum exhibit" about ${formData.topic || 'the topic'}. They must create physical artifacts, write informational placards, and act as tour guides for other students.
*Deliverables:* 3 physical artifacts, 1 written guide, oral presentation.

**Project Idea 2: The Pitch Deck**
Students play the role of entrepreneurs who have built a startup related to ${formData.topic || 'the topic'}. They must build a 5-slide pitch deck convincing "investors" (the teacher and classmates) why their concept is important and viable.
*Deliverables:* 5-slide presentation, 3-minute pitch, Q&A session.`;

    default:
      return "Generated successfully.";
  }
};

export default function ToolkitPage() {
  const [activeTool, setActiveTool] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const openTool = (tool: any) => {
    setActiveTool(tool);
    setFormData({});
    setOutput(null);
    setGenerating(false);
  };

  const closeTool = () => {
    setActiveTool(null);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    
    // Simulate AI delay
    setTimeout(() => {
      setOutput(generateMockOutput(activeTool.id, formData));
      setGenerating(false);
    }, 2000);
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-full flex flex-col pb-4">
      <Topbar title="AI Toolkit" showBack={false} />
      
      <div className="flex-1 flex flex-col relative bg-[#f8f9fa] md:mx-3 md:rounded-[24px] overflow-hidden md:shadow-sm md:border border-gray-100">
        <div className="flex-1 overflow-y-auto hide-scrollbar px-4 md:px-8 xl:px-12 pt-4 md:pt-6 pb-[140px] md:pb-24 flex flex-col items-center">
        
        {/* Vibrant Mesh Header */}
        <div className="w-full max-w-[1200px] rounded-[32px] mb-6 md:mb-8 relative overflow-hidden bg-[#1a1a1a] shadow-[0_20px_60px_rgba(0,0,0,0.15)] group">
          {/* Animated Mesh Gradients */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#ff512f]/40 to-[#dd2476]/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#4ca1af]/30 to-[#2c3e50]/30 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 group-hover:scale-110 transition-transform duration-1000 delay-100"></div>
          
          {/* Glassmorphic Overlay */}
          <div className="relative z-10 w-full p-6 md:p-14 bg-white/5 backdrop-blur-[2px] border border-white/10">
            <div className="max-w-2xl relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-black text-[11px] uppercase tracking-[0.2em] mb-4 md:mb-6 shadow-sm backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-[#ff512f]" /> 
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Beta Features</span>
              </div>
              <h1 className="text-[28px] md:text-[48px] font-black text-white tracking-tight leading-[1.1] mb-3 md:mb-5">
                Teacher&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff512f] to-[#f89b53]">AI Toolkit</span>
              </h1>
              <p className="text-[13px] md:text-[18px] text-gray-300 font-medium leading-relaxed max-w-xl">
                Supercharge your workflow. Instantly draft emails, create rubrics, and generate lesson plans with our suite of specialized AI assistants designed specifically for educators.
              </p>
            </div>
            
            {/* Decorative Grid Lines */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
          </div>
        </div>

        {/* Tools Grid - Bento Box Style */}
        <motion.div 
          initial="hidden" animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
        >
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } }
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                key={tool.id}
                onClick={() => openTool(tool)}
                className={clsx(
                  "relative bg-white rounded-[32px] p-5 md:p-8 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] cursor-pointer group transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-gray-200 flex flex-col overflow-hidden",
                  tool.glow
                )}
              >
                {/* Subtle background glow on hover */}
                <div className={clsx("absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br", tool.gradient)}></div>

                <div className="flex items-start justify-between mb-5 md:mb-8 relative z-10">
                  <div className="relative">
                    {/* Glowing background behind icon */}
                    <div className={clsx("absolute inset-0 blur-xl opacity-40 group-hover:opacity-80 transition-opacity duration-500 rounded-full", tool.iconBg)}></div>
                    <div className={clsx("w-12 h-12 md:w-16 md:h-16 rounded-[16px] md:rounded-[20px] flex items-center justify-center relative z-10 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 bg-gradient-to-br", tool.gradient)}>
                      <Icon className="w-5 h-5 md:w-7 md:h-7 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#1a1a1a] transition-all duration-500 shadow-sm border border-gray-100 group-hover:border-black group-hover:shadow-md">
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-white transition-colors duration-500 transform group-hover:translate-x-0.5" />
                  </div>
                </div>
                
                <div className="relative z-10 flex flex-col flex-1">
                  <div className="flex items-center flex-wrap gap-2 mb-3">
                    <h3 className="font-extrabold text-[18px] md:text-[22px] text-[#1a1a1a] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all duration-300 tracking-tight">{tool.title}</h3>
                    <div className={clsx("px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r text-white shadow-sm opacity-90", tool.gradient)}>Beta</div>
                  </div>
                  <p className="text-[13px] md:text-[15px] text-gray-500 font-medium leading-relaxed flex-1">
                    {tool.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        </div>
      </div>

      {/* Tool Modal */}
      <Modal isOpen={!!activeTool} onClose={closeTool} hideHeader={true} noPadding={true}>
        {activeTool && (
          <div className="bg-white w-full max-w-2xl rounded-[24px] overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="relative overflow-hidden bg-[#1a1a1a]">
               {/* Decorative Gradient in Modal Header */}
               <div className={clsx("absolute top-0 left-0 w-[400px] h-[400px] rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/2 opacity-30 bg-gradient-to-br", activeTool.gradient)}></div>
               
               <div className={clsx("px-5 py-5 md:px-8 md:py-8 border-b border-white/10 flex items-center justify-between relative z-10")}>
                 <div className="flex items-center gap-5">
                   <div className={clsx("w-10 h-10 md:w-14 md:h-14 rounded-[14px] md:rounded-[18px] flex items-center justify-center shadow-lg bg-gradient-to-br", activeTool.gradient)}>
                      <activeTool.icon className="w-5 h-5 md:w-7 md:h-7 text-white" strokeWidth={2.5} />
                   </div>
                   <div>
                     <h2 className="font-black text-[18px] md:text-[24px] text-white tracking-tight">{activeTool.title}</h2>
                     <p className="text-[12px] md:text-[13px] font-medium text-gray-400">{activeTool.description}</p>
                   </div>
                 </div>
                 <button onClick={closeTool} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                   <X className="w-5 h-5" />
                 </button>
               </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 md:p-10 overflow-y-auto flex-1 bg-white">
              
              {!output && !generating && (
                <form id="tool-form" onSubmit={handleGenerate} className="space-y-6">
                  {activeTool.inputs.map((input: any) => (
                    <div key={input.name}>
                      <label className="block text-[13px] font-extrabold text-[#1a1a1a] mb-2.5">{input.label}</label>
                      {input.type === 'textarea' ? (
                        <textarea 
                          required
                          placeholder={input.placeholder}
                          className="w-full border border-gray-200/60 rounded-[16px] px-5 py-4 text-[15px] font-medium focus:outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 bg-[#f4f5f7] transition-all min-h-[140px] resize-y shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] placeholder:text-gray-400"
                          onChange={(e) => setFormData({...formData, [input.name]: e.target.value})}
                        />
                      ) : input.type === 'select' ? (
                        <select 
                          required
                          className="w-full border border-gray-200/60 rounded-[16px] px-5 py-4 text-[15px] font-medium focus:outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 bg-[#f4f5f7] transition-all appearance-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                          onChange={(e) => setFormData({...formData, [input.name]: e.target.value})}
                          defaultValue=""
                        >
                          <option value="" disabled className="text-gray-400">Select {input.label}</option>
                          {input.options.map((opt: string) => (
                            <option key={opt} value={opt} className="text-gray-900">{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input 
                          type={input.type}
                          required
                          placeholder={input.placeholder}
                          className="w-full border border-gray-200/60 rounded-[16px] px-5 py-4 text-[15px] font-medium focus:outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 bg-[#f4f5f7] transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] placeholder:text-gray-400"
                          onChange={(e) => setFormData({...formData, [input.name]: e.target.value})}
                        />
                      )}
                    </div>
                  ))}
                </form>
              )}

              {generating && (
                <div className="flex flex-col items-center justify-center py-16 space-y-6">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-[3px] border-gray-100"></div>
                    <div className={clsx("absolute inset-0 rounded-full border-[3px] border-t-transparent animate-spin", `border-[${activeTool.iconColor.replace('text-', '')}]`)} style={{ borderColor: 'currentColor', borderTopColor: 'transparent' }} >
                       <div className={clsx("w-full h-full rounded-full", activeTool.iconColor)}></div>
                    </div>
                    <activeTool.icon className={clsx("absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 animate-pulse", activeTool.iconColor)} />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-[18px] text-[#1a1a1a] mb-1">AI is generating...</h3>
                    <p className="text-[13px] text-gray-500 font-medium">Crafting your custom {activeTool.title.toLowerCase()}</p>
                  </div>
                </div>
              )}

              {output && !generating && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="bg-white border border-gray-200 rounded-[16px] p-6 shadow-sm">
                     <pre className="whitespace-pre-wrap font-sans text-[14px] text-gray-700 leading-relaxed">
                       {output}
                     </pre>
                   </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 md:px-8 md:py-5 border-t border-gray-100 bg-white flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4 shrink-0">
               {!output && !generating && (
                 <>
                   <button type="button" onClick={closeTool} className="px-6 py-3 rounded-full font-bold text-[14px] text-gray-500 hover:bg-gray-100 transition-colors flex-1 md:flex-initial text-center">
                     Cancel
                   </button>
                   <button type="submit" form="tool-form" className="px-8 py-3 rounded-full font-bold text-[14px] text-white bg-[#1a1a1a] hover:bg-black transition-all shadow-[0_6px_20px_rgba(0,0,0,0.15)] flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 flex-1 md:flex-initial justify-center">
                     <Sparkles className="w-4 h-4" /> Generate
                   </button>
                 </>
               )}
               {output && !generating && (
                 <>
                   <button type="button" onClick={() => { setOutput(null); setFormData({}); }} className="px-6 py-3 rounded-full font-bold text-[14px] text-gray-500 hover:bg-gray-100 transition-colors flex-1 md:flex-initial text-center">
                     Generate Another
                   </button>
                   <button type="button" onClick={handleCopy} className={clsx("px-8 py-3 rounded-full font-bold text-[14px] text-white transition-all shadow-[0_6px_20px_rgba(0,0,0,0.15)] flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 flex-1 md:flex-initial justify-center", copied ? "bg-green-500 hover:bg-green-600" : "bg-[#1a1a1a] hover:bg-black")}>
                     {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />} 
                     {copied ? 'Copied!' : 'Copy to Clipboard'}
                   </button>
                 </>
               )}
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import { CheckCircle2, Play } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/components/Toaster';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await api.getAnalytics();
      setData(res);
    } catch (error) {
      console.error('Failed to load analytics', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // Establish WebSocket for real-time updates
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    const wsUrl = API_URL.replace('http', 'ws').replace('/api', '');
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'analytics_updated') {
          // Re-fetch data in real-time without page reload!
          fetchAnalytics();
        }
      } catch (err) {}
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const handleSeed = async () => {
    try {
      setLoading(true);
      await api.seedAnalytics();
      toast.success('Successfully seeded real-time data!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to seed');
    }
  };

  if (loading && !data) {
    return (
      <div className="h-full flex flex-col pb-4">
        <Topbar title="Analytics" showBack={true} />
        <div className="flex-1 flex items-center justify-center bg-[#eef0f3] ml-[11px] mr-4 rounded-[16px]">
          <span className="text-gray-500 font-bold">Loading real-time analytics...</span>
        </div>
      </div>
    );
  }

  const { totalSubmissions, expectedSubmissions, averageScore, topScore, classMedian, lowestScore, grades, missedConcepts, recommendedActions, maxScore } = data || {};
  const arcPercentage = totalSubmissions > 0 ? (totalSubmissions / expectedSubmissions) * 100 : 0;
  // Calculate arc end point (SVG math)
  // Arc goes from 180 deg to 0 deg. (pi to 0 rad). 100% is 0 deg.
  const angle = Math.PI - (arcPercentage / 100) * Math.PI;
  const arcX = 50 + 40 * Math.cos(angle);
  const arcY = 50 - 40 * Math.sin(angle);

  return (
    <div className="h-full flex flex-col pb-4">
      <Topbar title="Analytics" showBack={true} />
      <div className="flex-1 flex flex-col relative bg-[#eef0f3] ml-[11px] mr-4 rounded-[16px] overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="xl:col-span-2 flex flex-col gap-8">
            
            {/* Overall Class Performance Summary */}
            <section>
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-[18px] font-bold text-[#333]">Overall Class Performance Summary</h2>
                <button onClick={handleSeed} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm">
                  <Play className="w-3.5 h-3.5" /> Simulate Real-time Submissions
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                
                {/* Submissions Card */}
                <div className="bg-[#2d2d2d] rounded-[24px] p-6 pt-10 text-white flex flex-col items-center w-full md:w-[280px] shadow-sm relative overflow-hidden">
                  
                  {/* Arc Progress */}
                  <div className="relative w-[180px] h-[90px] flex items-end justify-center mb-6">
                    {/* Background Arc */}
                    <svg className="absolute top-0 left-0 w-full h-full overflow-hidden" viewBox="0 0 100 50" preserveAspectRatio="xMidYMax meet">
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#3d3d3d" strokeWidth="7" strokeLinecap="round" />
                      {/* Foreground Arc */}
                      <path d={`M 10 50 A 40 40 0 0 1 ${arcX} ${arcY}`} fill="none" stroke="#ff512f" strokeWidth="7" strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="absolute bottom-0 flex flex-col items-center w-full translate-y-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[34px] font-black leading-none tracking-tighter text-white">{totalSubmissions || 0}</span>
                        <span className="text-[14px] text-gray-300 font-medium">/ {expectedSubmissions || 50}</span>
                      </div>
                      <span className="text-[11px] text-gray-400 font-medium mt-1">Submissions</span>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex flex-col gap-3 text-[14px] font-medium text-gray-200 mt-2 self-center mr-6">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-[4px] bg-[#ff6230]"></div>
                      Submitted
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-[4px] bg-[#3d3d3d]"></div>
                      Not Submitted
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div className="bg-white rounded-[24px] flex flex-col items-center justify-center p-6 shadow-sm">
                    <span className="text-[42px] font-black text-[#13c656] tracking-tighter transition-all">{averageScore || 0}%</span>
                    <span className="text-[14px] font-semibold text-[#4f4f4f] mt-1">Average Score</span>
                  </div>
                  <div className="bg-white rounded-[24px] flex flex-col items-center justify-center p-6 shadow-sm">
                    <span className="text-[42px] font-black text-[#ff6230] tracking-tighter transition-all">{topScore || 0}%</span>
                    <span className="text-[14px] font-semibold text-[#4f4f4f] mt-1">TopScore</span>
                  </div>
                  <div className="bg-white rounded-[24px] flex flex-col items-center justify-center p-6 shadow-sm">
                    <span className="text-[42px] font-black text-[#1a1a1a] tracking-tighter transition-all">
                      {classMedian || 0}<span className="text-[24px] text-gray-400">/{maxScore || 25}</span>
                    </span>
                    <span className="text-[14px] font-semibold text-[#4f4f4f] mt-1">Class Median</span>
                  </div>
                  <div className="bg-white rounded-[24px] flex flex-col items-center justify-center p-6 shadow-sm">
                    <span className="text-[42px] font-black text-[#9ca3af] tracking-tighter transition-all">{lowestScore || 0}%</span>
                    <span className="text-[14px] font-semibold text-[#4f4f4f] mt-1">Lowest Score</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Student Segmentation */}
            <section className="bg-[#ff6230] rounded-[32px] p-4 flex flex-col md:flex-row items-stretch justify-between shadow-sm relative overflow-hidden">
              
              {/* White inner card */}
              <div className="bg-white rounded-[24px] p-6 md:p-8 flex-1 md:mr-4 z-10">
                <h3 className="text-[16px] font-bold text-[#4f4f4f] mb-6 text-center md:text-left">
                  Student Segmentation (Based on grades)
                </h3>
                
                <div className="flex justify-between items-end gap-3">
                  <div className="bg-[#48c774] rounded-[16px] text-white flex flex-col items-center justify-center py-6 px-4 flex-1 shadow-md">
                    <span className="text-[42px] font-black leading-none mb-2">A</span>
                    <span className="text-[13px] font-medium leading-tight">{grades?.A || 0}</span>
                    <span className="text-[12px] font-medium leading-tight">Students</span>
                  </div>
                  <div className="bg-[#f2c94c] rounded-[16px] text-white flex flex-col items-center justify-center py-6 px-4 flex-1 shadow-md">
                    <span className="text-[42px] font-black leading-none mb-2">B</span>
                    <span className="text-[13px] font-medium leading-tight">{grades?.B || 0}</span>
                    <span className="text-[12px] font-medium leading-tight">Students</span>
                  </div>
                  <div className="bg-[#f2994a] rounded-[16px] text-white flex flex-col items-center justify-center py-6 px-4 flex-1 shadow-md">
                    <span className="text-[42px] font-black leading-none mb-2">C</span>
                    <span className="text-[13px] font-medium leading-tight">{grades?.C || 0}</span>
                    <span className="text-[12px] font-medium leading-tight">Students</span>
                  </div>
                  <div className="bg-[#d96570] rounded-[16px] text-white flex flex-col items-center justify-center py-6 px-4 flex-1 shadow-md">
                    <span className="text-[12px] font-bold mb-1 tracking-wider opacity-90">Below</span>
                    <span className="text-[42px] font-black leading-none mb-2">D</span>
                    <span className="text-[13px] font-medium leading-tight">{grades?.D || 0}</span>
                    <span className="text-[12px] font-medium leading-tight">Students</span>
                  </div>
                </div>
              </div>
              
              {/* Avatar on right side */}
              <div className="w-[180px] hidden md:flex items-center justify-center relative shrink-0">
                <div className="absolute w-[160px] h-[160px] bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute w-[120px] h-[120px] bg-white/30 rounded-full"></div>
                {/* Fallback to Dicebear avatar if custom asset isn't present */}
                <div className="w-[90px] h-[90px] rounded-full overflow-hidden bg-orange-100 relative z-10 border-4 border-[#ff6230] shadow-xl">
                   <img src="https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Teacher&backgroundColor=ffdfbf" alt="AI Avatar" className="w-full h-full object-cover" />
                </div>
                
                {/* Floating UI elements around avatar */}
                <div className="absolute top-8 right-6 w-5 h-5 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm"><span className="w-1.5 h-1.5 bg-white rounded-full"></span></div>
                <div className="absolute bottom-8 left-6 w-6 h-6 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm"><span className="w-2 h-2 bg-white rounded-full"></span></div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[18px] font-bold text-[#333] pl-2">Learning Gaps Analysis</h2>
            
            {/* Frequently Missed Concepts */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm min-h-[250px]">
              <h3 className="text-[16px] font-bold text-[#4f4f4f] mb-6">Frequently missed concepts</h3>
              
              <ul className="space-y-4">
                {missedConcepts?.length > 0 ? missedConcepts.map((item: any, i: number) => (
                  <li key={i} className="flex justify-between items-center text-[14px] font-semibold text-[#333]">
                    <span>{i + 1}. {item.concept}</span>
                    <span className="text-[#eb5757]">{item.percentage}%</span>
                  </li>
                )) : (
                  <div className="text-[14px] text-gray-400 font-medium italic mt-8 text-center">No missing concepts detected yet.</div>
                )}
              </ul>
            </div>

            {/* Recommended Actions */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm min-h-[250px]">
              <h3 className="text-[16px] font-bold text-[#4f4f4f] mb-5">Recommended Actions for teachers</h3>
              
              <ul className="space-y-5 text-[13px] font-medium text-[#4f4f4f] leading-relaxed pr-2">
                {recommendedActions?.length > 0 ? recommendedActions.map((action: string, i: number) => {
                  // Bold the first part before the dash for styling
                  const parts = action.split('–');
                  return (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-bold shrink-0">{i + 1}.</span>
                      <span>
                        <span className="font-bold text-[#333]">{parts[0]}</span> 
                        {parts.length > 1 ? `– ${parts.slice(1).join('–')}` : ''}
                      </span>
                    </li>
                  );
                }) : (
                  <div className="text-[14px] text-gray-400 font-medium italic mt-8 text-center">More submissions needed to generate recommendations.</div>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* AI Feedback Summary Section */}
        <div className="mt-8">
           <h2 className="text-[18px] font-bold text-[#333] pl-2 mb-4">AI Feedback Summary</h2>
           <div className="bg-white rounded-[24px] p-6 shadow-sm inline-flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-[#13c656] flex items-center justify-center">
               <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={3} />
             </div>
             <span className="text-[16px] font-bold text-[#4f4f4f]">
               Assignment Graded : <span className="text-black">87</span>
             </span>
           </div>
        </div>
        
      </div>
    </div>
    </div>
  );
}

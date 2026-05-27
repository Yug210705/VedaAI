'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Settings,
  Sparkles,
  BarChart3,
  LayoutDashboard,
  FileText,
  Plus,
  User,
  Bell,
  Shield,
  Smartphone,
  Grid3X3,
  Calendar,
  Bookmark
} from 'lucide-react';
import clsx from 'clsx';
import { toast } from '@/components/Toaster';
import { api } from '@/lib/api';
import Modal from '@/components/Modal';
import homeImg from '@/assets/home.png';
import mygroupImg from '@/assets/mygroup.png';
import assignmentsImg from '@/assets/assignments.png';
import toolkitImg from '@/assets/toolkit.png';
import mylibraryImg from '@/assets/mylibrary.png';
import mainLogoImg from '@/assets/image.png';

export default function Sidebar() {
  const pathname = usePathname();
  const [org, setOrg] = useState<any>(null);

  const fetchOrg = async () => {
    try {
      const data = await api.getOrganization();
      setOrg(data);
    } catch (err) {
      console.error('Failed to fetch org', err);
    }
  };

  useEffect(() => {
    fetchOrg();
    
    const handleOrgUpdate = () => fetchOrg();
    window.addEventListener('orgUpdated', handleOrgUpdate);
    
    return () => {
      window.removeEventListener('orgUpdated', handleOrgUpdate);
    };
  }, []);

  const navItems: any[] = [
    { name: 'Home', href: '/', iconImg: homeImg.src },
    { name: 'My Classes', href: '/classes', iconImg: mygroupImg.src },
    { name: 'Assignments', href: '/assignments', iconImg: assignmentsImg.src },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'My Library', href: '/library', iconImg: mylibraryImg.src },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-[280px] h-[calc(100vh-24px)] m-[12px] bg-white rounded-[24px] p-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 z-10 shrink-0">
        <div className="flex flex-col w-full gap-[40px]">
          
          {/* Logo & Button Group */}
          <div className="flex flex-col w-full gap-[24px]">
            {/* Logo */}
            <div className="flex items-center gap-3 px-2 mt-2">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm flex items-center justify-center shrink-0 bg-gradient-to-br from-[#f89b53] to-[#ff512f]">
                {/* Fallback "V" if image is missing/broken */}
                <span className="absolute text-white font-black text-xl z-0">V</span>
                <img src={mainLogoImg.src} className="absolute inset-0 w-full h-full object-cover z-10" alt="VedaAI Logo" />
              </div>
              <span className="font-extrabold text-[24px] tracking-tight text-[#1a1a1a]">VedaAI</span>
            </div>

            {/* Create Button */}
            <Link href="/assignments/create" className="block w-full mt-2">
              <div className="w-full bg-[#1c1c1c] rounded-full px-4 py-3.5 flex items-center justify-center gap-2 text-white font-semibold text-[13px] hover:bg-black transition-all shadow-[0_4px_14px_rgba(0,0,0,0.25)] border-[1.5px] border-[#333]">
                <Sparkles className="w-4 h-4 text-white" />
                Create Assignment
              </div>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="flex flex-col gap-1 w-full">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={clsx(
                    "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-[13px]",
                    isActive 
                      ? "bg-[#f3f4f6] text-[#1a1a1a]" 
                      : "text-[#6b7280] hover:bg-gray-50 hover:text-[#1a1a1a]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.iconImg ? (
                      <img src={item.iconImg} alt={item.name} className={clsx("w-[18px] h-[18px] object-contain", isActive ? "opacity-100" : "opacity-40 grayscale")} />
                    ) : (
                      item.icon && <item.icon className={clsx("w-[18px] h-[18px]", isActive ? "text-[#1a1a1a]" : "text-[#6b7280]")} />
                    )}
                    {item.name}
                  </div>
                  {item.badge && (
                    <span className="bg-[#ff512f] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide shrink-0">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="mt-auto flex flex-col gap-2">
            {/* Settings & Extras */}
            <div className="flex flex-col gap-1 mt-auto">
              <Link 
                href="/settings"
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group",
                  pathname.startsWith('/settings') ? "bg-[#f3f4f6] text-[#1a1a1a]" : "text-gray-500 hover:bg-gray-50"
                )}
              >
                <Settings className={clsx("w-5 h-5 transition-colors", pathname.startsWith('/settings') ? "text-[#1a1a1a]" : "group-hover:text-gray-900")} />
                <span className={clsx("font-semibold text-[14px] transition-colors", pathname.startsWith('/settings') ? "text-[#1a1a1a]" : "group-hover:text-gray-900")}>Settings</span>
              </Link>
            </div>
          
          <div className="flex items-center gap-3 p-3 mt-2 rounded-[16px] bg-[#f9fafb] border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-[#dcfce7] border border-[#bbf7d0] flex items-center justify-center overflow-hidden flex-shrink-0 text-lg relative shadow-sm">
              <span className="absolute z-0">🛡️</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-bold text-gray-900 truncate">{org?.name || 'Loading...'}</span>
              <span className="text-[11px] font-medium text-[#828282] truncate">{org?.location || '...'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Floating Action Button (FAB) */}
      <div className="md:hidden fixed bottom-[100px] right-5 z-[60]">
        <Link href="/assignments/create" className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100">
          <Plus className="w-5 h-5 text-[#ff6230]" strokeWidth={2} />
        </Link>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed bottom-4 left-3 right-3 bg-[#1a1a1a] text-gray-400 flex justify-around items-center px-1 py-2.5 rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.3)] z-[60]">
        <Link href="/" className={clsx("flex flex-col items-center gap-1 w-14", pathname === '/' ? "text-white" : "text-[#888] hover:text-gray-300")}>
          <Grid3X3 className="w-[18px] h-[18px]" />
          <span className="text-[9px] font-bold tracking-wide">Home</span>
        </Link>
        <Link href="/assignments" className={clsx("flex flex-col items-center gap-1 w-14", (pathname.includes('/assignments') && !pathname.includes('create')) ? "text-white" : "text-[#888] hover:text-gray-300")}>
          <Calendar className="w-[18px] h-[18px]" />
          <span className="text-[9px] font-bold tracking-wide">Assignments</span>
        </Link>
        <Link href="/library" className={clsx("flex flex-col items-center gap-1 w-14", pathname === '/library' ? "text-white" : "text-[#888] hover:text-gray-300")}>
          <Bookmark className="w-[18px] h-[18px]" />
          <span className="text-[9px] font-bold tracking-wide">Library</span>
        </Link>
        <Link href="/toolkit" className={clsx("flex flex-col items-center gap-1 w-14", pathname === '/toolkit' ? "text-white" : "text-[#888] hover:text-gray-300")}>
          <Sparkles className="w-[18px] h-[18px]" />
          <span className="text-[9px] font-bold tracking-wide">AI Toolkit</span>
        </Link>
      </div>
    </>
  );
}

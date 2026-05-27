'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Grid3X3, Bell, ChevronDown, HelpCircle, Settings, LogOut, User, Mail, Search, MessageSquare, Shield, Smartphone, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { toast } from '@/components/Toaster';
import Modal from '@/components/Modal';
import { api } from '@/lib/api';

interface TopbarProps {
  title: string;
  showBack?: boolean;
}

function SettingsContent({ user, api, toast, onClose, fetchData }: { user: any; api: any; toast: any; onClose: () => void; fetchData: () => void }) {
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'devices', label: 'Devices', icon: Smartphone },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-0 md:gap-6 h-auto md:h-[420px] max-h-[75vh] overflow-hidden -mx-6 -mb-6 md:mx-0 md:mb-0">
      {/* Tabs - horizontal scroll on mobile, vertical sidebar on desktop */}
      <div className="w-full md:w-[180px] shrink-0 border-b md:border-b-0 md:border-r border-gray-100 bg-[#fafafa] md:bg-transparent px-4 md:px-0 md:pr-4 py-3 md:py-0 flex md:flex-col gap-1.5 md:gap-1 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "font-semibold px-4 md:px-3 py-2.5 rounded-xl md:rounded-lg text-[13px] flex items-center gap-2 cursor-pointer transition-all duration-200 shrink-0 whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-[#1a1a1a] text-white shadow-sm md:bg-gray-100 md:text-[#1a1a1a] md:shadow-none md:font-bold"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              )}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 md:px-2 pb-6 md:pb-0 pt-5 md:pt-0">
        {activeTab === 'account' && (
          <div>
            <h3 className="font-extrabold text-[18px] text-[#1a1a1a] mb-6">Account Settings</h3>
            {user && (
              <form className="space-y-5" onSubmit={async (e: React.FormEvent) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                try {
                  await api.updateUser({
                    displayName: formData.get('displayName'),
                    email: formData.get('email')
                  });
                  onClose();
                  toast.success('Settings saved successfully');
                  fetchData();
                } catch (err) {
                  toast.error('Failed to update settings');
                }
              }}>
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Display Name</label>
                  <input name="displayName" type="text" defaultValue={user.displayName} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input name="email" type="email" defaultValue={user.email} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white" />
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <button type="submit" className="w-full md:w-auto bg-[#1c1c1c] text-white font-bold text-[13px] px-6 py-3 rounded-full hover:bg-black transition-colors">
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div>
            <h3 className="font-extrabold text-[18px] text-[#1a1a1a] mb-6">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { label: 'Assignment Alerts', desc: 'Get notified when new assignments are created or updated' },
                { label: 'Student Updates', desc: 'Receive alerts about student activity and submissions' },
                { label: 'AI Generation Complete', desc: 'Notify when AI finishes generating content' },
                { label: 'Weekly Summary', desc: 'Receive a weekly digest of all platform activity' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#f8f9fa] rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className="flex-1 mr-4">
                    <p className="text-[14px] font-bold text-[#1a1a1a]">{item.label}</p>
                    <p className="text-[12px] text-gray-500 font-medium mt-0.5">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1a1a1a]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div>
            <h3 className="font-extrabold text-[18px] text-[#1a1a1a] mb-6">Privacy & Security</h3>
            <div className="space-y-4">
              <div className="p-4 bg-[#f8f9fa] rounded-2xl">
                <p className="text-[14px] font-bold text-[#1a1a1a] mb-1">Data Collection</p>
                <p className="text-[12px] text-gray-500 font-medium">We only collect data necessary to improve your experience. Your student data is encrypted and never shared.</p>
              </div>
              <div className="p-4 bg-[#f8f9fa] rounded-2xl">
                <p className="text-[14px] font-bold text-[#1a1a1a] mb-1">AI Data Usage</p>
                <p className="text-[12px] text-gray-500 font-medium">Documents uploaded for AI processing are deleted immediately after generation. They are not stored or used for training.</p>
              </div>
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                <p className="text-[14px] font-bold text-red-600 mb-1">Danger Zone</p>
                <p className="text-[12px] text-red-500 font-medium mb-3">Permanently delete your account and all associated data.</p>
                <button className="px-4 py-2 bg-red-500 text-white text-[12px] font-bold rounded-full hover:bg-red-600 transition-colors">Delete Account</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'devices' && (
          <div>
            <h3 className="font-extrabold text-[18px] text-[#1a1a1a] mb-6">Active Devices</h3>
            <div className="space-y-3">
              {[
                { name: 'Chrome on Windows', location: 'Current Session', active: true },
                { name: 'Safari on iPhone', location: 'Last active 2h ago', active: false },
                { name: 'Firefox on MacOS', location: 'Last active 3 days ago', active: false },
              ].map((device, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#f8f9fa] rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center", device.active ? "bg-green-100" : "bg-gray-200")}>
                      <Smartphone className={clsx("w-5 h-5", device.active ? "text-green-600" : "text-gray-500")} />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[#1a1a1a]">{device.name}</p>
                      <p className="text-[12px] text-gray-500 font-medium">{device.location}</p>
                    </div>
                  </div>
                  {device.active ? (
                    <span className="text-[11px] font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">Active</span>
                  ) : (
                    <button className="text-[12px] font-bold text-red-500 hover:text-red-600 transition-colors">Revoke</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Topbar({ title, showBack = false }: TopbarProps) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const mobileProfileRef = useRef<HTMLDivElement>(null);
  const mobileNotifRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      const [userData, notifData] = await Promise.all([
        api.getUser(),
        api.getNotifications()
      ]);
      setUser(userData);
      setNotifications(notifData);
    } catch (error) {
      console.error('Failed to fetch topbar data', error);
    }
  };

  useEffect(() => {
    fetchData();

    // Listen for custom profile update event
    const handleProfileUpdate = () => fetchData();
    window.addEventListener('profileUpdated', handleProfileUpdate);

    function handleClickOutside(event: MouseEvent) {
      if (
        (profileRef.current && !profileRef.current.contains(event.target as Node)) &&
        (!mobileProfileRef.current || !mobileProfileRef.current.contains(event.target as Node))
      ) {
        setIsProfileOpen(false);
      }
      if (
        (notifRef.current && !notifRef.current.contains(event.target as Node)) &&
        (!mobileNotifRef.current || !mobileNotifRef.current.contains(event.target as Node))
      ) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  return (
    <>
      {/* Mobile Topbar Spacer to prevent overlap */}
      <div className="md:hidden h-[74px] w-full shrink-0"></div>

      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-3 left-3 right-3 bg-white rounded-[16px] h-[52px] px-3.5 shadow-sm flex items-center justify-between z-[60]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[8px] overflow-hidden shadow-sm flex items-center justify-center bg-[#2d2d2d]">
            <span className="text-white font-black text-[12px] leading-none">V</span>
          </div>
          <span className="font-extrabold text-[16px] text-[#1a1a1a] tracking-tight">VedaAI</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative" ref={mobileNotifRef}>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
              className="relative p-1"
            >
              <Bell className="w-5 h-5 text-gray-700" strokeWidth={2} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#ff6230] rounded-full border-2 border-white box-content"></span>
              )}
            </motion.button>
            {/* Mobile Notif Dropdown */}
            <AnimatePresence>
              {isNotifOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute right-0 mt-2 w-[280px] bg-white rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-gray-100 py-3 z-[100]"
                >
                  <div className="px-4 pb-2 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-[#1a1a1a]">Notifications</h3>
                    <span onClick={async () => { await api.markNotificationsRead(); fetchData(); }} className="text-[11px] font-bold text-[#ff6230] bg-orange-50 px-2 py-1 rounded-md cursor-pointer hover:bg-orange-100 transition-colors">Mark all read</span>
                  </div>
                  <div className="flex flex-col max-h-[250px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                    ) : notifications.map((n) => (
                      <div key={n._id || n.id} className={clsx("px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 border-b border-gray-50 last:border-0", !n.read && "bg-orange-50/30")}>
                        <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5", n.type === 'success' ? 'bg-green-50' : 'bg-blue-50')}>
                          {n.type === 'success' ? <User className="w-4 h-4 text-green-500" /> : <Grid3X3 className="w-4 h-4 text-blue-500" />}
                        </div>
                        <div>
                          <p className="text-[12px] text-[#1a1a1a] font-medium leading-tight">{n.title} <span className="font-bold">{n.description}</span></p>
                          <p className="text-[10px] text-gray-500 mt-1">{new Date(n.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={mobileProfileRef}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }} className="w-[28px] h-[28px] rounded-full overflow-hidden border-[1.5px] border-white shadow-sm flex shrink-0">
              <img src={user?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Default"} alt="avatar" className="w-full h-full object-cover" />
            </motion.button>
            {/* Mobile Profile Dropdown */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute right-0 mt-2 w-52 bg-white rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-gray-100 py-2 z-[100]"
                >
                  <Link href="/profile" onClick={() => setIsProfileOpen(false)}>
                    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-[#1a1a1a] font-semibold text-[13px] cursor-pointer">
                      <User className="w-4 h-4 text-gray-500" strokeWidth={2.5} /> My Profile
                    </div>
                  </Link>
                  <button onClick={() => { setIsProfileOpen(false); setIsSettingsOpen(true); }} className="w-full text-left">
                    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-[#1a1a1a] font-semibold text-[13px] cursor-pointer">
                      <Settings className="w-4 h-4 text-gray-500" strokeWidth={2.5} /> Settings
                    </div>
                  </button>
                  <div className="h-[1px] bg-gray-100 my-1 mx-3"></div>
                  <Link href="/" onClick={() => { setIsProfileOpen(false); toast.success('Logged out successfully'); }}>
                    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-red-600 font-semibold text-[13px] cursor-pointer">
                      <LogOut className="w-4 h-4 text-red-500" strokeWidth={2.5} /> Log Out
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Desktop Topbar */}
      <header className="flex items-center justify-between bg-white h-[56px] pl-[24px] pr-[12px] rounded-[16px] mb-3 mt-[12px] ml-[11px] mr-4 shadow-sm border border-gray-100 hidden md:flex z-50 relative">
        <div className="flex items-center gap-6 text-gray-400 pl-2">
        {showBack && (
          <button 
            onClick={() => router.back()} 
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 cursor-pointer text-gray-700" strokeWidth={2.5} />
          </button>
        )}
        <div className="flex items-center gap-2 text-[15px] font-semibold text-gray-400">
          <Grid3X3 className="w-5 h-5" strokeWidth={2.5} />
          {title}
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button 
          onClick={() => setIsHelpOpen(true)}
          className="relative w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-full transition-colors cursor-pointer text-[#4f4f4f]"
        >
          <HelpCircle className="w-5 h-5" strokeWidth={2} />
        </button>
        
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            className="relative w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-full transition-colors cursor-pointer text-[#4f4f4f]"
          >
            <Bell className="w-5 h-5" strokeWidth={2} />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white box-content"></span>
            )}
          </motion.button>
          
          <AnimatePresence>
            {isNotifOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="absolute right-0 mt-3 w-[320px] bg-white rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-gray-100 py-3 z-50"
              >
                <div className="px-5 pb-3 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-[#1a1a1a]">Notifications</h3>
                  <span 
                    onClick={async () => {
                      await api.markNotificationsRead();
                      fetchData();
                    }}
                    className="text-[11px] font-bold text-[#ff6230] bg-orange-50 px-2 py-1 rounded-md cursor-pointer hover:bg-orange-100 transition-colors"
                  >
                    Mark all read
                  </span>
                </div>
                <div className="flex flex-col max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                  ) : notifications.map((n) => (
                    <div key={n._id || n.id} className={clsx("px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 border-b border-gray-50 last:border-0", !n.read && "bg-orange-50/30")}>
                      <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5", n.type === 'success' ? 'bg-green-50' : 'bg-blue-50')}>
                        {n.type === 'success' ? <User className="w-4 h-4 text-green-500" /> : <Grid3X3 className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div>
                        <p className="text-[13px] text-[#1a1a1a] font-medium leading-tight">{n.title} <span className="font-bold">{n.description}</span></p>
                        <p className="text-[11px] text-gray-500 mt-1">{new Date(n.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 px-5 text-center">
                  <span className="text-[12px] font-bold text-gray-500 hover:text-[#1a1a1a] cursor-pointer transition-colors">View all notifications</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
            }}
            className={clsx(
              "flex items-center gap-3 pr-5 pl-1.5 py-1.5 rounded-full cursor-pointer transition-colors",
              isProfileOpen ? "bg-gray-100" : "bg-gray-50 hover:bg-gray-100"
            )}
          >
            <div className="w-9 h-9 rounded-full overflow-hidden bg-[#fce3c7] flex items-center justify-center font-bold text-[#f89b53]">
              {user?.avatarUrl && !user.avatarUrl.includes('dicebear') ? (
                <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                user?.displayName?.charAt(0) || 'U'
              )}
            </div>
            <span className="text-[15px] font-bold text-gray-700">{user?.displayName || 'Loading...'}</span>
            <ChevronDown className={clsx("w-4 h-4 text-gray-400 transition-transform", isProfileOpen && "rotate-180")} />
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="absolute right-0 mt-3 w-56 bg-white rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-gray-100 py-2 z-50"
              >
                <Link href="/profile" onClick={() => setIsProfileOpen(false)}>
                  <div className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-[#1a1a1a] font-semibold text-[13px] cursor-pointer">
                    <User className="w-4 h-4 text-gray-500" strokeWidth={2.5} />
                    My Profile
                  </div>
                </Link>
                <button 
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsSettingsOpen(true);
                  }}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-[#1a1a1a] font-semibold text-[13px] cursor-pointer">
                    <Settings className="w-4 h-4 text-gray-500" strokeWidth={2.5} />
                    Settings
                  </div>
                </button>
                <div className="h-[1px] bg-gray-100 my-1 mx-4"></div>
                <Link 
                  href="/" 
                  onClick={() => {
                    setIsProfileOpen(false);
                    toast.success('Logged out successfully');
                  }}
                >
                  <div className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition-colors text-red-600 font-semibold text-[13px] cursor-pointer">
                    <LogOut className="w-4 h-4 text-red-500" strokeWidth={2.5} />
                    Log Out
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>

      {/* Modals */}
      <Modal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} title="Help Center">
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[#1a1a1a] text-[14px]">Need immediate assistance?</h4>
              <p className="text-[13px] text-gray-600 mt-1">Our support team is available 24/7 to help you with any issues.</p>
              <button className="mt-3 bg-white border border-gray-200 text-[#1a1a1a] px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-gray-50 transition-colors">
                Chat with Support
              </button>
            </div>
          </div>
          
          <div className="pt-4">
            <h4 className="font-bold text-[#1a1a1a] text-[14px] mb-3">Frequently Asked Questions</h4>
            <div className="space-y-2">
              {['How do I generate an AI question paper?', 'Can I manually edit the grading rubric?', 'How do I invite students to my class?'].map((q, i) => (
                <div key={i} className="p-3 border border-gray-100 rounded-xl hover:border-gray-300 transition-colors cursor-pointer flex justify-between items-center group">
                  <span className="text-[13px] font-medium text-gray-700 group-hover:text-[#1a1a1a]">{q}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Settings" maxWidth="max-w-2xl">
        <SettingsContent user={user} api={api} toast={toast} onClose={() => setIsSettingsOpen(false)} fetchData={fetchData} />
      </Modal>
    </>
  );
}

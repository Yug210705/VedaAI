'use client';

import React, { useState, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import { 
  User, Building2, Users, CreditCard, Puzzle, Bell, Shield, 
  Smartphone, Upload, Plus, Trash2, CheckCircle2, ChevronRight, ToggleLeft, ToggleRight
} from 'lucide-react';
import clsx from 'clsx';
import { toast } from '@/components/Toaster';
import { api } from '@/lib/api';

const TABS = [
  { id: 'profile', label: 'Profile & Account', icon: User, desc: 'Personal info and preferences' },
  { id: 'org', label: 'Organization', icon: Building2, desc: 'School details and branding' },
  { id: 'team', label: 'Team Management', icon: Users, desc: 'Manage teachers and admins' },
  { id: 'billing', label: 'Billing & Usage', icon: CreditCard, desc: 'Plans and AI token usage' },
  { id: 'integrations', label: 'Integrations', icon: Puzzle, desc: 'LMS and external APIs' },
  { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Alerts and email preferences' },
  { id: 'security', label: 'Security', icon: Shield, desc: 'Passwords and 2FA' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  // States
  const [profile, setProfile] = useState<any>({});
  const [org, setOrg] = useState<any>({});
  const [team, setTeam] = useState<any[]>([]);
  const [billing, setBilling] = useState<any>({});
  const [integrations, setIntegrations] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const [profRes, orgRes, teamRes, billRes, intRes] = await Promise.all([
        api.getProfile(),
        api.getOrganization(),
        api.getTeam(),
        api.getBilling(),
        api.getIntegrations()
      ]);
      setProfile(profRes);
      setOrg(orgRes);
      setTeam(teamRes);
      setBilling(billRes);
      setIntegrations(intRes);
    } catch (err) {
      toast.error('Failed to load settings data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateProfile(profile);
      toast.success('Profile updated successfully');
      window.dispatchEvent(new Event('profileUpdated'));
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleOrgSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateOrganization(org);
      toast.success('Organization updated successfully');
      window.dispatchEvent(new Event('orgUpdated'));
    } catch (err) {
      toast.error('Failed to update organization');
    }
  };

  const handleInviteMember = async () => {
    const email = prompt('Enter email address to invite:');
    if (!email) return;
    try {
      await api.inviteTeamMember({ displayName: email.split('@')[0], email, role: 'Teacher' });
      toast.success('Member invited successfully');
      loadData();
    } catch (err) {
      toast.error('Failed to invite member');
    }
  };

  const handleToggleIntegration = async (id: string) => {
    try {
      await api.toggleIntegration(id);
      toast.success('Integration toggled');
      loadData();
    } catch (err) {
      toast.error('Failed to toggle integration');
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      await api.deleteTeamMember(id);
      toast.success('Member removed');
      loadData();
    } catch (err) {
      toast.error('Failed to remove member');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 800 * 1024) {
      toast.error('Image must be less than 800KB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile({ ...profile, avatarUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const renderContent = () => {
    if (loading) {
      return <div className="flex items-center justify-center h-[400px]">Loading settings...</div>;
    }

    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleProfileSave} className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <h2 className="text-[18px] md:text-[20px] font-extrabold text-[#1a1a1a] tracking-tight mb-1">Profile & Account</h2>
              <p className="text-[12px] md:text-[13px] text-gray-500 font-medium">Manage your personal information and preferences.</p>
            </div>
            
            {/* Avatar Section */}
            <div className="flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-6 pb-6 border-b border-gray-100">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#fce3c7] shadow-sm flex items-center justify-center text-white text-xl md:text-2xl font-black overflow-hidden relative shrink-0">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#f89b53] to-[#ff512f] flex items-center justify-center">
                    {profile?.displayName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-auto">
                <input 
                  type="file" 
                  id="avatarUpload" 
                  accept="image/jpeg, image/png, image/gif" 
                  className="hidden" 
                  onChange={handlePhotoUpload} 
                />
                <button 
                  type="button" 
                  onClick={() => document.getElementById('avatarUpload')?.click()}
                  className="bg-white border border-gray-200 hover:bg-gray-50 text-[12px] md:text-[13px] font-bold px-4 py-2.5 md:py-2 rounded-[100px] md:rounded-xl transition-colors mb-1.5 md:mb-2 flex items-center justify-center gap-2 w-full md:w-auto shadow-sm active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5 md:w-4 md:h-4" /> Upload New Photo
                </button>
                <p className="text-[10px] md:text-[11px] text-gray-400">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-6 border-b border-gray-100">
              <div>
                <label className="block text-[11px] md:text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-2">Full Name</label>
                <input type="text" value={profile?.displayName || ''} onChange={(e) => setProfile({...profile, displayName: e.target.value})} className="w-full border border-gray-200 rounded-[12px] md:rounded-xl px-4 py-3 md:py-2.5 text-[13px] md:text-[14px] font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-[#f8f9fa]" />
              </div>
              <div>
                <label className="block text-[11px] md:text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-2">Email Address</label>
                <input type="email" value={profile?.email || ''} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full border border-gray-200 rounded-[12px] md:rounded-xl px-4 py-3 md:py-2.5 text-[13px] md:text-[14px] font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-[#f8f9fa]" />
              </div>
              <div>
                <label className="block text-[11px] md:text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-2">Role</label>
                <input type="text" value={profile?.role || ''} readOnly className="w-full border border-gray-200 rounded-[12px] md:rounded-xl px-4 py-3 md:py-2.5 text-[13px] md:text-[14px] font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-[#eef0f3] cursor-not-allowed text-gray-500" />
              </div>
              <div>
                <label className="block text-[11px] md:text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-2">Timezone</label>
                <div className="relative">
                  <select value={profile?.timezone || ''} onChange={(e) => setProfile({...profile, timezone: e.target.value})} className="w-full border border-gray-200 rounded-[12px] md:rounded-xl px-4 py-3 md:py-2.5 text-[13px] md:text-[14px] font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-[#f8f9fa] appearance-none cursor-pointer">
                    <option>Asia/Kolkata (IST)</option>
                    <option>America/New_York (EST)</option>
                    <option>Europe/London (GMT)</option>
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                className="w-full md:w-auto bg-[#1a1a1a] hover:bg-black text-white font-bold text-[13px] md:text-[13px] px-6 py-3.5 md:py-3 rounded-full transition-colors shadow-[0_4px_14px_rgba(0,0,0,0.15)] active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        );
      case 'org':
        return (
          <form onSubmit={handleOrgSave} className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <h2 className="text-[20px] font-extrabold text-[#1a1a1a] tracking-tight mb-1">Organization Settings</h2>
              <p className="text-[13px] text-gray-500 font-medium">Manage your school or institution's details.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
              <div className="md:col-span-2">
                <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">School/Organization Name</label>
                <input type="text" value={org?.name || ''} onChange={(e) => setOrg({...org, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-[#f8f9fa]" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Location/Branch</label>
                <input type="text" value={org?.location || ''} onChange={(e) => setOrg({...org, location: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-[#f8f9fa]" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Academic Year</label>
                <select value={org?.academicYear || ''} onChange={(e) => setOrg({...org, academicYear: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-[#f8f9fa] appearance-none cursor-pointer">
                  <option>2023 - 2024</option>
                  <option>2024 - 2025</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit"
                className="bg-[#1a1a1a] hover:bg-black text-white font-bold text-[13px] px-6 py-3 rounded-full transition-colors shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
              >
                Save Changes
              </button>
            </div>
          </form>
        );
      case 'team':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="text-[20px] font-extrabold text-[#1a1a1a] tracking-tight mb-1">Team Management</h2>
                <p className="text-[13px] text-gray-500 font-medium">Manage teachers and administrators in your workspace.</p>
              </div>
              <button onClick={handleInviteMember} className="bg-[#ff512f] text-white font-bold text-[12px] px-4 py-2.5 rounded-full hover:bg-[#ff7a50] transition-colors shadow-sm flex items-center gap-2">
                <Plus className="w-4 h-4" /> Invite Member
              </button>
            </div>
            
            <div className="border border-gray-100 rounded-[20px] overflow-hidden bg-white shadow-sm">
              <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 p-4 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <div>Member</div>
                <div>Role</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>
              
              <div className="divide-y divide-gray-50">
                {team.map((user: any, i) => {
                  const isMe = user._id === profile._id;
                  return (
                    <div key={user._id || i} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#f3f4f6] flex items-center justify-center font-bold text-[#4f4f4f] text-[13px] overflow-hidden relative">
                          {user.avatarUrl && !user.avatarUrl.includes('dicebear') ? (
                            <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            user.displayName?.charAt(0) || 'U'
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[14px] text-[#1a1a1a] flex items-center gap-2">
                            {user.displayName}
                            {isMe && <span className="bg-orange-100 text-orange-600 text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">You</span>}
                          </div>
                          <div className="text-[12px] font-medium text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      <div>
                        <select disabled={isMe} defaultValue={user.role} className="bg-transparent text-[13px] font-semibold text-gray-700 focus:outline-none cursor-pointer">
                          <option value="Teacher">Teacher</option>
                          <option value="Admin">Admin</option>
                          <option value="Owner / Admin">Owner / Admin</option>
                        </select>
                      </div>
                      <div>
                        <span className={clsx(
                          "text-[11px] font-bold px-2 py-1 rounded-md",
                          user.status === 'Active' ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
                        )}>
                          {user.status || 'Active'}
                        </span>
                      </div>
                      <div className="text-right w-[50px] flex justify-end">
                        {!isMe && (
                          <button onClick={() => handleDeleteMember(user._id)} className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case 'billing':
        const pctUsed = Math.min(100, Math.round(((billing.tokensUsed || 0) / (billing.tokenLimit || 10000)) * 100));
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <h2 className="text-[20px] font-extrabold text-[#1a1a1a] tracking-tight mb-1">Billing & Usage</h2>
              <p className="text-[13px] text-gray-500 font-medium">Manage your subscription and monitor AI token usage.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Plan */}
              <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff512f]/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="bg-orange-50 text-orange-600 text-[11px] font-bold px-2.5 py-1 rounded-full w-fit mb-4 uppercase tracking-wider">Current Plan</div>
                <h3 className="font-black text-[28px] text-[#1a1a1a] mb-1">{billing.planType || 'Pro Educator'}</h3>
                <p className="text-[13px] font-medium text-gray-500 mb-6">{billing.price || '$12 / month (billed annually)'}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Unlimited Classes & Assignments
                  </div>
                  <div className="flex items-center gap-2 text-[13px] font-medium text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> {billing.tokenLimit?.toLocaleString() || '10,000'} AI Tokens / month
                  </div>
                  <div className="flex items-center gap-2 text-[13px] font-medium text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Priority Support
                  </div>
                </div>
                
                <button className="w-full bg-white border border-gray-200 text-[#1a1a1a] font-bold text-[13px] px-6 py-2.5 rounded-full hover:bg-gray-50 transition-colors">
                  Manage Subscription
                </button>
              </div>

              {/* Usage */}
              <div className="bg-[#2d2d2d] rounded-[24px] p-6 shadow-sm relative overflow-hidden text-white flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-[14px] text-gray-300 mb-4 uppercase tracking-wider">AI Token Usage</h3>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="font-black text-[42px] leading-none">{billing.tokensUsed?.toLocaleString() || 0}</span>
                    <span className="text-[13px] text-gray-400 font-medium mb-1">/ {billing.tokenLimit?.toLocaleString() || 10000}</span>
                  </div>
                  <p className="text-[12px] text-gray-400">Tokens used this billing cycle</p>
                </div>
                
                <div className="mt-8">
                  <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-gradient-to-r from-[#f89b53] to-[#ff512f] rounded-full transition-all duration-1000" style={{ width: `${pctUsed}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-gray-400">
                    <span>Reset in {Math.max(0, Math.ceil((new Date(billing.resetDate || Date.now()).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days</span>
                    <span>{pctUsed}% Used</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'integrations':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <h2 className="text-[20px] font-extrabold text-[#1a1a1a] tracking-tight mb-1">Integrations</h2>
              <p className="text-[13px] text-gray-500 font-medium">Connect VedaAI with your favorite LMS and tools.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrations.map((app: any, i) => (
                <div key={app._id || i} className="bg-white border border-gray-100 rounded-[20px] p-5 flex items-center justify-between hover:shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-gray-400 text-lg shrink-0">
                      {app.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-[14px] text-[#1a1a1a]">{app.name}</h4>
                      <p className="text-[11px] text-gray-500 font-medium mt-0.5 max-w-[180px]">{app.desc}</p>
                    </div>
                  </div>
                  <div>
                    {app.connected ? (
                      <button onClick={() => handleToggleIntegration(app._id)} className="bg-green-50 text-green-600 border border-green-100 font-bold text-[12px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-green-100 transition-colors">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                      </button>
                    ) : (
                      <button onClick={() => handleToggleIntegration(app._id)} className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-[12px] px-4 py-1.5 rounded-lg transition-colors">
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-[400px] text-gray-400 font-medium">
            Section under construction
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col pb-4">
      <Topbar title="Settings" showBack={false} />
      
      <div className="flex-1 flex flex-col relative bg-[#f8f9fa] md:mx-3 md:rounded-[24px] overflow-hidden md:shadow-sm md:border border-gray-100">
        <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
          
          {/* Left Sidebar / Top Horizontal Scroll on Mobile */}
          <div className="w-full md:w-[280px] bg-white border-b md:border-b-0 md:border-r border-gray-100 shrink-0 md:h-full overflow-x-auto md:overflow-y-auto hide-scrollbar p-4 md:p-6 z-10 shadow-sm md:shadow-none">
            <h3 className="hidden md:block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-4">Settings Menu</h3>
            <div className="flex md:flex-col gap-2 md:gap-1 w-max md:w-full">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={clsx(
                      "flex md:flex-col items-center md:items-start gap-2 md:gap-0 px-4 py-2.5 md:py-3 rounded-[100px] md:rounded-[16px] transition-all text-left border md:border-transparent shrink-0",
                      isActive 
                        ? "bg-[#1a1a1a] text-white shadow-md border-black" 
                        : "text-gray-500 bg-white hover:bg-gray-50 border-gray-200"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <tab.icon className={clsx("w-[16px] h-[16px] md:w-[18px] md:h-[18px]", isActive ? "text-[#ff512f]" : "")} />
                      <span className={clsx("font-extrabold text-[13px] md:text-[13.5px]", isActive ? "text-white" : "text-[#1a1a1a]")}>{tab.label}</span>
                    </div>
                    <span className={clsx(
                      "hidden md:block text-[10px] font-medium mt-1 ml-[28px]",
                      isActive ? "text-gray-300" : "text-gray-400"
                    )}>
                      {tab.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Right Content */}
          <div className="flex-1 overflow-y-auto hide-scrollbar p-4 md:p-8 xl:p-12 pb-[140px] md:pb-12 bg-white md:bg-transparent">
            <div className="max-w-3xl">
              {renderContent()}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

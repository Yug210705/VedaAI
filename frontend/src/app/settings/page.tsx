'use client';

import React, { useState, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import { 
  User, Building2, Users, CreditCard, Puzzle, Bell, Shield, 
  Smartphone, Upload, Plus, Trash2, CheckCircle2, ChevronRight, ToggleLeft, ToggleRight, Archive, RefreshCw, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  { id: 'archives', label: 'Archives & Bin', icon: Archive, desc: 'Restore or delete items' },
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

  // Archives & Bin State
  const [archivedAssignments, setArchivedAssignments] = useState<any[]>([]);
  const [deletedAssignments, setDeletedAssignments] = useState<any[]>([]);
  const [archivedClasses, setArchivedClasses] = useState<any[]>([]);
  const [deletedClasses, setDeletedClasses] = useState<any[]>([]);
  const [archiveView, setArchiveView] = useState<'assignments' | 'classes'>('assignments');
  
  // Notifications State
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    assignment: true,
    marketing: false
  });

  const loadData = async () => {
    try {
      const [profRes, orgRes, teamRes, billRes, intRes, archAssign, delAssign, archClass, delClass] = await Promise.all([
        api.getProfile(),
        api.getOrganization(),
        api.getTeam(),
        api.getBilling(),
        api.getIntegrations(),
        api.getArchivedAssignments(),
        api.getDeletedAssignments(),
        api.getArchivedClasses(),
        api.getDeletedClasses()
      ]);
      setProfile(profRes);
      setOrg(orgRes);
      setTeam(teamRes);
      setBilling(billRes);
      setIntegrations(intRes);
      setArchivedAssignments(archAssign);
      setDeletedAssignments(delAssign);
      setArchivedClasses(archClass);
      setDeletedClasses(delClass);
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

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Notification preferences updated');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile({ ...profile, avatarUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleRestoreAssignment = async (id: string) => {
    try {
      await api.restoreAssignment(id);
      toast.success('Assignment restored');
      loadData();
    } catch (err) { toast.error('Failed to restore assignment'); }
  };
  const handlePermDeleteAssignment = async (id: string) => {
    if(!confirm('Delete permanently?')) return;
    try {
      await api.permanentDeleteAssignment(id);
      toast.success('Assignment permanently deleted');
      loadData();
    } catch (err) { toast.error('Failed to delete assignment'); }
  };
  const handleRestoreClass = async (id: string) => {
    try {
      await api.restoreClass(id);
      toast.success('Class restored');
      loadData();
    } catch (err) { toast.error('Failed to restore class'); }
  };
  const handlePermDeleteClass = async (id: string) => {
    if(!confirm('Delete permanently?')) return;
    try {
      await api.permanentDeleteClass(id);
      toast.success('Class permanently deleted');
      loadData();
    } catch (err) { toast.error('Failed to delete class'); }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="flex items-center justify-center h-[400px]">Loading settings...</div>;
    }

    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleProfileSave} className="space-y-6 md:space-y-8 md:bg-white md:p-8 xl:p-10 md:rounded-[24px] md:shadow-sm md:border md:border-gray-100">
            <div className="pb-4 md:pb-2">
              <h2 className="text-[18px] md:text-[22px] font-extrabold text-[#1a1a1a] tracking-tight mb-1">Profile & Account</h2>
              <p className="text-[12px] md:text-[14px] text-gray-500 font-medium">Manage your personal information and preferences.</p>
            </div>
            
            {/* Avatar Section */}
            <div className="flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-8 pb-6 md:pb-8 border-b border-gray-100">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#fce3c7] shadow-sm flex items-center justify-center text-white text-xl md:text-3xl font-black overflow-hidden relative shrink-0 ring-4 ring-white">
                {profile?.avatarUrl && !profile.avatarUrl.includes('dicebear') ? (
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
                  className="bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-[12px] md:text-[13.5px] font-bold px-4 py-2.5 md:py-2.5 md:px-5 rounded-[100px] md:rounded-xl transition-all mb-1.5 md:mb-2.5 flex items-center justify-center gap-2 w-full md:w-auto shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95"
                >
                  <span className="font-bold text-[11px] md:text-[13px] text-gray-800">Upload New Photo</span>
                </button>
                <p className="text-[10px] md:text-[11px] font-medium text-gray-400 mt-2.5">JPG, GIF or PNG. Max size of 5MB</p>
              </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-7 pb-6 md:pb-8 border-b border-gray-100">
              <div>
                <label className="block text-[11px] md:text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-2.5">Full Name</label>
                <input type="text" value={profile?.displayName || ''} onChange={(e) => setProfile({...profile, displayName: e.target.value})} className="w-full border border-gray-200 rounded-[12px] md:rounded-xl px-4 py-3 md:py-3.5 text-[13px] md:text-[14.5px] font-medium focus:outline-none focus:bg-white focus:border-[#ff512f] focus:ring-4 focus:ring-[#ff512f]/10 bg-[#f8f9fa] transition-all" />
              </div>
              <div>
                <label className="block text-[11px] md:text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-2.5">Email Address</label>
                <input type="email" value={profile?.email || ''} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full border border-gray-200 rounded-[12px] md:rounded-xl px-4 py-3 md:py-3.5 text-[13px] md:text-[14.5px] font-medium focus:outline-none focus:bg-white focus:border-[#ff512f] focus:ring-4 focus:ring-[#ff512f]/10 bg-[#f8f9fa] transition-all" />
              </div>
              <div>
                <label className="block text-[11px] md:text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-2.5">Department</label>
                <input type="text" value={profile?.department || ''} onChange={(e) => setProfile({...profile, department: e.target.value})} placeholder="e.g. Mathematics" className="w-full border border-gray-200 rounded-[12px] md:rounded-xl px-4 py-3 md:py-3.5 text-[13px] md:text-[14.5px] font-medium focus:outline-none focus:bg-white focus:border-[#ff512f] focus:ring-4 focus:ring-[#ff512f]/10 bg-[#f8f9fa] transition-all" />
              </div>
              <div>
                <label className="block text-[11px] md:text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-2.5">Phone Number</label>
                <input type="tel" value={profile?.phoneNumber || ''} onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})} placeholder="+91 00000 00000" className="w-full border border-gray-200 rounded-[12px] md:rounded-xl px-4 py-3 md:py-3.5 text-[13px] md:text-[14.5px] font-medium focus:outline-none focus:bg-white focus:border-[#ff512f] focus:ring-4 focus:ring-[#ff512f]/10 bg-[#f8f9fa] transition-all" />
              </div>
              <div>
                <label className="block text-[11px] md:text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-2.5">Role</label>
                <input type="text" value={profile?.role || ''} readOnly className="w-full border border-gray-200 rounded-[12px] md:rounded-xl px-4 py-3 md:py-3.5 text-[13px] md:text-[14.5px] font-medium focus:outline-none focus:bg-white focus:border-[#ff512f] focus:ring-4 focus:ring-[#ff512f]/10 bg-[#eef0f3] cursor-not-allowed text-gray-500 transition-all" />
              </div>
              <div>
                <label className="block text-[11px] md:text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-2.5">Timezone</label>
                <div className="relative">
                  <select value={profile?.timezone || ''} onChange={(e) => setProfile({...profile, timezone: e.target.value})} className="w-full border border-gray-200 rounded-[12px] md:rounded-xl px-4 py-3 md:py-3.5 text-[13px] md:text-[14.5px] font-medium focus:outline-none focus:bg-white focus:border-[#ff512f] focus:ring-4 focus:ring-[#ff512f]/10 bg-[#f8f9fa] appearance-none cursor-pointer transition-all">
                    <option>Asia/Kolkata (IST)</option>
                    <option>America/New_York (EST)</option>
                    <option>Europe/London (GMT)</option>
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 pointer-events-none rotate-90" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[11px] md:text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-2.5">Bio</label>
                <textarea value={profile?.bio || ''} onChange={(e) => setProfile({...profile, bio: e.target.value})} placeholder="Write a short bio about your teaching experience..." className="w-full border border-gray-200 rounded-[12px] md:rounded-xl px-4 py-3 md:py-3.5 text-[13px] md:text-[14.5px] font-medium focus:outline-none focus:bg-white focus:border-[#ff512f] focus:ring-4 focus:ring-[#ff512f]/10 bg-[#f8f9fa] transition-all min-h-[100px] resize-y"></textarea>
              </div>
            </div>

            <div className="flex justify-end pt-4 md:pt-2">
              <button 
                type="submit"
                className="w-full md:w-auto bg-[#1a1a1a] hover:bg-black text-white font-bold text-[13px] md:text-[14px] px-6 py-3.5 md:py-3.5 md:px-8 rounded-full transition-all shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        );
      case 'org':
        return (
          <form onSubmit={handleOrgSave} className="space-y-6 md:space-y-8 md:bg-white md:p-8 xl:p-10 md:rounded-[24px] md:shadow-sm md:border md:border-gray-100">
            <div className="pb-4 md:pb-2">
              <h2 className="text-[18px] md:text-[22px] font-extrabold text-[#1a1a1a] tracking-tight mb-1">Organization Settings</h2>
              <p className="text-[12px] md:text-[14px] text-gray-500 font-medium">Manage your school or institution's details.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-7 pb-6 md:pb-8 border-b border-gray-100">
              <div className="md:col-span-2">
                <label className="block text-[11px] md:text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-2.5">School/Organization Name</label>
                <input type="text" value={org?.name || ''} onChange={(e) => setOrg({...org, name: e.target.value})} className="w-full border border-gray-200 rounded-[12px] md:rounded-xl px-4 py-3 md:py-3.5 text-[13px] md:text-[14.5px] font-medium focus:outline-none focus:bg-white focus:border-[#ff512f] focus:ring-4 focus:ring-[#ff512f]/10 bg-[#f8f9fa] transition-all" />
              </div>
              <div>
                <label className="block text-[11px] md:text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-2.5">Location/Branch</label>
                <input type="text" value={org?.location || ''} onChange={(e) => setOrg({...org, location: e.target.value})} className="w-full border border-gray-200 rounded-[12px] md:rounded-xl px-4 py-3 md:py-3.5 text-[13px] md:text-[14.5px] font-medium focus:outline-none focus:bg-white focus:border-[#ff512f] focus:ring-4 focus:ring-[#ff512f]/10 bg-[#f8f9fa] transition-all" />
              </div>
              <div>
                <label className="block text-[11px] md:text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-2.5">Academic Year</label>
                <div className="relative">
                  <select value={org?.academicYear || ''} onChange={(e) => setOrg({...org, academicYear: e.target.value})} className="w-full border border-gray-200 rounded-[12px] md:rounded-xl px-4 py-3 md:py-3.5 text-[13px] md:text-[14.5px] font-medium focus:outline-none focus:bg-white focus:border-[#ff512f] focus:ring-4 focus:ring-[#ff512f]/10 bg-[#f8f9fa] appearance-none cursor-pointer transition-all">
                    <option>2023 - 2024</option>
                    <option>2024 - 2025</option>
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 pointer-events-none rotate-90" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 md:pt-2">
              <button 
                type="submit"
                className="w-full md:w-auto bg-[#1a1a1a] hover:bg-black text-white font-bold text-[13px] md:text-[14px] px-6 py-3.5 md:py-3.5 md:px-8 rounded-full transition-all shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        );
      case 'team':
        return (
          <div className="space-y-6 md:space-y-8 md:bg-white md:p-8 xl:p-10 md:rounded-[24px] md:shadow-sm md:border md:border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 md:pb-2">
              <div>
                <h2 className="text-[18px] md:text-[22px] font-extrabold text-[#1a1a1a] tracking-tight mb-1">Team Management</h2>
                <p className="text-[12px] md:text-[14px] text-gray-500 font-medium">Manage teachers and administrators in your workspace.</p>
              </div>
              <button onClick={handleInviteMember} className="w-full md:w-auto bg-[#ff512f] text-white font-bold text-[12px] md:text-[13px] px-5 py-3 md:py-2.5 rounded-full hover:bg-[#ff7a50] transition-all shadow-[0_4px_14px_rgba(255,81,47,0.25)] hover:shadow-[0_6px_20px_rgba(255,81,47,0.3)] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2">
                <Plus className="w-4 h-4 md:w-4 md:h-4" /> Invite Member
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-[16px] md:rounded-[20px] overflow-hidden bg-white shadow-sm">
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 p-4 md:px-6 md:py-4 bg-[#f8f9fa] border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <div>Member</div>
                <div>Role</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {team.map((user: any, i) => {
                  const isMe = user._id === profile._id;
                  return (
                    <div key={user._id || i} className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_auto] gap-4 md:gap-4 p-4 md:px-6 md:py-4 items-start md:items-center hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3 md:gap-4 w-full">
                        <div className="w-10 h-10 md:w-10 md:h-10 rounded-full bg-[#fce3c7] flex items-center justify-center font-bold text-[#f89b53] text-[13px] md:text-[14px] overflow-hidden relative shrink-0">
                          {user.avatarUrl && !user.avatarUrl.includes('dicebear') ? (
                            <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            user.displayName?.charAt(0) || 'U'
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[14px] text-[#1a1a1a] flex items-center gap-2 truncate">
                            {user.displayName}
                            {isMe && <span className="bg-[#ff512f]/10 text-[#ff512f] text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-md uppercase tracking-wider font-bold">You</span>}
                          </div>
                          <div className="text-[12px] md:text-[12.5px] font-medium text-gray-500 truncate">{user.email}</div>
                        </div>
                      </div>
                      <div className="w-full md:w-auto">
                        <select disabled={isMe} defaultValue={user.role} className="w-full md:w-auto bg-white md:bg-transparent border border-gray-200 md:border-transparent rounded-[10px] md:rounded-none px-3 md:px-0 py-2 md:py-0 text-[13px] font-bold text-gray-700 focus:outline-none cursor-pointer">
                          <option value="Teacher">Teacher</option>
                          <option value="Admin">Admin</option>
                          <option value="Owner / Admin">Owner / Admin</option>
                        </select>
                      </div>
                      <div className="w-full md:w-auto flex justify-between md:block items-center">
                        <span className="md:hidden text-[12px] font-bold text-gray-500 uppercase tracking-wider">Status</span>
                        <span className={clsx(
                          "text-[11px] md:text-[12px] font-bold px-2.5 py-1 md:py-1 rounded-md",
                          user.status === 'Active' ? "bg-green-50 text-green-600 border border-green-100" : "bg-yellow-50 text-yellow-600 border border-yellow-100"
                        )}>
                          {user.status || 'Active'}
                        </span>
                      </div>
                      <div className="text-right w-full md:w-[50px] flex justify-end">
                        {!isMe && (
                          <button onClick={() => handleDeleteMember(user._id)} className="w-full md:w-auto text-gray-400 hover:text-red-500 transition-colors p-2 md:p-1.5 rounded-[10px] md:rounded-lg border border-gray-200 md:border-transparent hover:bg-red-50 flex justify-center items-center gap-2">
                            <Trash2 className="w-4 h-4 md:w-4 md:h-4" />
                            <span className="md:hidden text-[13px] font-bold">Remove Member</span>
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
          <div className="space-y-6 md:space-y-8 md:bg-white md:p-8 xl:p-10 md:rounded-[24px] md:shadow-sm md:border md:border-gray-100">
            <div className="pb-4 md:pb-2">
              <h2 className="text-[18px] md:text-[22px] font-extrabold text-[#1a1a1a] tracking-tight mb-1">Billing & Usage</h2>
              <p className="text-[12px] md:text-[14px] text-gray-500 font-medium">Manage your subscription and monitor AI token usage.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 md:pb-2">
              {/* Current Plan */}
              <div className="bg-white border border-gray-100 md:border-gray-200 rounded-[20px] md:rounded-[24px] p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff512f]/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="bg-orange-50 text-orange-600 text-[11px] font-bold px-2.5 py-1 rounded-full w-fit mb-4 uppercase tracking-wider border border-orange-100">Current Plan</div>
                <h3 className="font-black text-[24px] md:text-[28px] text-[#1a1a1a] mb-1">{billing.planType || 'Pro Educator'}</h3>
                <p className="text-[12px] md:text-[13px] font-medium text-gray-500 mb-6">{billing.price || '$12 / month (billed annually)'}</p>
                
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
          <div className="space-y-6 md:space-y-8 md:bg-white md:p-8 xl:p-10 md:rounded-[24px] md:shadow-sm md:border md:border-gray-100">
            <div className="pb-4 md:pb-2">
              <h2 className="text-[18px] md:text-[22px] font-extrabold text-[#1a1a1a] tracking-tight mb-1">Integrations</h2>
              <p className="text-[12px] md:text-[14px] text-gray-500 font-medium">Connect VedaAI with your favorite LMS and tools.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 md:pb-2">
              {integrations.map((app: any, i) => (
                <div key={app._id || i} className="bg-white border border-gray-100 md:border-gray-200 rounded-[16px] md:rounded-[20px] p-4 md:p-5 flex items-center justify-between hover:shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-shadow group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-[12px] md:rounded-2xl bg-[#f8f9fa] border border-gray-200 flex items-center justify-center font-black text-gray-400 text-lg shrink-0 group-hover:scale-105 transition-transform">
                      {app.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-[13px] md:text-[14px] text-[#1a1a1a]">{app.name}</h4>
                      <p className="text-[11px] text-gray-500 font-medium mt-0.5 md:max-w-[180px]">{app.desc}</p>
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
      case 'notifications':
        return (
          <div className="space-y-6 md:space-y-8 md:bg-white md:p-8 xl:p-10 md:rounded-[24px] md:shadow-sm md:border md:border-gray-100">
            <div className="pb-4 md:pb-2 border-b border-gray-100">
              <h2 className="text-[18px] md:text-[22px] font-extrabold text-[#1a1a1a] tracking-tight mb-1">Notifications</h2>
              <p className="text-[12px] md:text-[14px] text-gray-500 font-medium">Manage how and when you receive alerts.</p>
            </div>
            
            <div className="space-y-5 pb-6 md:pb-2">
              {[
                { id: 'email' as const, title: 'Email Notifications', desc: 'Receive summaries of daily activity' },
                { id: 'push' as const, title: 'Push Notifications', desc: 'Instant alerts in your browser' },
                { id: 'assignment' as const, title: 'Assignment Updates', desc: 'When a student submits an assignment' },
                { id: 'marketing' as const, title: 'Marketing Emails', desc: 'News, features, and product updates' },
              ].map((item, i) => {
                const isOn = notifications[item.id];
                return (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[13px] md:text-[14px] text-[#1a1a1a]">{item.title}</h4>
                      <p className="text-[11px] md:text-[12px] text-gray-500 font-medium mt-0.5">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => handleToggleNotification(item.id)}
                      className={clsx("w-11 h-6 rounded-full relative transition-colors duration-300 shadow-inner", isOn ? "bg-green-500" : "bg-gray-200")}
                    >
                      <div className={clsx("w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm", isOn ? "left-[22px]" : "left-0.5")}></div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6 md:space-y-8 md:bg-white md:p-8 xl:p-10 md:rounded-[24px] md:shadow-sm md:border md:border-gray-100">
            <div className="pb-4 md:pb-2 border-b border-gray-100">
              <h2 className="text-[18px] md:text-[22px] font-extrabold text-[#1a1a1a] tracking-tight mb-1">Security Settings</h2>
              <p className="text-[12px] md:text-[14px] text-gray-500 font-medium">Update your password and secure your account.</p>
            </div>
            
            <div className="space-y-4 md:space-y-6 max-w-md pb-6 md:pb-2">
              <div>
                <label className="block text-[11px] md:text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-2.5">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-[12px] md:rounded-xl px-4 py-3 md:py-3.5 text-[13px] md:text-[14.5px] font-medium focus:outline-none focus:bg-white focus:border-[#ff512f] focus:ring-4 focus:ring-[#ff512f]/10 bg-[#f8f9fa] transition-all" />
              </div>
              <div>
                <label className="block text-[11px] md:text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-2.5">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-[12px] md:rounded-xl px-4 py-3 md:py-3.5 text-[13px] md:text-[14.5px] font-medium focus:outline-none focus:bg-white focus:border-[#ff512f] focus:ring-4 focus:ring-[#ff512f]/10 bg-[#f8f9fa] transition-all" />
              </div>
              <div>
                <label className="block text-[11px] md:text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:mb-2.5">Confirm New Password</label>
                <input type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-[12px] md:rounded-xl px-4 py-3 md:py-3.5 text-[13px] md:text-[14.5px] font-medium focus:outline-none focus:bg-white focus:border-[#ff512f] focus:ring-4 focus:ring-[#ff512f]/10 bg-[#f8f9fa] transition-all" />
              </div>
              
              <div className="pt-2">
                <button className="bg-[#1a1a1a] hover:bg-black text-white font-bold text-[13px] md:text-[14px] px-6 py-3 md:py-3.5 rounded-full transition-all shadow-[0_4px_14px_rgba(0,0,0,0.15)] active:scale-95">
                  Update Password
                </button>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <h3 className="font-bold text-[14px] text-[#1a1a1a] mb-2">Two-Factor Authentication</h3>
              <p className="text-[12px] text-gray-500 font-medium mb-4 max-w-md">Add an extra layer of security to your account by requiring a code from your mobile device to log in.</p>
              <button className="bg-white border border-gray-200 hover:bg-gray-50 text-[#1a1a1a] font-bold text-[12px] md:text-[13px] px-5 py-2.5 rounded-[12px] md:rounded-xl transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" /> Enable 2FA
              </button>
            </div>
          </div>
        );
      case 'archives':
        const displayArchived = archiveView === 'assignments' ? archivedAssignments : archivedClasses;
        const displayDeleted = archiveView === 'assignments' ? deletedAssignments : deletedClasses;
        
        return (
          <div className="space-y-6 md:space-y-8 md:bg-white md:p-8 xl:p-10 md:rounded-[24px] md:shadow-sm md:border md:border-gray-100">
            <div className="pb-4 md:pb-2 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-[18px] md:text-[22px] font-extrabold text-[#1a1a1a] tracking-tight mb-1">Archives & Bin</h2>
                <p className="text-[12px] md:text-[14px] text-gray-500 font-medium">Restore or permanently delete your items.</p>
              </div>
              <div className="flex p-1 bg-gray-100 rounded-[12px]">
                <button 
                  onClick={() => setArchiveView('assignments')}
                  className={clsx("px-4 py-2 rounded-[10px] text-[12px] font-bold transition-all", archiveView === 'assignments' ? "bg-white text-[#1a1a1a] shadow-sm" : "text-gray-500 hover:text-gray-700")}
                >
                  Assignments
                </button>
                <button 
                  onClick={() => setArchiveView('classes')}
                  className={clsx("px-4 py-2 rounded-[10px] text-[12px] font-bold transition-all", archiveView === 'classes' ? "bg-white text-[#1a1a1a] shadow-sm" : "text-gray-500 hover:text-gray-700")}
                >
                  Classes
                </button>
              </div>
            </div>

            <div className="space-y-8">
              {/* Archived Section */}
              <div>
                <h3 className="font-bold text-[14px] text-gray-800 mb-4 flex items-center gap-2">
                  <Archive className="w-4 h-4 text-gray-500" /> Archived {archiveView === 'assignments' ? 'Assignments' : 'Classes'}
                </h3>
                {displayArchived.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No archived items found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayArchived.map(item => (
                      <div key={item._id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                        <div className="mb-4">
                          <h4 className="font-bold text-[14px] text-[#1a1a1a] truncate">{item.title || item.name}</h4>
                          <p className="text-[11px] text-gray-500 mt-1">Archived on {new Date(item.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => archiveView === 'assignments' ? handleRestoreAssignment(item._id) : handleRestoreClass(item._id)} className="flex-1 bg-[#1a1a1a] text-white px-3 py-2 rounded-lg text-[12px] font-bold hover:bg-black transition-colors flex items-center justify-center gap-1.5">
                            <RefreshCw className="w-3.5 h-3.5" /> Restore
                          </button>
                          <button onClick={() => archiveView === 'assignments' ? handlePermDeleteAssignment(item._id) : handlePermDeleteClass(item._id)} className="flex-1 bg-white border border-gray-200 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-[12px] font-bold transition-colors flex items-center justify-center gap-1.5">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bin Section */}
              <div>
                <h3 className="font-bold text-[14px] text-gray-800 mb-4 flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-red-500" /> Bin (Soft Deleted)
                </h3>
                {displayDeleted.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No deleted items found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayDeleted.map(item => (
                      <div key={item._id} className="bg-red-50/30 border border-red-100 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                        <div className="mb-4">
                          <h4 className="font-bold text-[14px] text-red-900 truncate">{item.title || item.name}</h4>
                          <p className="text-[11px] text-red-400 mt-1">Moved to bin</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => archiveView === 'assignments' ? handleRestoreAssignment(item._id) : handleRestoreClass(item._id)} className="flex-1 bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-[12px] font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5">
                            <RefreshCw className="w-3.5 h-3.5" /> Restore
                          </button>
                          <button onClick={() => archiveView === 'assignments' ? handlePermDeleteAssignment(item._id) : handlePermDeleteClass(item._id)} className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-[12px] font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5">
                            <Trash2 className="w-3.5 h-3.5" /> Permanently Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-[400px] text-gray-400 font-medium bg-white rounded-[24px] border border-gray-100">
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
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

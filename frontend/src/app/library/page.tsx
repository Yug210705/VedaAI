'use client';

import React, { useState, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import { 
  Folder, FileText, Image as ImageIcon, Video, File, 
  Search, Filter, Plus, MoreVertical, Download, 
  Clock, Star, HardDrive, UploadCloud, Trash2, Edit2
} from 'lucide-react';
import clsx from 'clsx';
import { toast } from '@/components/Toaster';
import Modal from '@/components/Modal';
import { api } from '@/lib/api';

// Template for dynamic generation
const CATEGORY_TEMPLATES = [
  { id: '1', name: 'Lesson Plans', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: '2', name: 'Question Banks', icon: Folder, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: '3', name: 'Presentations', icon: Video, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: '4', name: 'Reference Materials', icon: File, color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

// Removed static recentFiles array

function getFileIcon(type: string) {
  switch (type) {
    case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
    case 'doc': return <FileText className="w-5 h-5 text-blue-500" />;
    case 'img': return <ImageIcon className="w-5 h-5 text-emerald-500" />;
    case 'sheet': return <FileText className="w-5 h-5 text-green-600" />;
    default: return <File className="w-5 h-5 text-gray-500" />;
  }
}

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<'recent' | 'starred'>('recent');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadFolder, setUploadFolder] = useState('Lesson Plans');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<any[]>([]);

  // Derived Database Stats
  const dynamicCategories = CATEGORY_TEMPLATES.map(cat => ({
    ...cat,
    count: files.filter(f => f.folder === cat.name).length
  }));

  const totalSizeMB = files.reduce((acc, file) => {
    const sizeStr = file.size || '';
    const val = parseFloat(sizeStr) || 0;
    if (sizeStr.toLowerCase().includes('gb')) return acc + (val * 1024);
    if (sizeStr.toLowerCase().includes('kb')) return acc + (val / 1024);
    return acc + val;
  }, 0);

  let displayValue = "0.00";
  let displayUnit = "GB";
  if (totalSizeMB > 0 && totalSizeMB < 1024) {
    displayValue = totalSizeMB.toFixed(2);
    displayUnit = "MB";
  } else {
    displayValue = (totalSizeMB / 1024).toFixed(2);
    displayUnit = "GB";
  }

  const maxStorageGB = 100;
  const storagePercentage = Math.min((totalSizeMB / (maxStorageGB * 1024)) * 100, 100);

  const fetchFiles = async () => {
    try {
      const data = await api.getResources();
      setFiles(data);
    } catch (err) {
      toast.error('Failed to load library resources');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const close = () => {
      setActiveDropdown(null);
      setIsFilterOpen(false);
    };
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  return (
    <div className="h-full flex flex-col md:pb-4 bg-[#d0d3d8] md:bg-background overflow-hidden md:overflow-visible">
      <div className="hidden md:block">
        <Topbar title="My Library" showBack={false} />
      </div>
      <div className="md:hidden">
        <Topbar title="My Library" showBack={false} />
      </div>
      
      <div className="flex-1 flex flex-col relative md:bg-[#eef0f3] bg-transparent md:ml-[11px] md:mr-4 md:rounded-[16px] overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 hide-scrollbar">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
            {/* Storage Hero Card */}
            <div className="bg-[#2d2d2d] rounded-[20px] md:rounded-[24px] p-5 md:p-8 flex-1 text-white relative overflow-hidden shadow-sm flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                    <HardDrive className="w-4 h-4 md:w-5 md:h-5 text-[#ff6230]" />
                    <span className="text-[11px] md:text-[12px] font-bold text-gray-400 uppercase tracking-wider">Cloud Storage</span>
                  </div>
                  <h2 className="text-[28px] md:text-[32px] font-black tracking-tight mb-0.5 md:mb-1 leading-none text-white">{displayValue} {displayUnit} <span className="text-[16px] md:text-[20px] font-bold text-gray-400">Used</span></h2>
                  <p className="text-[11.5px] md:text-[13px] font-medium text-gray-400">of {maxStorageGB} GB available</p>
                </div>
                
                <button 
                  onClick={() => setIsUploadOpen(true)}
                  className="bg-[#ff6230] text-white w-full md:w-auto mt-4 md:mt-0 px-6 py-3 rounded-full flex items-center justify-center gap-2 font-bold text-[12px] md:text-[13px] shadow-sm hover:bg-[#ff7a50] transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" strokeWidth={3} />
                  Upload Resource
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="relative z-10 mt-5 md:mt-6 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#ff6230] rounded-full transition-all duration-500 ease-out" style={{ width: `${storagePercentage}%` }}></div>
              </div>
            </div>

            {/* Quick Stats Column */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 w-full md:w-[280px] shrink-0">
              <div className="bg-white rounded-[20px] md:rounded-[24px] p-4 md:p-5 shadow-sm flex flex-col justify-center items-center">
                <span className="text-[28px] md:text-[32px] font-black text-[#1a1a1a] leading-none tracking-tighter">{files.length}</span>
                <span className="text-[10px] md:text-[11px] font-bold text-[#9ca3af] mt-1 uppercase tracking-wider">Total Files</span>
              </div>
              <div className="bg-white rounded-[20px] md:rounded-[24px] p-4 md:p-5 shadow-sm flex flex-col justify-center items-center">
                <span className="text-[28px] md:text-[32px] font-black text-[#1a1a1a] leading-none tracking-tighter">{files.filter(f => f.starred).length}</span>
                <span className="text-[10px] md:text-[11px] font-bold text-[#9ca3af] mt-1 uppercase tracking-wider">Starred</span>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="mb-6 md:mb-8">
            <h3 className="text-[15px] md:text-[16px] font-extrabold text-[#1a1a1a] tracking-tight mb-3 md:mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#2563eb]"></div>
              Resource Folders
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {dynamicCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.id} className="bg-white rounded-[16px] md:rounded-[20px] p-4 md:p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between group">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
                      <div className={clsx("w-10 h-10 md:w-12 md:h-12 rounded-[12px] md:rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105", cat.bg)}>
                        <Icon className={clsx("w-5 h-5 md:w-6 md:h-6", cat.color)} strokeWidth={2} />
                      </div>
                      <div className="mt-1 md:mt-0">
                        <h4 className="text-[13px] md:text-[14px] font-extrabold text-[#1a1a1a] leading-tight mb-0.5 md:mb-0">{cat.name}</h4>
                        <span className="text-[11px] md:text-[12px] font-semibold text-[#9ca3af]">{cat.count} items</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Files Section */}
          <div className="bg-white rounded-[20px] md:rounded-[24px] p-4 md:p-6 shadow-sm min-h-[400px]">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5 md:mb-6">
              <div className="flex items-center gap-6 border-b border-[#eef0f3] w-full md:w-auto">
                <button 
                  onClick={() => setActiveTab('recent')}
                  className={clsx(
                    "pb-3 text-[14px] font-bold transition-colors relative",
                    activeTab === 'recent' ? "text-[#ff6230]" : "text-[#6b7280] hover:text-[#1a1a1a]"
                  )}
                >
                  Recent Files
                  {activeTab === 'recent' && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#ff6230] rounded-t-full"></div>}
                </button>
                <button 
                  onClick={() => setActiveTab('starred')}
                  className={clsx(
                    "pb-3 text-[14px] font-bold transition-colors relative flex items-center gap-1.5",
                    activeTab === 'starred' ? "text-[#ff6230]" : "text-[#6b7280] hover:text-[#1a1a1a]"
                  )}
                >
                  <Star className="w-3.5 h-3.5" strokeWidth={2.5} /> Starred
                  {activeTab === 'starred' && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#ff6230] rounded-t-full"></div>}
                </button>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-[240px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search resources..." 
                    className="w-full bg-[#f8f9fa] border-none rounded-full py-2.5 pl-9 pr-4 text-[13px] font-medium text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6230]/20"
                  />
                </div>
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFilterOpen(!isFilterOpen);
                    }}
                    className={clsx(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0",
                      isFilterOpen ? "bg-gray-200 text-[#1a1a1a]" : "bg-[#f8f9fa] text-[#4f4f4f] hover:bg-gray-100"
                    )}
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                  
                  {isFilterOpen && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    >
                      <h4 className="px-4 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">File Types</h4>
                      {['PDF Documents', 'Word Docs', 'Presentations', 'Spreadsheets'].map((type, i) => (
                        <label key={i} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                          <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-[#ff6230] focus:ring-[#ff6230]" />
                          <span className="text-[13px] font-medium text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Files Table List */}
            <div className="flex flex-col gap-1">
              <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-2 md:gap-4 px-2 md:px-4 py-2 border-b border-[#eef0f3] mb-2 items-center">
                <span className="w-8 md:w-10"></span> {/* Icon spacing */}
                <span className="text-[10px] md:text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">File Name</span>
                <span className="text-[10px] md:text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider w-[80px] md:w-[100px] hidden sm:block">Size</span>
                <span className="text-[10px] md:text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider w-[100px] md:w-[140px] hidden md:block">Last Modified</span>
                <span className="w-16 md:w-20 text-center"></span> {/* Action spacing */}
              </div>

              {(activeTab === 'starred' ? files.filter(f => f.starred) : files).map((file) => (
                <div key={file._id || file.id} className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-2 md:gap-4 px-2 md:px-4 py-2.5 md:py-3 rounded-[12px] md:rounded-2xl hover:bg-[#f8f9fa] transition-colors items-center cursor-pointer group">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center justify-center shrink-0">
                    <div className="scale-75 md:scale-100">
                      {getFileIcon(file.type)}
                    </div>
                  </div>
                  
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[13px] md:text-[14px] font-bold text-[#1a1a1a] truncate pr-2 md:pr-4">{file.name}</span>
                    <span className="text-[10.5px] md:text-[11px] font-semibold text-[#9ca3af] sm:hidden">{file.size} • {new Date(file.date).toLocaleDateString()}</span>
                  </div>

                  <span className="text-[12px] md:text-[13px] font-semibold text-[#6b7280] w-[80px] md:w-[100px] hidden sm:block">{file.size}</span>
                  
                  <div className="text-[12px] md:text-[13px] font-semibold text-[#6b7280] w-[100px] md:w-[140px] hidden md:flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(file.date).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-0 md:gap-1">
                    <button 
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await api.toggleResourceStar(file._id || file.id);
                          toast.success(file.starred ? 'Removed from starred' : 'Added to starred');
                          fetchFiles();
                        } catch (err) {
                          toast.error('Failed to update file');
                        }
                      }}
                      className="p-2 text-gray-300 hover:text-yellow-400 transition-colors"
                    >
                      <Star className={clsx("w-4 h-4", file.starred && "fill-yellow-400 text-yellow-400")} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Native File Download Logic
                        const blob = new Blob(['Mock file content for ' + file.name], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = file.name;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        toast.success('Download started');
                      }}
                      className="p-2 text-gray-400 hover:text-[#1a1a1a] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === (file._id || file.id) ? null : (file._id || file.id));
                        }}
                        className="p-2 text-gray-400 hover:text-[#1a1a1a] transition-colors relative z-20"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {activeDropdown === (file._id || file.id) && (
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setActiveDropdown(null); toast.success('Rename dialog opened'); }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[13px] font-semibold text-gray-700 flex items-center gap-2"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Rename
                          </button>
                          <button 
                            onClick={async (e) => { 
                              e.stopPropagation(); 
                              setActiveDropdown(null); 
                              try {
                                await api.deleteResource(file._id || file.id);
                                toast.success('File deleted');
                                fetchFiles();
                              } catch (err) {
                                toast.error('Failed to delete file');
                              }
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-red-50 text-[13px] font-semibold text-red-600 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
      <Modal isOpen={isUploadOpen} onClose={() => { setIsUploadOpen(false); setSelectedFile(null); }} title="Upload Resource" maxWidth="max-w-xl">
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                setSelectedFile(e.dataTransfer.files[0]);
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center cursor-pointer group relative"
          >
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
              accept=".pdf,.docx,.pptx,.xlsx"
            />
            {selectedFile ? (
              <div className="flex flex-col items-center text-center px-4">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-[14px] font-bold text-[#1a1a1a] truncate max-w-[280px]">{selectedFile.name}</p>
                <p className="text-[12px] font-medium text-emerald-600 mt-1">Ready to upload • {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                  className="mt-3 text-[12px] font-bold text-red-500 hover:text-red-600 transition-colors"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6 text-[#ff6230]" />
                </div>
                <p className="text-[14px] font-bold text-[#1a1a1a]">Click to upload or drag and drop</p>
                <p className="text-[12px] font-medium text-gray-500 mt-1">PDF, DOCX, PPTX or XLSX (max. 50MB)</p>
              </>
            )}
          </div>
          
          <div>
            <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Save to Folder</label>
            <select 
              value={uploadFolder}
              onChange={(e) => setUploadFolder(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
            >
              {dynamicCategories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
              <option value="Uncategorized">Uncategorized</option>
            </select>
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button 
              onClick={async () => {
                if (!selectedFile) {
                  toast.error('Please select a file first');
                  return;
                }
                try {
                  const extension = selectedFile.name.split('.').pop()?.toLowerCase() || 'doc';
                  let type = 'doc';
                  if (extension === 'pdf') type = 'pdf';
                  if (['png', 'jpg', 'jpeg', 'gif'].includes(extension)) type = 'img';
                  if (['xls', 'xlsx'].includes(extension)) type = 'sheet';

                  await api.createResource({
                    name: selectedFile.name,
                    type: type,
                    size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
                    folder: uploadFolder
                  });
                  setIsUploadOpen(false);
                  setSelectedFile(null);
                  toast.success('Resource uploaded successfully');
                  fetchFiles();
                } catch (err) {
                  toast.error('Failed to upload resource');
                }
              }}
              className={clsx(
                "font-bold text-[13px] px-8 py-3 rounded-full transition-colors",
                selectedFile ? "bg-[#1c1c1c] text-white hover:bg-black" : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
            >
              Upload
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

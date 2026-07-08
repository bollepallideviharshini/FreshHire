import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  Bot,
  FileText,
  CheckCircle,
  TrendingUp,
  Building2,
  User,
  Settings,
  Bell,
  Scale,
  Compass,
  ArrowUpRight,
  FileCheck
} from 'lucide-react';

// Interfaces for structured data
interface Job {
  id: number;
  title: string;
  company: string;
  companyLogo: string;
  logoBg: string;
  location: string;
  type: string; // Full-time, Hybrid, etc.
  experience: string; // Fresher, etc.
  salary: string;
  aiMatch: number;
  postedTime: string;
  tags: string[];
}

interface Company {
  id: number;
  name: string;
  logo: string;
  logoBg: string;
  location: string;
  openRoles: number;
  rating: number;
}

interface RecentJob {
  id: number;
  title: string;
  company: string;
  location: string;
  postedTime: string;
}

export default function HomePage() {
  // --- STATE MANAGEMENT ---
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Standard system preference or saved local storage theme
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  
  // Default active filters
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Default bookmarked jobs
  const [savedJobs, setSavedJobs] = useState<number[]>([1, 3, 5]);
  
  // List of jobs selected for comparison
  const [compareJobs, setCompareJobs] = useState<number[]>([1, 3]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Profile Editor States with LocalStorage Persistence
  const [candidateName, setCandidateName] = useState<string>(() => {
    return localStorage.getItem('candidateName') || 'Jane Doe';
  });
  const [candidateTitle, setCandidateTitle] = useState<string>(() => {
    return localStorage.getItem('candidateTitle') || 'Frontend Developer Aspirant';
  });
  const [candidateLocation, setCandidateLocation] = useState<string>(() => {
    return localStorage.getItem('candidateLocation') || 'Hyderabad, India';
  });
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [showSettingsToast, setShowSettingsToast] = useState(false);

  // Settings Toggles with LocalStorage Persistence
  const [emailAlerts, setEmailAlerts] = useState<boolean>(() => {
    return localStorage.getItem('pref_email') !== 'false';
  });
  const [recruiterMessages, setRecruiterMessages] = useState<boolean>(() => {
    return localStorage.getItem('pref_recruiter') !== 'false';
  });
  const [weeklyTrends, setWeeklyTrends] = useState<boolean>(() => {
    return localStorage.getItem('pref_weekly') === 'true';
  });

  const getInitials = (name: string) => {
    return name
      .trim()
      .split(/\s+/)
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const handleSavePreferences = () => {
    localStorage.setItem('pref_email', String(emailAlerts));
    localStorage.setItem('pref_recruiter', String(recruiterMessages));
    localStorage.setItem('pref_weekly', String(weeklyTrends));
    setShowSettingsToast(true);
    setTimeout(() => setShowSettingsToast(false), 4000);
  };

  // Resume Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedResume, setUploadedResume] = useState<string | null>(null);
  const [showUploadToast, setShowUploadToast] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateUpload(file.name);
    }
  };

  const simulateUpload = (fileName: string) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadedResume(fileName);
            setShowUploadToast(true);
            setTimeout(() => setShowUploadToast(false), 4500);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  // AI Tools states
  const [isSummarizerOpen, setIsSummarizerOpen] = useState(false);
  const [jobDescriptionInput, setJobDescriptionInput] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summarizerResult, setSummarizerResult] = useState<{
    skills: string[];
    salary: string;
    responsibilities: string[];
    redFlags: string;
  } | null>(null);

  const [isCoverLetterOpen, setIsCoverLetterOpen] = useState(false);
  const [selectedCoverLetterJobId, setSelectedCoverLetterJobId] = useState<number>(1);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [coverLetterResult, setCoverLetterResult] = useState<string | null>(null);
  const [interviewQuestionsResult, setInterviewQuestionsResult] = useState<string[] | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  const handleSummarize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescriptionInput.trim()) {
      alert('Please paste a job description first.');
      return;
    }
    setIsSummarizing(true);
    setSummarizerResult(null);
    setTimeout(() => {
      setIsSummarizing(false);
      setSummarizerResult({
        skills: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'RESTful APIs', 'Oxlint'],
        salary: '$95k - $125k (Estimated based on market data)',
        responsibilities: [
          'Develop high fidelity layouts with modern component blurs and animations.',
          'Migrate legacy styling sheets to utility classes.',
          'Collaborate with UI/UX engineers via Figma prototypes.'
        ],
        redFlags: 'Fast-paced timeline mentioned twice. Legacy migration work represents 40% of initial sprint objectives.'
      });
    }, 1500);
  };

  const handleGenerateCoverLetter = () => {
    setIsGeneratingCoverLetter(true);
    setCoverLetterResult(null);
    setInterviewQuestionsResult(null);
    
    const targetJob = rawJobs.find(j => j.id === selectedCoverLetterJobId) || rawJobs[0];

    setTimeout(() => {
      setIsGeneratingCoverLetter(false);
      setCoverLetterResult(
        `Subject: Application for ${targetJob.title} position at ${targetJob.company}\n\nDear Hiring Team at ${targetJob.company},\n\nI am writing to express my enthusiastic interest in the open ${targetJob.title} role. As a junior developer with strong foundations in ${targetJob.tags.slice(0, 3).join(', ')}, I am eager to contribute to your engineering team.\n\nFreshHire's AI analysis matched my profile compatibility score for this exact role. I am particularly impressed by ${targetJob.company}'s work and look forward to the opportunity of discussing my qualifications further.\n\nThank you for your time and consideration.\n\nSincerely,\nJane Doe`
      );
      setInterviewQuestionsResult([
        `1. Performance Tuning: How would you optimize page loads in a React 19 app utilizing ${targetJob.tags[0] || 'modern frameworks'}?`,
        `2. Typings: Can you explain how you handle strict TypeScript types for async API responses?`,
        `3. Cultural Fit: What draws you to start your early-career path at a company like ${targetJob.company}?`
      ]);
    }, 1500);
  };

  const handleCopyCoverLetter = () => {
    if (coverLetterResult) {
      navigator.clipboard.writeText(coverLetterResult);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  // Sync theme with document class
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // --- MOCK DATA ---
  const rawJobs: Job[] = [
    {
      id: 1,
      title: 'Frontend Developer (React/TS)',
      company: 'Vercel',
      companyLogo: 'V',
      logoBg: 'bg-black text-white dark:bg-white dark:text-black',
      location: 'Remote (USA/Europe)',
      type: 'Full-time',
      experience: 'Fresher friendly',
      salary: '$90k - $120k',
      aiMatch: 94,
      postedTime: '2 hours ago',
      tags: ['React', 'TypeScript', 'Next.js', 'Tailwind']
    },
    {
      id: 2,
      title: 'Software Engineer (Backend)',
      company: 'Stripe',
      companyLogo: 'S',
      logoBg: 'bg-indigo-600 text-white',
      location: 'Hyderabad, India (Hybrid)',
      type: 'Full-time',
      experience: 'Fresher friendly',
      salary: '₹14L - ₹18L',
      aiMatch: 88,
      postedTime: '5 hours ago',
      tags: ['Node.js', 'TypeScript', 'PostgreSQL', 'APIs']
    },
    {
      id: 3,
      title: 'Product UI/UX Designer',
      company: 'Figma',
      companyLogo: 'F',
      logoBg: 'bg-orange-500 text-white',
      location: 'Remote (Global)',
      type: 'Contract',
      experience: 'Early Career',
      salary: '$70k - $95k',
      aiMatch: 82,
      postedTime: '1 day ago',
      tags: ['Figma', 'UI Design', 'Design Systems', 'Prototyping']
    },
    {
      id: 4,
      title: 'Data & AI Engineer',
      company: 'Snowflake',
      companyLogo: 'S',
      logoBg: 'bg-sky-500 text-white',
      location: 'Bangalore, India (On-site)',
      type: 'Full-time',
      experience: 'Early Career',
      salary: '₹18L - ₹24L',
      aiMatch: 85,
      postedTime: '2 days ago',
      tags: ['Python', 'SQL', 'Snowflake', 'GenAI']
    },
    {
      id: 5,
      title: 'Junior Fullstack Engineer',
      company: 'Supabase',
      companyLogo: 'S',
      logoBg: 'bg-emerald-600 text-white',
      location: 'Remote (APAC)',
      type: 'Full-time',
      experience: 'Fresher friendly',
      salary: '$80k - $100k',
      aiMatch: 91,
      postedTime: '3 days ago',
      tags: ['React', 'PostgreSQL', 'Supabase', 'TypeScript']
    },
    {
      id: 6,
      title: 'DevOps & Platform Associate',
      company: 'HashiCorp',
      companyLogo: 'H',
      logoBg: 'bg-slate-800 text-white',
      location: 'Hyderabad, India (Hybrid)',
      type: 'Full-time',
      experience: 'Fresher friendly',
      salary: '₹12L - ₹16L',
      aiMatch: 78,
      postedTime: '4 days ago',
      tags: ['Terraform', 'Docker', 'AWS', 'Linux']
    },
    {
      id: 7,
      title: 'AI Research Associate (NLP)',
      company: 'Google',
      companyLogo: 'G',
      logoBg: 'bg-red-500 text-white dark:bg-red-650',
      location: 'Remote (Global)',
      type: 'Full-time',
      experience: 'Fresher friendly',
      salary: '$110k - $140k',
      aiMatch: 95,
      postedTime: '3 hours ago',
      tags: ['PyTorch', 'Python', 'LLMs', 'NLP']
    },
    {
      id: 8,
      title: 'Frontend Engineer - AI Product',
      company: 'Meta',
      companyLogo: 'M',
      logoBg: 'bg-blue-600 text-white dark:bg-blue-750',
      location: 'Remote (APAC)',
      type: 'Full-time',
      experience: 'Fresher friendly',
      salary: '$105k - $135k',
      aiMatch: 92,
      postedTime: '1 day ago',
      tags: ['React', 'PyTorch', 'Tailwind', 'TypeScript']
    },
    {
      id: 9,
      title: 'Machine Learning Associate',
      company: 'Amazon',
      companyLogo: 'A',
      logoBg: 'bg-amber-600 text-white dark:bg-amber-700',
      location: 'Hyderabad, India (Hybrid)',
      type: 'Full-time',
      experience: 'Fresher friendly',
      salary: '₹16L - ₹22L',
      aiMatch: 86,
      postedTime: '2 days ago',
      tags: ['Python', 'AWS', 'SageMaker', 'SQL']
    },
    {
      id: 10,
      title: 'Data & AI Analyst',
      company: 'Netflix',
      companyLogo: 'N',
      logoBg: 'bg-red-700 text-white dark:bg-red-800',
      location: 'Remote (APAC)',
      type: 'Full-time',
      experience: 'Early Career',
      salary: '$95k - $125k',
      aiMatch: 81,
      postedTime: '3 days ago',
      tags: ['Python', 'SQL', 'Tableau', 'Statistics']
    }
  ];

  // Dynamically adjust AI Match scores when resume is uploaded
  const processedJobs = React.useMemo(() => {
    return rawJobs.map(job => {
      if (uploadedResume) {
        let matchAdjustment = 0;
        const lowerTitle = job.title.toLowerCase();
        
        if (lowerTitle.includes('ai') || job.tags.some(t => t.toLowerCase().includes('ai')) || job.tags.some(t => t.toLowerCase().includes('learning')) || job.tags.some(t => t.toLowerCase().includes('nlp')) || job.tags.some(t => t.toLowerCase().includes('pytorch'))) {
          matchAdjustment = 4; // AI job matches custom resume uploading
        } else if (job.tags.includes('React') || job.tags.includes('TypeScript') || job.tags.includes('Next.js')) {
          matchAdjustment = 3; // Frontend developer match
        } else {
          matchAdjustment = 1;
        }
        
        return {
          ...job,
          aiMatch: Math.min(99, job.aiMatch + matchAdjustment),
          isResumeMatched: true
        };
      }
      return { ...job, isResumeMatched: false };
    });
  }, [uploadedResume, rawJobs]);

  const initialJobs = processedJobs;

  const recentViews: RecentJob[] = [
    { id: 10, title: 'Product Analyst', company: 'Airbnb', location: 'Remote', postedTime: '3h ago' },
    { id: 11, title: 'Mobile Developer (React Native)', company: 'Linear', location: 'Remote', postedTime: '1d ago' },
    { id: 12, title: 'Associate QA Engineer', company: 'Railway', location: 'Remote', postedTime: '2d ago' }
  ];

  const companies: Company[] = [
    { id: 1, name: 'Amazon', logo: 'A', logoBg: 'bg-amber-600 text-white dark:bg-amber-700', location: 'Hyderabad / Seattle', openRoles: 34, rating: 4.4 },
    { id: 2, name: 'Google', logo: 'G', logoBg: 'bg-red-500 text-white dark:bg-red-650', location: 'Bangalore / Mountain View', openRoles: 28, rating: 4.7 },
    { id: 3, name: 'Netflix', logo: 'N', logoBg: 'bg-red-700 text-white dark:bg-red-800', location: 'Los Gatos / Remote', openRoles: 15, rating: 4.6 },
    { id: 4, name: 'Meta', logo: 'M', logoBg: 'bg-blue-600 text-white dark:bg-blue-750', location: 'Menlo Park / Remote', openRoles: 22, rating: 4.5 }
  ];

  const filterChips = ['Fresher friendly', 'Remote', 'Hyderabad', 'Frontend', 'Backend', 'Data'];

  // Toggle filter chip state
  const handleFilterToggle = (chip: string) => {
    setActiveFilters(prev => 
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    );
  };

  // Toggle saved job bookmark
  const handleSaveToggle = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    e.preventDefault();
    setSavedJobs(prev =>
      prev.includes(id) ? prev.filter(jid => jid !== id) : [...prev, id]
    );
  };

  // Toggle job for comparison
  const handleCompareToggle = (id: number) => {
    setCompareJobs(prev => {
      if (prev.includes(id)) {
        return prev.filter(jid => jid !== id);
      } else {
        if (prev.length >= 3) {
          alert('You can compare up to 3 jobs at once.');
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  // Filter jobs based on search inputs and filter chips
  const filteredJobs = initialJobs.filter(job => {
    // 1. Search text matches title, company or tags
    const searchMatch = searchQuery.trim() === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Location matches
    const locationMatch = locationQuery.trim() === '' || 
      job.location.toLowerCase().includes(locationQuery.toLowerCase());

    // 3. Filter chips match (If chip matches experience tag, location tag, or language tag)
    const chipsMatch = activeFilters.every(chip => {
      if (chip === 'Fresher friendly') return job.experience === 'Fresher friendly';
      if (chip === 'Remote') return job.location.toLowerCase().includes('remote');
      if (chip === 'Hyderabad') return job.location.toLowerCase().includes('hyderabad');
      if (chip === 'Frontend') return job.title.toLowerCase().includes('frontend') || job.title.toLowerCase().includes('designer') || job.tags.includes('React');
      if (chip === 'Backend') return job.title.toLowerCase().includes('backend') || job.tags.includes('Node.js');
      if (chip === 'Data') return job.title.toLowerCase().includes('data') || job.tags.includes('Python');
      return true;
    });

    return searchMatch && locationMatch && chipsMatch;
  });

  return (
    <div className="min-h-screen font-sans bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 selection:bg-teal-500 selection:text-white dark:selection:text-slate-950">
      
      {/* --- NAVBAR --- */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/80 dark:bg-slate-950/80 backdrop-blur-nav dark:border-slate-900 transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 text-white font-bold text-lg shadow-md shadow-teal-500/20">
              FH
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-indigo-400">
              FreshHire
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300" aria-label="Main Navigation">
            <a href="#home" className="rounded-lg px-3 py-2 text-teal-600 dark:text-teal-400 bg-slate-50 dark:bg-slate-900/60 font-semibold">Home</a>
            <a href="#jobs" className="rounded-lg px-3 py-2 transition-colors hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/40">Jobs</a>
            <a href="#companies" className="rounded-lg px-3 py-2 transition-colors hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/40">Companies</a>
            <a href="#saved-jobs" className="rounded-lg px-3 py-2 transition-colors hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/40">Saved Jobs</a>
            <a href="#profile" className="rounded-lg px-3 py-2 transition-colors hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/40">Profile</a>
            <a href="#settings" className="rounded-lg px-3 py-2 transition-colors hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/40">Settings</a>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <Sun className="h-[1.2rem] w-[1.2rem] transition-all rotate-0 scale-100" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] transition-all rotate-0 scale-100" />
              )}
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                aria-label="View notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-teal-500"></span>
              </button>
              
              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                    <span className="font-semibold text-sm">Notifications</span>
                    <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold cursor-pointer">Mark all read</span>
                  </div>
                  <div className="mt-3 space-y-3">
                    <div className="flex gap-3 text-xs leading-normal">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">Vercel matched 94% with your profile!</p>
                        <p className="text-slate-400 mt-0.5">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex gap-3 text-xs leading-normal">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">Stripe posted a new Fresher Role in Hyderabad</p>
                        <p className="text-slate-400 mt-0.5">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-teal-500 font-semibold text-sm text-white shadow-xs hover:opacity-90 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                aria-label="User profile settings"
              >
                {getInitials(candidateName)}
              </button>
              
              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-100 bg-white py-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                  <div className="border-b border-slate-100 px-4 py-2 dark:border-slate-800 text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{candidateName}</p>
                    <p className="text-slate-400 truncate">{candidateName.toLowerCase().replace(/\s+/g, '.')}@freshhire.dev</p>
                  </div>
                  <a href="#profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                    <User className="h-4 w-4" /> Profile
                  </a>
                  <a href="#settings" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                    <Settings className="h-4 w-4" /> Settings
                  </a>
                  <hr className="border-slate-100 dark:border-slate-800" />
                  <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-left">
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden transition-all cursor-pointer"
              aria-label="Open mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 px-4 py-3 space-y-1 animate-in fade-in-25 slide-in-from-top-4 duration-200">
            <a href="#home" className="block rounded-xl px-3 py-2 text-base font-medium text-teal-600 bg-teal-500/10 dark:text-teal-400">Home</a>
            <a href="#jobs" className="block rounded-xl px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900">Jobs</a>
            <a href="#companies" className="block rounded-xl px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900">Companies</a>
            <a href="#saved-jobs" className="block rounded-xl px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900">Saved Jobs</a>
            <a href="#profile" className="block rounded-xl px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900">Profile</a>
            <a href="#settings" className="block rounded-xl px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900">Settings</a>
          </div>
        )}
      </header>

      {/* --- MAIN MAIN WRAPPER --- */}
      <main id="home" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-16">
        
        {/* --- HERO SECTION --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" aria-labelledby="hero-heading">
          
          {/* Left Text Side */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* New Announcement Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/20 bg-teal-500/5 px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
              <Sparkles className="h-3.5 w-3.5 text-teal-500 animate-pulse" />
              <span>New - AI-powered job board for fresh talent</span>
            </div>

            {/* Giant Heading */}
            <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] sm:leading-[1.05]">
              Find your next role with{' '}
              <span className="bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-indigo-400">
                FreshHire
              </span>.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              Search curated junior and early-career opportunities, compare compensation metrics, and get instant AI evaluations for your resume, cover letter, and interview prep.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="#jobs"
                className="inline-flex items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 dark:text-slate-950 font-semibold text-white px-6 py-3.5 shadow-md shadow-teal-600/10 dark:shadow-teal-500/10 hover:translate-y-[-1px] active:translate-y-0 transition-all text-center"
              >
                Start searching jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <button
                onClick={handleUploadClick}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 font-semibold px-6 py-3.5 transition-all text-center cursor-pointer"
              >
                <FileCheck className="mr-2 h-4 w-4 text-indigo-500" />
                Upload resume for AI match
              </button>
            </div>

            {/* Proof Points */}
            <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-900 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-teal-500" />
                <span>Verified Recruiters</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-teal-500" />
                <span>100% Fresher Friendly</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-teal-500" />
                <span>Zero Hidden Salaries</span>
              </div>
            </div>

          </div>

          {/* Right Cards Stack (Desktop Only) */}
          <div className="hidden lg:col-span-5 lg:block relative h-[360px]">
            
            {/* Card 1: AI Resume Match */}
            <div className="absolute right-4 top-0 w-72 rounded-2xl border border-slate-100 bg-white p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900/90 z-20 hover:scale-105 transition-all duration-300 transform -rotate-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-slate-400">AI Resume Evaluator</h3>
                    <p className="font-bold text-sm leading-tight text-slate-900 dark:text-white">Frontend Developer</p>
                  </div>
                </div>
                <div className="flex items-center justify-center h-10 w-10 rounded-full border-2 border-teal-500 bg-teal-50 dark:bg-slate-900 font-bold text-teal-600 text-xs">
                  82%
                </div>
              </div>
              <div className="mt-3 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl text-xs space-y-1">
                <p className="font-medium text-slate-600 dark:text-slate-300">Match score is high! ✨</p>
                <p className="text-slate-400 leading-tight">Strengths detected: React, TypeScript. Recommended adding Tailwind Projects.</p>
              </div>
            </div>

            {/* Card 2: Jobs matching Profile */}
            <div className="absolute left-6 top-16 w-64 rounded-2xl border border-slate-100 bg-white p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900/90 z-10 hover:scale-105 transition-all duration-300 transform rotate-3">
              <h3 className="font-semibold text-xs text-slate-400">Matches Tailored for You</h3>
              <p className="mt-1 text-2xl font-black bg-gradient-to-r from-teal-500 to-indigo-500 bg-clip-text text-transparent">24 Roles Open</p>
              
              <div className="flex -space-x-2 mt-4 overflow-hidden">
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">S</div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-black flex items-center justify-center font-bold text-xs text-white">V</div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-orange-500 flex items-center justify-center font-bold text-xs text-white">F</div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">S</div>
                <div className="inline-block h-8.5 w-8.5 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-400">
                  +20
                </div>
              </div>
            </div>

            {/* Card 3: Recent Actions summary */}
            <div className="absolute right-12 bottom-0 w-72 rounded-2xl border border-slate-100 bg-white p-4.5 shadow-xl dark:border-slate-800 dark:bg-slate-900/90 z-30 hover:scale-105 transition-all duration-300 transform -rotate-1">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                <span className="font-semibold text-xs text-slate-400">Quick Stats</span>
                <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">Live</span>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Saved Roles</span>
                  <span className="font-semibold">{savedJobs.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Applications</span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400">2 Pending</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Interview Invites</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">1 Scheduled</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- SEARCH & FILTERS BAR --- */}
        <section className="relative z-30 -mt-6" aria-label="Job Search and Filters">
          
          {/* Main Floating Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900/95 transition-all">
            <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              
              {/* Search text input */}
              <div className="md:col-span-5 relative flex items-center">
                <Search className="absolute left-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
                <label htmlFor="search-input" className="sr-only">Job title, company, or skill</label>
                <input
                  id="search-input"
                  type="text"
                  placeholder="Job title, company, or skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium outline-hidden focus:border-teal-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:focus:border-teal-400 dark:focus:bg-slate-950 transition-all text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Location input */}
              <div className="md:col-span-4 relative flex items-center">
                <MapPin className="absolute left-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
                <label htmlFor="location-input" className="sr-only">Location</label>
                <input
                  id="location-input"
                  type="text"
                  placeholder="Location (e.g. Remote, Bangalore)..."
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium outline-hidden focus:border-teal-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:focus:border-teal-400 dark:focus:bg-slate-950 transition-all text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Search Button */}
              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 dark:text-slate-950 font-semibold text-white py-3 flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <Search className="h-4.5 w-4.5" />
                  <span>Search Jobs</span>
                </button>
              </div>

            </form>

            {/* Filter Chips row */}
            <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-2 flex items-center gap-1">
                <Compass className="h-3.5 w-3.5" /> Quick filters:
              </span>
              
              {filterChips.map(chip => {
                const isActive = activeFilters.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleFilterToggle(chip)}
                    aria-pressed={isActive}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium cursor-pointer transition-all border ${
                      isActive
                        ? 'bg-teal-500/10 text-teal-600 border-teal-500/30 dark:bg-teal-400/10 dark:text-teal-400 dark:border-teal-400/30 font-semibold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800'
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}

              {/* Reset filter chips */}
              {activeFilters.length > 0 && (
                <button
                  onClick={() => setActiveFilters([])}
                  className="text-xs text-slate-400 dark:text-slate-500 underline ml-auto hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

          </div>
        </section>

        {/* --- RECOMMENDED JOBS SECTION --- */}
        <section id="jobs" className="space-y-6" aria-labelledby="recommended-heading">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 id="recommended-heading" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-teal-500" /> Recommended for you
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Showing {filteredJobs.length} fresh opportunities matching your profile matching active filters
              </p>
            </div>
            
            {compareJobs.length > 0 && (
              <button
                onClick={() => setIsCompareOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-50/80 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/80 border border-indigo-200/50 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm font-semibold px-4 py-2.5 transition-all shadow-xs cursor-pointer"
              >
                <Scale className="h-4.5 w-4.5" />
                <span>Compare Selected ({compareJobs.length})</span>
              </button>
            )}
          </div>

          {filteredJobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">No jobs matches found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                We couldn't find any roles matching your current filters. Try resetting the filters or modifying your search text.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setLocationQuery(''); setActiveFilters([]); }}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {filteredJobs.map(job => {
                const isSaved = savedJobs.includes(job.id);
                const isSelectedForCompare = compareJobs.includes(job.id);

                return (
                  <div
                    key={job.id}
                    className="relative group rounded-2xl border border-slate-100 bg-white p-6 shadow-xs hover:shadow-lg dark:border-slate-900 dark:bg-slate-900/50 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Resume Match Floating Badge */}
                    {job.isResumeMatched && (
                      <span className="absolute -top-3 left-4 bg-emerald-500 text-white dark:bg-emerald-600 dark:text-slate-950 font-extrabold text-[9px] rounded-full px-2.5 py-0.5 shadow-xs border border-emerald-400/20 animate-pulse z-10">
                        Matched by Resume ✨
                      </span>
                    )}
                    <div>
                      {/* Top Row: Logo, Company & Bookmark */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold text-lg shadow-sm ${job.logoBg}`}>
                            {job.companyLogo}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{job.company}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-0.5">
                                <MapPin className="h-3 w-3" /> {job.location.split('(')[0]}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Save Bookmark Button */}
                        <button
                          onClick={(e) => handleSaveToggle(e, job.id)}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                            isSaved 
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-500 dark:hover:bg-slate-900'
                          }`}
                          aria-label={isSaved ? "Remove job bookmark" : "Bookmark job"}
                        >
                          {isSaved ? <BookmarkCheck className="h-5 w-5 fill-amber-500" /> : <Bookmark className="h-5 w-5" />}
                        </button>
                      </div>

                      {/* Job Title */}
                      <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {job.title}
                      </h3>

                      {/* Mid Row: Tags list */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {job.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="rounded-md bg-slate-50 dark:bg-slate-950 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800/40">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Row Info */}
                    <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800/50 flex flex-col gap-3">
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-teal-600 dark:text-teal-400 bg-teal-500/5 dark:bg-teal-400/5 px-2 py-1 rounded-md border border-teal-500/10">
                          {job.salary}
                        </span>
                        
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 dark:bg-indigo-400/10 rounded-full px-2 py-0.5">
                          <Sparkles className="h-3 w-3" />
                          <span>AI Match: {job.aiMatch}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-0.5">
                          <Calendar className="h-3 w-3" /> {job.postedTime}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {/* Comparison Checkbox */}
                          <label className="flex items-center gap-1 text-xs cursor-pointer select-none text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                            <input
                              type="checkbox"
                              checked={isSelectedForCompare}
                              onChange={() => handleCompareToggle(job.id)}
                              className="h-3.5 w-3.5 accent-teal-600 dark:accent-teal-400 rounded-xs border-slate-300 text-teal-600"
                            />
                            <span>Compare</span>
                          </label>

                          <button 
                            onClick={() => alert(`Day 2 Feature: Routing to detailed info page for ${job.title} at ${job.company}`)}
                            className="text-xs font-semibold text-slate-700 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 flex items-center gap-0.5 cursor-pointer ml-1"
                          >
                            <span>Details</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}

            </div>
          )}

        </section>

        {/* --- COMPARISONS & RECENT SECTION (SPLIT) --- */}
        <section id="saved-jobs" className="grid grid-cols-1 lg:grid-cols-12 gap-8" aria-labelledby="saved-recent-heading">
          
          {/* Left: Saved jobs & comparisons */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900/20 border border-slate-100 dark:border-slate-900 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <h2 id="saved-recent-heading" className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bookmark className="h-5.5 w-5.5 text-amber-500 fill-amber-500/20" /> Saved Jobs & Comparisons
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Quick comparisons for bookmarked jobs</p>
              </div>

              {compareJobs.length > 0 ? (
                <button
                  onClick={() => setIsCompareOpen(true)}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Scale className="h-4 w-4" /> Compare Selected
                </button>
              ) : (
                <span className="text-xs text-slate-400">Select cards above to compare</span>
              )}
            </div>

            {savedJobs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                <Bookmark className="h-8 w-8 mx-auto stroke-1 mb-2 opacity-50" />
                <p className="text-sm">No saved jobs yet.</p>
                <p className="text-xs mt-0.5">Click the bookmark icon on jobs to save them.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {initialJobs.filter(j => savedJobs.includes(j.id)).map(job => {
                  const isSelectedForCompare = compareJobs.includes(job.id);
                  return (
                    <div
                      key={job.id}
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border transition-all gap-4 ${
                        isSelectedForCompare
                          ? 'border-indigo-200 bg-indigo-50/20 dark:border-indigo-900/40 dark:bg-indigo-950/10'
                          : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-900 dark:bg-slate-950/20 dark:hover:bg-slate-950/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Compare toggle checkbox */}
                        <input
                          type="checkbox"
                          checked={isSelectedForCompare}
                          onChange={() => handleCompareToggle(job.id)}
                          className="h-4 w-4 accent-indigo-600 text-indigo-600 rounded-sm cursor-pointer"
                          aria-label={`Select ${job.title} at ${job.company} for comparison`}
                        />
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-sm ${job.logoBg}`}>
                          {job.companyLogo}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{job.title}</h4>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                            <span>{job.company}</span>
                            <span>•</span>
                            <span>{job.location.split('(')[0]}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right sm:mr-4">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">{job.salary}</p>
                          <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">AI Match: {job.aiMatch}%</p>
                        </div>
                        
                        <button
                          onClick={(e) => handleSaveToggle(e, job.id)}
                          className="text-xs text-red-500 hover:text-red-600 font-medium px-2 py-1 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Recently viewed */}
          <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-900 rounded-3xl p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-500" /> Recently Viewed
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Quick resume of viewed job posts</p>
            </div>

            <div className="space-y-4">
              {recentViews.map(job => (
                <a
                  href="#jobs"
                  key={job.id}
                  onClick={(e) => { e.preventDefault(); alert(`Vite Route mapping coming soon: viewing ${job.title} details`); }}
                  className="block group p-4 rounded-2xl border border-slate-100 bg-white hover:border-teal-500/30 dark:border-slate-900 dark:bg-slate-900/30 dark:hover:border-teal-400/30 transition-all shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-tight">
                        {job.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">{job.company} • {job.location}</p>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 shrink-0">{job.postedTime}</span>
                  </div>
                </a>
              ))}
            </div>

            {/* Quick Helper Alert */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500/5 to-teal-500/5 border border-indigo-500/10 p-4 space-y-2">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Bot className="h-4 w-4 text-indigo-500 animate-bounce" /> Smart suggestion
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                You've viewed several Frontend Developer roles. Consider optimizing your resume using our AI Assistant to maximize matching odds!
              </p>
            </div>

          </div>

        </section>

        {/* --- AI TOOLS SECTION --- */}
        <section className="space-y-6" aria-labelledby="ai-heading">
          <div>
            <h2 id="ai-heading" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-indigo-500" /> AI tools to boost your search
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Leverage artificial intelligence to review documents, extract key info, and format pitch cover letters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tool 1: AI Resume Match */}
            <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-xs hover:shadow-md dark:border-slate-900 dark:bg-slate-900/40 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  AI Resume Matcher
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Upload your resume in PDF/Docx format to instantly scan against recommended roles, finding keyword gaps and matching scores.
                </p>
              </div>
              <button
                onClick={handleUploadClick}
                className="mt-6 inline-flex items-center text-xs font-semibold text-teal-600 dark:text-teal-400 group-hover:gap-1.5 transition-all text-left bg-transparent border-0 cursor-pointer p-0"
              >
                <span>Try Resume Matcher</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Tool 2: AI Job Summary */}
            <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-xs hover:shadow-md dark:border-slate-900 dark:bg-slate-900/40 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Bot className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  AI Job Summary
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Confused by long job descriptions? Paste them in to extract core tech, key responsibilities, salary estimates, and hidden requirements.
                </p>
              </div>
              <button
                onClick={() => setIsSummarizerOpen(true)}
                className="mt-6 inline-flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:gap-1.5 transition-all text-left bg-transparent border-0 cursor-pointer p-0"
              >
                <span>Summarize Job Post</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Tool 3: AI Cover Letter & Questions */}
            <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-xs hover:shadow-md dark:border-slate-900 dark:bg-slate-900/40 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  AI Cover Letter & Prep
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Generate tailored cover letters tailored to specific jobs. Plus, get the top 5 interview questions you are likely to be asked.
                </p>
              </div>
              <button
                onClick={() => setIsCoverLetterOpen(true)}
                className="mt-6 inline-flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:gap-1.5 transition-all text-left bg-transparent border-0 cursor-pointer p-0"
              >
                <span>Generate Cover Letter</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </section>

        {/* --- TRENDING TECHNOLOGIES & COMPANIES SECTION --- */}
        <section id="companies" className="grid grid-cols-1 lg:grid-cols-12 gap-8" aria-label="Trending Skills and Employers">
          
          {/* Left: Trending technologies */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Trending Technologies</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Top skills employers are searching for in freshers</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { name: 'React 19', count: 142 },
                { name: 'TypeScript', count: 210 },
                { name: 'Artificial Intelligence/Machine Learning specialists', count: 184 },
                { name: 'data scientists', count: 142 },
                { name: 'cybersecurity analysts', count: 98 },
                { name: 'GenAI & LLMs', count: 85 },
                { name: 'Data Engineering', count: 114 },
                { name: 'Docker / DevOps', count: 72 },
                { name: 'Tailwind CSS v4', count: 104 },
                { name: 'Node.js Backend', count: 130 }
              ].map(tech => (
                <button
                  key={tech.name}
                  onClick={() => setSearchQuery(tech.name)}
                  className="rounded-xl border border-slate-100 bg-white px-3.5 py-2.5 text-xs text-slate-600 hover:border-teal-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-400 flex items-center justify-between gap-3 shadow-xs group cursor-pointer transition-all hover:-translate-y-0.5"
                >
                  <span className="font-semibold group-hover:text-teal-600 dark:group-hover:text-teal-400">{tech.name}</span>
                  <span className="rounded-md bg-slate-50 dark:bg-slate-950 px-1.5 py-0.5 text-[9px] font-bold text-slate-400 dark:text-slate-500">
                    {tech.count} roles
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Top companies hiring */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Top Companies Hiring</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Verified companies actively looking for early-career hires</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {companies.map(company => (
                <div
                  key={company.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:border-indigo-500/20 dark:border-slate-900 dark:bg-slate-900/40 transition-all shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl font-bold text-lg shadow-sm ${company.logoBg}`}>
                      {company.logo}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{company.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{company.location}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] font-bold text-teal-600 dark:text-teal-400">
                      {company.openRoles} active roles
                    </span>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold">★ {company.rating} Rating</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* --- PROFILE SECTION --- */}
        <section id="profile" className="bg-white dark:bg-slate-900/20 border border-slate-100 dark:border-slate-900 rounded-3xl p-6 md:p-8 space-y-6" aria-labelledby="profile-heading">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h2 id="profile-heading" className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="h-5.5 w-5.5 text-teal-500" /> My Profile & AI Portfolio
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage your credentials, uploaded resumes, and compatibility profiles</p>
            </div>
            <span className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-600 dark:text-teal-400">
              Active Candidate
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in-50 duration-300">
            {/* Left Card: Avatar & Status */}
            <div className="md:col-span-4 flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-100 dark:border-slate-900/60 space-y-4">
              <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-500 flex items-center justify-center font-bold text-3xl text-white shadow-md">
                {getInitials(candidateName)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{candidateName}</h3>
                <p className="text-xs text-slate-400">{candidateTitle}</p>
                <p className="text-[10px] text-slate-500 mt-1 flex items-center justify-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-teal-500" /> {candidateLocation}
                </p>
              </div>
              <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-900 space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Match Readiness</span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400">82%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
            </div>

            {/* Right Card: Uploaded Resumes & Verification */}
            <div className="md:col-span-8 space-y-6">
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Uploaded Documents</h4>
                
                {/* File Row 1 */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                      <FileCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {uploadedResume || 'Jane_Doe_Resume_2026.pdf'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {uploadedResume ? 'PDF • Custom File' : 'PDF • 142 KB'} • Uploaded {uploadedResume ? 'Just now' : 'Jul 7, 2026'}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-md bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 text-[10px] font-bold text-teal-600 dark:text-teal-400">
                    Primary Match
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Skills Detected by AI</h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'JavaScript (ES6)', 'HTML5/CSS3', 'Tailwind CSS', 'Next.js', 'REST APIs', 'Git'].map(skill => (
                    <span key={skill} className="rounded-full bg-slate-100 dark:bg-slate-950 px-3.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800/80">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 dark:text-slate-950 font-semibold text-xs text-white px-4 py-2.5 shadow-xs transition-colors cursor-pointer"
                >
                  Edit Profile Info
                </button>
                <button
                  onClick={handleUploadClick}
                  className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 font-semibold text-xs px-4 py-2.5 transition-colors cursor-pointer"
                >
                  Upload New Resume
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --- SETTINGS SECTION --- */}
        <section id="settings" className="bg-slate-50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-900 rounded-3xl p-6 md:p-8 space-y-6" aria-labelledby="settings-heading">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
            <Settings className="h-5.5 w-5.5 text-indigo-500" />
            <div>
              <h2 id="settings-heading" className="text-xl font-bold text-slate-900 dark:text-white">Account Preferences & Settings</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Customize notification criteria, job alerts, and privacy preferences</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in-50 duration-300">
            
            {/* Setting Box 1: Alerts */}
            <div className="p-5 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-4">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Alert Notifications</h3>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between text-xs cursor-pointer group">
                  <span className="text-slate-600 dark:text-slate-300">Email updates for new AI Job Matches</span>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="h-4.5 w-4.5 rounded-sm accent-indigo-600 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between text-xs cursor-pointer group">
                  <span className="text-slate-600 dark:text-slate-300">Direct message notifications from recruiters</span>
                  <input
                    type="checkbox"
                    checked={recruiterMessages}
                    onChange={(e) => setRecruiterMessages(e.target.checked)}
                    className="h-4.5 w-4.5 rounded-sm accent-indigo-600 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between text-xs cursor-pointer group">
                  <span className="text-slate-600 dark:text-slate-300">Weekly tech trends and salary insight digest</span>
                  <input
                    type="checkbox"
                    checked={weeklyTrends}
                    onChange={(e) => setWeeklyTrends(e.target.checked)}
                    className="h-4.5 w-4.5 rounded-sm accent-indigo-600 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Setting Box 2: Job Search Targets */}
            <div className="p-5 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-4">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Job Target Settings</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300">Target Salary Range</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹12L - ₹18L per annum</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300">Preferred Locations</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Remote / Hyderabad / Bangalore</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300">Privacy Status</span>
                  <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-600 dark:text-emerald-400">
                    Visible to Vetted Recruiters
                  </span>
                </div>
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSavePreferences}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 shadow-xs transition-colors cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-100 bg-white dark:border-slate-900 dark:bg-slate-950 mt-16 transition-colors">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Column 1: Brand details */}
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 text-white font-bold text-md shadow-xs">
                  FH
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-indigo-400">
                  FreshHire
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                Empowering the next generation of software developers, designers, and analyst professionals to launch their tech careers.
              </p>
              <p className="text-xs text-slate-400">
                © 2026 FreshHire Inc. All rights reserved.
              </p>
            </div>

            {/* Column 2: About columns */}
            <div className="text-left space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">About FreshHire</h4>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <li><a href="#about" className="hover:text-teal-600 dark:hover:text-teal-400">Who We Are</a></li>
                <li><a href="#careers" className="hover:text-teal-600 dark:hover:text-teal-400">Careers</a></li>
                <li><a href="#press" className="hover:text-teal-600 dark:hover:text-teal-400">Press & News</a></li>
                <li><a href="#blog" className="hover:text-teal-600 dark:hover:text-teal-400">Tech Blog</a></li>
              </ul>
            </div>

            {/* Column 3: Help / Support */}
            <div className="text-left space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Help & Support</h4>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <li><a href="#faq" className="hover:text-teal-600 dark:hover:text-teal-400">Candidate FAQs</a></li>
                <li><a href="#employer-faq" className="hover:text-teal-600 dark:hover:text-teal-400">Recruiter FAQs</a></li>
                <li><a href="#support" className="hover:text-teal-600 dark:hover:text-teal-400">Contact Support</a></li>
                <li><a href="#safety" className="hover:text-teal-600 dark:hover:text-teal-400">Safety & Trust</a></li>
              </ul>
            </div>

            {/* Column 4: Terms & Privacy */}
            <div className="text-left space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Terms & Legal</h4>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <li><a href="#privacy" className="hover:text-teal-600 dark:hover:text-teal-400">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-teal-600 dark:hover:text-teal-400">Terms of Service</a></li>
                <li><a href="#cookies" className="hover:text-teal-600 dark:hover:text-teal-400">Cookie Preferences</a></li>
                <li><a href="#gdpr" className="hover:text-teal-600 dark:hover:text-teal-400">GDPR Compliance</a></li>
              </ul>
            </div>

          </div>
        </div>
      </footer>

      {/* --- DYNAMIC JOB COMPARISON SHEET MODAL --- */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            
            {/* Close button */}
            <button
              onClick={() => setIsCompareOpen(false)}
              className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer"
              aria-label="Close Comparison modal"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Header */}
            <div className="mb-6 space-y-1">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="h-6 w-6 text-indigo-500" /> Job Comparison Table
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compare side-by-side details, compensation, and AI matches to find the best career fit.
              </p>
            </div>

            {compareJobs.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <p className="text-sm text-slate-500">No jobs selected for comparison.</p>
                <p className="text-xs text-slate-400">Select "Compare" on the job cards to start comparing.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-2xl">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                      <th className="p-4 font-bold text-slate-500 w-1/4">Metric</th>
                      {initialJobs.filter(j => compareJobs.includes(j.id)).map(job => (
                        <th key={job.id} className="p-4 font-bold w-1/4">
                          <div className="flex items-center gap-2.5">
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${job.logoBg}`}>
                              {job.companyLogo}
                            </div>
                            <div>
                              <p className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-[150px]">{job.title}</p>
                              <p className="text-[10px] text-slate-400">{job.company}</p>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {/* Location */}
                    <tr>
                      <td className="p-4 font-semibold text-slate-500 text-xs">Location</td>
                      {initialJobs.filter(j => compareJobs.includes(j.id)).map(job => (
                        <td key={job.id} className="p-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                          {job.location}
                        </td>
                      ))}
                    </tr>
                    {/* Salary */}
                    <tr>
                      <td className="p-4 font-semibold text-slate-500 text-xs">Salary / Comp</td>
                      {initialJobs.filter(j => compareJobs.includes(j.id)).map(job => (
                        <td key={job.id} className="p-4 text-xs font-bold text-teal-600 dark:text-teal-400">
                          {job.salary}
                        </td>
                      ))}
                    </tr>
                    {/* Experience Level */}
                    <tr>
                      <td className="p-4 font-semibold text-slate-500 text-xs">Experience</td>
                      {initialJobs.filter(j => compareJobs.includes(j.id)).map(job => (
                        <td key={job.id} className="p-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                          {job.experience}
                        </td>
                      ))}
                    </tr>
                    {/* AI Match */}
                    <tr>
                      <td className="p-4 font-semibold text-slate-500 text-xs">AI Compatibility Match</td>
                      {initialJobs.filter(j => compareJobs.includes(j.id)).map(job => (
                        <td key={job.id} className="p-4">
                          <div className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-full px-2.5 py-1">
                            <Sparkles className="h-3 w-3" />
                            <span>{job.aiMatch}% Fit</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    {/* Core Tech Stack */}
                    <tr>
                      <td className="p-4 font-semibold text-slate-500 text-xs">Core Tech Stack</td>
                      {initialJobs.filter(j => compareJobs.includes(j.id)).map(job => (
                        <td key={job.id} className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {job.tags.map(tag => (
                              <span key={tag} className="rounded-md bg-slate-50 dark:bg-slate-950 px-2 py-0.5 text-[9px] font-semibold text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800/40">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                    {/* Action */}
                    <tr>
                      <td className="p-4 font-semibold text-slate-500 text-xs">Actions</td>
                      {initialJobs.filter(j => compareJobs.includes(j.id)).map(job => (
                        <td key={job.id} className="p-4">
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => {
                                setIsCompareOpen(false);
                                alert(`Apply Flow triggered for ${job.title} at ${job.company}`);
                              }}
                              className="rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-3 py-1.5 transition-colors cursor-pointer text-center"
                            >
                              Quick Apply
                            </button>
                            <button
                              onClick={() => handleCompareToggle(job.id)}
                              className="text-[11px] text-slate-400 hover:text-red-500 transition-colors text-left"
                            >
                              Remove from Compare
                            </button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Bottom Modal CTA */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsCompareOpen(false)}
                className="rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 font-semibold text-sm px-6 py-2.5 cursor-pointer"
              >
                Close Comparison
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- AI JOB SUMMARIZER MODAL --- */}
      {isSummarizerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            
            {/* Close button */}
            <button
              onClick={() => { setIsSummarizerOpen(false); setSummarizerResult(null); setJobDescriptionInput(''); }}
              className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer"
              aria-label="Close Job Summarizer"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Header */}
            <div className="mb-6 space-y-1">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="h-6 w-6 text-indigo-500" /> AI Job Summarizer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste any long, confusing job description to extract the absolute core metrics and requirements.
              </p>
            </div>

            <form onSubmit={handleSummarize} className="space-y-4">
              <div>
                <label htmlFor="jd-text" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Paste Job Description
                </label>
                <textarea
                  id="jd-text"
                  rows={6}
                  placeholder="Paste the full job post details here..."
                  value={jobDescriptionInput}
                  onChange={(e) => setJobDescriptionInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50 p-4 text-xs font-medium outline-hidden focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:focus:border-indigo-400 dark:focus:bg-slate-950 transition-all text-slate-800 dark:text-slate-100 resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSummarizing}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSummarizing ? (
                    <>
                      <Bot className="h-4 w-4 animate-spin animate-infinite" />
                      <span>Analyzing Job...</span>
                    </>
                  ) : (
                    <span>Summarize with AI</span>
                  )}
                </button>
              </div>
            </form>

            {/* Summarizer Result Details */}
            {summarizerResult && (
              <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800 space-y-4 animate-in fade-in-50 duration-200 text-left">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-500" /> AI Insights Extracted:
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Salary Estimate Target</p>
                    <p className="text-sm font-bold text-teal-600 dark:text-teal-400">{summarizerResult.salary}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Core Skills Needed</p>
                    <div className="flex flex-wrap gap-1">
                      {summarizerResult.skills.map(s => (
                        <span key={s} className="rounded-md bg-white dark:bg-slate-900 px-2 py-0.5 text-[9px] font-semibold border border-slate-100 dark:border-slate-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Responsibilities</p>
                  <ul className="list-disc pl-4 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    {summarizerResult.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-amber-500/5 dark:bg-amber-400/5 border border-amber-500/10 rounded-xl space-y-1.5">
                  <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                    ⚠️ AI Red Flag Check
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                    {summarizerResult.redFlags}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- AI COVER LETTER & PREP MODAL --- */}
      {isCoverLetterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            
            {/* Close button */}
            <button
              onClick={() => { setIsCoverLetterOpen(false); setCoverLetterResult(null); setInterviewQuestionsResult(null); }}
              className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer"
              aria-label="Close Cover Letter Panel"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Header */}
            <div className="mb-6 space-y-1">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="h-6 w-6 text-amber-500" /> AI Cover Letter & Prep
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select a job position to automatically generate a tailored pitch cover letter and top likely interview questions.
              </p>
            </div>

            <div className="space-y-4 text-left">
              <div>
                <label htmlFor="cover-job-select" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Select Target Job Position
                </label>
                <select
                  id="cover-job-select"
                  value={selectedCoverLetterJobId}
                  onChange={(e) => setSelectedCoverLetterJobId(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-hidden focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                >
                  {processedJobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title} at {job.company}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleGenerateCoverLetter}
                  disabled={isGeneratingCoverLetter}
                  className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-5 py-2.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isGeneratingCoverLetter ? (
                    <>
                      <FileText className="h-4 w-4 animate-spin animate-infinite" />
                      <span>Generating materials...</span>
                    </>
                  ) : (
                    <span>Generate Materials</span>
                  )}
                </button>
              </div>
            </div>

            {/* Results */}
            {(coverLetterResult || interviewQuestionsResult) && (
              <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800 space-y-6 text-left animate-in fade-in-50 duration-200">
                
                {/* Cover Letter Box */}
                {coverLetterResult && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Tailored Cover Letter</h4>
                      <button
                        onClick={handleCopyCoverLetter}
                        className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0"
                      >
                        <span>{copiedText ? 'Copied!' : 'Copy to Clipboard'}</span>
                      </button>
                    </div>
                    <pre className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-900 text-xs text-slate-600 dark:text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
                      {coverLetterResult}
                    </pre>
                  </div>
                )}

                {/* Interview Questions Box */}
                {interviewQuestionsResult && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">AI Top Interview Questions Prep</h4>
                    <div className="space-y-2">
                      {interviewQuestionsResult.map((q, i) => (
                        <div key={i} className="p-3 bg-indigo-500/5 dark:bg-indigo-400/5 border border-indigo-500/10 dark:border-indigo-400/10 rounded-xl text-xs">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 leading-normal">{q}</p>
                          <p className="text-slate-400 mt-1.5 leading-normal">
                            <span className="font-semibold text-teal-600 dark:text-teal-400">Recommended Answer Approach:</span> Discuss your background, focus on standard efficiency criteria (complexity, bundle size, state render caching), and link it directly to this employer's style constraints.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      )}

      {/* Hidden file input for resume upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
        className="hidden"
        aria-label="Upload resume for AI match"
      />

      {/* Simulated Uploading Overlay */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 text-center space-y-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Bot className="h-8 w-8 animate-bounce text-teal-500" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">AI Resume Analysis</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Scanning qualifications, matching skills against database open roles, and generating fit scores...
              </p>
            </div>
            
            <div className="space-y-2 text-left">
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>Analyzing and scoring...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-855 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-teal-500 to-indigo-500 h-2 rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Complete Success Toast Notification */}
      {showUploadToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-teal-400">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="font-bold text-xs text-slate-900 dark:text-white">Resume Analyzed successfully!</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[220px]">
              Match results updated based on "{uploadedResume}"
            </p>
          </div>
        </div>
      )}

      {/* --- EDIT PROFILE INFO MODAL --- */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in zoom-in-95 duration-200">
            
            {/* Close button */}
            <button
              onClick={() => setIsEditProfileOpen(false)}
              className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer"
              aria-label="Close Profile Editor"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Header */}
            <div className="mb-6 space-y-1 text-left">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="h-5.5 w-5.5 text-teal-500" /> Edit Profile Details
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update your professional headline, display name, and location settings.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsEditProfileOpen(false);
                localStorage.setItem('candidateName', candidateName);
                localStorage.setItem('candidateTitle', candidateTitle);
                localStorage.setItem('candidateLocation', candidateLocation);
                setShowSettingsToast(true);
                setTimeout(() => setShowSettingsToast(false), 4000);
              }}
              className="space-y-4 text-left"
            >
              <div>
                <label htmlFor="edit-name" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Display Name
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-hidden focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label htmlFor="edit-title" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Headline / Title
                </label>
                <input
                  id="edit-title"
                  type="text"
                  value={candidateTitle}
                  onChange={(e) => setCandidateTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-hidden focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label htmlFor="edit-location" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Location
                </label>
                <input
                  id="edit-location"
                  type="text"
                  value={candidateLocation}
                  onChange={(e) => setCandidateLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs outline-hidden focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-5 py-2.5 shadow-xs transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Saved Toast Notification */}
      {showSettingsToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-indigo-500/20 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="font-bold text-xs text-slate-900 dark:text-white">Changes Saved successfully!</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Your profile preferences and settings have been synced.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

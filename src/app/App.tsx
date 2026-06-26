import { useState, useEffect, useCallback } from "react";
import type { ReactNode, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, BookOpen, HelpCircle, Users, BarChart2,
  FileText, Download, Settings, LogOut, Menu, X, ChevronRight,
  ChevronLeft, ArrowRight, Lock, Bell, Eye, EyeOff,
  Plus, Search, Filter, Edit2, Trash2, Clock, Target, TrendingUp,
  CheckCircle, AlertCircle, BookMarked, Check, Award,
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

// ─── CSS INJECTIONS ────────────────────────────────────────────────────────────
const globalCSS = `
  @keyframes shimmer {
    0% { background-position: -468px 0; }
    100% { background-position: 468px 0; }
  }
  .shimmer-box {
    background: #f6f7f8;
    background-image: linear-gradient(90deg, #f0f2f4 0%, #e4e7ea 30%, #f0f2f4 60%, #f0f2f4 100%);
    background-repeat: no-repeat;
    background-size: 800px 100%;
    animation: shimmer 1.4s infinite linear;
  }
  body { font-family: 'Inter', sans-serif; }
  input[type="range"] { -webkit-appearance: none; appearance: none; background: transparent; cursor: pointer; }
  input[type="range"]::-webkit-slider-runnable-track { height: 6px; border-radius: 9999px; }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    width: 20px; height: 20px; border-radius: 50%;
    background: #16A085; border: 3px solid #fff;
    box-shadow: 0 0 0 1.5px #16A085; margin-top: -7px;
  }
  input[type="range"]::-moz-range-thumb {
    width: 20px; height: 20px; border-radius: 50%;
    background: #16A085; border: 3px solid #fff;
    box-shadow: 0 0 0 1.5px #16A085;
  }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 9999px; }
  ::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }
`;

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Page =
  | "landing" | "login" | "register"
  | "dashboard" | "lesson" | "quiz" | "survey"
  | "results-immediate" | "results-delayed"
  | "admin-login" | "admin-dashboard" | "admin-modules"
  | "admin-module-form" | "admin-module-edit"
  | "admin-quizzes" | "admin-quiz-form" | "admin-quiz-edit"
  | "admin-participants" | "admin-assign-groups"
  | "admin-analytics" | "admin-results" | "admin-export"
  | "admin-settings" | "unauthorized" | "not-found";

// ─── SAMPLE DATA ──────────────────────────────────────────────────────────────
const modules = [
  { id: "1", title: "Introduction to Data Structures", description: "Arrays, linked lists, stacks, queues, and trees.", progress: 75, lessons: 8, quizzes: 2, status: "active" },
  { id: "2", title: "Algorithms and Complexity", description: "Big-O notation, sorting, and searching algorithms.", progress: 0, lessons: 10, quizzes: 2, status: "active" },
  { id: "3", title: "Database Systems", description: "Relational databases, SQL, and normalization.", progress: 0, lessons: 6, quizzes: 2, status: "draft" },
];

const participants = [
  { id: "1", name: "Adaeze Okonkwo", email: "adaeze@unn.edu.ng", device: "Mobile", group: "Experimental", status: "Active" },
  { id: "2", name: "Chidinma Eze", email: "chidinma@unn.edu.ng", device: "Mobile", group: "Control", status: "Active" },
  { id: "3", name: "Emeka Nwosu", email: "emeka@unn.edu.ng", device: "Mobile", group: "Experimental", status: "Active" },
  { id: "4", name: "Funmilayo Adeyemi", email: "funmi@unilag.edu.ng", device: "Tablet", group: "Control", status: "Active" },
  { id: "5", name: "Gbenga Okafor", email: "gbenga@unilag.edu.ng", device: "Mobile", group: "Experimental", status: "Pending" },
  { id: "6", name: "Hauwa Ibrahim", email: "hauwa@abu.edu.ng", device: "Mobile", group: "Control", status: "Active" },
  { id: "7", name: "Ifeoma Chukwu", email: "ifeoma@unn.edu.ng", device: "Desktop", group: "Experimental", status: "Active" },
  { id: "8", name: "Jide Olawale", email: "jide@ui.edu.ng", device: "Mobile", group: "Control", status: "Active" },
];

const quizQuestions = [
  { id: 1, question: "Which data structure operates on a Last-In-First-Out (LIFO) principle?", options: ["Queue", "Stack", "Linked List", "Binary Tree"], correct: 1 },
  { id: 2, question: "What is the time complexity of binary search on a sorted array?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], correct: 2 },
  { id: 3, question: "Which sorting algorithm has the best average-case time complexity of O(n log n)?", options: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort"], correct: 3 },
];

const lessonContent = [
  {
    title: "What is a Data Structure?",
    content: `A data structure is a specialised format for organising, processing, retrieving, and storing data. There are several basic and advanced types, all designed to arrange data to suit a specific purpose.\n\nData structures make it easy for users to access and work with the data they need in appropriate ways. Most importantly, data structures frame the organisation of information so that machines and humans can better understand it.\n\nIn computer science, a data structure is a data organisation, management, and storage format that enables efficient access and modification — a collection of data values, the relationships among them, and the operations that can be applied to the data.`,
  },
  {
    title: "Arrays",
    content: `An array is a collection of items stored at contiguous memory locations. The idea is to store multiple items of the same type together, making it easier to calculate the position of each element by adding an offset to a base value.\n\nArrays are used when the size of the data is known in advance. They provide O(1) access time when the index is known, making them highly efficient for read-heavy operations.\n\nKey characteristics:\n• Fixed size in most languages\n• Elements stored in contiguous memory\n• Zero-indexed in most programming languages\n• O(1) random access, O(n) insertion and deletion`,
  },
  {
    title: "Linked Lists",
    content: `A linked list is a linear data structure where elements are stored in nodes. Each node contains a data field and a reference to the next node in the list. Unlike arrays, linked list elements are not stored at contiguous memory locations.\n\nLinked lists are preferred for operations involving frequent insertion and deletion, as these can be performed in O(1) time given a pointer to the node.\n\nTypes of linked lists:\n• Singly linked list — each node points to the next node\n• Doubly linked list — each node points to both previous and next nodes\n• Circular linked list — the last node points back to the first node`,
  },
];

const cognitiveLoadData = [
  { name: "Mental", control: 62, experimental: 41 },
  { name: "Physical", control: 28, experimental: 22 },
  { name: "Temporal", control: 55, experimental: 38 },
  { name: "Performance", control: 58, experimental: 72 },
  { name: "Effort", control: 64, experimental: 45 },
  { name: "Frustration", control: 48, experimental: 31 },
];

const retentionData = [
  { name: "Week 1", control: 62, experimental: 74 },
  { name: "Week 2", control: 55, experimental: 69 },
  { name: "Week 3", control: 49, experimental: 65 },
  { name: "Week 4", control: 44, experimental: 63 },
];

const adminResultsData = [
  { participant: "Adaeze Okonkwo", group: "Experimental", immediate: 85, delayed: 78, nasaTlx: 38, time: "42m" },
  { participant: "Chidinma Eze", group: "Control", immediate: 70, delayed: 58, nasaTlx: 56, time: "58m" },
  { participant: "Emeka Nwosu", group: "Experimental", immediate: 90, delayed: 84, nasaTlx: 32, time: "38m" },
  { participant: "Funmilayo Adeyemi", group: "Control", immediate: 65, delayed: 51, nasaTlx: 61, time: "64m" },
  { participant: "Gbenga Okafor", group: "Experimental", immediate: 80, delayed: 75, nasaTlx: 41, time: "45m" },
  { participant: "Hauwa Ibrahim", group: "Control", immediate: 72, delayed: 60, nasaTlx: 53, time: "55m" },
];

const quizData = [
  { id: "1", name: "Module 1 – Immediate Recall", module: "Introduction to Data Structures", type: "Immediate", questions: 20 },
  { id: "2", name: "Module 1 – Delayed Recall", module: "Introduction to Data Structures", type: "Delayed", questions: 20 },
  { id: "3", name: "Module 2 – Immediate Recall", module: "Algorithms and Complexity", type: "Immediate", questions: 20 },
];

// ─── SKELETON COMPONENTS ──────────────────────────────────────────────────────
function Shimmer({ w = "100%", h = "1rem", r = "8px", className = "" }: { w?: string; h?: string; r?: string; className?: string }) {
  return <div className={`shimmer-box ${className}`} style={{ width: w, height: h, borderRadius: r }} />;
}

function DashboardSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <Shimmer h="1.5rem" w="35%" />
      <Shimmer h="1rem" w="20%" />
      <div className="bg-[#F3F4F6] rounded-2xl p-8 space-y-4">
        <Shimmer h="1rem" w="25%" />
        <Shimmer h="1.75rem" w="60%" />
        <Shimmer h="1rem" w="80%" />
        <Shimmer h="6px" r="9999px" />
        <Shimmer h="2.75rem" w="10rem" r="12px" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <div key={i} className="border border-[#E5E7EB] rounded-xl p-5 space-y-3">
            <Shimmer h="1rem" w="50%" />
            <Shimmer h="0.875rem" w="90%" />
            <Shimmer h="0.875rem" w="70%" />
          </div>
        ))}
      </div>
    </div>
  );
}

function LessonSkeleton() {
  return (
    <div className="max-w-[650px] mx-auto px-4 py-10 space-y-6">
      <Shimmer h="6px" r="9999px" />
      <Shimmer h="2rem" w="65%" />
      <div className="space-y-2">
        {[100, 95, 100, 88, 76, 100, 65, 90].map((w, i) => (
          <Shimmer key={i} h="1rem" w={`${w}%`} />
        ))}
      </div>
      <div className="flex gap-3 pt-4">
        <Shimmer h="2.75rem" w="8rem" r="12px" />
        <Shimmer h="2.75rem" w="8rem" r="12px" />
      </div>
    </div>
  );
}

function QuizSkeleton() {
  return (
    <div className="max-w-[640px] mx-auto px-4 py-10 space-y-6">
      <Shimmer h="6px" r="9999px" />
      <Shimmer h="1rem" w="28%" />
      <Shimmer h="1.75rem" w="85%" />
      <Shimmer h="1.25rem" w="65%" />
      <div className="space-y-3 pt-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="border border-[#E5E7EB] rounded-xl p-4">
            <Shimmer h="1rem" w="55%" />
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminTableSkeleton() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Shimmer h="1.5rem" w="12rem" />
          <Shimmer h="0.875rem" w="8rem" />
        </div>
        <Shimmer h="2.5rem" w="9rem" r="12px" />
      </div>
      <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB] flex gap-4">
          {[28, 22, 18, 15, 12].map((w, i) => <Shimmer key={i} h="0.875rem" w={`${w}%`} />)}
        </div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="p-4 border-b border-[#E5E7EB] last:border-0 flex gap-4">
            {[28, 22, 18, 15, 12].map((w, j) => <Shimmer key={j} h="1rem" w={`${w}%`} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────────────

function TealButton({ children, onClick, size = "md", type = "button", disabled = false, className = "" }: {
  children: ReactNode; onClick?: () => void; size?: "sm" | "md" | "lg";
  type?: "button" | "submit"; disabled?: boolean; className?: string;
}) {
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-5 py-2.5 text-sm", lg: "px-6 py-3 text-sm" };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-2 font-semibold rounded-xl bg-[#16A085] text-white hover:bg-[#138a72] active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#16A085] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
}

function Btn({ children, variant = "primary", size = "md", onClick, type = "button", disabled = false, className = "", icon }: {
  children: ReactNode; variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg"; onClick?: () => void; type?: "button" | "submit";
  disabled?: boolean; className?: string; icon?: ReactNode;
}) {
  const base = "inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#16A085] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-5 py-2.5 text-sm", lg: "px-6 py-3 text-sm" };
  const variants = {
    primary: "bg-[#1A3A5C] text-white hover:bg-[#142d47]",
    secondary: "bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]",
    ghost: "bg-transparent text-[#1A3A5C] hover:bg-[#F3F4F6]",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {icon}{children}
    </button>
  );
}

function Field({ label, type = "text", placeholder, value, onChange, required = false }: {
  label: string; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#374151]">{label}</label>
      <input type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)} required={required}
        className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl bg-white text-[#374151] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#16A085] focus:border-transparent transition-all text-sm" />
    </div>
  );
}

function PasswordField({ label, placeholder, value, onChange }: {
  label: string; placeholder?: string; value: string; onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#374151]">{label}</label>
      <div className="relative">
        <input type={show ? "text" : "password"} placeholder={placeholder} value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-2.5 pr-11 border border-[#E5E7EB] rounded-xl bg-white text-[#374151] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#16A085] focus:border-transparent transition-all text-sm" />
        <button type="button" onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

function ProgressBar({ value, color = "teal" }: { value: number; color?: "teal" | "navy" }) {
  return (
    <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
      <motion.div className={`h-full rounded-full ${color === "teal" ? "bg-[#16A085]" : "bg-[#1A3A5C]"}`}
        initial={{ width: 0 }} animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }} />
    </div>
  );
}

function Badge({ text, color }: { text: string; color: "green" | "blue" | "yellow" | "gray" | "red" }) {
  const colors = {
    green: "bg-emerald-50 text-emerald-700", blue: "bg-blue-50 text-blue-700",
    yellow: "bg-amber-50 text-amber-700", gray: "bg-[#F3F4F6] text-[#6B7280]",
    red: "bg-red-50 text-red-700",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>{text}</span>;
}

function StatCard({ label, value, sub, icon: Icon, trend }: { label: string; value: string | number; sub?: string; icon?: React.ElementType; trend?: "up" | "down" }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-[#1A3A5C] mt-1">{value}</p>
          {sub && <p className="text-xs text-[#9CA3AF] mt-0.5">{sub}</p>}
        </div>
        {Icon && (
          <div className="p-2.5 bg-[#F0FBF8] rounded-xl shrink-0">
            <Icon size={18} className="text-[#16A085]" />
          </div>
        )}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-3 text-xs font-medium ${trend === "up" ? "text-emerald-600" : "text-red-500"}`}>
          <TrendingUp size={11} className={trend === "down" ? "rotate-180" : ""} />
          {trend === "up" ? "+4.2% from last month" : "-2.1% from last month"}
        </div>
      )}
    </div>
  );
}

function Toast({ message, type, onClose }: { message: string; type: "success" | "error" | "info"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const icons = { success: CheckCircle, error: AlertCircle, info: Bell };
  const colors = { success: "text-emerald-700 border-emerald-200", error: "text-red-700 border-red-200", info: "text-[#374151] border-[#E5E7EB]" };
  const Icon = icons[type];
  return (
    <motion.div initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: -20, x: "-50%" }}
      className={`fixed top-4 left-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-white border rounded-xl shadow-xl text-sm font-medium ${colors[type]}`}>
      <Icon size={15} />{message}
      <button onClick={onClose} className="ml-1 opacity-50 hover:opacity-100"><X size={13} /></button>
    </motion.div>
  );
}

function Pagination({ page, total, perPage, onChange }: { page: number; total: number; perPage: number; onChange: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  return (
    <div className="flex items-center justify-between text-sm text-[#6B7280]">
      <span className="text-xs">Showing {Math.min((page - 1) * perPage + 1, total)}–{Math.min(page * perPage, total)} of {total}</span>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(page - 1)} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-[#F3F4F6] disabled:opacity-40 transition-colors">
          <ChevronLeft size={14} />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onChange(p)}
            className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p === page ? "bg-[#1A3A5C] text-white" : "hover:bg-[#F3F4F6]"}`}>
            {p}
          </button>
        ))}
        <button onClick={() => onChange(page + 1)} disabled={page === pages} className="p-1.5 rounded-lg hover:bg-[#F3F4F6] disabled:opacity-40 transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── STUDENT NAV ──────────────────────────────────────────────────────────────
function StudentNav({ onNavigate, currentPage }: { onNavigate: (p: Page) => void; currentPage: Page }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuth = ["dashboard", "lesson", "quiz", "survey", "results-immediate", "results-delayed"].includes(currentPage);

  return (
    <nav className="h-16 bg-[#1A3A5C] flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <button onClick={() => onNavigate(isAuth ? "dashboard" : "landing")}
        className="text-white font-bold text-lg tracking-tight shrink-0">
        FocusLearn
      </button>

      {!isAuth && (
        <div className="hidden md:flex items-center gap-6">
          <button className="text-white/60 hover:text-white text-sm transition-colors">How It Works</button>
          <button className="text-white/60 hover:text-white text-sm transition-colors">Features</button>
          <button onClick={() => onNavigate("login")} className="text-white/60 hover:text-white text-sm transition-colors">Sign In</button>
          <TealButton onClick={() => onNavigate("register")} size="sm">Get Started</TealButton>
        </div>
      )}

      {isAuth && (
        <div className="flex items-center gap-3">
          <button className="text-white/60 hover:text-white transition-colors"><Bell size={17} /></button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#16A085] flex items-center justify-center text-xs font-bold text-white">A</div>
            <span className="hidden md:block text-sm text-white/80">Adaeze</span>
          </div>
        </div>
      )}

      <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white ml-3">
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="absolute top-16 left-0 right-0 bg-[#1A3A5C] border-t border-white/10 p-4 space-y-1 md:hidden z-40">
            {!isAuth && (
              <>
                <button className="block w-full text-left text-white/60 py-2.5 text-sm">How It Works</button>
                <button className="block w-full text-left text-white/60 py-2.5 text-sm">Features</button>
                <button onClick={() => { onNavigate("login"); setMenuOpen(false); }} className="block w-full text-left text-white/60 py-2.5 text-sm">Sign In</button>
                <TealButton onClick={() => { onNavigate("register"); setMenuOpen(false); }} className="w-full justify-center mt-2">Get Started</TealButton>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── ADMIN LAYOUT ─────────────────────────────────────────────────────────────
const adminNavItems = [
  { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "admin-modules", label: "Modules", icon: BookOpen },
  { id: "admin-quizzes", label: "Quizzes", icon: HelpCircle },
  { id: "admin-participants", label: "Participants", icon: Users },
  { id: "admin-analytics", label: "Analytics", icon: BarChart2 },
  { id: "admin-results", label: "Results", icon: FileText },
  { id: "admin-export", label: "Export", icon: Download },
  { id: "admin-settings", label: "Settings", icon: Settings },
];

function AdminSidebar({ currentPage, onNavigate, mobileOpen, onClose }: {
  currentPage: Page; onNavigate: (p: Page) => void; mobileOpen: boolean; onClose: () => void;
}) {
  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/40 z-30 lg:hidden" />
        )}
      </AnimatePresence>
      <aside className={`fixed left-0 top-0 h-full w-64 bg-[#1A3A5C] flex flex-col z-40 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="h-16 flex items-center px-6 border-b border-white/10 gap-2">
          <span className="text-white font-bold text-lg tracking-tight">FocusLearn</span>
          <span className="text-[10px] font-semibold text-[#16A085] bg-[#16A085]/20 px-1.5 py-0.5 rounded-full">Admin</span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {adminNavItems.map(item => {
            const Icon = item.icon;
            const active = currentPage === item.id || (item.id === "admin-modules" && currentPage.startsWith("admin-module")) || (item.id === "admin-quizzes" && currentPage.startsWith("admin-quiz"));
            return (
              <button key={item.id} onClick={() => { onNavigate(item.id as Page); onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? "bg-white/10 text-white" : "text-white/55 hover:text-white hover:bg-white/5"}`}>
                <Icon size={16} className={active ? "text-[#16A085]" : ""} />
                {item.label}
                {active && <ChevronRight size={12} className="ml-auto text-white/30" />}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={() => onNavigate("landing")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/55 hover:text-white hover:bg-white/5 transition-all">
            <LogOut size={16} />Log Out
          </button>
        </div>
      </aside>
    </>
  );
}

function AdminLayout({ children, currentPage, onNavigate, title }: {
  children: ReactNode; currentPage: Page; onNavigate: (p: Page) => void; title: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <AdminSidebar currentPage={currentPage} onNavigate={onNavigate}
        mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64 min-h-screen flex flex-col">
        <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#374151] p-1">
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-bold text-[#1A3A5C]">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-[#9CA3AF] hover:text-[#374151] transition-colors"><Bell size={17} /></button>
            <div className="w-8 h-8 rounded-full bg-[#1A3A5C] flex items-center justify-center text-xs font-bold text-white">AD</div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-24 md:py-36 px-4 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E5E7EB] text-xs font-semibold text-[#16A085] mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-[#16A085]" />
            Cognitive Load Theory — Applied
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-[#1A3A5C] leading-[1.05] tracking-tight">
            Learn Better.<br />Retain More.
          </h1>
          <p className="mt-6 text-[#6B7280] text-lg leading-relaxed max-w-md">
            Minimalist learning designed to improve concentration and long-term memory. Built for Nigerian university students.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <TealButton onClick={() => onNavigate("register")} size="lg">
              Get Started <ArrowRight size={16} />
            </TealButton>
            <Btn variant="ghost" size="lg">Learn More</Btn>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#9CA3AF]">
            {["Free to join", "Mobile optimised", "Works on low data"].map(f => (
              <span key={f} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#16A085]" />{f}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="border-y border-[#E5E7EB] bg-[#F9FAFB] py-8 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[{ v: "48", l: "Active Students" }, { v: "3", l: "Modules" }, { v: "67.8%", l: "Avg. Recall Rate" }, { v: "42%", l: "Lower Cognitive Load" }].map(s => (
            <div key={s.l}>
              <p className="text-2xl font-bold text-[#1A3A5C]">{s.v}</p>
              <p className="text-xs text-[#6B7280] mt-1 font-medium">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 max-w-5xl mx-auto">
        <p className="text-xs font-bold text-[#16A085] uppercase tracking-widest mb-3">How It Works</p>
        <h2 className="text-3xl font-bold text-[#1A3A5C] mb-14 max-w-sm">Three steps to better retention</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { step: "01", title: "Study a Module", desc: "Read focused, bite-sized lessons with no distractions. One concept at a time." },
            { step: "02", title: "Take the Quiz", desc: "Immediately test what you just learned. Spaced recall reinforces long-term memory." },
            { step: "03", title: "Measure Retention", desc: "A delayed quiz 48–72 hours later reveals how much you truly retained." },
          ].map((s, i) => (
            <div key={i} className="flex gap-5">
              <div className="text-4xl font-black text-[#E5E7EB] shrink-0 leading-none mt-1">{s.step}</div>
              <div>
                <h3 className="font-bold text-[#1A3A5C] mb-2">{s.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 bg-[#F9FAFB] border-y border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1A3A5C] mb-10">Built on science.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Target, title: "Cognitive Load Theory", desc: "Interface designed to minimise extraneous cognitive load." },
              { icon: BookMarked, title: "Spaced Repetition", desc: "Delayed quizzes measure actual long-term retention." },
              { icon: TrendingUp, title: "Progress Tracking", desc: "See your recall rate improve over time with clear data." },
              { icon: Clock, title: "Time-Efficient", desc: "Complete a full module and quiz in under 90 minutes." },
              { icon: Target, title: "One Task at a Time", desc: "Every screen has exactly one primary action. No clutter." },
              { icon: CheckCircle, title: "NASA-TLX Validated", desc: "Cognitive workload measured with a validated research tool." },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                  <div className="w-8 h-8 bg-[#F0FBF8] rounded-xl flex items-center justify-center mb-3">
                    <Icon size={16} className="text-[#16A085]" />
                  </div>
                  <h3 className="font-semibold text-[#1A3A5C] text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-[#1A3A5C]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to study smarter?</h2>
          <p className="text-white/50 text-sm mb-8">Join the study. Measure your retention. Improve.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <TealButton onClick={() => onNavigate("register")} size="lg">Create Account <ArrowRight size={15} /></TealButton>
            <Btn variant="ghost" onClick={() => onNavigate("login")} size="lg" className="text-white/70 hover:text-white hover:bg-white/10">Sign In</Btn>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#9CA3AF]">
          <span className="font-bold text-[#1A3A5C]">FocusLearn</span>
          <span>A Computer Science Final Year Project</span>
          <button onClick={() => onNavigate("admin-login")} className="hover:text-[#1A3A5C] transition-colors text-xs">Admin Portal →</button>
        </div>
      </footer>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-[#F9FAFB]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8">
          <h1 className="text-xl font-bold text-[#1A3A5C] mb-1">Welcome back</h1>
          <p className="text-sm text-[#6B7280] mb-7">Sign in to continue learning</p>
          <form onSubmit={e => { e.preventDefault(); onNavigate("dashboard"); }} className="space-y-4">
            <Field label="Email address" type="email" placeholder="you@university.edu.ng" value={email} onChange={setEmail} required />
            <PasswordField label="Password" placeholder="Enter your password" value={password} onChange={setPassword} />
            <div className="flex justify-end">
              <button type="button" className="text-xs text-[#16A085] hover:underline">Forgot password?</button>
            </div>
            <TealButton type="submit" className="w-full justify-center" size="lg">Sign In</TealButton>
          </form>
          <p className="text-sm text-center text-[#6B7280] mt-6">
            {"Don't have an account? "}
            <button onClick={() => onNavigate("register")} className="text-[#16A085] font-medium hover:underline">Create Account</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── REGISTER PAGE ────────────────────────────────────────────────────────────
function RegisterPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-[#F9FAFB]">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border border-[#E5E7EB] p-8">
          <h1 className="text-xl font-bold text-[#1A3A5C] mb-1">Create your account</h1>
          <p className="text-sm text-[#6B7280] mb-7">Join FocusLearn and start studying smarter</p>
          <form onSubmit={e => { e.preventDefault(); onNavigate("dashboard"); }} className="space-y-4">
            <Field label="Full Name" placeholder="Adaeze Okonkwo" value={name} onChange={setName} required />
            <Field label="Email address" type="email" placeholder="you@university.edu.ng" value={email} onChange={setEmail} required />
            <PasswordField label="Password" placeholder="Create a password" value={password} onChange={setPassword} />
            <PasswordField label="Confirm Password" placeholder="Confirm your password" value={confirm} onChange={setConfirm} />
            <TealButton type="submit" className="w-full justify-center" size="lg">Create Account</TealButton>
          </form>
          <p className="text-sm text-center text-[#6B7280] mt-6">
            Already have an account?{" "}
            <button onClick={() => onNavigate("login")} className="text-[#16A085] font-medium hover:underline">Sign In</button>
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex flex-col items-center text-center space-y-6 p-6">
          <div className="w-44 h-44 relative">
            <div className="absolute inset-0 rounded-2xl bg-[#F0FBF8] border border-[#16A085]/20" />
            <div className="absolute inset-6 rounded-xl bg-[#1A3A5C]/5 border border-[#1A3A5C]/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen size={44} className="text-[#16A085]" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1A3A5C] mb-2">Study. Recall. Retain.</h2>
            <p className="text-sm text-[#6B7280] max-w-xs">FocusLearn uses cognitive science to help you retain more of what you study.</p>
          </div>
          <div className="w-full space-y-2.5">
            {["Minimalist, distraction-free design", "Spaced repetition quizzing", "Track your retention over time"].map(f => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-[#374151]">
                <CheckCircle size={15} className="text-[#16A085] shrink-0" />{f}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const mod = modules[0];
  const h = new Date().getHours();
  const greeting = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return (
    <div className="bg-[#F9FAFB] min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div className="mb-8">
            <p className="text-sm text-[#9CA3AF]">{greeting}</p>
            <h1 className="text-2xl font-bold text-[#1A3A5C]">Welcome back, Adaeze</h1>
          </div>

          <div className="bg-[#1A3A5C] rounded-2xl p-6 md:p-8 mb-5">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1.5">Continue Where You Left Off</p>
            <h2 className="text-xl font-bold text-white mb-2">{mod.title}</h2>
            <p className="text-sm text-white/60 mb-5">{mod.description}</p>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-1.5 bg-white/15 rounded-full overflow-hidden">
                <div className="h-full bg-[#16A085] rounded-full transition-all duration-1000" style={{ width: `${mod.progress}%` }} />
              </div>
              <span className="text-sm font-semibold text-white/70 shrink-0">{mod.progress}%</span>
            </div>
            <TealButton onClick={() => onNavigate("lesson")} size="lg">
              Continue Module <ArrowRight size={15} />
            </TealButton>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-start gap-3">
              <div className="p-2 bg-amber-50 rounded-xl shrink-0"><Clock size={17} className="text-amber-500" /></div>
              <div>
                <h3 className="font-semibold text-[#1A3A5C] text-sm mb-1">Study Reminder</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">Your delayed quiz for Module 1 will be available in <strong className="text-[#374151]">36 hours</strong>. Come back on Thursday.</p>
              </div>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-start gap-3">
              <div className="p-2 bg-[#F0FBF8] rounded-xl shrink-0"><Award size={17} className="text-[#16A085]" /></div>
              <div>
                <h3 className="font-semibold text-[#1A3A5C] text-sm mb-1">Recent Performance</h3>
                <p className="text-xs text-[#6B7280]">Module 1 – Immediate Quiz</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-lg font-bold text-[#16A085]">85%</span>
                  <span className="text-xs text-[#9CA3AF]">17 / 20 correct</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-[#1A3A5C] mb-3 uppercase tracking-wide">All Modules</h2>
            <div className="space-y-2.5">
              {modules.map(m => (
                <div key={m.id} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F3F4F6] flex items-center justify-center shrink-0">
                    <BookOpen size={16} className="text-[#9CA3AF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1A3A5C] text-sm truncate">{m.title}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{m.lessons} lessons · {m.quizzes} quizzes</p>
                  </div>
                  {m.progress > 0 ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-16 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div className="h-full bg-[#16A085] rounded-full" style={{ width: `${m.progress}%` }} />
                      </div>
                      <span className="text-xs text-[#9CA3AF]">{m.progress}%</span>
                    </div>
                  ) : (
                    <Badge text={m.status === "draft" ? "Draft" : "Not started"} color={m.status === "draft" ? "yellow" : "gray"} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── LESSON VIEWER ────────────────────────────────────────────────────────────
function LessonPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [section, setSection] = useState(0);
  const total = lessonContent.length;
  const cur = lessonContent[section];
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      <div className="h-1 bg-[#F3F4F6]">
        <motion.div className="h-full bg-[#16A085]" initial={{ width: 0 }} animate={{ width: `${((section + 1) / total) * 100}%` }} transition={{ duration: 0.4 }} />
      </div>
      <div className="max-w-[650px] mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-10 text-xs text-[#9CA3AF] font-medium">
          <span>Section {section + 1} of {total}</span>
          <span>Introduction to Data Structures</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={section} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
            <h1 className="text-2xl font-bold text-[#1A3A5C] mb-7">{cur.title}</h1>
            <div className="space-y-4">
              {cur.content.split("\n\n").map((para, i) => (
                <p key={i} className="text-[#374151] leading-[1.75] text-base">{para}</p>
              ))}
            </div>
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-[#E5E7EB]">
              <Btn variant="secondary" onClick={() => setSection(Math.max(0, section - 1))}
                disabled={section === 0} icon={<ChevronLeft size={15} />}>Previous</Btn>
              {section < total - 1 ? (
                <Btn onClick={() => setSection(section + 1)} icon={<ChevronRight size={15} />}>Next</Btn>
              ) : (
                <TealButton onClick={() => onNavigate("quiz")}>Take Quiz <ArrowRight size={15} /></TealButton>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── QUIZ PAGE ────────────────────────────────────────────────────────────────
function QuizPage({ onNavigate, delayed = false }: { onNavigate: (p: Page) => void; delayed?: boolean }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const q = quizQuestions[current];
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      <div className="h-1 bg-[#F3F4F6]">
        <motion.div className="h-full bg-[#16A085]" initial={{ width: 0 }} animate={{ width: `${((current + 1) / quizQuestions.length) * 100}%` }} transition={{ duration: 0.3 }} />
      </div>
      <div className="max-w-[640px] mx-auto px-4 py-10">
        {delayed && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <Clock size={15} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">This assessment is available <strong>48–72 hours</strong> after completing the lesson. This is your delayed recall test.</p>
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
            <p className="text-xs font-semibold text-[#9CA3AF] mb-3 uppercase tracking-wide">Question {current + 1} of {quizQuestions.length}</p>
            <h2 className="text-xl font-bold text-[#1A3A5C] mb-8 leading-snug">{q.question}</h2>
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const sel = answers[q.id] === i;
                return (
                  <button key={i} onClick={() => setAnswers({ ...answers, [q.id]: i })}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-150 ${sel ? "border-[#16A085] bg-[#F0FBF8]" : "border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB]"}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${sel ? "border-[#16A085]" : "border-[#D1D5DB]"}`}>
                      {sel && <div className="w-2.5 h-2.5 rounded-full bg-[#16A085]" />}
                    </div>
                    <span className={`text-sm font-medium ${sel ? "text-[#16A085]" : "text-[#374151]"}`}>{opt}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#E5E7EB]">
              <Btn variant="secondary" onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0} icon={<ChevronLeft size={15} />}>Previous</Btn>
              {current < quizQuestions.length - 1 ? (
                <Btn onClick={() => setCurrent(current + 1)} icon={<ChevronRight size={15} />}>Next</Btn>
              ) : (
                <TealButton onClick={() => onNavigate(delayed ? "results-delayed" : "survey")}>
                  {delayed ? "Submit Quiz" : "Submit & Continue"}
                </TealButton>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── NASA-TLX SURVEY ──────────────────────────────────────────────────────────
const tlxDimensions = [
  { id: "mental", label: "Mental Demand", desc: "How mentally demanding was the task?" },
  { id: "physical", label: "Physical Demand", desc: "How physically demanding was the task?" },
  { id: "temporal", label: "Temporal Demand", desc: "How hurried or rushed was the pace?" },
  { id: "performance", label: "Performance", desc: "How successful were you in accomplishing the task?" },
  { id: "effort", label: "Effort", desc: "How hard did you have to work to maintain your performance?" },
  { id: "frustration", label: "Frustration", desc: "How insecure, discouraged, or stressed were you?" },
];

function SurveyPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [vals, setVals] = useState<Record<string, number>>({ mental: 40, physical: 18, temporal: 35, performance: 72, effort: 44, frustration: 28 });
  return (
    <div className="bg-[#F9FAFB] min-h-[calc(100vh-4rem)]">
      <div className="max-w-[620px] mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <p className="text-xs font-bold text-[#16A085] uppercase tracking-widest mb-2">NASA Task Load Index</p>
            <h1 className="text-2xl font-bold text-[#1A3A5C]">How was the lesson?</h1>
            <p className="text-sm text-[#6B7280] mt-1.5">Rate each dimension from 0 (very low) to 100 (very high).</p>
          </div>
          <div className="space-y-4">
            {tlxDimensions.map(dim => (
              <div key={dim.id} className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div>
                    <h3 className="font-semibold text-[#1A3A5C] text-sm">{dim.label}</h3>
                    <p className="text-xs text-[#6B7280] mt-0.5">{dim.desc}</p>
                  </div>
                  <span className="text-xl font-bold text-[#1A3A5C] shrink-0 tabular-nums">{vals[dim.id]}</span>
                </div>
                <input type="range" min={0} max={100} value={vals[dim.id]}
                  onChange={e => setVals({ ...vals, [dim.id]: Number(e.target.value) })}
                  className="w-full h-1.5"
                  style={{ background: `linear-gradient(to right, #16A085 0%, #16A085 ${vals[dim.id]}%, #E5E7EB ${vals[dim.id]}%, #E5E7EB 100%)` }} />
                <div className="flex justify-between mt-1.5 text-[10px] text-[#9CA3AF] font-medium">
                  <span>Very Low</span><span>Very High</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <TealButton onClick={() => onNavigate("results-immediate")} size="lg" className="w-full justify-center">
              Submit Survey
            </TealButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── RESULTS PAGE ─────────────────────────────────────────────────────────────
function ResultsPage({ onNavigate, delayed = false }: { onNavigate: (p: Page) => void; delayed?: boolean }) {
  const score = delayed ? 0.73 : 0.85;
  const r = 42;
  const circumference = 2 * Math.PI * r;
  return (
    <div className="bg-[#F9FAFB] min-h-[calc(100vh-4rem)]">
      <div className="max-w-[580px] mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="relative w-36 h-36 mx-auto mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={r} fill="none" stroke="#F3F4F6" strokeWidth="7" />
              <motion.circle cx="50" cy="50" r={r} fill="none" stroke="#16A085" strokeWidth="7"
                strokeLinecap="round" strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference * (1 - score) }}
                transition={{ duration: 1.2, ease: "easeOut" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-[#1A3A5C]">{Math.round(score * 100)}%</span>
              <span className="text-xs text-[#9CA3AF]">Score</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[#1A3A5C] mb-2">
            {delayed ? "Delayed Recall Results" : "Great work, Adaeze!"}
          </h1>
          <p className="text-sm text-[#6B7280] mb-8">
            {delayed ? "Here is how well you retained the material after 48 hours." : "Here is how you performed on the immediate recall quiz."}
          </p>

          {delayed ? (
            <>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[{ l: "Immediate Score", v: "85%", c: "text-[#1A3A5C]" }, { l: "Delayed Score", v: "73%", c: "text-[#16A085]" }, { l: "Retention Drop", v: "−12%", c: "text-amber-600" }].map((s, i) => (
                  <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-4">
                    <p className={`text-2xl font-bold ${s.c}`}>{s.v}</p>
                    <p className="text-xs text-[#9CA3AF] mt-1 leading-tight">{s.l}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 mb-6">
                <h3 className="font-semibold text-[#1A3A5C] text-sm mb-4 text-left">Score Comparison</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={[{ name: "Scores", immediate: 85, delayed: 73 }]} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "12px" }} />
                    <Legend formatter={v => <span className="text-xs text-[#6B7280]">{v === "immediate" ? "Immediate" : "Delayed"}</span>} />
                    <Bar dataKey="immediate" fill="#1A3A5C" radius={[4, 4, 0, 0]} name="immediate" />
                    <Bar dataKey="delayed" fill="#16A085" radius={[4, 4, 0, 0]} name="delayed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[{ l: "Score", v: "85%" }, { l: "Correct", v: "17 / 20" }, { l: "Time Taken", v: "14m 22s" }, { l: "NASA-TLX", v: "38 / 100" }].map((s, i) => (
                <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-4">
                  <p className="text-xl font-bold text-[#1A3A5C]">{s.v}</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          )}

          {!delayed && (
            <div className="mb-6 p-4 bg-[#F0FBF8] border border-[#16A085]/20 rounded-xl text-left">
              <p className="text-sm text-[#374151]">
                <strong>Your delayed quiz will be available in 48–72 hours.</strong> Come back to test how much you truly retained.
              </p>
            </div>
          )}
          <TealButton onClick={() => onNavigate("dashboard")} size="lg" className="w-full justify-center">
            {delayed ? "Return to Dashboard" : "Continue"} <ArrowRight size={15} />
          </TealButton>
        </motion.div>
      </div>
    </div>
  );
}

// ─── ADMIN LOGIN ──────────────────────────────────────────────────────────────
function AdminLoginPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-7">
          <div className="w-12 h-12 bg-[#1A3A5C] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#1A3A5C]">Admin Portal</h1>
          <p className="text-sm text-[#6B7280] mt-1">Researcher access only</p>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8">
          <form onSubmit={e => { e.preventDefault(); onNavigate("admin-dashboard"); }} className="space-y-4">
            <Field label="Email address" type="email" placeholder="researcher@university.edu.ng" value={email} onChange={setEmail} />
            <PasswordField label="Password" placeholder="Enter your password" value={password} onChange={setPassword} />
            <Btn type="submit" variant="primary" className="w-full justify-center" size="lg">Sign In</Btn>
          </form>
          <button onClick={() => onNavigate("landing")}
            className="mt-5 w-full text-center text-xs text-[#9CA3AF] hover:text-[#374151] flex items-center justify-center gap-1 transition-colors">
            <ChevronLeft size={12} />Return to student portal
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboardPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-7">
        <h2 className="text-xl font-bold text-[#1A3A5C]">Research Overview</h2>
        <p className="text-sm text-[#6B7280] mt-0.5">Module 1 — Introduction to Data Structures</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-7">
        <StatCard label="Total Participants" value="48" icon={Users} trend="up" />
        <StatCard label="Control Group" value="24" sub="Standard interface" />
        <StatCard label="Experimental Group" value="24" sub="Minimalist interface" />
        <StatCard label="Avg. NASA-TLX" value="42.3" sub="Lower = less load" icon={Target} />
        <StatCard label="Immediate Recall" value="67.8%" icon={CheckCircle} trend="up" />
        <StatCard label="Delayed Recall" value="58.4%" icon={TrendingUp} />
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <h3 className="font-semibold text-[#1A3A5C] text-sm mb-0.5">Cognitive Load Comparison</h3>
          <p className="text-xs text-[#9CA3AF] mb-4">NASA-TLX dimensions by group</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={cognitiveLoadData} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "11px" }} />
              <Legend formatter={v => <span className="text-xs text-[#6B7280]">{v === "control" ? "Control" : "Experimental"}</span>} />
              <Bar dataKey="control" fill="#1A3A5C" radius={[3, 3, 0, 0]} />
              <Bar dataKey="experimental" fill="#16A085" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <h3 className="font-semibold text-[#1A3A5C] text-sm mb-0.5">Retention Over Time</h3>
          <p className="text-xs text-[#9CA3AF] mb-4">Weekly score comparison</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <YAxis domain={[30, 80]} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "11px" }} />
              <Legend formatter={v => <span className="text-xs text-[#6B7280]">{v === "control" ? "Control" : "Experimental"}</span>} />
              <Line type="monotone" dataKey="control" stroke="#1A3A5C" strokeWidth={2} dot={{ r: 3, fill: "#1A3A5C" }} />
              <Line type="monotone" dataKey="experimental" stroke="#16A085" strokeWidth={2} dot={{ r: 3, fill: "#16A085" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN MODULES ────────────────────────────────────────────────────────────
function AdminModulesPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1A3A5C]">Modules</h2>
          <p className="text-sm text-[#9CA3AF] mt-0.5">{modules.length} modules</p>
        </div>
        <TealButton onClick={() => onNavigate("admin-module-form")} icon={<Plus size={15} />}>New Module</TealButton>
      </div>
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
              {["Title", "Lessons", "Quizzes", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#9CA3AF] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map(m => (
              <tr key={m.id} className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB] transition-colors">
                <td className="px-4 py-4">
                  <p className="font-semibold text-[#1A3A5C] text-sm">{m.title}</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{m.description}</p>
                </td>
                <td className="px-4 py-4 text-sm text-[#374151]">{m.lessons}</td>
                <td className="px-4 py-4 text-sm text-[#374151]">{m.quizzes}</td>
                <td className="px-4 py-4"><Badge text={m.status === "active" ? "Active" : "Draft"} color={m.status === "active" ? "green" : "yellow"} /></td>
                <td className="px-4 py-4">
                  <div className="flex gap-1">
                    <button onClick={() => onNavigate("admin-module-edit")} className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#374151] transition-colors"><Edit2 size={13} /></button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 text-[#9CA3AF] hover:text-red-600 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ADMIN MODULE FORM ────────────────────────────────────────────────────────
function AdminModuleFormPage({ onNavigate, isEdit = false }: { onNavigate: (p: Page) => void; isEdit?: boolean }) {
  const [title, setTitle] = useState(isEdit ? "Introduction to Data Structures" : "");
  const [desc, setDesc] = useState(isEdit ? "Arrays, linked lists, stacks, and queues." : "");
  const [sections, setSections] = useState(isEdit ? "8" : "");
  const [status, setStatus] = useState(isEdit ? "active" : "draft");
  return (
    <div className="p-6 md:p-8">
      <button onClick={() => onNavigate("admin-modules")} className="flex items-center gap-1 text-sm text-[#9CA3AF] hover:text-[#374151] mb-5 transition-colors">
        <ChevronLeft size={14} />Back to Modules
      </button>
      <h2 className="text-xl font-bold text-[#1A3A5C] mb-6">{isEdit ? "Edit Module" : "Create Module"}</h2>
      <div className="max-w-lg bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-5">
        <Field label="Module Title" placeholder="e.g. Introduction to Data Structures" value={title} onChange={setTitle} />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[#374151]">Description</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Brief module overview..."
            className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl bg-white text-[#374151] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#16A085] focus:border-transparent transition-all resize-none text-sm" />
        </div>
        <Field label="Number of Sections" type="number" placeholder="8" value={sections} onChange={setSections} />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[#374151]">Status</label>
          <div className="flex gap-2">
            {["draft", "active"].map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-xl border transition-all ${status === s ? "border-[#16A085] bg-[#F0FBF8] text-[#16A085]" : "border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB]"}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <TealButton onClick={() => onNavigate("admin-modules")} className="flex-1 justify-center">{isEdit ? "Update" : "Save Module"}</TealButton>
          <Btn variant="secondary" onClick={() => onNavigate("admin-modules")} className="justify-center px-5">Cancel</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN QUIZZES ────────────────────────────────────────────────────────────
function AdminQuizzesPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1A3A5C]">Quizzes</h2>
          <p className="text-sm text-[#9CA3AF] mt-0.5">{quizData.length} quizzes</p>
        </div>
        <TealButton onClick={() => onNavigate("admin-quiz-form")} icon={<Plus size={15} />}>New Quiz</TealButton>
      </div>
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
              {["Quiz Name", "Module", "Type", "Questions", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#9CA3AF] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quizData.map(q => (
              <tr key={q.id} className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB] transition-colors">
                <td className="px-4 py-4 font-semibold text-[#1A3A5C] text-sm">{q.name}</td>
                <td className="px-4 py-4 text-xs text-[#6B7280]">{q.module}</td>
                <td className="px-4 py-4"><Badge text={q.type} color={q.type === "Immediate" ? "blue" : "yellow"} /></td>
                <td className="px-4 py-4 text-sm text-[#374151]">{q.questions}</td>
                <td className="px-4 py-4">
                  <div className="flex gap-1">
                    <button onClick={() => onNavigate("admin-quiz-edit")} className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#374151] transition-colors"><Edit2 size={13} /></button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 text-[#9CA3AF] hover:text-red-600 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ADMIN QUIZ FORM ──────────────────────────────────────────────────────────
function AdminQuizFormPage({ onNavigate, isEdit = false }: { onNavigate: (p: Page) => void; isEdit?: boolean }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [questionText, setQuestionText] = useState(isEdit ? quizQuestions[0].question : "");
  const [options, setOptions] = useState(isEdit ? [...quizQuestions[0].options] : ["", "", "", ""]);
  const [correct, setCorrect] = useState(isEdit ? quizQuestions[0].correct : 0);
  const [explanation, setExplanation] = useState(isEdit ? "A stack follows LIFO — the last item pushed is the first to be popped." : "");
  return (
    <div className="p-6 md:p-8">
      <button onClick={() => onNavigate("admin-quizzes")} className="flex items-center gap-1 text-sm text-[#9CA3AF] hover:text-[#374151] mb-5 transition-colors">
        <ChevronLeft size={14} />Back to Quizzes
      </button>
      <h2 className="text-xl font-bold text-[#1A3A5C] mb-6">{isEdit ? "Edit Quiz" : "Create Quiz"}</h2>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-4 h-fit">
          <h3 className="font-semibold text-[#1A3A5C] text-sm border-b border-[#E5E7EB] pb-3">Quiz Settings</h3>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#374151]">Module</label>
            <select className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-[#374151] bg-white focus:outline-none focus:ring-2 focus:ring-[#16A085]">
              {modules.map(m => <option key={m.id}>{m.title}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#374151]">Quiz Type</label>
            <select className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-[#374151] bg-white focus:outline-none focus:ring-2 focus:ring-[#16A085]">
              <option>Immediate Recall</option>
              <option>Delayed Recall</option>
            </select>
          </div>
          <Field label="Number of Questions" type="number" value="20" onChange={() => {}} />
          <div className="space-y-1 pt-1">
            {quizQuestions.map((_, i) => (
              <button key={i} onClick={() => setCurrentQ(i)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${currentQ === i ? "bg-[#F0FBF8] text-[#16A085]" : "text-[#6B7280] hover:bg-[#F9FAFB]"}`}>
                <span>Question {i + 1}</span>
                {isEdit && <CheckCircle size={11} className={currentQ === i ? "text-[#16A085]" : "text-[#D1D5DB]"} />}
              </button>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-[#1A3A5C] text-sm border-b border-[#E5E7EB] pb-3">Question {currentQ + 1}</h3>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#374151]">Question</label>
            <textarea value={questionText} onChange={e => setQuestionText(e.target.value)} rows={2}
              placeholder="Enter your question here..."
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl bg-white text-[#374151] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#16A085] transition-all resize-none text-sm" />
          </div>
          <div className="space-y-2.5">
            <label className="block text-sm font-medium text-[#374151]">Answer Options <span className="text-[#9CA3AF] font-normal text-xs">(click circle to mark correct)</span></label>
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <button onClick={() => setCorrect(i)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${correct === i ? "border-[#16A085]" : "border-[#D1D5DB]"}`}>
                  {correct === i && <div className="w-2.5 h-2.5 rounded-full bg-[#16A085]" />}
                </button>
                <input type="text" value={opt} placeholder={`Option ${i + 1}`}
                  onChange={e => { const o = [...options]; o[i] = e.target.value; setOptions(o); }}
                  className="flex-1 px-3 py-2 border border-[#E5E7EB] rounded-xl text-sm text-[#374151] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#16A085]" />
                {correct === i && <Badge text="Correct" color="green" />}
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#374151]">Explanation <span className="text-[#9CA3AF] font-normal text-xs">(optional)</span></label>
            <textarea value={explanation} onChange={e => setExplanation(e.target.value)} rows={2}
              placeholder="Why is this the correct answer?"
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl bg-white text-[#374151] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#16A085] transition-all resize-none text-sm" />
          </div>
          <div className="flex gap-3 pt-1">
            <TealButton onClick={() => onNavigate("admin-quizzes")} className="flex-1 justify-center">{isEdit ? "Update Quiz" : "Save Quiz"}</TealButton>
            <Btn variant="secondary" onClick={() => onNavigate("admin-quizzes")} className="justify-center px-5">Cancel</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PARTICIPANTS ─────────────────────────────────────────────────────────────
function AdminParticipantsPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const filtered = participants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1A3A5C]">Participants</h2>
          <p className="text-sm text-[#9CA3AF] mt-0.5">{participants.length} registered</p>
        </div>
        <Btn variant="secondary" onClick={() => onNavigate("admin-assign-groups")} icon={<Users size={14} />}>Assign Groups</Btn>
      </div>
      <div className="flex gap-2.5 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search participants..."
            className="w-full pl-9 pr-4 py-2 border border-[#E5E7EB] rounded-xl text-sm text-[#374151] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#16A085] bg-white" />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 border border-[#E5E7EB] rounded-xl text-sm text-[#6B7280] bg-white hover:border-[#D1D5DB] transition-colors">
          <Filter size={13} />Filter
        </button>
      </div>
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                {["Name", "Email", "Device", "Group", "Status"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#9CA3AF] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice((page - 1) * 5, page * 5).map(p => (
                <tr key={p.id} className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#1A3A5C] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        {p.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="font-semibold text-[#1A3A5C] text-sm">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[#6B7280]">{p.email}</td>
                  <td className="px-4 py-3.5 text-sm text-[#374151]">{p.device}</td>
                  <td className="px-4 py-3.5"><Badge text={p.group} color={p.group === "Experimental" ? "blue" : "gray"} /></td>
                  <td className="px-4 py-3.5"><Badge text={p.status} color={p.status === "Active" ? "green" : "yellow"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[#E5E7EB]">
          <Pagination page={page} total={filtered.length} perPage={5} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}

// ─── ASSIGN GROUPS ────────────────────────────────────────────────────────────
function AdminAssignGroupsPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [target, setTarget] = useState<"Control" | "Experimental">("Experimental");
  const toggle = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  return (
    <div className="p-6 md:p-8">
      <button onClick={() => onNavigate("admin-participants")} className="flex items-center gap-1 text-sm text-[#9CA3AF] hover:text-[#374151] mb-5 transition-colors">
        <ChevronLeft size={14} />Back to Participants
      </button>
      <h2 className="text-xl font-bold text-[#1A3A5C] mb-1.5">Assign Groups</h2>
      <p className="text-sm text-[#6B7280] mb-6">Assign participants to the control or experimental group</p>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <h3 className="font-semibold text-[#1A3A5C] text-sm mb-4">Select Target Group</h3>
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {(["Control", "Experimental"] as const).map(g => (
              <button key={g} onClick={() => setTarget(g)}
                className={`py-3 rounded-xl border text-sm font-semibold transition-all ${target === g ? "border-[#1A3A5C] bg-[#1A3A5C] text-white" : "border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB]"}`}>
                {g}
              </button>
            ))}
          </div>
          <div className="p-4 bg-[#F9FAFB] rounded-xl space-y-3">
            {[{ label: "Control Group", val: 100, color: "navy" as const }, { label: "Experimental Group", val: 100, color: "teal" as const }].map(g => (
              <div key={g.label}>
                <div className="flex justify-between text-xs text-[#6B7280] mb-1.5">
                  <span>{g.label}</span><span>24 / 24</span>
                </div>
                <ProgressBar value={g.val} color={g.color} />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between">
            <h3 className="font-semibold text-[#1A3A5C] text-sm">Select Participants</h3>
            <span className="text-xs text-[#9CA3AF]">{selected.length} selected</span>
          </div>
          <div className="flex-1 divide-y divide-[#E5E7EB] overflow-y-auto">
            {participants.map(p => (
              <label key={p.id} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#F9FAFB] transition-colors">
                <div onClick={() => toggle(p.id)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0 ${selected.includes(p.id) ? "bg-[#16A085] border-[#16A085]" : "border-[#D1D5DB]"}`}>
                  {selected.includes(p.id) && <Check size={9} className="text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A3A5C] truncate">{p.name}</p>
                  <p className="text-xs text-[#9CA3AF]">{p.email}</p>
                </div>
                <Badge text={p.group} color={p.group === "Experimental" ? "blue" : "gray"} />
              </label>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-[#E5E7EB]">
            <TealButton disabled={selected.length === 0} onClick={() => { setSelected([]); onNavigate("admin-participants"); }} className="w-full justify-center">
              Assign {selected.length > 0 ? `(${selected.length})` : ""} to {target}
            </TealButton>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN ANALYTICS ─────────────────────────────────────────────────────────
function AdminAnalyticsPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-7">
        <h2 className="text-xl font-bold text-[#1A3A5C]">Analytics</h2>
        <p className="text-sm text-[#9CA3AF] mt-0.5">Research data summary</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard label="Avg. NASA-TLX" value="42.3" icon={Target} sub="Experimental group" />
        <StatCard label="Immediate Recall" value="67.8%" icon={CheckCircle} trend="up" />
        <StatCard label="Delayed Recall" value="58.4%" icon={TrendingUp} />
        <StatCard label="Retention Rate" value="86.1%" sub="Exp vs control" trend="up" />
      </div>
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <h3 className="font-semibold text-[#1A3A5C] text-sm mb-0.5">NASA-TLX by Dimension</h3>
          <p className="text-xs text-[#9CA3AF] mb-4">Control vs Experimental group</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={cognitiveLoadData} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "11px" }} />
              <Legend formatter={v => <span className="text-xs text-[#6B7280]">{v === "control" ? "Control" : "Experimental"}</span>} />
              <Bar dataKey="control" fill="#1A3A5C" radius={[3, 3, 0, 0]} />
              <Bar dataKey="experimental" fill="#16A085" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <h3 className="font-semibold text-[#1A3A5C] text-sm mb-0.5">Retention Over Time</h3>
          <p className="text-xs text-[#9CA3AF] mb-4">Weekly score comparison</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <YAxis domain={[30, 80]} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "11px" }} />
              <Legend formatter={v => <span className="text-xs text-[#6B7280]">{v === "control" ? "Control" : "Experimental"}</span>} />
              <Line type="monotone" dataKey="control" stroke="#1A3A5C" strokeWidth={2} dot={{ r: 3, fill: "#1A3A5C" }} />
              <Line type="monotone" dataKey="experimental" stroke="#16A085" strokeWidth={2} dot={{ r: 3, fill: "#16A085" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <h3 className="font-semibold text-[#1A3A5C] text-sm mb-0.5">Retention Comparison</h3>
        <p className="text-xs text-[#9CA3AF] mb-4">Immediate vs delayed recall scores by group</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={[
            { label: "Control Imm.", score: 62, fill: "#1A3A5C" },
            { label: "Control Del.", score: 49, fill: "#374151" },
            { label: "Exp. Imm.", score: 74, fill: "#16A085" },
            { label: "Exp. Del.", score: 68, fill: "#138a72" },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#9CA3AF" }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "11px" }} />
            <Bar dataKey="score" radius={[4, 4, 0, 0]} fill="#1A3A5C" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── ADMIN RESULTS ────────────────────────────────────────────────────────────
function AdminResultsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const filtered = adminResultsData.filter(r => r.participant.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#1A3A5C]">Results</h2>
        <p className="text-sm text-[#9CA3AF] mt-0.5">All participant quiz results</p>
      </div>
      <div className="flex gap-2.5 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search results..."
            className="w-full pl-9 pr-4 py-2 border border-[#E5E7EB] rounded-xl text-sm text-[#374151] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#16A085] bg-white" />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 border border-[#E5E7EB] rounded-xl text-sm text-[#6B7280] bg-white hover:border-[#D1D5DB] transition-colors">
          <Filter size={13} />Filter
        </button>
      </div>
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                {["Participant", "Group", "Immediate", "Delayed", "NASA-TLX", "Time on Task"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#9CA3AF] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice((page - 1) * 5, page * 5).map((r, i) => (
                <tr key={i} className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-[#1A3A5C] text-sm">{r.participant}</td>
                  <td className="px-4 py-3.5"><Badge text={r.group} color={r.group === "Experimental" ? "blue" : "gray"} /></td>
                  <td className="px-4 py-3.5 text-sm font-medium text-[#374151]">{r.immediate}%</td>
                  <td className="px-4 py-3.5 text-sm font-medium text-[#374151]">{r.delayed}%</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-sm font-semibold ${r.nasaTlx < 40 ? "text-[#16A085]" : "text-amber-600"}`}>{r.nasaTlx}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-[#9CA3AF]">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[#E5E7EB]">
          <Pagination page={page} total={filtered.length} perPage={5} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}

// ─── EXPORT DATA ──────────────────────────────────────────────────────────────
function AdminExportPage() {
  const [exporting, setExporting] = useState<string | null>(null);
  const exportItems = [
    { title: "Participants", desc: "All registered participant data including device and group assignment", icon: Users, count: "48 records" },
    { title: "Test Results", desc: "Immediate and delayed recall quiz scores for all participants", icon: FileText, count: "96 records" },
    { title: "NASA-TLX Data", desc: "All six-dimension workload survey responses", icon: BarChart2, count: "48 records" },
    { title: "Session Logs", desc: "Time-on-task and interaction event logs", icon: Clock, count: "192 records" },
  ];
  return (
    <div className="p-6 md:p-8">
      <div className="mb-7">
        <h2 className="text-xl font-bold text-[#1A3A5C]">Export Data</h2>
        <p className="text-sm text-[#9CA3AF] mt-0.5">Download research data as CSV files</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {exportItems.map(item => {
          const Icon = item.icon;
          const isExporting = exporting === item.title;
          return (
            <div key={item.title} className="bg-white border border-[#E5E7EB] rounded-xl p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2.5 bg-[#F0FBF8] rounded-xl shrink-0"><Icon size={18} className="text-[#16A085]" /></div>
                <div>
                  <h3 className="font-semibold text-[#1A3A5C] text-sm">{item.title}</h3>
                  <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{item.desc}</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">{item.count}</p>
                </div>
              </div>
              <button onClick={() => { setExporting(item.title); setTimeout(() => setExporting(null), 1800); }}
                disabled={isExporting}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${isExporting ? "border-[#16A085] bg-[#F0FBF8] text-[#16A085]" : "border-[#E5E7EB] text-[#374151] hover:border-[#16A085] hover:text-[#16A085]"}`}>
                {isExporting ? <><CheckCircle size={14} />Exported!</> : <><Download size={14} />Export CSV</>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ADMIN SETTINGS ───────────────────────────────────────────────────────────
function AdminSettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [autoAssign, setAutoAssign] = useState(false);
  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className="relative shrink-0" style={{ width: 40, height: 22 }}>
      <div className={`absolute inset-0 rounded-full transition-colors ${on ? "bg-[#16A085]" : "bg-[#D1D5DB]"}`} />
      <div className="absolute top-0.5 rounded-full bg-white shadow transition-all" style={{ width: 18, height: 18, left: on ? 20 : 2 }} />
    </button>
  );
  return (
    <div className="p-6 md:p-8">
      <div className="mb-7">
        <h2 className="text-xl font-bold text-[#1A3A5C]">Settings</h2>
        <p className="text-sm text-[#9CA3AF] mt-0.5">Platform configuration</p>
      </div>
      <div className="max-w-lg space-y-4">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <h3 className="font-semibold text-[#1A3A5C] text-sm border-b border-[#E5E7EB] pb-3 mb-4">Notifications</h3>
          <div className="space-y-4">
            {[
              { label: "Email notifications", desc: "Notify participants of upcoming quizzes", on: emailNotifs, toggle: () => setEmailNotifs(!emailNotifs) },
              { label: "Auto-assign groups", desc: "Automatically balance participants between groups", on: autoAssign, toggle: () => setAutoAssign(!autoAssign) },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#374151]">{s.label}</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{s.desc}</p>
                </div>
                <Toggle on={s.on} onToggle={s.toggle} />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <h3 className="font-semibold text-[#1A3A5C] text-sm border-b border-[#E5E7EB] pb-3 mb-4">Delayed Quiz Window</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Minimum (hours)" type="number" value="48" onChange={() => {}} />
            <Field label="Maximum (hours)" type="number" value="72" onChange={() => {}} />
          </div>
          <p className="text-xs text-[#9CA3AF] mt-2 leading-relaxed">Students can only take the delayed quiz within this window after completing the lesson.</p>
        </div>
        <TealButton className="w-full justify-center" size="lg">Save Settings</TealButton>
      </div>
    </div>
  );
}

// ─── SYSTEM PAGES ─────────────────────────────────────────────────────────────
function UnauthorizedPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-xs">
        <div className="w-20 h-20 bg-[#F3F4F6] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Lock size={34} className="text-[#9CA3AF]" />
        </div>
        <h1 className="text-xl font-bold text-[#1A3A5C] mb-2">Access Denied</h1>
        <p className="text-sm text-[#6B7280] mb-8">You do not have permission to access this page.</p>
        <TealButton onClick={() => onNavigate("landing")} size="lg">Return Home</TealButton>
      </motion.div>
    </div>
  );
}

function NotFoundPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-xs">
        <p className="text-8xl font-black text-[#E5E7EB] mb-5 leading-none">404</p>
        <h1 className="text-xl font-bold text-[#1A3A5C] mb-2">Page Not Found</h1>
        <p className="text-sm text-[#6B7280] mb-8">The page you are looking for does not exist.</p>
        <TealButton onClick={() => onNavigate("landing")} size="lg">Go Home</TealButton>
      </motion.div>
    </div>
  );
}

// ─── DEMO NAVIGATOR ───────────────────────────────────────────────────────────
const allPages: { id: Page; label: string; group: string }[] = [
  { id: "landing", label: "Landing", group: "Student" },
  { id: "login", label: "Login", group: "Student" },
  { id: "register", label: "Register", group: "Student" },
  { id: "dashboard", label: "Dashboard", group: "Student" },
  { id: "lesson", label: "Lesson Viewer", group: "Student" },
  { id: "quiz", label: "Quiz (Immediate)", group: "Student" },
  { id: "survey", label: "NASA-TLX Survey", group: "Student" },
  { id: "results-immediate", label: "Results (Immediate)", group: "Student" },
  { id: "results-delayed", label: "Results (Delayed)", group: "Student" },
  { id: "admin-login", label: "Admin Login", group: "Admin" },
  { id: "admin-dashboard", label: "Admin Dashboard", group: "Admin" },
  { id: "admin-modules", label: "Modules", group: "Admin" },
  { id: "admin-module-form", label: "Create Module", group: "Admin" },
  { id: "admin-module-edit", label: "Edit Module", group: "Admin" },
  { id: "admin-quizzes", label: "Quizzes", group: "Admin" },
  { id: "admin-quiz-form", label: "Create Quiz", group: "Admin" },
  { id: "admin-quiz-edit", label: "Edit Quiz", group: "Admin" },
  { id: "admin-participants", label: "Participants", group: "Admin" },
  { id: "admin-assign-groups", label: "Assign Groups", group: "Admin" },
  { id: "admin-analytics", label: "Analytics", group: "Admin" },
  { id: "admin-results", label: "Results", group: "Admin" },
  { id: "admin-export", label: "Export Data", group: "Admin" },
  { id: "admin-settings", label: "Settings", group: "Admin" },
  { id: "unauthorized", label: "Unauthorized", group: "System" },
  { id: "not-found", label: "404 Not Found", group: "System" },
];

function DemoNavigator({ currentPage, onNavigate }: { currentPage: Page; onNavigate: (p: Page) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
            className="bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl mb-3 w-52 overflow-hidden"
            style={{ maxHeight: "65vh", overflowY: "auto" }}>
            <div className="px-3.5 py-2.5 border-b border-[#E5E7EB] bg-[#F9FAFB] sticky top-0">
              <p className="text-xs font-bold text-[#1A3A5C]">All Pages</p>
            </div>
            {["Student", "Admin", "System"].map(group => (
              <div key={group}>
                <p className="px-3.5 pt-3 pb-1 text-[9px] font-bold text-[#D1D5DB] uppercase tracking-widest">{group}</p>
                {allPages.filter(p => p.group === group).map(p => (
                  <button key={p.id} onClick={() => { onNavigate(p.id); setOpen(false); }}
                    className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${currentPage === p.id ? "bg-[#F0FBF8] text-[#16A085] font-semibold" : "text-[#374151] hover:bg-[#F9FAFB]"}`}>
                    {currentPage === p.id && "› "}{p.label}
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setOpen(!open)}
        className="w-11 h-11 bg-[#1A3A5C] rounded-full shadow-xl flex items-center justify-center text-white hover:bg-[#142d47] transition-colors"
        title="Navigate to any page">
        {open ? <X size={16} /> : <BookOpen size={16} />}
      </button>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [route, setRoute] = useState<{ page: Page }>({ page: "landing" });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useCallback((page: Page) => {
    setIsLoading(true);
    setTimeout(() => {
      setRoute({ page });
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 650);
  }, []);

  const isAdmin = route.page.startsWith("admin") && route.page !== "admin-login";

  const adminTitles: Partial<Record<Page, string>> = {
    "admin-dashboard": "Dashboard", "admin-modules": "Modules",
    "admin-module-form": "Create Module", "admin-module-edit": "Edit Module",
    "admin-quizzes": "Quizzes", "admin-quiz-form": "Create Quiz", "admin-quiz-edit": "Edit Quiz",
    "admin-participants": "Participants", "admin-assign-groups": "Assign Groups",
    "admin-analytics": "Analytics", "admin-results": "Results",
    "admin-export": "Export Data", "admin-settings": "Settings",
  };

  const noStudentNav = ["admin-login", "unauthorized", "not-found"].includes(route.page);

  const renderSkeleton = () => {
    if (route.page === "dashboard") return <DashboardSkeleton />;
    if (route.page === "lesson") return <LessonSkeleton />;
    if (route.page.includes("quiz")) return <QuizSkeleton />;
    if (isAdmin) return <AdminTableSkeleton />;
    return (
      <div className="p-8 space-y-4 max-w-sm mx-auto mt-16">
        <Shimmer h="2rem" w="50%" /><Shimmer h="1rem" w="75%" /><Shimmer h="1rem" w="60%" />
      </div>
    );
  };

  const renderPage = () => {
    switch (route.page) {
      case "landing": return <LandingPage onNavigate={navigate} />;
      case "login": return <LoginPage onNavigate={navigate} />;
      case "register": return <RegisterPage onNavigate={navigate} />;
      case "dashboard": return <DashboardPage onNavigate={navigate} />;
      case "lesson": return <LessonPage onNavigate={navigate} />;
      case "quiz": return <QuizPage onNavigate={navigate} />;
      case "survey": return <SurveyPage onNavigate={navigate} />;
      case "results-immediate": return <ResultsPage onNavigate={navigate} />;
      case "results-delayed": return <ResultsPage onNavigate={navigate} delayed />;
      case "admin-login": return <AdminLoginPage onNavigate={navigate} />;
      case "admin-dashboard": return <AdminDashboardPage onNavigate={navigate} />;
      case "admin-modules": return <AdminModulesPage onNavigate={navigate} />;
      case "admin-module-form": return <AdminModuleFormPage onNavigate={navigate} />;
      case "admin-module-edit": return <AdminModuleFormPage onNavigate={navigate} isEdit />;
      case "admin-quizzes": return <AdminQuizzesPage onNavigate={navigate} />;
      case "admin-quiz-form": return <AdminQuizFormPage onNavigate={navigate} />;
      case "admin-quiz-edit": return <AdminQuizFormPage onNavigate={navigate} isEdit />;
      case "admin-participants": return <AdminParticipantsPage onNavigate={navigate} />;
      case "admin-assign-groups": return <AdminAssignGroupsPage onNavigate={navigate} />;
      case "admin-analytics": return <AdminAnalyticsPage />;
      case "admin-results": return <AdminResultsPage />;
      case "admin-export": return <AdminExportPage />;
      case "admin-settings": return <AdminSettingsPage />;
      case "unauthorized": return <UnauthorizedPage onNavigate={navigate} />;
      default: return <NotFoundPage onNavigate={navigate} />;
    }
  };

  const pageContent = (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {renderSkeleton()}
        </motion.div>
      ) : (
        <motion.div key={route.page} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
          {renderPage()}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <style>{globalCSS}</style>
      {isAdmin ? (
        <AdminLayout currentPage={route.page} onNavigate={navigate} title={adminTitles[route.page] || ""}>
          {pageContent}
        </AdminLayout>
      ) : (
        <div className="min-h-screen">
          {!noStudentNav && <StudentNav onNavigate={navigate} currentPage={route.page} />}
          {pageContent}
        </div>
      )}
      <DemoNavigator currentPage={route.page} onNavigate={navigate} />
    </>
  );
}

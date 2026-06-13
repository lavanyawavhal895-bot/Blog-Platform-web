"use client";

import React, { useEffect, useState, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import axios from "axios";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { WebGLShader } from "../components/ui/WebGLShader.tsx";
import { useAuth } from "../context/AuthContext"; // Import the hook

// Premium UI Polish Components Injected
import { Modal } from "../components/ui/Modal";
import { ToastContainer } from "../components/ui/ToastContainer";
import { ToastMessage } from "../components/ui/Toast";

interface UserInfo {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

interface BlogInfo {
  _id: string;
  title: string;
  author: {
    _id: string;
    username: string;
    email: string;
  } | null;
  createdAt: string;
}

interface DashboardSummary {
  totalUsers: number;
  totalBlogs: number;
  totalImagesUploaded: number;
  blogsCreatedThisMonth: number;
}

interface ChartItem {
  name: string;
  Blogs: number;
}

interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  variant: "danger" | "warning" | "info";
  onConfirm: () => void;
}

const AdminDashboard = () => {
  // Use the context instead of direct localStorage access
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Core Data States
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [blogs, setBlogs] = useState<BlogInfo[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "blogs">("users");

  // Premium UX Notification & Confirmation States
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: "",
    message: "",
    variant: "info",
    onConfirm: () => {},
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const chartBoxRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 280 });

  // Dedicated Component Data Loading Lifecycle 
  useEffect(() => {
    if (user?.role === "admin" && token) {
      fetchDashboardData();
    }
  }, [user, token]); // Re-run if auth state changes

  // Isolated Resize Tracking Engine
  useEffect(() => {
    if (!chartBoxRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      if (width > 0) {
        setDimensions({
          width: width,
          height: window.innerWidth < 768 ? 240 : 300
        });
      }
    });

    observer.observe(chartBoxRef.current);
    return () => observer.disconnect();
  }, [chartData]);

  // Toast dispatch abstraction helper
  const addToast = (text: string, type: "success" | "error" | "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchDashboardData = async (searchStr = "") => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const userUrl = searchStr 
        ? `http://localhost:5000/api/admin/users?search=${encodeURIComponent(searchStr)}`
        : "http://localhost:5000/api/admin/users";

      const [statsRes, usersRes, blogsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/stats", config),
        axios.get(userUrl, config),
        axios.get("http://localhost:5000/api/admin/blogs", config)
      ]);

      setSummary(statsRes.data.summary);
      setChartData(statsRes.data.chartData);
      setUsers(usersRes.data);
      setBlogs(blogsRes.data);
    } catch (error) {
      console.error("Dashboard synchronization failure:", error);
      addToast("Failed to secure active cluster directory statistics metrics.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUserSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDashboardData(userSearch);
  };

  const handleToggleRoleClick = (targetUser: UserInfo) => {
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    
    setModalConfig({
      isOpen: true,
      title: "Modify Access Controls?",
      message: `Are you sure you want to alter authorization privileges for ${targetUser.username}? This transitions their clearance tier directly to ${newRole.toUpperCase()}.`,
      variant: "warning",
      onConfirm: () => executeToggleRole(targetUser, newRole),
    });
  };

  const executeToggleRole = async (targetUser: UserInfo, newRole: string) => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`http://localhost:5000/api/admin/user-role/${targetUser._id}`, { role: newRole }, config);
      
      setUsers(users.map(u => u._id === targetUser._id ? { ...u, role: newRole } : u));
      addToast(`Privileges for ${targetUser.username} updated to ${newRole}.`, "success");
    } catch (error) {
      console.error("Failed to alter user role mapping:", error);
      addToast("Failed to modify user target security matrix.", "error");
    }
  };

  const handleDeleteUserClick = (userId: string, username: string) => {
    setModalConfig({
      isOpen: true,
      title: "Purge User Profile?",
      message: `Permanently delete ${username}'s system account along with all associated articles? This action drops all database links and cannot be reversed.`,
      variant: "danger",
      onConfirm: () => executeDeleteUser(userId),
    });
  };

  const executeDeleteUser = async (userId: string) => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/admin/user/${userId}`, config);
      addToast("User account lifecycle record purged successfully.", "success");
      fetchDashboardData(userSearch);
    } catch (error) {
      console.error("Failed to purge user:", error);
      addToast("Security engine denied file destruction request.", "error");
    }
  };

  const handleDeleteBlogClick = (blogId: string, title: string) => {
    setModalConfig({
      isOpen: true,
      title: "Force Delete Article?",
      message: `Are you sure you want to permanently drop "${title}" from the platform? This removes the entry from the public global feed immediately.`,
      variant: "danger",
      onConfirm: () => executeDeleteBlog(blogId),
    });
  };

  const executeDeleteBlog = async (blogId: string) => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/admin/blog/${blogId}`, config);
      
      setBlogs(blogs.filter(b => b._id !== blogId));
      if (summary) setSummary({ ...summary, totalBlogs: summary.totalBlogs - 1 });
      addToast("Article removed from database registry.", "success");
    } catch (error) {
      console.error("Failed to delete blog:", error);
      addToast("Failed to delete the selected content entry.", "error");
    }
  };

  if (!token || user?.role !== "admin") {
    return <Navigate to="/dashboard" replace={true} />;
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen text-white pb-16 relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"
    >
      <div className="absolute w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl top-[-10%] left-[-10%] pointer-events-none z-0"></div>
      <div className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl bottom-[-10%] right-[-10%] pointer-events-none z-0"></div>

      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <WebGLShader />
      </div>

      <div className="relative z-10 pt-24 px-4 md:px-12 max-w-7xl mx-auto w-full">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest bg-purple-500/10 border border-purple-500/30 text-purple-400 uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Central Control Terminal
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            System Administration
          </h1>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: summary?.totalUsers },
            { label: "Total Blogs", value: summary?.totalBlogs },
            { label: "Images Uploaded", value: summary?.totalImagesUploaded },
            { label: "Created This Month", value: summary?.blogsCreatedThisMonth },
          ].map((card, i) => (
            <div key={i} className="p-5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:border-white/20 transition-all duration-300">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">{card.label}</span>
              <h3 className="text-3xl font-bold mt-1 text-white">{card.value ?? 0}</h3>
            </div>
          ))}
        </div>

        {chartData.length > 0 && (
          <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl mb-10 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-6">Article Publishing Velocity</h3>
            <div ref={chartBoxRef} className="w-full flex justify-center items-center overflow-hidden min-h-[260px]">
              {dimensions.width > 0 ? (
                <AreaChart 
                  width={dimensions.width} 
                  height={dimensions.height} 
                  data={chartData} 
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorBlogs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8338ec" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8338ec" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" style={{ fontSize: '11px' }} />
                  <YAxis stroke="rgba(255,255,255,0.4)" style={{ fontSize: '11px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: "8px" }}
                  />
                  <Area type="monotone" dataKey="Blogs" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorBlogs)" />
                </AreaChart>
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-slate-500 tracking-wider">
                  INITIALIZING GRAPH INTERFACE LAYER...
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
          <div className="flex gap-2 bg-white/5 p-1 rounded-xl self-start border border-white/10 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 sm:flex-none text-center px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeTab === "users" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab("blogs")}
              className={`flex-1 sm:flex-none text-center px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeTab === "blogs" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              Blogs
            </button>
          </div>

          {activeTab === "users" && (
            <form onSubmit={handleUserSearchSubmit} className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 w-full sm:w-64"
              />
              <button type="submit" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm transition-all border border-white/10 active:scale-95">
                Search
              </button>
            </form>
          )}
        </div>

        <div className="min-h-[350px] relative z-10">
          {loading ? (
            <div className="py-24 text-center text-sm text-slate-400 animate-pulse tracking-widest uppercase">
              Syncing directory instances...
            </div>
          ) : activeTab === "users" ? (
            <div className="border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider bg-white/5">
                      <th className="p-4 pl-6">Username</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Access Role</th>
                      <th className="p-4 text-right pr-6">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-sm text-slate-200">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-white/5 transition-colors duration-150">
                        <td className="p-4 pl-6 font-medium text-white">{u.username}</td>
                        <td className="p-4 text-slate-300">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                            u.role === "admin" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-6 space-x-2 whitespace-nowrap">
                          {u._id !== user?.id ? (
                            <>
                              <button
                                onClick={() => handleToggleRoleClick(u)}
                                className="text-xs bg-white/5 hover:bg-white/10 text-white/80 px-2.5 py-1.5 rounded-lg border border-white/10 transition-all active:scale-95"
                              >
                                Toggle Role
                              </button>
                              <button
                                onClick={() => handleDeleteUserClick(u._id, u.username)}
                                className="text-xs bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white px-2.5 py-1.5 rounded-lg border border-red-500/20 transition-all active:scale-95"
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-slate-500 italic pr-4">Active Session</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider bg-white/5">
                      <th className="p-4 pl-6">Article Title</th>
                      <th className="p-4">Author Link</th>
                      <th className="p-4">Date Published</th>
                      <th className="p-4 text-right pr-6">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-sm text-slate-200">
                    {blogs.map((b) => (
                      <tr key={b._id} className="hover:bg-white/5 transition-colors duration-150">
                        <td className="p-4 pl-6 font-medium text-white max-w-xs truncate">{b.title}</td>
                        <td className="p-4 text-slate-300">{b.author?.username || <span className="text-slate-500 italic">Unknown</span>}</td>
                        <td className="p-4 text-slate-400">{new Date(b.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-right pr-6 space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => navigate(`/edit-blog/${b._id}`)}
                            className="text-xs bg-white/5 hover:bg-white/10 text-white/80 px-2.5 py-1.5 rounded-lg border border-white/10 transition-all active:scale-95"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBlogClick(b._id, b.title)}
                            className="text-xs bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white px-2.5 py-1.5 rounded-lg border border-red-500/20 transition-all active:scale-95"
                          >
                            Force Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Modal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        variant={modalConfig.variant}
        confirmLabel="Confirm Action"
        cancelLabel="Dismiss"
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default AdminDashboard;
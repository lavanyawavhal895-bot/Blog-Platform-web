import axios from "axios";
import { Link } from "react-router-dom";
import { WebGLShader } from "../components/ui/WebGLShader";
import Masonry from "react-masonry-css";
import {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  backgroundColor: string;
  textColor: string;
  createdAt: string;
  author?: {
    _id: string;
    username: string;
  };
}

interface GlassCardProps {
  blog: Blog;
  color: string;
  onDelete?: (id: string) => void;
}

const breakpointColumns = {
  default: 4,
  1400: 3,
  1024: 2,
  768: 1,
};

const GlassCard = ({ blog, color, onDelete }: GlassCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative rounded-3xl overflow-hidden backdrop-blur-xl border border-white/10
                 hover:border-white/20 transition-all duration-500 group cursor-pointer
                 hover:shadow-2xl active:scale-95 flex flex-col h-full"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
        boxShadow: `0 8px 32px rgba(${color}, 0.15)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 16px 48px rgba(${color}, 0.35)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 32px rgba(${color}, 0.15)`;
      }}
    >
      <div
        className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(${color}, 0.25), transparent 50%)`,
          inset: 0,
        }}
      />

      {blog.image ? (
        <div className="overflow-hidden relative">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      ) : (
        <div
          className="h-56 flex items-center justify-center text-4xl text-white/20"
          style={{
            background: `linear-gradient(135deg, rgba(${color}, 0.2), rgba(${color}, 0.05))`,
          }}
        >
          ◈
        </div>
      )}

      <div className="p-5 relative z-10 flex flex-col flex-1 justify-between">
        <div>
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-3"
            style={{
              background: `rgba(${color}, 0.15)`,
              border: `1px solid rgba(${color}, 0.35)`,
              color: `rgb(${color})`,
            }}
          >
            Featured
          </div>

          <h3 className="text-lg font-bold text-white line-clamp-2 mb-2 leading-tight">
            {blog.title}
          </h3>

          <div className="flex items-center justify-between mb-3 text-xs text-white/50">
            <span>By {blog.author?.username || "Anonymous"}</span>
            <span>
              {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          <p className="text-sm text-white/60 line-clamp-2 mb-4 leading-relaxed">
            {blog.content}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10 mt-auto">
          <Link
            to={`/blog/${blog._id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 border border-emerald-400/25 text-emerald-300 hover:bg-emerald-500/20 transition-colors duration-200"
          >
            👁 Read
          </Link>
          <Link
            to={`/edit-blog/${blog._id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/10 border border-cyan-400/25 text-cyan-300 hover:bg-cyan-500/20 transition-colors duration-200"
          >
            ✏️ Edit
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(blog._id);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 border border-red-400/25 text-red-300 hover:bg-red-500/20 transition-colors duration-200"
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const MyBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const colorPalettes = [
    "255, 0, 110",
    "131, 56, 236",
    "58, 134, 255",
    "6, 255, 165",
    "255, 190, 11",
    "251, 86, 7",
  ];

  // Map option values to human-readable labels
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "az", label: "A – Z" },
    { value: "za", label: "Z – A" },
  ];
useEffect(() => {
  fetchBlogs();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () =>
    document.removeEventListener("mousedown", handleClickOutside);
}, []);

 const fetchBlogs = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `https://blog-platform-web-gqdd.onrender.com/api/blogs/user/${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setBlogs(res.data);
  } catch (error) {
    console.log(error);
  }
};
 const deleteBlog = async (id: string) => {
  if (!window.confirm("Are you sure you want to delete this blog?")) return;

  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `https://blog-platform-web-gqdd.onrender.com/api/blogs/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchBlogs();
  } catch (error) {
    alert("Delete Failed");
  }
};
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "az":
        return a.title.localeCompare(b.title);
      case "za":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  const totalBlogs = blogs.length;
  const blogsThisMonth = blogs.filter((blog) => {
    const d = new Date(blog.createdAt),
      now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const latestBlogDate =
    blogs.length > 0
      ? new Date(Math.max(...blogs.map((b) => new Date(b.createdAt).getTime()))).toLocaleDateString()
      : "N/A";
  const totalImagesUploaded = blogs.filter((b) => b.image?.trim()).length;

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <WebGLShader />

      <div className="relative z-10">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-8 border-b border-slate-800">
          <div>
            <h1 className="text-4xl font-bold">My Blogs</h1>
            <p className="text-slate-400 mt-2">Manage your blogs</p>
          </div>
          <Link
            to="/create-blog"
            className="px-6 py-2.5 rounded-full font-semibold text-white backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300"
          >
            + Create Blog
          </Link>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-8 mt-8">
          {[
            { label: "Total Blogs", value: totalBlogs, color: "text-purple-400" },
            { label: "Blogs This Month", value: blogsThisMonth, color: "text-blue-400" },
            { label: "Latest Blog Date", value: latestBlogDate, color: "text-green-400" },
            { label: "Images Uploaded", value: totalImagesUploaded, color: "text-pink-400" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            >
              <h3 className="text-slate-400 text-sm">{label}</h3>
              <p className={`text-4xl font-bold mt-2 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── Search + Sort ── */}
        <div className="flex flex-col sm:flex-row gap-4 px-8 mt-8 relative z-20">
          <input
            type="text"
            placeholder="Search my blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder-slate-500 outline-none focus:border-white/30 transition"
          />

          {/* Custom Glassmorphism Dropdown List */}
          <div className="relative min-w-[180px]" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full text-left bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-white/30 transition flex justify-between items-center"
            >
              <span>{sortOptions.find((o) => o.value === sortBy)?.label}</span>
              <span className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}>
                ▼
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-200">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSortBy(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 text-sm transition-colors text-white hover:bg-white/10
                      ${sortBy === option.value ? "bg-white/5 font-semibold text-purple-400" : ""}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Blog Cards ── */}
        <div className="px-8 py-8 relative z-10">
          {sortedBlogs.length > 0 ? (
            <Masonry
              breakpointCols={breakpointColumns}
              className="flex gap-6"
              columnClassName="flex flex-col gap-6"
            >
              {sortedBlogs.map((blog, idx) => (
                <GlassCard
                  key={blog._id}
                  blog={blog}
                  color={colorPalettes[idx % colorPalettes.length]}
                  onDelete={deleteBlog}
                />
              ))}
            </Masonry>
          ) : (
            <div className="text-center text-slate-400 mt-20 text-xl">
              No blogs found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBlogs;
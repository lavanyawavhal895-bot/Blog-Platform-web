"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import Masonry from "react-masonry-css"
import { WebGLShader } from "../components/ui/WebGLShader.tsx"

interface Blog {
  _id: string
  title: string
  content: string
  image: string
  backgroundColor: string
  textColor: string
  createdAt: string
  author: { _id: string; username: string }
}

interface GlassCardProps {
  blog: Blog
  color: string
}

const GlassCard = ({ blog, color }: GlassCardProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative rounded-3xl overflow-hidden backdrop-blur-xl border border-white/10
                 hover:border-white/20 transition-all duration-500 group cursor-pointer
                 hover:shadow-2xl active:scale-95"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
        boxShadow: `0 8px 32px rgba(${color}, 0.15)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 16px 48px rgba(${color}, 0.35)`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 32px rgba(${color}, 0.15)`
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

      <div className="p-5 relative z-10">
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

        <Link
          to={`/blog/${blog._id}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white
                     transition-all duration-300 active:scale-95 overflow-hidden relative group/btn"
          style={{
            background: `linear-gradient(135deg, rgb(${color}), rgba(${color}, 0.7))`,
            boxShadow: `0 8px 20px rgba(${color}, 0.4)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 12px 32px rgba(${color}, 0.6)`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `0 8px 20px rgba(${color}, 0.4)`
          }}
        >
          <span className="relative z-10 flex items-center gap-2">Read →</span>
          <div
            className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              animation: "shimmer 2s infinite",
            }}
          />
        </Link>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  const user = JSON.parse(typeof window !== "undefined" ? sessionStorage.getItem("user") || "{}" : "{}")

  const colorPalettes = [
    "255, 0, 110",
    "131, 56, 236",
    "58, 134, 255",
    "6, 255, 165",
    "255, 190, 11",
    "251, 86, 7",
    "255, 0, 110",
  ]

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("https://blog-platform-web-gqdd.onrender.com/api/blogs")
      setBlogs(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const filtered = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  )

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "az":
        return a.title.localeCompare(b.title)
      case "za":
        return b.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  const latestBlog =
    blogs.length > 0
      ? [...blogs].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]
      : null

  const uniqueAuthors = new Set(blogs.map((blog) => blog.author?.username)).size

  return (
    <div
      className="relative min-h-screen overflow-x-hidden text-white"
      style={{
        background: "radial-gradient(ellipse at 20% 50%, rgba(51, 14, 76, 0.2) 0%, rgba(10, 5, 20, 0.9) 100%)",
      }}
    >
      <WebGLShader />

      <div className="relative z-10 pt-24">
        <header className="px-6 md:px-12 mb-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-2 text-sm font-semibold tracking-widest text-white/40 uppercase">
              Welcome back
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
              Hey,{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #ff006e, #8338ec, #3a86ff)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {user.username || "Creator"}
              </span>{" "}
              ✨
            </h1>
            <p className="text-lg text-white/50">
              Discover amazing stories from our community
            </p>
          </div>
        </header>

        <section className="px-6 md:px-12 mb-16">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
            <div
              className="rounded-3xl p-8 backdrop-blur-xl border border-white/10
                         hover:border-white/20 transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(255,0,110,0.1), rgba(131,56,236,0.05))",
                boxShadow: "0 8px 32px rgba(255, 0, 110, 0.2)",
              }}
            >
              <div className="text-4xl mb-3">📚</div>
              <p className="text-white/50 text-sm mb-2">Total Blogs</p>
              <p className="text-4xl font-black text-white">{blogs.length}</p>
              <div className="mt-3 text-xs text-white/40">
                +{Math.floor(blogs.length * 0.15)} this week
              </div>
            </div>

            <div
              className="rounded-3xl p-8 backdrop-blur-xl border border-white/10
                         hover:border-white/20 transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(58,134,255,0.1), rgba(6,255,165,0.05))",
                boxShadow: "0 8px 32px rgba(58, 134, 255, 0.2)",
              }}
            >
              <div className="text-4xl mb-3">✍️</div>
              <p className="text-white/50 text-sm mb-2">Active Authors</p>
              <p className="text-4xl font-black text-white">{uniqueAuthors}</p>
              <div className="mt-3 text-xs text-white/40">Growing community</div>
            </div>

            <div
              className="rounded-3xl p-8 backdrop-blur-xl border border-white/10
                         hover:border-white/20 transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(255,190,11,0.1), rgba(251,86,7,0.05))",
                boxShadow: "0 8px 32px rgba(255, 190, 11, 0.2)",
              }}
            >
              <div className="text-4xl mb-3">👁️</div>
              <p className="text-white/50 text-sm mb-2">Visible Blogs</p>
              <p className="text-4xl font-black text-white">{filtered.length}</p>
              <div className="mt-3 text-xs text-white/40">
                Matching your search
              </div>
            </div>
          </div>
        </section>

        {latestBlog && (
          <section className="px-6 md:px-12 mb-16">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-black text-white mb-6">
                Featured Post
              </h2>
              <div
                className="rounded-3xl overflow-hidden backdrop-blur-xl border border-white/10
                           hover:border-white/20 transition-all duration-500 group"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                  boxShadow: "0 12px 48px rgba(131, 56, 236, 0.25)",
                }}
              >
                <div className="grid md:grid-cols-2 gap-0">
                  {latestBlog.image && (
                    <div className="overflow-hidden h-auto md:h-auto">
                      <img
                        src={latestBlog.image}
                        alt={latestBlog.title}
                        className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}

                  <div className="p-8 flex flex-col justify-center">
                    <span
                      className="inline-block w-fit px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
                      style={{
                        background: "rgba(131, 56, 236, 0.2)",
                        border: "1px solid rgba(131, 56, 236, 0.4)",
                        color: "#c084fc",
                      }}
                    >
                      ⭐ Latest Post
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
                      {latestBlog.title}
                    </h2>
                    <p className="text-white/50 text-sm mb-4">
                      By {latestBlog.author?.username || "Anonymous"}
                    </p>
                    <p className="text-white/60 leading-relaxed mb-6">
                      {latestBlog.content.slice(0, 150)}...
                    </p>
                    <Link
                      to={`/blog/${latestBlog._id}`}
                      className="w-fit px-8 py-3 rounded-full font-bold text-white flex items-center gap-2
                                 transition-all duration-300 active:scale-95"
                      style={{
                        background: "linear-gradient(135deg, #8338ec, #3a86ff)",
                        boxShadow: "0 8px 24px rgba(131, 56, 236, 0.5)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 12px 36px rgba(131, 56, 236, 0.75)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(131, 56, 236, 0.5)"
                      }}
                    >
                      Read Featured Post →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="px-6 md:px-12 mb-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search blogs by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl text-white text-sm
                           bg-white/5 backdrop-blur-xl border border-white/10
                           placeholder-white/30 outline-none
                           focus:border-white/30 focus:bg-white/10
                           transition-all duration-300"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 text-lg">
                ⌕
              </span>
            </div>

            {/* Custom styled select wrapper matching the input search container */}
            <div className="relative md:w-56">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl text-white text-sm
                           bg-white/5 backdrop-blur-xl border border-white/10
                           outline-none focus:border-white/30 focus:bg-white/10
                           transition-all duration-300 cursor-pointer appearance-none pr-12"
              >
                <option value="newest" className="bg-[#120a21] text-white">Newest First</option>
                <option value="oldest" className="bg-[#120a21] text-white">Oldest First</option>
                <option value="az" className="bg-[#120a21] text-white">A → Z</option>
                <option value="za" className="bg-[#120a21] text-white">Z → A</option>
              </select>
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 text-xs pointer-events-none">
                ▼
              </span>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-12 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-black text-white mb-8">
              All Blogs ({filtered.length})
            </h2>

            {sorted.length > 0 ? (
              <Masonry
                breakpointCols={{
                  default: 5,
                  1400: 4,
                  1100: 3,
                  768: 2,
                  500: 1,
                }}
                className="flex gap-6"
                columnClassName="flex flex-col gap-6"
              >
                {sorted.map((blog, idx) => (
                  <GlassCard
                    key={blog._id}
                    blog={blog}
                    color={colorPalettes[idx % colorPalettes.length]}
                  />
                ))}
              </Masonry>
            ) : (
              <div
                className="rounded-3xl p-16 text-center backdrop-blur-xl border border-white/10"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
                }}
              >
                <p className="text-5xl mb-4">◈</p>
                <p className="text-2xl font-bold text-white mb-2">
                  No blogs found
                </p>
                <p className="text-white/50 mb-6">
                  Try adjusting your search criteria
                </p>
                <button
                  onClick={() => setSearch("")}
                  className="px-6 py-2 rounded-full text-sm font-bold text-white
                             transition-all duration-300"
                  style={{
                    background: "rgba(255, 0, 110, 0.2)",
                    border: "1px solid rgba(255, 0, 110, 0.4)",
                    color: "#ff6b9d",
                  }}
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      <style>{`
        .masonry-grid {
          display: grid;
          grid-auto-flow: dense;
          gap: 24px;
        }

        .masonry-grid-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        @media (max-width: 768px) {
          .masonry-grid {
            grid-template-columns: 1fr;
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

export default Dashboard
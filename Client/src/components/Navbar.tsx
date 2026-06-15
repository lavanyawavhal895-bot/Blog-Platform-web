import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{
          background: "rgba(15, 10, 30, 0.35)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-lg transition-all duration-300"
              style={{
                background: "linear-gradient(135deg,#ff006e,#8338ec)",
                boxShadow: "0 0 25px rgba(131,56,236,.55)",
              }}
            >
              ◈
            </div>

            <span className="text-xl font-black text-white hidden sm:block">
              Ink
              <span
                style={{
                  background:
                    "linear-gradient(90deg,#ff006e,#8338ec,#3a86ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Flow
              </span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/dashboard"
              className="text-white/70 hover:text-white transition-all duration-300"
            >
              Dashboard
            </Link>

            <Link
              to="/my-blogs"
              className="text-white/70 hover:text-white transition-all duration-300"
            >
              My Blogs
            </Link>
            <Link
              to="/profile"
              className="text-white/70 hover:text-white transition-all duration-300"
            >
              Profile
            </Link>
            {/* Admin Dashboard Conditional Route Node */}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-red-400 font-medium hover:text-red-300 transition-all duration-300 flex items-center gap-1"
              >
                🛡️ Admin Panel
              </Link>
            )}

            <Link
              to="/create-blog"
              className="relative px-8 py-3 rounded-full overflow-hidden transition-all duration-300 hover:-translate-y-1 active:scale-95"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,.95), rgba(220,225,230,.95))",
                border: "1px solid rgba(255,255,255,.8)",
                boxShadow: `
                  inset 0 2px 4px rgba(255,255,255,.9),
                  inset 0 -8px 16px rgba(0,0,0,.08),
                  0 12px 30px rgba(0,0,0,.15),
                  0 20px 40px rgba(0,255,255,.12)
                `,
              }}
            >
              <div
                className="absolute left-3 right-3 top-1 h-1/2 rounded-full"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,.95), transparent)",
                }}
              />

              <div
                className="absolute inset-x-5 bottom-0 h-3 rounded-full blur-md"
                style={{
                  background: "rgba(0,255,255,.25)",
                }}
              />

              <span className="relative z-50 font-semibold text-black">
                ✨ Write Blog
              </span>
            </Link>
          </div>

        <Link
                to="/profile"
                title={`Logged in as ${user?.username} (${user?.role || "user"})`}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm uppercase select-none"
                style={{
                  background:
                    user?.role === "admin"
                      ? "linear-gradient(135deg, #ff006e, #8338ec)"
                      : "linear-gradient(135deg,#00d4ff,#3a86ff)",
                  boxShadow:
                    user?.role === "admin"
                      ? "0 0 18px rgba(255,0,110,.5)"
                      : "0 0 18px rgba(58,134,255,.5)",
                }}
              >
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </Link>
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="hidden md:block px-5 py-2 rounded-full text-sm text-white transition-all duration-300 hover:bg-white/10"
              style={{
                background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(255,255,255,.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              Logout
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl text-white"
              style={{
                background: "rgba(255,255,255,.08)",
                backdropFilter: "blur(10px)",
              }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        
        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="md:hidden mt-4 rounded-3xl p-5"
            style={{
              background: "rgba(15, 10, 30, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            <div className="flex flex-col gap-4">
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white py-1"
              >
                Dashboard
              </Link>

              <Link
                to="/my-blogs"
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white py-1"
              >
                My Blogs
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white py-1"
              >
                Profile
              </Link>
              {/* Mobile View Admin Link */}
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="text-red-400 font-medium hover:text-red-300 py-1"
                >
                  🛡️ Admin Panel
                </Link>
              )}

              <Link
                to="/create-blog"
                onClick={() => setIsOpen(false)}
                className="relative text-center px-6 py-3 rounded-full overflow-hidden mt-2"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,.95), rgba(220,225,230,.95))",
                  border: "1px solid rgba(255,255,255,.8)",
                  boxShadow: `
                    inset 0 2px 4px rgba(255,255,255,.9),
                    inset 0 -8px 16px rgba(0,0,0,.08),
                    0 12px 30px rgba(0,0,0,.15)
                  `,
                }}
              >
                <span className="font-semibold text-black">
                  ✨ Write Blog
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-3 rounded-full text-white mt-1 text-center"
                style={{
                  background: "rgba(255,255,255,.05)",
                  border: "1px solid rgba(255,255,255,.08)",
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="h-20" />
    </>
  );
};

export default Navbar;
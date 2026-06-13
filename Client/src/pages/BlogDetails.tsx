import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { WebGLShader } from "../components/ui/WebGLShader";
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

const BlogDetails = () => {
  const { id } = useParams();

  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(
        `https://blog-platform-web-gqdd.onrender.com/api/blogs/${id}`
      );

      setBlog(res.data);
    } catch (error) {
      console.log(error);
    }
  };

if (!blog) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-3xl animate-pulse">
        Loading Article...
      </div>
    </div>
  );
}
const currentUser = JSON.parse(
  localStorage.getItem("user") || "{}"
);

const isOwner =
  currentUser.id === blog.author?._id;
  return (
  <div className="relative min-h-screen overflow-hidden text-white">
    <WebGLShader />

    <div className="relative z-10">

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 pt-12">

        <div className="flex flex-wrap gap-4 mb-8">

          <Link
            to="/dashboard"
            className="px-5 py-2 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition"
          >
            ← Dashboard
          </Link>

          <Link to="/my-blogs"
            className="px-5 py-2 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition"
          >
            My Blogs
          </Link>

        </div>

        {/* Featured Image */}
        {blog.image && (
          <div className="relative mb-12 group">
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-cyan-500/30 rounded-[40px]" />

            <div className="relative rounded-[40px] overflow-hidden border border-white/10 backdrop-blur-xl">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full max-h-[700px] object-cover group-hover:scale-105 transition duration-700"
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">

          {/* Article */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[32px] p-8 lg:p-12">

            <div className="inline-flex px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase bg-purple-500/20 text-purple-300 border border-purple-400/20 mb-6">
              Featured Article
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-8 text-sm text-slate-400">

              <span>
                👤 {blog.author?.username || "Anonymous"}
              </span>

              <span>
                📅 {new Date(blog.createdAt).toLocaleDateString()}
              </span>

              <span>
                📖 {Math.ceil(blog.content.split(" ").length / 200)} min read
              </span>

            </div>

            <div className="h-px bg-white/10 my-10" />

            <div className="prose prose-invert max-w-none">
              <div className="text-lg leading-9 whitespace-pre-wrap text-slate-200">
                {blog.content}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">

              <h3 className="font-bold text-xl mb-5">
                Blog Stats
              </h3>

              <div className="space-y-4">

                <div>
                  <p className="text-slate-400 text-sm">
                    Words
                  </p>

                  <p className="text-2xl font-bold">
                    {blog.content.split(" ").length}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">
                    Reading Time
                  </p>

                  <p className="text-2xl font-bold">
                    {Math.ceil(blog.content.split(" ").length / 200)} min
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">
                    Published
                  </p>

                  <p className="text-lg">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>

              </div>

            </div>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">

              <h3 className="font-bold text-xl mb-4">
                Author
              </h3>

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-xl font-bold">
                  {(blog.author?.username || "A")[0].toUpperCase()}
                </div>

                <div>
                  <p className="font-semibold">
                    {blog.author?.username || "Anonymous"}
                  </p>

                  <p className="text-sm text-slate-400">
                    Blog Author
                  </p>
                </div>

              </div>

            </div>

           {isOwner && (
  <Link
    to={`/edit-blog/${blog._id}`}
    className="block w-full text-center py-3 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/20 hover:bg-cyan-500/30 transition"
  >
    ✏️ Edit Blog
  </Link>
)}
          </div>

        </div>
      </div>
    </div>
  </div>
);
};

export default BlogDetails;
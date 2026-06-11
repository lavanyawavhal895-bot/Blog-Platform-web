import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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
        `http://localhost:5000/api/blogs/${id}`
      );

      setBlog(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-12 px-5"
      style={{
        backgroundColor: blog.backgroundColor,
        color: blog.textColor,
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Image */}
        {blog.image && (
          <div className="mb-10">
            <div className="rounded-3xl overflow-hidden p-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-pulse shadow-[0_0_40px_rgba(168,85,247,0.6)]">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-auto rounded-3xl object-contain"
              />
            </div>
          </div>
        )}

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          {blog.title}
        </h1>

        {/* Author */}
        <p className="mt-5 text-lg opacity-80">
          By {blog.author?.username || "Unknown"}
        </p>

        {/* Date */}
        <p className="mt-2 opacity-60">
          {new Date(blog.createdAt).toLocaleDateString()}
        </p>

        {/* Divider */}
        <div className="w-full h-[1px] bg-white/20 my-8"></div>

        {/* Content */}
        <div className="text-xl leading-relaxed whitespace-pre-wrap">
          {blog.content}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
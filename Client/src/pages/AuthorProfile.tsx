import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import apiClient from "../apiClient";

const AuthorProfile = () => {
  const { id } = useParams();

  const [author, setAuthor] = useState<any>(null);
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchAuthor();
      fetchBlogs();
    }
  }, [id]);

  const fetchAuthor = async () => {
    try {
      const res = await apiClient.get(`/users/${id}`);
      setAuthor(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await apiClient.get(`/blogs/author/${id}`);
      setBlogs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading Author...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Cover Image */}
      {author.coverImage && (
        <img
          src={author.coverImage}
          alt="Cover"
          className="w-full h-72 object-cover"
        />
      )}

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Profile Section */}
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">

          {author.profileImage ? (
            <img
              src={author.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-cyan-500"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-purple-600 flex items-center justify-center text-4xl font-bold">
              {author.username?.[0]?.toUpperCase()}
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold">
              {author.username}
            </h1>

            <p className="text-slate-400 mt-3">
              {author.bio}
            </p>

            <p className="mt-3 text-cyan-400">
              {blogs.length} Blogs Published
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 flex flex-wrap gap-4">
          {author.socialLinks?.github && (
            <a
              href={author.socialLinks.github}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400"
            >
              GitHub
            </a>
          )}

          {author.socialLinks?.linkedin && (
            <a
              href={author.socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400"
            >
              LinkedIn
            </a>
          )}

          {author.socialLinks?.twitter && (
            <a
              href={author.socialLinks.twitter}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400"
            >
              Twitter
            </a>
          )}

          {author.socialLinks?.instagram && (
            <a
              href={author.socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400"
            >
              Instagram
            </a>
          )}
        </div>

        {/* Blogs Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">
            Author Blogs
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blog/${blog._id}`}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500 transition"
              >
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-52 object-cover"
                  />
                )}

                <div className="p-5">
                  <h3 className="font-bold text-xl mb-2">
                    {blog.title}
                  </h3>

                  <p className="text-slate-400 line-clamp-3">
                    {blog.content}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthorProfile;
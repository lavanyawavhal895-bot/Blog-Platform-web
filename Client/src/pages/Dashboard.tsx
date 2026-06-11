import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Masonry from "react-masonry-css";

interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  backgroundColor: string;
  textColor: string;
  createdAt: string;
  author: {
    _id: string;
    username: string;
  };
}

const Dashboard = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/blogs/user/${user.id}`
      );

      setBlogs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBlog = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/blogs/${id}`
      );

      fetchBlogs();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-indigo-950 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-8 border-b border-slate-800">
        <div>
          <h1 className="text-4xl font-bold">
            Welcome, {user.username} 👋
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your luxury blogs
          </p>
        </div>

        <Link
          to="/create-blog"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition-all px-6 py-3 rounded-xl font-semibold shadow-lg"
        >
          + Create Blog
        </Link>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Search */}
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full p-4 mb-8 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:border-purple-500"
        />

        {filteredBlogs.length > 0 ? (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex gap-8"
            columnClassName="space-y-8"
          >
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="
                  rounded-3xl
                  overflow-hidden
                  border
                  border-purple-500/30
                  shadow-[0_0_25px_rgba(168,85,247,0.25)]
                  hover:shadow-[0_0_45px_rgba(168,85,247,0.6)]
                  hover:scale-[1.02]
                  transition-all
                  duration-500
                "
                style={{
                  backgroundColor:
                    blog.backgroundColor,
                  color: blog.textColor,
                }}
              >
                {/* Image */}
                {blog.image && (
                  <div className="p-3">
                    <div
                      className="
                        rounded-2xl
                        overflow-hidden
                        border
                        border-purple-500
                        shadow-[0_0_25px_rgba(168,85,247,0.5)]
                        hover:scale-105
                        transition-all
                        duration-500
                      "
                    >
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="
                          w-full
                          h-auto
                          object-cover
                          transition-transform
                          duration-700
                          hover:scale-110
                        "
                      />
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold break-words">
                    {blog.title}
                  </h2>

                  <p className="text-sm mt-2 opacity-80">
                    By {blog.author?.username}
                  </p>

                  <p className="text-sm mt-1 opacity-70">
                    {new Date(
                      blog.createdAt
                    ).toLocaleDateString()}
                  </p>

                  <p className="mt-4 line-clamp-4 break-words">
                    {blog.content}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-6">
                    <Link
                      to={`/blog/${blog._id}`}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white"
                    >
                      Read More
                    </Link>

                    <Link
                      to={`/edit-blog/${blog._id}`}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() =>
                        deleteBlog(blog._id)
                      }
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Masonry>
        ) : (
          <div className="text-center text-slate-400 mt-10 text-xl">
            No blogs found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
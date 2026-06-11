import { useEffect, useState } from "react";
import axios from "axios";

interface Blog {
  _id: string;
  title: string;
  content: string;
  image?: string;
  author?: {
    username: string;
  };
  backgroundColor: string;
  textColor: string;
}

const MyBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const user = JSON.parse(
          localStorage.getItem("user") || "{}"
        );

        const res = await axios.get(
          `http://localhost:5000/api/blogs/user/${user.id}`
        );

        setBlogs(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-4xl font-bold mb-8">
        My Blogs
      </h1>

      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="grid gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="rounded-3xl p-6 border border-slate-700 shadow-xl"
              style={{
                backgroundColor:
                  blog.backgroundColor,
                color: blog.textColor,
              }}
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-64 object-cover rounded-2xl mb-4"
                />
              )}

              <h2 className="text-2xl font-bold">
                {blog.title}
              </h2>

              <p className="mt-3">
                {blog.content}
              </p>

              <p className="mt-4 text-sm opacity-80">
                By {blog.author?.username}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
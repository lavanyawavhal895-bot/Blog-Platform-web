import { useState } from "react";
import axios from "axios";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const [backgroundColor, setBackgroundColor] =
    useState("#0B0B0B");

  const [textColor, setTextColor] =
    useState("#FFFFFF");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    try {
      const res = await axios.post(
        "http://localhost:5000/api/blogs",
        {
          title,
          content,
          image,
          backgroundColor,
          textColor,
          author: user.id,
        }
      );

      console.log(res.data);

      alert("Blog Created Successfully");

      setTitle("");
      setContent("");
      setImage("");
      setBackgroundColor("#0B0B0B");
      setTextColor("#FFFFFF");
    } catch (error: any) {
      console.log(error.response?.data);
      console.log(error);

      alert("Failed to create blog");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-4xl font-bold mb-8">
        Create Luxury Blog
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 outline-none"
          required
        />

        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) =>
            setImage(e.target.value)
          }
          className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 outline-none"
        />

        <select
          value={backgroundColor}
          onChange={(e) =>
            setBackgroundColor(e.target.value)
          }
          className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700"
        >
          <option value="#0B0B0B">
            Noir Black
          </option>
          <option value="#7B112C">
            Cherry Red
          </option>
          <option value="#3B0A0A">
            Maroon Noir
          </option>
          <option value="#0F3460">
            Deep Blue
          </option>
          <option value="#1B3B6F">
            Cosmos Blue
          </option>
          <option value="#8B6F47">
            Pale Brown
          </option>
        </select>

        <select
          value={textColor}
          onChange={(e) =>
            setTextColor(e.target.value)
          }
          className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700"
        >
          <option value="#FFFFFF">
            White
          </option>
          <option value="#F5F5DC">
            Cream
          </option>
          <option value="#D1D5DB">
            Silver
          </option>
          <option value="#FDE68A">
            Luxury Gold
          </option>
        </select>

        <textarea
          placeholder="Blog Content"
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          rows={8}
          className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 outline-none"
          required
        />

        {/* Preview */}

        <div
          className="rounded-3xl p-6 border border-slate-700 shadow-2xl"
          style={{
            backgroundColor,
            color: textColor,
          }}
        >
          {image && (
            <div className="rounded-2xl overflow-hidden mb-4 border border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:shadow-[0_0_45px_rgba(168,85,247,1)] transition duration-500">
              <img
                src={image}
                alt="Preview"
                className="w-full object-contain hover:scale-105 transition duration-500"
              />
            </div>
          )}

          <h2 className="text-3xl font-bold">
            {title ||
              "Your Luxury Blog Title"}
          </h2>

          <p className="mt-4 whitespace-pre-wrap">
            {content ||
              "Your blog content preview will appear here..."}
          </p>
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 rounded-xl font-semibold transition"
        >
          Publish Blog
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    backgroundColor: "#0B0B0B",
    textColor: "#FFFFFF",
  });

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

      setFormData({
        title: res.data.title || "",
        content: res.data.content || "",
        image: res.data.image || "",
        backgroundColor:
          res.data.backgroundColor || "#0B0B0B",
        textColor:
          res.data.textColor || "#FFFFFF",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      setUploading(true);

      const res = await axios.post(
        "http://localhost:5000/api/upload/image",
        uploadData
      );

      setFormData((prev) => ({
        ...prev,
        image: res.data.imageUrl,
      }));

      alert("Image Uploaded Successfully");
    } catch (error) {
      console.log(error);
      alert("Image Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/blogs/${id}`,
        formData
      );

      alert("Blog Updated Successfully");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-8 rounded-3xl w-full max-w-3xl border border-slate-700 shadow-2xl"
      >
        <h1 className="text-4xl text-white mb-8 font-bold">
          Edit Luxury Blog
        </h1>

        <input
          type="text"
          placeholder="Blog Title"
          value={formData.title}
          onChange={(e) =>
            setFormData({
              ...formData,
              title: e.target.value,
            })
          }
          className="w-full p-4 mb-4 rounded-xl bg-slate-800 text-white border border-slate-700"
          required
        />

        {/* IMAGE UPLOAD */}

        <div className="mb-4">
          <label className="block text-white mb-2">
            Upload New Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-4 rounded-xl bg-slate-800 text-white border border-slate-700"
          />

          {uploading && (
            <p className="mt-2 text-purple-400">
              Uploading image...
            </p>
          )}
        </div>

        <select
          value={formData.backgroundColor}
          onChange={(e) =>
            setFormData({
              ...formData,
              backgroundColor: e.target.value,
            })
          }
          className="w-full p-4 mb-4 rounded-xl bg-slate-800 text-white border border-slate-700"
        >
          <option value="#0B0B0B">Noir Black</option>
          <option value="#7B112C">Cherry Red</option>
          <option value="#3B0A0A">Maroon Noir</option>
          <option value="#0F3460">Deep Blue</option>
          <option value="#1B3B6F">Cosmos Blue</option>
          <option value="#8B6F47">Pale Brown</option>
        </select>

        <select
          value={formData.textColor}
          onChange={(e) =>
            setFormData({
              ...formData,
              textColor: e.target.value,
            })
          }
          className="w-full p-4 mb-6 rounded-xl bg-slate-800 text-white border border-slate-700"
        >
          <option value="#FFFFFF">White</option>
          <option value="#F5F5DC">Cream</option>
          <option value="#D1D5DB">Silver</option>
          <option value="#FDE68A">Luxury Gold</option>
        </select>

        {/* LIVE PREVIEW */}

        <div
          className="rounded-3xl p-6 mb-6 border border-slate-700 shadow-xl"
          style={{
            backgroundColor:
              formData.backgroundColor,
            color: formData.textColor,
          }}
        >
          {formData.image && (
            <div className="rounded-2xl overflow-hidden mb-4 border border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.6)]">
              <img
                src={formData.image}
                alt="Preview"
                className="w-full object-contain"
              />
            </div>
          )}

          <h2 className="text-3xl font-bold">
            {formData.title || "Blog Title"}
          </h2>

          <p className="mt-4 whitespace-pre-wrap">
            {formData.content ||
              "Blog content preview..."}
          </p>
        </div>

        <textarea
          placeholder="Blog Content"
          value={formData.content}
          onChange={(e) =>
            setFormData({
              ...formData,
              content: e.target.value,
            })
          }
          rows={8}
          className="w-full p-4 rounded-xl bg-slate-800 text-white border border-slate-700"
          required
        />

        <button
          type="submit"
          disabled={uploading}
          className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 rounded-xl font-semibold text-white transition disabled:opacity-50"
        >
          {uploading
            ? "Uploading..."
            : "Update Blog"}
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
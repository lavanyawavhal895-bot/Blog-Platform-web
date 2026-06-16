import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react";
import { WebGLShader } from "../components/ui/WebGLShader";
// Injected your newly crafted Premium UX UI Components
import { Modal } from "../components/ui/Modal";
import { ToastContainer } from "../components/ui/ToastContainer";
import { ToastMessage } from "../components/ui/Toast";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);
  const [isTextDropdownOpen, setIsTextDropdownOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);

  // UX Polish State Matrices
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const textDropdownRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const fontDropdownRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    textColor: "#FFFFFF",
    fontStyle: "ui-sans-serif, system-ui, sans-serif",
  });

  const textOptions = [
    { value: "#FFFFFF", label: "White" },
    { value: "#F5F5DC", label: "Cream" },
    { value: "#D1D5DB", label: "Silver" },
    { value: "#FDE68A", label: "Luxury Gold" },
  ];

  const fontStyleOptions = [
    { label: "Standard Modern", value: "ui-sans-serif, system-ui, sans-serif" },
    { label: "Elegant Editorial", value: "ui-serif, Georgia, Cambria, serif" },
    { label: "Monospace Classic", value: "ui-monospace, SFMono-Regular, Menlo, monospace" },
    { label: "Playfair Luxury", value: "'Playfair Display', serif" },
    { label: "Cinzel Majestic", value: "'Cinzel', serif" },
    { label: "Montserrat Geometric", value: "'Montserrat', sans-serif" },
    { label: "Cormorant Traditional", value: "'Cormorant Garamond', serif" },
    { label: "Inter Sharp Black", value: "'Inter', sans-serif", weight: "700" },
  ];

  // Toast dispatch utility abstraction handler
  const addToast = (text: string, type: "success" | "error" | "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    if (id) {
      fetchBlog();
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (textDropdownRef.current && !textDropdownRef.current.contains(event.target as Node)) {
        setIsTextDropdownOpen(false);
      }
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setIsEmojiPickerOpen(false);
      }
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(event.target as Node)) {
        setIsFontDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`https://blog-platform-web-gqdd.onrender.com/api/blogs/${id}`);

      setFormData({
        title: res.data.title || "",
        content: res.data.content || "",
        image: res.data.image || "",
        textColor: res.data.textColor || "#FFFFFF",
        fontStyle: res.data.fontStyle || "ui-sans-serif, system-ui, sans-serif",
      });
    } catch (error) {
      console.log(error);
      addToast("Failed to fetch initial blog record data data stream.", "error");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      setUploading(true);
      const token = sessionStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.post("https://blog-platform-web-gqdd.onrender.com/api/upload/image", uploadData, config);

      setFormData((prev) => ({
        ...prev,
        image: res.data.imageUrl,
      }));

      addToast("Hero banner asset saved successfully", "success");
    } catch (error) {
      console.log(error);
      addToast("Image server storage handshake failure.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const text = formData.content;
    const emoji = emojiData.emoji;

    const updatedContent = text.substring(0, startPos) + emoji + text.substring(endPos);

    setFormData({
      ...formData,
      content: updatedContent,
    });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(startPos + emoji.length, startPos + emoji.length);
    }, 0);
  };

  const changeSelectedFont = (fontFamilyValue: string) => {
    setFormData({
      ...formData,
      fontStyle: fontFamilyValue,
    });
    setIsFontDropdownOpen(false);
  };

  const handleFormSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();
    // Open verification confirmation modal window instead of triggering raw database alterations directly
    setIsModalOpen(true);
  };

  const executeUpdatePayload = async () => {
    setIsModalOpen(false);
    try {
      const token = sessionStorage.getItem("token");
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`https://blog-platform-web-gqdd.onrender.com/api/blogs/${id}`, formData, config);
      
      addToast("Blog documentation compilation saved successfully!", "success");
      
      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 1000);
    } catch (error) {
      console.log(error);
      addToast("System update transmission failure code 403/500.", "error");
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-slate-950 flex items-center justify-center p-6 overflow-x-hidden">
      
      {/* Dynamic Interactive Background Mouse Canvas Instance */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <WebGLShader />
      </div>

      <form
        onSubmit={handleFormSubmitClick}
        className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl w-full max-w-3xl border border-slate-700/60 shadow-2xl relative z-10"
      >
        <h1 className="text-4xl text-white mb-8 font-bold">Edit  Blog</h1>

        <input
          type="text"
          placeholder="Blog Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-4 mb-4 rounded-xl bg-slate-800/80 text-white border border-slate-700/80 outline-none focus:border-slate-500 transition"
          required
        />

        {/* IMAGE UPLOAD */}
        <div className="mb-4">
          <label className="block text-white mb-2">Upload New Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-4 rounded-xl bg-slate-800/80 text-white border border-slate-700/80 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer"
          />
          {uploading && <p className="mt-2 text-purple-400 animate-pulse">Uploading image...</p>}
        </div>

        {/* TEXT COLOR DROP-DOWN LIST */}
        <div className="mb-6 relative z-30 max-w-xs">
          <div className="relative" ref={textDropdownRef}>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
              Text Color
            </label>
            <button
              type="button"
              onClick={() => setIsTextDropdownOpen(!isTextDropdownOpen)}
              className="w-full text-left bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:border-slate-500 transition flex justify-between items-center"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: formData.textColor }} />
                <span>{textOptions.find((o) => o.value === formData.textColor)?.label}</span>
              </div>
              <span className={`text-xs text-slate-400 transition-transform duration-300 ${isTextDropdownOpen ? "rotate-180" : "rotate-0"}`}>
                ▼
              </span>
            </button>

            {isTextDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-full bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
                {textOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, textColor: option.value });
                      setIsTextDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors text-white hover:bg-white/5 flex items-center gap-2.5
                      ${formData.textColor === option.value ? "bg-white/10 font-semibold text-purple-400" : ""}`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: option.value }} />
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* LIVE PREVIEW CONTAINER */}
        <div
          className="rounded-3xl p-6 mb-6 border border-slate-700/60 bg-black/40 shadow-xl relative z-10 transition-all"
          style={{ 
            color: formData.textColor, 
            fontFamily: formData.fontStyle,
            fontWeight: fontStyleOptions.find(o => o.value === formData.fontStyle)?.weight || "normal"
          }}
        >
          {formData.image && (
            <div className="rounded-2xl overflow-hidden mb-4 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <img src={formData.image} alt="Preview" className="w-full object-contain" />
            </div>
          )}
          <h2 className="text-3xl font-bold tracking-tight">{formData.title || "Blog Title"}</h2>
          <p className="mt-4 whitespace-pre-wrap leading-relaxed">{formData.content || "Blog content preview..."}</p>
        </div>

        {/* UTILITY ACTION STRIP */}
        <div className="mb-2 flex items-center justify-between bg-slate-800/80 px-4 py-2 rounded-t-xl border-t border-x border-slate-700/80 relative z-25">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider select-none">
            Blog Body Content
          </span>
          
          <div className="flex items-center gap-2">
            <div className="relative" ref={fontDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsFontDropdownOpen(!isFontDropdownOpen);
                  setIsEmojiPickerOpen(false);
                }}
                className="text-xs font-semibold px-3 py-1.5 bg-slate-700 text-white border border-slate-600 rounded-lg hover:bg-slate-600 transition flex items-center gap-1.5"
              >
                🔤 Font: {fontStyleOptions.find(o => o.value === formData.fontStyle)?.label.split(" ")[0]} ▼
              </button>

              {isFontDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl overflow-hidden shadow-2xl max-h-64 overflow-y-auto z-50">
                  {fontStyleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => changeSelectedFont(option.value)}
                      className={`w-full text-left px-4 py-3 text-xs text-white hover:bg-white/10 border-b border-white/5 last:border-0 transition-colors flex flex-col gap-0.5
                        ${formData.fontStyle === option.value ? "bg-white/5 text-purple-400 font-semibold" : ""}`}
                    >
                      <span>{option.label}</span>
                      <span className="text-[10px] text-slate-400 opacity-80" style={{ fontFamily: option.value }}>
                         Typography Preview
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={emojiPickerRef}>
              <button
                type="button"
                onClick={() => {
                  setIsEmojiPickerOpen(!isEmojiPickerOpen);
                  setIsFontDropdownOpen(false);
                }}
                className="text-xs font-semibold px-3 py-1.5 bg-slate-700 text-white border border-slate-600 rounded-lg hover:bg-slate-600 transition flex items-center gap-1.5"
              >
                😀 Add Emoji
              </button>

              {isEmojiPickerOpen && (
                <div className="absolute right-0 mt-2 shadow-2xl border border-slate-700 rounded-xl overflow-hidden z-50">
                  <EmojiPicker
                    theme={Theme.DARK}
                    onEmojiClick={handleEmojiClick}
                    lazyLoadEmojis={true}
                    searchPlaceHolder="Search emojis..."
                    width={320}
                    height={400}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT INPUT TEXTAREA */}
        <textarea
          ref={textareaRef}
          placeholder="Blog Content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={8}
          className="w-full p-4 rounded-b-xl rounded-t-none bg-slate-800/80 text-white border border-slate-700/80 outline-none focus:border-slate-500 transition relative z-10"
          style={{ 
            fontFamily: formData.fontStyle,
            fontWeight: fontStyleOptions.find(o => o.value === formData.fontStyle)?.weight || "normal"
          }}
          required
        />

        <button
          type="submit"
          disabled={uploading}
          className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 rounded-xl font-semibold text-white transition disabled:opacity-50 relative z-10"
        >
          {uploading ? "Uploading..." : "Update Blog"}
        </button>
      </form>

      {/* Global Toast Stack Layer Overlay Node */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Luxury Intercept Confirmation Modal Hook */}
      <Modal
        isOpen={isModalOpen}
        title="Save Changes?"
        message="Are you sure you want to write these modifications to the database? This action will update the live public post feed directly."
        confirmLabel="Save Modifications"
        cancelLabel="Discard"
        variant="info"
        onConfirm={executeUpdatePayload}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default EditBlog;
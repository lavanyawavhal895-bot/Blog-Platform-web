import { useState, useRef, useEffect } from "react";
import axios from "axios";
import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react";
// Injected your design system WebGL Shader core component
import { WebGLShader } from "../components/ui/WebGLShader";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [fontStyle, setFontStyle] = useState("ui-sans-serif, system-ui, sans-serif");

  const [isTextDropdownOpen, setIsTextDropdownOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);

  const textDropdownRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const fontDropdownRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
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
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("http://localhost:5000/api/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImage(res.data.imageUrl);
      alert("Image Uploaded Successfully");
    } catch (error) {
      console.log(error);
      alert("Image Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const emoji = emojiData.emoji;

    const updatedContent = content.substring(0, startPos) + emoji + content.substring(endPos);
    setContent(updatedContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(startPos + emoji.length, startPos + emoji.length);
    }, 0);
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

  try {
    await axios.post(
      "http://localhost:5000/api/blogs",
      {
        title,
        content,
        image,
        textColor,
        fontStyle,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Blog Created Successfully");

    setTitle("");
    setContent("");
    setImage("");
    setTextColor("#FFFFFF");
    setFontStyle("ui-sans-serif, system-ui, sans-serif");
  } catch (error: any) {
    console.log(error);
    alert(error.response?.data?.message || "Failed to create blog");
  }
};

  return (
    // Fixed relative positioning node to hold the interactive background canvas layer layout bounds safely
    <div className="min-h-screen w-full relative bg-slate-950 text-white p-10 flex items-center justify-center overflow-x-hidden">
      
      {/* Dynamic Interactive Background Mouse Canvas Instance */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <WebGLShader />
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl w-full max-w-3xl border border-slate-700/60 shadow-2xl relative space-y-5 z-10"
      >
        <h1 className="text-4xl font-bold tracking-tight">Create Luxury Blog</h1>

        {/* Title */}
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-4 rounded-xl bg-slate-800/80 text-white border border-slate-700/80 outline-none focus:border-slate-500 transition"
          required
        />

        {/* Image Upload */}
        <div>
          <label className="block mb-2 font-medium text-slate-300">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer"
          />
          {uploading && <p className="mt-2 text-purple-400 animate-pulse">Uploading image...</p>}
        </div>

        {/* TEXT COLOR DROP-DOWN LIST */}
        <div className="relative z-30 max-w-xs" ref={textDropdownRef}>
          <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
            Text Color
          </label>
          <button
            type="button"
            onClick={() => setIsTextDropdownOpen(!isTextDropdownOpen)}
            className="w-full text-left bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:border-slate-500 transition flex justify-between items-center"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: textColor }} />
              <span>{textOptions.find((o) => o.value === textColor)?.label}</span>
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
                    setTextColor(option.value);
                    setIsTextDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors text-white hover:bg-white/5 flex items-center gap-2.5
                    ${textColor === option.value ? "bg-white/10 font-semibold text-purple-400" : ""}`}
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: option.value }} />
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* LIVE PREVIEW CONTAINER */}
        <div
          className="rounded-3xl p-6 border border-slate-700/60 bg-black/40 shadow-xl relative z-10 transition-all"
          style={{ 
            color: textColor, 
            fontFamily: fontStyle,
            fontWeight: fontStyleOptions.find(o => o.value === fontStyle)?.weight || "normal"
          }}
        >
          {image && (
            <div className="rounded-2xl overflow-hidden mb-4 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <img src={image} alt="Preview" className="w-full object-contain" />
            </div>
          )}
          <h2 className="text-3xl font-bold tracking-tight">{title || "Your Luxury Blog Title"}</h2>
          <p className="mt-4 whitespace-pre-wrap leading-relaxed">{content || "Your blog content preview will appear here..."}</p>
        </div>

        {/* EDITOR STRIP TOOLBAR */}
        <div className="flex items-center justify-between bg-slate-800/80 px-4 py-2 rounded-t-xl border-t border-x border-slate-700/80 relative z-25">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider select-none">
            Blog Body Content
          </span>
          
          <div className="flex items-center gap-2">
            {/* Font Style drop-down list menu container */}
            <div className="relative" ref={fontDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsFontDropdownOpen(!isFontDropdownOpen);
                  setIsEmojiPickerOpen(false);
                }}
                className="text-xs font-semibold px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition flex items-center gap-1.5"
              >
                🔤 Font: {fontStyleOptions.find(o => o.value === fontStyle)?.label.split(" ")[0]} ▼
              </button>

              {isFontDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl overflow-hidden shadow-2xl max-h-64 overflow-y-auto z-50">
                  {fontStyleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFontStyle(option.value);
                        setIsFontDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-xs text-white hover:bg-white/10 border-b border-white/5 last:border-0 transition-colors flex flex-col gap-0.5
                        ${fontStyle === option.value ? "bg-white/5 text-purple-400 font-semibold" : ""}`}
                    >
                      <span>{option.label}</span>
                      <span className="text-[10px] text-slate-400 opacity-80" style={{ fontFamily: option.value }}>
                        Luxury Typography Preview
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Unlimited Emoji Picker Portal */}
            <div className="relative" ref={emojiPickerRef}>
              <button
                type="button"
                onClick={() => {
                  setIsEmojiPickerOpen(!isEmojiPickerOpen);
                  setIsFontDropdownOpen(false);
                }}
                className="text-xs font-semibold px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition flex items-center gap-1.5"
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

        {/* Content input text area fields */}
        <textarea
          ref={textareaRef}
          placeholder="Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="w-full p-4 mt-0! rounded-b-xl rounded-t-none bg-slate-800/80 text-white border border-slate-700/80 outline-none focus:border-slate-500 transition relative z-10"
          style={{ 
            fontFamily: fontStyle,
            fontWeight: fontStyleOptions.find(o => o.value === fontStyle)?.weight || "normal"
          }}
          required
        />

        {/* Submit Action Controller */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 rounded-xl font-semibold transition disabled:opacity-50 relative z-10"
        >
          {uploading ? "Uploading..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
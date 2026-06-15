import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for re-login navigation
import { 
  Camera, 
  Image as ImageIcon, 
  User, 
  FileText, 
  Globe, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle 
} from "lucide-react";
import apiClient from "../apiClient";
import ShaderBackground from "../components/ui/ShaderBackground";

// Fallback Custom SVG Icons to bypass lucide brand version issues completely
const GithubIcon = () => (
  <svg className="w-5 h-5 text-white inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
);

const LinkedinIcon = () => (
  <svg className="w-5 h-5 text-blue-400 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5 text-pink-400 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5 text-sky-400 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form Inputs State
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");

  // Security States (Password Change)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  // Fetch Profile Data
  const fetchProfile = async () => {
    try {
      const res = await apiClient.get("/profile");
      setProfile(res.data);
      
      setUsername(res.data.username || "");
      setBio(res.data.bio || "");
      setGithub(res.data.socialLinks?.github || "");
      setLinkedin(res.data.socialLinks?.linkedin || "");
      setPortfolio(res.data.socialLinks?.portfolio || "");
      setTwitter(res.data.socialLinks?.twitter || "");
      setInstagram(res.data.socialLinks?.instagram || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle Profile Image Upload with Size Validation
  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await apiClient.post("/upload/image", formData);
      const imageUrl = uploadRes.data.imageUrl;

      await apiClient.put("/profile", {
        profileImage: imageUrl,
      });

      fetchProfile();
      alert("Profile image updated! 👤");
    } catch (error) {
      console.error(error);
      alert("Profile image upload failed");
    }
  };

  // Handle Cover Image Upload with Size Validation
  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await apiClient.post("/upload/image", formData);
      const imageUrl = uploadRes.data.imageUrl;

      await apiClient.put("/profile", {
        coverImage: imageUrl,
      });

      fetchProfile();
      alert("Cover image updated! 🖼️");
    } catch (error) {
      console.error(error);
      alert("Cover image upload failed");
    }
  };

  // Password Strength Check Logic
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: "", color: "text-slate-400" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[!@#$%^&*]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;

    if (score <= 2) return { label: "🔴 Weak", color: "text-red-400" };
    if (score === 3) return { label: "🟡 Medium", color: "text-yellow-400" };
    return { label: "🟢 Strong", color: "text-green-400" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  // Handle Profile Update Save with URL Validation Check
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    // URL Validation Guard for Social Links
    if (github && !github.startsWith("http")) return alert("GitHub URL invalid. Must start with http:// or https://");
    if (linkedin && !linkedin.startsWith("http")) return alert("LinkedIn URL invalid. Must start with http:// or https://");
    if (portfolio && !portfolio.startsWith("http")) return alert("Portfolio URL invalid. Must start with http:// or https://");
    if (twitter && !twitter.startsWith("http")) return alert("Twitter/X URL invalid. Must start with http:// or https://");
    if (instagram && !instagram.startsWith("http")) return alert("Instagram URL invalid. Must start with http:// or https://");

    try {
      await apiClient.put("/profile", {
        username,
        bio,
        socialLinks: {
          github,
          linkedin,
          portfolio,
          twitter,
          instagram,
        },
      });
      alert("Profile updated successfully! 🎉");
      setIsEditing(false);
      fetchProfile();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  // Handle Password Change with Automatic Re-login Flow
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setPasswordMessage("❌ New password must be at least 8 characters!");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordMessage("❌ New password must be different from current password!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("❌ New passwords do not match!");
      return;
    }

    try {
      await apiClient.put("/profile/change-password", {
        currentPassword,
        newPassword,
      });
      
      setPasswordMessage("✅ Password updated successfully! Logging out...");
      alert("Password changed successfully. Please login again with your new credentials! 🔐");
      
      // Clear token and force re-login for security best practice
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error: any) {
      setPasswordMessage(error.response?.data?.message || "❌ Failed to change password");
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center text-white">
        <ShaderBackground />
        <div className="relative font-bold text-2xl animate-pulse">Loading Profile...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full p-4 md:p-8 flex justify-center items-start overflow-y-auto">
      <ShaderBackground />

      {/* Hidden File Inputs for Upload */}
      <input
        type="file"
        accept="image/*"
        id="profileImageInput"
        className="hidden"
        onChange={handleProfileImageUpload}
      />
      <input
        type="file"
        accept="image/*"
        id="coverImageInput"
        className="hidden"
        onChange={handleCoverImageUpload}
      />

      <div className="relative w-full max-w-5xl space-y-8 my-6">
        
        {/* SECTION 1: COVER BANNER & PROFILE HEADER */}
        <div className="relative rounded-3xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
          <div className="relative h-48 md:h-64 bg-gradient-to-r from-purple-600/50 to-blue-600/50 flex items-center justify-center">
            {profile?.coverImage ? (
              <img src={profile.coverImage} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="text-white/30 text-sm tracking-widest uppercase">No Cover Banner Uploaded</div>
            )}
            <button 
              type="button"
              onClick={() => document.getElementById("coverImageInput")?.click()}
              className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 p-3 rounded-full text-white transition-colors"
            >
              <ImageIcon size={18} />
            </button>
          </div>

          <div className="p-6 pt-0 flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 relative z-10">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 border-4 border-slate-950 flex items-center justify-center text-5xl font-bold text-white shadow-lg overflow-hidden">
                {profile?.profileImage ? (
                  <img src={profile.profileImage} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  profile?.username?.charAt(0)?.toUpperCase()
                )}
              </div>
              <button
                type="button"
                onClick={() => document.getElementById("profileImageInput")?.click()}
                className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 p-2.5 rounded-full text-white border border-white/10 shadow-md transition-colors"
              >
                <Camera size={16} />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left text-white mt-4 md:mt-0">
              <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                <h1 className="text-3xl font-bold tracking-wide">{profile?.username}</h1>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/10 border border-white/20 inline-flex items-center gap-1 w-max mx-auto md:mx-0">
                  <CheckCircle size={12} className="text-purple-400" /> {profile?.role?.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-300 text-sm mt-1">{profile?.email}</p>
            </div>

            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all text-sm"
            >
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* SECTION 2: EDIT PROFILE FORM OR VIEW DESIGN */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="w-full space-y-6">
            <div className="p-6 md:p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><User size={20}/> Edit Account Info</h2>
              <div className="space-y-2">
                <label className="text-slate-300 text-sm">Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-300 text-sm">Bio</label>
                <textarea 
                  rows={4} 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..." 
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>
            </div>

            <div className="p-6 md:p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl space-y-6">
              <h2 className="text-xl font-bold text-white">🌐 Social Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-2 pr-4">
                  <span className="p-2 bg-slate-800 rounded-lg text-white flex items-center justify-center"><GithubIcon /></span>
                  <input placeholder="GitHub URL" value={github} onChange={(e)=>setGithub(e.target.value)} className="flex-1 bg-transparent border-none text-white focus:outline-none text-sm" />
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-2 pr-4">
                  <span className="p-2 bg-blue-900 rounded-lg text-white flex items-center justify-center"><LinkedinIcon /></span>
                  <input placeholder="LinkedIn URL" value={linkedin} onChange={(e)=>setLinkedin(e.target.value)} className="flex-1 bg-transparent border-none text-white focus:outline-none text-sm" />
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-2 pr-4">
                  <span className="p-2 bg-emerald-900 rounded-lg text-white"><Globe size={18}/></span>
                  <input placeholder="Portfolio Website URL" value={portfolio} onChange={(e)=>setPortfolio(e.target.value)} className="flex-1 bg-transparent border-none text-white focus:outline-none text-sm" />
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-2 pr-4">
                  <span className="p-2 bg-sky-900 rounded-lg text-white flex items-center justify-center"><TwitterIcon /></span>
                  <input placeholder="Twitter/X URL" value={twitter} onChange={(e)=>setTwitter(e.target.value)} className="flex-1 bg-transparent border-none text-white focus:outline-none text-sm" />
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-2 pr-4 md:col-span-2">
                  <span className="p-2 bg-pink-900 rounded-lg text-white flex items-center justify-center"><InstagramIcon /></span>
                  <input placeholder="Instagram URL" value={instagram} onChange={(e)=>setInstagram(e.target.value)} className="flex-1 bg-transparent border-none text-white focus:outline-none text-sm" />
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">
                Save All Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="p-6 md:p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText size={20}/> About Me</h3>
                <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line">
                  {profile?.bio || "No bio added yet. Click on Edit Profile to write something cool!"}
                </p>
              </div>

              <div className="p-6 md:p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl text-white space-y-4">
                <h3 className="text-xl font-bold">Connect with Me</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile?.socialLinks?.github && (
                    <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                      <GithubIcon /> <span className="text-xs truncate">GitHub</span>
                    </a>
                  )}
                  {profile?.socialLinks?.linkedin && (
                    <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                      <LinkedinIcon /> <span className="text-xs truncate">LinkedIn</span>
                    </a>
                  )}
                  {profile?.socialLinks?.portfolio && (
                    <a href={profile.socialLinks.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                      <Globe size={18} className="text-emerald-400" /> <span className="text-xs truncate">Portfolio</span>
                    </a>
                  )}
                  {profile?.socialLinks?.twitter && (
                    <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                      <TwitterIcon /> <span className="text-xs truncate">Twitter / X</span>
                    </a>
                  )}
                  {profile?.socialLinks?.instagram && (
                    <a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                      <InstagramIcon /> <span className="text-xs truncate">Instagram</span>
                    </a>
                  )}
                  {!profile?.socialLinks?.github && 
                   !profile?.socialLinks?.linkedin && 
                   !profile?.socialLinks?.portfolio && 
                   !profile?.socialLinks?.twitter && 
                   !profile?.socialLinks?.instagram && (
                    <p className="text-slate-400 text-sm">No social media profiles added yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl text-white space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2"><Lock size={18}/> Update Password</h3>
                
                <form onSubmit={handlePasswordUpdate} className="space-y-3">
                  <div className="relative">
                    <input 
                      type={showCurrentPassword ? "text" : "password"} 
                      placeholder="Current Password" 
                      value={currentPassword}
                      onChange={(e)=>setCurrentPassword(e.target.value)}
                      required
                      className="w-full p-3 pr-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button type="button" onClick={()=>setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-3 text-slate-400">
                      {showCurrentPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>

                  <div className="relative">
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      placeholder="New Password" 
                      value={newPassword}
                      onChange={(e)=>setNewPassword(e.target.value)}
                      required
                      className="w-full p-3 pr-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button type="button" onClick={()=>setShowNewPassword(!showNewPassword)} className="absolute right-3 top-3 text-slate-400">
                      {showNewPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>

                  <input 
                    type="password" 
                    placeholder="Confirm New Password" 
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />

                  {newPassword && (
                    <div className="text-xs pt-1">
                      Strength: <span className={`font-bold ${passwordStrength.color}`}>{passwordStrength.label}</span>
                    </div>
                  )}

                  <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-sm font-bold transition-transform active:scale-95">
                    Update Security
                  </button>
                </form>

                {passwordMessage && (
                  <p className="text-center text-xs pt-2 text-slate-300 font-medium">{passwordMessage}</p>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
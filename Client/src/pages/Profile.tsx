import { useEffect, useState } from "react";
import apiClient from "../apiClient";

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get("/profile");
        setProfile(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">

        <div className="h-56 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500" />

        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-blue-500 border-4 border-slate-950 -mt-16 flex items-center justify-center text-4xl font-bold">
            {profile?.username?.charAt(0)?.toUpperCase()}
          </div>

          <h1 className="text-3xl font-bold mt-4">
            {profile.username}
          </h1>

          <p className="text-gray-400">
            {profile.email}
          </p>

          <p className="mt-2 inline-block px-3 py-1 rounded-full bg-purple-600">
            {profile.role}
          </p>
        </div>

        <div className="mt-8 bg-slate-900 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-3">Bio</h2>
          <p className="text-gray-300">
            {profile.bio || "No bio added yet."}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Profile;
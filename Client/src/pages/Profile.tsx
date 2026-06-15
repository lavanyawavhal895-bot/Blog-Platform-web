import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Cover */}
        <div className="h-56 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500" />

        {/* Profile Section */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-blue-500 border-4 border-slate-950 -mt-16 flex items-center justify-center text-4xl font-bold">
            {user?.username?.charAt(0)?.toUpperCase()}
          </div>

          <h1 className="text-3xl font-bold mt-4">
            {user?.username}
          </h1>

          <p className="text-gray-400">
            {user?.email}
          </p>

          <p className="mt-2 inline-block px-3 py-1 rounded-full bg-purple-600">
            {user?.role}
          </p>
        </div>

        {/* Bio */}
        <div className="mt-8 bg-slate-900 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-3">Bio</h2>
          <p className="text-gray-300">
            No bio added yet.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Profile;
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen p-10 text-white">
      <h1 className="text-4xl font-bold mb-6">My Profile</h1>

      <div className="bg-slate-900 p-6 rounded-xl max-w-md">
        <p>
          <strong>Username:</strong> {user?.username}
        </p>

        <p>
          <strong>Email:</strong> {user?.email}
        </p>

        <p>
          <strong>Role:</strong> {user?.role}
        </p>
      </div>
    </div>
  );
};

export default Profile;
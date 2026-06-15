import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, token, loading } = useAuth();

  return (
    <div className="min-h-screen p-10 text-white">
      <pre>
        {JSON.stringify(
          {
            loading,
            token,
            user,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
};

export default Profile;
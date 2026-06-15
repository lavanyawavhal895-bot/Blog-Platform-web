import { useEffect } from "react";

const Profile = () => {
  useEffect(() => {
    console.log("PROFILE PAGE LOADED");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <h1 className="text-4xl font-bold">
        My Profile
      </h1>
    </div>
  );
};

export default Profile;
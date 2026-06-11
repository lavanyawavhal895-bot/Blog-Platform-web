import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white px-8 py-4 flex justify-between">
      <Link to="/dashboard">
        Blog CMS
      </Link>

      <div className="flex gap-4">
        <Link to="/dashboard">
          Dashboard
        </Link>

       

        <button
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
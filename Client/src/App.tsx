import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <AppRoutes />
    </>
  );
}

export default App;
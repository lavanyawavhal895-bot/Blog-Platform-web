import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

const AppContent = () => {
  const location = useLocation();

  const hideNavbar =
  location.pathname === "/login" ||
  location.pathname === "/register" ||
  location.pathname === "/forgot-password" ||
  location.pathname.startsWith("/reset-password");
  return (
    <div className="min-h-screen">
      {!hideNavbar && <Navbar />}
      <main>
        <AppRoutes />
      </main>
    </div>
  );
};

function App() {
  return (
   
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    
  );
}

export default App;
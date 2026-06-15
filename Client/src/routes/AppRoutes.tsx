import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import CreateBlog from "../pages/CreateBlog";
import MyBlogs from "../pages/MyBlogs";
import BlogDetails from "../pages/BlogDetails";
import EditBlog from "../pages/EditBlog";
import Profile from "../pages/Profile"; // NEW

import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

      {/* Protected User Routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} /> {/* NEW */}
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/my-blogs" element={<MyBlogs />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/edit-blog/:id" element={<EditBlog />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* 404 */}
   {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center text-red-500 text-4xl">
                404 ROUTE HIT
              </div>
            }
          />
    </Routes>
  );
};

export default AppRoutes;
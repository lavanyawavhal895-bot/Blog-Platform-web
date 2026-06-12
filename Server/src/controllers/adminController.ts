import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import User from "../models/User";
import Blog from "../models/Blog";

// 1. Get Comprehensive Analytics Data Stack for Recharts & Status Counters
export const getAdminStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();

    // Aggregate counts of blogs that have an active image string present
    const totalImagesUploaded = await Blog.countDocuments({ image: { $ne: "", $exists: true } });

    // Calculate dynamic milestone dates
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const blogsCreatedThisMonth = await Blog.countDocuments({
      createdAt: { $gte: startOfCurrentMonth }
    });

    // Aggregate dynamic time-series registration metrics over the past 6 months for Recharts
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyDataAggregation = await Blog.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          blogsCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Format the raw aggregation data cleanly for frontend Recharts consumption
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedChartData = monthlyDataAggregation.map(item => ({
      name: `${monthNames[item._id.month - 1]} ${item._id.year.toString().slice(-2)}`,
      Blogs: item.blogsCount
    }));

    return res.status(200).json({
      summary: {
        totalUsers,
        totalBlogs,
        totalImagesUploaded,
        blogsCreatedThisMonth,
      },
      chartData: formattedChartData
    });
  } catch (error) {
    console.error("Admin Analytics Stats Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 2. Read and Search/Filter all Platform Users
export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const searchQuery = req.query.search as string;
    let filterCondition = {};

    if (searchQuery) {
      filterCondition = {
        $or: [
          { username: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } }
        ]
      };
    }

    const users = await User.find(filterCondition).select("-password").sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (error) {
    console.error("Admin Get Users Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 3. Mutate or Elevate User Account Roles (User ↔ Admin swap toggle)
export const adminUpdateUserRole = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role assignment specified" });
    }

    const userToModify = await User.findById(id);
    if (!userToModify) {
      return res.status(404).json({ message: "Target user profile not found" });
    }

    if (userToModify._id.toString() === req.user?.id) {
      return res.status(400).json({ message: "Self privilege revocation is disabled. You cannot alter your own role." });
    }

    userToModify.role = role;
    await userToModify.save();

    return res.status(200).json({ message: `User status elevated to ${role} successfully` });
  } catch (error) {
    console.error("Admin Role Update Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 4. Admin Universal Blog List (With unified contextual author lookups)
export const adminGetAllBlogs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username email")
      .sort({ createdAt: -1 });
    return res.status(200).json(blogs);
  } catch (error) {
    console.error("Admin Get Blogs Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 5. Delete User Account Profile
export const adminDeleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User profile not found" });
    }

    if (user._id.toString() === req.user?.id) {
      return res.status(400).json({ message: "Action aborted. Safe execution protects active session self-destruction." });
    }

    await Blog.deleteMany({ author: id });
    await user.deleteOne();

    return res.status(200).json({ message: "User account and published articles wiped clean" });
  } catch (error) {
    console.error("Admin Wipe Account Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// 6. Force-Terminate Any Blog Post Entry
export const adminDeleteBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Target post item not found" });
    }

    await blog.deleteOne();
    return res.status(200).json({ message: "Content post item force deleted from directory" });
  } catch (error) {
    console.error("Admin Content Force Removal Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
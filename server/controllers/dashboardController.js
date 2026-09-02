import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const totalProjects = await Project.countDocuments({
      user: userId,
    });

    const totalTasks = await Task.countDocuments({
      user: userId,
    });

    const todoTasks = await Task.countDocuments({
      user: userId,
      status: "Todo",
    });

    const inProgressTasks = await Task.countDocuments({
      user: userId,
      status: "In Progress",
    });

    const completedTasks = await Task.countDocuments({
      user: userId,
      status: "Completed",
    });

    res.status(200).json({
      totalProjects,
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};
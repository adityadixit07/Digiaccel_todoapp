const Task = require("../models/Task");

class TaskController {
  // Create Task
  static async createTask(req, res) {
    try {
      const { title, description, dateTime, priority } = req.body;

      const newTask = new Task({
        title,
        description,
        dateTime,
        priority,
      });

      await newTask.save();
      res
        .status(201)
        .json({ message: "Task created successfully", task: newTask });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating task", error });
    }
  }

  // Edit Task
  static async editTask(req, res) {
    try {
      const { id } = req.params;
      const { title, description, dateTime, priority } = req.body;

      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { title, description, dateTime, priority },
        { new: true }
      );

      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      res
        .status(200)
        .json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating task", error });
    }
  }

  // Delete Task
  static async deleteTask(req, res) {
    try {
      const { id } = req.params;

      const deletedTask = await Task.findByIdAndDelete(id);

      if (!deletedTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting task", error });
    }
  }

  // Search Tasks
  static async searchTasks(req, res) {
    try {
      const { keyword } = req.query;

      const tasks = await Task.find({
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      });

      res.status(200).json({ tasks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error searching tasks", error });
    }
  }

  // Update Task Status
  static async updateTaskStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.status(200).json({
        message: "Task status updated successfully",
        task: updatedTask,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating task status", error });
    }
  }

  // Get Weekly Task Summary
  static async getWeeklySummary(req, res) {
    try {
      const tasks = await Task.aggregate([
        {
          $addFields: {
            week: { $isoWeek: "$dateTime" },
          },
        },
        {
          $group: {
            _id: "$week",
            openTasks: {
              $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] },
            },
            completedTasks: {
              $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
            },
            tasks: { $push: "$$ROOT" },
          },
        },
      ]);

      res.status(200).json({ weeklySummary: tasks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching weekly summary", error });
    }
  }
}

module.exports = TaskController;

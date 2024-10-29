const Task = require("../models/Task");

class TaskController {
  // Create Task
  static async createTask(req, res) {
    try {
      const { title, description, dateTime, priority } = req.body;

      // Validate required fields
      if (!title || !dateTime) {
        return res.status(400).json({
          message: "Title and dateTime are mandatory fields",
        });
      }

      const newTask = new Task({
        title,
        description,
        dateTime: new Date(dateTime),
        priority: priority || "Low",
        status: "In Progress", // Default status
      });

      await newTask.save();
      res.status(201).json({
        message: "Task created successfully",
        task: newTask,
      });
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

      // Validate required fields
      if (title === "" || dateTime === "") {
        return res.status(400).json({
          message: "Title and dateTime cannot be empty",
        });
      }

      const updatedTask = await Task.findByIdAndUpdate(
        id,
        {
          title,
          description,
          dateTime: dateTime ? new Date(dateTime) : undefined,
          priority,
        },
        { new: true, runValidators: true }
      );

      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.status(200).json({
        message: "Task updated successfully",
        task: updatedTask,
      });
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

      res.status(200).json({
        message: "Task deleted successfully",
        taskId: id,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting task", error });
    }
  }

  // Search Tasks
  static async searchTasks(req, res) {
    try {
      const { keyword } = req.query;

      if (!keyword) {
        return res.status(400).json({
          message: "Search keyword is required",
        });
      }

      const tasks = await Task.find({
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      }).sort({ dateTime: 1 }); // Sort by date

      res.status(200).json({
        message: "Search results retrieved successfully",
        count: tasks.length,
        tasks,
      });
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

      // Validate status
      if (!["In Progress", "Completed"].includes(status)) {
        return res.status(400).json({
          message: "Invalid status. Must be 'In Progress' or 'Completed'",
        });
      }

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
      const pipeline = [
        {
          $addFields: {
            week: {
              $dateTrunc: {
                date: "$dateTime",
                unit: "week",
                startOfWeek: "Monday",
              },
            },
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
            tasks: {
              $push: {
                _id: "$_id",
                title: "$title",
                description: "$description",
                dateTime: "$dateTime",
                priority: "$priority",
                status: "$status",
              },
            },
          },
        },
        {
          $sort: { _id: 1 }, // Sort by week
        },
        {
          $project: {
            week: "$_id",
            openTasks: 1,
            completedTasks: 1,
            totalTasks: { $size: "$tasks" },
            tasks: 1,
            _id: 0,
          },
        },
      ];

      const weeklySummary = await Task.aggregate(pipeline);

      res.status(200).json({
        message: "Weekly summary retrieved successfully",
        weeklySummary,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching weekly summary", error });
    }
  }
}

module.exports = TaskController;

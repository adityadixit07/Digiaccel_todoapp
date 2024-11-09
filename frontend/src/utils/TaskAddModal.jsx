import { X } from "lucide-react";
import React, { useEffect, useMemo } from "react";

const TaskAddModal = ({
  isModalOpen,
  setIsModalOpen,
  title,
  setTitle,
  priority,
  setPriority,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  taskDate,
  setTaskDate,
  description,
  setDescription,
  handleSubmit,
  editingId,
}) => {
  const currentDate = useMemo(() => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  }, []);

  // Get date from 6 days ago in YYYY-MM-DD format
  const pastDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 6);
    return date.toISOString().split("T")[0];
  }, []);

  useEffect(() => {
    if (editingId) {
      console.log("Editing Task ID:", editingId);
      // Assume that the parent component has already set the state
      // If you want to reset fields when switching tasks, you can handle it here
    } else {
      // Reset fields if not editing
      setTitle("");
      setPriority("");
      setStartTime("");
      setEndTime("");
      setTaskDate("");
      setDescription("");
    }
  }, [
    editingId,
    setTitle,
    setPriority,
    setStartTime,
    setEndTime,
    setTaskDate,
    setDescription,
  ]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div
        className={`fixed inset-x-0 bottom-0 transform ${
          isModalOpen ? "translate-y-0" : "translate-y-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="bg-white rounded-t-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? "Edit Task" : "Add New Task"}
              </h2>
              <p className="text-sm text-gray-500">
                {editingId
                  ? "Update the task details"
                  : "Create a new task to your list"}
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Priority
              </label>
              <select
                id="priority"
                name="priority"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="">Select Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  min={new Date().toLocaleTimeString().split(" ")[0]}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  min={startTime}
                  max="23:59"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Set Date
              </label>
              <input
                type="date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                min={pastDate}
                max={currentDate}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add description"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-4 rounded-xl hover:bg-blue-600 transition-colors duration-200"
            >
              {editingId ? "Update Task" : "Create Task"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskAddModal;

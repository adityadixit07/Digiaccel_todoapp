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
  // Get current date in YYYY-MM-DD format
  const currentDate = useMemo(() => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  }, []);

  // Get current time in HH:mm format
  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Get max end time (23:59) for the current day
  const maxEndTime = "23:59";

  // Initialize form with current date and time when opening
  useEffect(() => {
    if (!editingId) {
      const currentTime = getCurrentTime();
      setTaskDate(currentDate);
      setStartTime(currentTime);
      setEndTime(currentTime); // Default to current time, user can adjust up to 23:59
      setTitle("");
      setPriority("");
      setDescription("");
    }
  }, [
    editingId,
    currentDate,
    setTitle,
    setPriority,
    setStartTime,
    setEndTime,
    setTaskDate,
    setDescription,
  ]);

  // Validate time selections
  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    const currentTime = getCurrentTime();

    // If selected date is current date, start time cannot be earlier than current time
    if (taskDate === currentDate && newStartTime < currentTime) {
      alert("Start time cannot be earlier than current time for today's tasks");
      setStartTime(currentTime);
      return;
    }

    setStartTime(newStartTime);

    // If end time is earlier than new start time, update end time
    if (endTime < newStartTime) {
      setEndTime(newStartTime);
    }
  };

  const handleEndTimeChange = (e) => {
    const newEndTime = e.target.value;

    // End time must be after start time
    if (newEndTime < startTime) {
      alert("End time must be after start time");
      return;
    }

    setEndTime(newEndTime);
  };

  // Custom form submit handler
  const onSubmit = (e) => {
    e.preventDefault();

    // Additional validation before submitting
    if (taskDate === currentDate) {
      const currentTime = getCurrentTime();
      if (startTime < currentTime) {
        alert(
          "Start time cannot be earlier than current time for today's tasks"
        );
        return;
      }
    }

    if (endTime < startTime) {
      alert("End time must be after start time");
      return;
    }

    handleSubmit(e);
  };

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

          <form onSubmit={onSubmit} className="space-y-5">
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
                required
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
                required
              >
                <option value="">Select Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Set Date
              </label>
              <input
                type="date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                min={currentDate}
                max={currentDate}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  min={taskDate === currentDate ? getCurrentTime() : "00:00"}
                  max={maxEndTime}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={handleEndTimeChange}
                  min={startTime}
                  max={maxEndTime}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
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
                required
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

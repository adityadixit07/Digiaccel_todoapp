import { X,Clock,Calendar } from "lucide-react";
import React from "react";

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
}) => {
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
              <h2 className="text-xl font-bold text-gray-800">Add New Task</h2>
              <p className="text-sm text-gray-500">
                Create a new task to your list
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
            </div>{" "}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Priority
              </label>
              <div className="w-full">
                <label
                  htmlFor="priority"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Choose Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={priority}
                  onChange={(e) => {
                    setPriority(e.target.value);
                    console.log(e.target.value, "priority...");
                  }}
                >
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <Clock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <Clock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Set Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add description"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-4 rounded-xl hover:bg-blue-600 transition-colors duration-200 font-medium text-lg"
            >
              Create Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskAddModal;

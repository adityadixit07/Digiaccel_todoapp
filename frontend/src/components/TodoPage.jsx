import React, { useState, useEffect } from "react";
import {
  Settings,
  Search,
  Bell,
  Plus,
  X,
  Clock,
  Calendar,
  Trash2,
  Pencil,
  Check,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { format, addDays } from "date-fns";

const TodoPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [tasks, setTasks] = useState([
    { id: 1, title: "Finishing Wireframe", status: "pending" },
    { id: 2, title: "Meeting with team", status: "pending" },
    { id: 3, title: "Buy cat food", status: "complete" },
    { id: 4, title: "Finishing daily commission", status: "complete" },
  ]);

  // Filter tasks based on search query
  useEffect(() => {
    const filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTasks(filtered);
  }, [searchQuery, tasks]);
  const [newTask, setNewTask] = useState({
    title: "",
    startTime: "",
    endTime: "",
    date: "",
    description: "",
  });

  const handleTaskStatusChange = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "complete" ? "pending" : "complete",
            }
          : task
      )
    );
  };

  const handleTaskDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTaskItem = {
      id: tasks.length + 1,
      ...newTask,
      status: "pending",
    };
    setTasks([...tasks, newTaskItem]);
    setIsModalOpen(false);
    setNewTask({
      title: "",
      startTime: "",
      endTime: "",
      date: "",
      description: "",
    });
  };

  // Search Interface Component
  const SearchInterface = () => {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="flex items-center p-4 border-b">
          <button
            onClick={() => setIsSearchOpen(false)}
            className="mr-4 hover:text-blue-500"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 relative">
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-4 pr-10 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {searchQuery ? (
            filteredTasks.length > 0 ? (
              <div className="space-y-2">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center p-4 bg-white rounded-lg border shadow-sm"
                  >
                    <input
                      type="checkbox"
                      checked={task.status === "complete"}
                      onChange={() => handleTaskStatusChange(task.id)}
                      className="form-checkbox h-5 w-5 text-blue-500 rounded"
                    />
                    <span
                      className={`ml-3 flex-1 ${
                        task.status === "complete"
                          ? "line-through text-gray-400"
                          : ""
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-8">
                <p>No tasks found matching "{searchQuery}"</p>
              </div>
            )
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-gray-500 font-medium">
                Recent Searches
              </div>
              <div className="space-y-2">
                {["Meeting", "Wireframe", "Design"].map((term, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(term)}
                    className="flex items-center w-full p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <Clock className="w-4 h-4 text-gray-400 mr-3" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>

              <div className="text-sm text-gray-500 font-medium mt-6">
                Suggested
              </div>
              <div className="space-y-2">
                {["All tasks", "Completed tasks", "Pending tasks"].map(
                  (suggestion, index) => (
                    <button
                      key={index}
                      className="flex items-center w-full p-3 hover:bg-gray-50 rounded-lg"
                    >
                      <Search className="w-4 h-4 text-gray-400 mr-3" />
                      <span>{suggestion}</span>
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 bg-white z-10 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <Settings className="w-6 h-6 text-gray-600" />
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hover:text-blue-500"
            >
              <Search className="w-6 h-6 text-gray-600" />
            </button>
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Interface */}
      {isSearchOpen && <SearchInterface />}

      <div className="pt-16 px-4 pb-24 h-full overflow-y-auto">
        <div className="flex justify-between mb-6 overflow-x-auto py-2">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`flex flex-col items-center py-3 px-4 rounded-xl ${
                format(addDays(new Date(), i), "dd") ===
                format(new Date(), "dd")
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-white border"
              } min-w-[60px] mx-1`}
            >
              <span className="text-xs font-medium">
                {format(addDays(new Date(), i), "EEE")}
              </span>
              <span className="text-lg font-bold mt-1">
                {format(addDays(new Date(), i), "dd")}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl shadow-sm border border-gray-100 bg-blue-100">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-200 rounded-full mb-2">
              <Check className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-xs text-gray-500">Completed Tasks</span>
            <span className="font-bold text-2xl block mb-1">50</span>
            <span className="text-xs text-gray-500">this week</span>
          </div>
          <div className="bg-red-100 p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mb-2">
              <Clock className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-xs text-gray-500">Pending Tasks</span>
            <span className="font-bold text-2xl block mb-1">08</span>
            <span className="text-xs text-gray-500">this week</span>
          </div>
        </div>

        {/* Tasks List */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Today's Tasks</h2>
            <button className="text-blue-500 text-sm">View All</button>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <input
                      type="checkbox"
                      checked={task.status === "complete"}
                      onChange={() => handleTaskStatusChange(task.id)}
                      className="form-checkbox h-5 w-5 text-blue-500 rounded-lg"
                    />
                    <span
                      className={`ml-3 ${
                        task.status === "complete"
                          ? "line-through text-gray-400"
                          : "text-gray-700"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleTaskDelete(task.id)}>
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </button>
                    <button>
                      <Pencil className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-10">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-colors duration-200"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      {/*  Modal */}
      {isModalOpen && (
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
                    Add New Task
                  </h2>
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
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    placeholder="Enter task title"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={newTask.startTime}
                        onChange={(e) =>
                          setNewTask({ ...newTask, startTime: e.target.value })
                        }
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
                        value={newTask.endTime}
                        onChange={(e) =>
                          setNewTask({ ...newTask, endTime: e.target.value })
                        }
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
                      value={newTask.date}
                      onChange={(e) =>
                        setNewTask({ ...newTask, date: e.target.value })
                      }
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
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
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
      )}
    </div>
  );
};

export default TodoPage;

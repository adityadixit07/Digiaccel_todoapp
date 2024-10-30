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
import { useDispatch, useSelector } from "react-redux";
import {
  allTasksList,
  createTask,
  deleteTask,
  updateTaskStatus,
} from "../store/slices/taskSlice";
import { toast } from "react-toastify";

const TodoPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [priorityId, setPriorityId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [tasks, setTasks] = useState([]);

  const taskList = useSelector((state) => state?.task?.tasks);

  const [allTasks, setAllTasks] = useState([]);
  useEffect(() => {
    dispatch(allTasksList());
  }, []);

  const dispatch = useDispatch();
  // Filter tasks based on search query
  useEffect(() => {
    const filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTasks(filtered);
  }, [searchQuery, tasks]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTaskStatusChange = async (id, status) => {
    setIsLoading(true);
    console.log(id, status, "idand stuad");
    try {
      await dispatch(
        updateTaskStatus({
          id,
          status,
        })
      ).unwrap();

      // Optional: Show success notification
      toast.success("Task status updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update task status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskDelete = (id) => {
    // setTasks(tasks.filter((task) => task.id !== id));
    dispatch(deleteTask(id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = {
      title,
      description,
      dateTime: {
        startTime,
        endTime,
      },
      priority,
    };
    await dispatch(createTask(taskData)).unwrap();
    setIsModalOpen(false);
    // Optional: Reset form
    setFormData({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      priority: priority,
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
                {filteredTasks?.map((task) => (
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

        <div className="mb-6">
          {/* Header section */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Today's Tasks</h2>
            <button className="text-blue-500 text-sm font-medium">
              View All
            </button>
          </div>

          {/* Tasks list */}
          <div className="space-y-3">
            {taskList?.map((task) => (
              <div
                key={task?._id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition duration-200"
              >
                <div className="flex items-center justify-between">
                  {/* Task title and status */}
                  <div className="flex items-center flex-1">
                    <input
                      type="checkbox"
                      checked={task?.status === "complete"}
                      onChange={() => handleTaskStatusChange(task?._id)}
                      className="form-checkbox h-5 w-5 text-blue-500 rounded-lg cursor-pointer"
                    />
                    <span
                      className={`ml-3 font-medium ${
                        task?.status === "complete"
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {task?.title}
                    </span>
                    <span
                      onClick={() =>
                        !isLoading &&
                        handleTaskStatusChange(
                          task?._id,
                          task?.status === "Completed"
                            ? "In Progress"
                            : "Completed"
                        )
                      }
                      className={`ml-3 px-3 py-1 text-sm rounded-full 
      ${
        isLoading
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:opacity-80"
      } 
      transition-opacity ${
        task?.status === "Completed"
          ? "bg-green-100 text-green-600"
          : "bg-yellow-100 text-yellow-600"
      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Updating...
                        </span>
                      ) : (
                        task?.status || "In Progress"
                      )}
                    </span>
                    <span className="ml-2 ">{task?.description}</span>
                  </div>

                  {/* Task actions */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleTaskDelete(task?._id)}
                      className="p-2 rounded-lg hover:bg-red-50 transition duration-200"
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-50 transition duration-200">
                      <Pencil className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                    </button>

                    {/* Task priority */}
                    <div className="relative">
                      <button
                        onClick={() => setPriorityId(task?._id)}
                        className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-50 transition duration-200"
                      >
                        <span
                          className={`text-sm font-medium ${
                            task?.priority === "Low"
                              ? "text-green-500"
                              : task?.priority === "Medium"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          {task?.priority}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 ${
                            task?.priority === "Low"
                              ? "text-green-500"
                              : task?.priority === "Medium"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        />
                      </button>
                      {priorityId === task?.id && (
                        <div className="absolute top-10 right-0 w-40 bg-white border border-gray-100 rounded-lg shadow-md mt-2 z-10">
                          {["Low", "Medium", "High"].map((item, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                handlePriorityChange(task.id, item)
                              }
                              className="block w-full p-2 text-sm font-medium hover:bg-gray-100 transition duration-200"
                            >
                              <span
                                className={`${
                                  item === "Low"
                                    ? "text-green-500"
                                    : item === "Medium"
                                    ? "text-yellow-500"
                                    : "text-red-500"
                                }`}
                              >
                                {item}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
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
      )}
    </div>
  );
};

export default TodoPage;

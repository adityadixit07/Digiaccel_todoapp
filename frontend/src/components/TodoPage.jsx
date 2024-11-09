import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Clock, Trash2, Pencil, Check, ChevronDown } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import {
  allTasksList,
  createTask,
  deleteTask,
  updateTaskPriority,
  updateTaskStatus,
} from "../store/slices/taskSlice";
import { toast } from "react-toastify";
import axios from "axios";
import Nav from "./Nav";
import TaskAddModal from "../utils/TaskAddModal";
import SearchInterface from "./SearchInterface";

const TodoPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const [filteredTasks, setFilteredTasks] = useState([]);
  const [priorityId, setPriorityId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [completedTasks, setCompletedTasks] = useState("0");
  const [openTasks, setOpenTasks] = useState("0");
  const [isLoading, setIsLoading] = useState(false);

  const taskList = useSelector((state) => state?.task?.tasks);
  const tasks = useSelector((state) => state.task.tasks);

  const dispatch = useDispatch();
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      task?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    );
  }, [searchQuery, tasks]);

  useEffect(() => {
    dispatch(allTasksList());
  }, [dispatch]);
  const handleTaskStatusChange = useCallback(
    async (id, status) => {
      setIsLoading(true);
      try {
        await dispatch(updateTaskStatus({ id, status })).unwrap();
        toast.success("Task status updated successfully");
      } catch (err) {
        toast.error("Failed to update task status");
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch]
  );

  const handlePriorityChange = useCallback(
    async (taskId, newPriority) => {
      try {
        await dispatch(
          updateTaskPriority({ id: taskId, priority: newPriority })
        ).unwrap();
        setPriorityId(null);
        toast.success("Priority updated successfully");
      } catch (err) {
        toast.error("Failed to update priority");
      }
    },
    [dispatch]
  );

  const handleTaskDelete = useCallback(
    async (id) => {
      setIsLoading(true);
      await dispatch(deleteTask(id)).unwrap();
      setIsLoading(false);
      toast.success("Task deleted successfully");
    },
    [dispatch]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const taskData = {
        title,
        description,
        dateTime: { startTime, endTime },
        priority,
      };
      await dispatch(createTask(taskData)).unwrap();
      setIsModalOpen(false);
      setTitle("");
      setDescription("");
      setStartTime("");
      setEndTime("");
    },
    [dispatch, title, description, startTime, endTime, priority]
  );

  const getWeeklySummary = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/weekly-summary");

      setCompletedTasks(res?.data?.weeklySummary[0]?.completedTasks);
      setOpenTasks(res?.data?.weeklySummary[0]?.openTasks);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getWeeklySummary();
  }, [taskList]);

  return (
    <div className="relative h-screen bg-gray-50">
      <Nav setIsSearchOpen={setIsSearchOpen} />

      {/* Search Interface */}
      {isSearchOpen && (
        <SearchInterface
          setIsSearchOpen={setIsSearchOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredTasks={filteredTasks}
          handleTaskStatusChange={handleTaskStatusChange}
        />
      )}

      <div className="pt-16 px-4 pb-24 h-full overflow-y-auto">
        <div className="flex justify-between mb-6 overflow-x-auto py-2">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`flex flex-col items-center py-3 px-4 rounded-xl ${
                format(addDays(new Date(), 6 - i), "dd") ===
                format(new Date(), "dd")
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-white border"
              } min-w-[60px] mx-1`}
            >
              <span className="text-xs font-medium">
                {format(subDays(new Date(), 6 - i), "EEE")}
              </span>
              <span className="text-lg font-bold mt-1">
                {format(subDays(new Date(), 6 - i), "dd")}
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
            <span className="font-bold text-2xl block mb-1">
              {completedTasks}
            </span>
            <span className="text-xs text-gray-500">this week</span>
          </div>
          <div className="bg-red-100 p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mb-2">
              <Clock className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-xs text-gray-500">Pending Tasks</span>
            <span className="font-bold text-2xl block mb-1">{openTasks}</span>
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
                    {/* <span className="ml-2 ">{task?.description}</span>  */}
                  </div>

                  {/* Task actions */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleTaskDelete(task?._id)}
                      className="p-2 rounded-lg hover:bg-red-50 transition duration-200"
                    >
                      {isLoading ? (
                        "Delete the task"
                      ) : (
                        <Trash2 className="h-5 w-5 text-red-500" />
                      )}
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-50 transition duration-200">
                      <Pencil className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                    </button>

                    {/* Task priority */}
                    <div className="relative priority-dropdown">
                      <button
                        onClick={() => setPriorityId(task?._id)} // Changed from task?.id to task?._id
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

                      {/* Priority Dropdown Menu */}
                      {priorityId === task?._id && ( // Changed from task?.id to task?._id
                        <div className="absolute top-10 right-0 w-40 bg-white border border-gray-100 rounded-lg shadow-md mt-2 z-10">
                          {["Low", "Medium", "High"].map((item) => (
                            <button
                              key={item}
                              onClick={() =>
                                handlePriorityChange(task?._id, item)
                              } // Changed from task.id to task._id
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
        <TaskAddModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          title={title}
          setTitle={setTitle}
          priority={priority}
          setPriority={setPriority}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          taskDate={taskDate}
          setTaskDate={setTaskDate}
          description={description}
          setDescription={setDescription}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default TodoPage;

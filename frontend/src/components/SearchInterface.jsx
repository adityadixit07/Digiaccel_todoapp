import { ArrowLeft, Clock, Search, X, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask, searchTasks } from "../store/slices/taskSlice";

const SearchInterface = ({ setIsSearchOpen, searchQuery, setSearchQuery }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.task.tasks);

  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  // Debounce the search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery) {
      dispatch(searchTasks(debouncedQuery));
    }
  }, [debouncedQuery, dispatch]);

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
    dispatch(searchTasks({ query: debouncedQuery }));
  };

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
        {debouncedQuery ? (
          filteredTasks.length > 0 ? (
            <div className="space-y-2">
              {filteredTasks?.map((task) => (
                <div
                  key={task?._id}
                  className="flex justify-between items-center p-4 bg-white rounded-lg border shadow-sm"
                >
                  <div>
                    <p className="font-semibold">{task?.title}</p>
                    <p className="text-sm text-gray-500">
                      Priority: {task?.priority}
                    </p>
                    <p
                      className={`text-sm ${
                        task?.status === "complete"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }`}
                    >
                      Status:{" "}
                      {task?.status === "complete"
                        ? "Completed"
                        : "In Progress"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task?._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <p>No tasks found matching "{debouncedQuery}"</p>
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

            {/* <div className="text-sm text-gray-500 font-medium mt-6">
              Suggested
            </div>
            <div className="space-y-2">
              {["All tasks", "Completed tasks", "Pending tasks"].map(
                (suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(suggestion)}
                    className="flex items-center w-full p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <Search className="w-4 h-4 text-gray-400 mr-3" />
                    <span>{suggestion}</span>
                  </button>
                )
              )}
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInterface;

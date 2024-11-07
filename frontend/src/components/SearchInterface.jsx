import { ArrowLeft, Clock, Search, X } from "lucide-react";
import React from "react";

const SearchInterface = ({
  setIsSearchOpen,
  searchQuery,
  setSearchQuery,
  filteredTasks,
  handleTaskStatusChange,
}) => {
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

export default SearchInterface;

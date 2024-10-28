const TaskModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg w-11/12 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Task</h2>

      <form className="space-y-4">
        <div>
          <label>Task Title</label>
          <input type="text" className="w-full p-2 border rounded-lg" />
        </div>
        <div className="flex space-x-2">
          <div className="w-1/2">
            <label>Start Time</label>
            <input type="time" className="w-full p-2 border rounded-lg" />
          </div>
          <div className="w-1/2">
            <label>End Time</label>
            <input type="time" className="w-full p-2 border rounded-lg" />
          </div>
        </div>
        <div>
          <label>Date</label>
          <input type="date" className="w-full p-2 border rounded-lg" />
        </div>
        <div>
          <label>Description</label>
          <textarea
            className="w-full p-2 border rounded-lg"
            rows="3"
          ></textarea>
        </div>
      </form>

      <div className="mt-4 flex justify-end space-x-2">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Create Task
        </button>
      </div>
    </div>
  </div>
);

export default TaskModal;

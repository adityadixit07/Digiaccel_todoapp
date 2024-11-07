import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInterceptor from "../../utils/axiosInterceptior";

// Async thunk actions

export const allTasksList = createAsyncThunk(
  "task/all",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInterceptor.get("/all");
      return response?.data?.tasks;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const createTask = createAsyncThunk(
  "task/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      console.log("taskData", taskData);
      const response = await axiosInterceptor.post("/create", taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editTask = createAsyncThunk(
  "task/editTask",
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const response = await axiosInterceptor.put(`/edit/${id}`, taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInterceptor.delete(`/delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const searchTasks = createAsyncThunk(
  "task/searchTasks",
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await axiosInterceptor.get("/search", {
        params: searchParams,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  "task/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInterceptor.put(`/status/${id}`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateTaskPriority = createAsyncThunk(
  "task/updatePriority",
  async ({ id, priority }, { rejectWithValue }) => {
    try {
      const response = await axiosInterceptor.put(`/task/priority/${id}`, {
        priority,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getWeeklySummary = createAsyncThunk(
  "task/getWeeklySummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInterceptor.get("/weekly-summary");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const taskSlice = createSlice({
  name: "task",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
    weeklySummary: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      state.tasks = [];
      state.loading = false;
      state.error = null;
      state.weeklySummary = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(allTasksList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(allTasksList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.tasks = payload;
      state.error = null;
    });
    builder.addCase(allTasksList.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    // Create Task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, { payload }) => {
        state.loading = false;
        // state.tasks.push(payload);
        state.tasks = [payload, ...state.tasks];
        state.error = null;
      })
      .addCase(createTask.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Edit Task
      .addCase(editTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(editTask.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tasks = state.tasks.map((task) =>
          task.id === payload.id ? payload : task
        );
        state.error = null;
      })
      .addCase(editTask.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTask.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== payload);
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Search Tasks
      .addCase(searchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchTasks.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tasks = payload;
        state.error = null;
      })
      .addCase(searchTasks.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Update Task Status
      .addCase(updateTaskStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTaskStatus.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tasks = state.tasks.map((task) =>
          task.id === payload.id ? payload : task
        );
        state.error = null;
      })
      .addCase(updateTaskStatus.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Update Task Priority
      .addCase(updateTaskPriority.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTaskPriority.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tasks = state.tasks.map((task) =>
          task.id === payload.id ? payload : task
        );
        state.error = null;
      })
      .addCase(updateTaskPriority.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Weekly Summary
      .addCase(getWeeklySummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWeeklySummary.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.weeklySummary = payload;
        state.error = null;
      })
      .addCase(getWeeklySummary.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { clearError, resetState } = taskSlice.actions;
export default taskSlice.reducer;

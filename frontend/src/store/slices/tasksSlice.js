import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    createTask as createTaskAPI,
    updateTask as updateTaskAPI,
    deleteTask as deleteTaskAPI,
    getAllTasks as getAllTasksAPI,
} from '../../apis/tasks';
import toast from 'react-hot-toast';

const initialState = {
    Backlog: [],
    'To do': [],
    'In progress': [],
    Done: [],
    loading: false,
    error: null,
};

// Async Thunks with Optimistic Updates

// Fetch all tasks
export const fetchTasksAsync = createAsyncThunk(
    'tasks/fetchTasks',
    async ({ userId, token, startDate }, { rejectWithValue }) => {
        try {
            const tasksData = await getAllTasksAPI(userId, token, startDate);
            // Add isCollapsed property to all tasks
            Object.keys(tasksData).forEach((type) => {
                tasksData[type].forEach((task) => {
                    task.isCollapsed = true;
                });
            });
            return tasksData;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch tasks');
        }
    }
);

// Create task with optimistic update
export const createTaskAsync = createAsyncThunk(
    'tasks/createTask',
    async ({ taskData, token }, { rejectWithValue, getState }) => {
        const optimisticTask = {
            ...taskData,
            _id: `temp-${Date.now()}`, // Temporary ID
            isCollapsed: true,
            createdAt: new Date().toISOString(),
        };

        try {
            const newTask = await createTaskAPI(taskData, token);
            newTask.isCollapsed = true;
            return { optimisticTask, newTask };
        } catch (error) {
            return rejectWithValue({
                error: error.response?.data || 'Failed to create task',
                optimisticTask,
            });
        }
    }
);

// Update task with optimistic update
export const updateTaskAsync = createAsyncThunk(
    'tasks/updateTask',
    async ({ taskId, updatedData, previousTask }, { rejectWithValue }) => {
        const optimisticTask = {
            ...previousTask,
            ...updatedData,
        };

        try {
            const updatedTask = await updateTaskAPI(taskId, updatedData);
            updatedTask.isCollapsed = previousTask.isCollapsed;
            return { optimisticTask, updatedTask, taskId };
        } catch (error) {
            return rejectWithValue({
                error: error.response?.data || 'Failed to update task',
                previousTask,
            });
        }
    }
);

// Delete task with optimistic update
export const deleteTaskAsync = createAsyncThunk(
    'tasks/deleteTask',
    async ({ taskId, task }, { rejectWithValue }) => {
        try {
            await deleteTaskAPI(taskId);
            return { taskId, task };
        } catch (error) {
            return rejectWithValue({
                error: error.response?.data || 'Failed to delete task',
                task,
            });
        }
    }
);

// Update task type (move between columns) with optimistic update
export const updateTaskTypeAsync = createAsyncThunk(
    'tasks/updateTaskType',
    async ({ taskId, newType, task }, { rejectWithValue }) => {
        const previousType = task.taskType;

        try {
            await updateTaskAPI(taskId, { taskType: newType });
            return { taskId, newType, previousType, task };
        } catch (error) {
            return rejectWithValue({
                error: error.response?.data || 'Failed to update task type',
                task,
                previousType,
            });
        }
    }
);

// Update checklist with optimistic update
export const updateChecklistAsync = createAsyncThunk(
    'tasks/updateChecklist',
    async ({ taskId, checklist, task }, { rejectWithValue }) => {
        const previousChecklist = task.checklist;

        try {
            await updateTaskAPI(taskId, { checklist });
            return { taskId, checklist, task };
        } catch (error) {
            return rejectWithValue({
                error: error.response?.data || 'Failed to update checklist',
                task,
                previousChecklist,
            });
        }
    }
);

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        // Local UI state updates (no API call needed)
        toggleTaskCollapse: (state, action) => {
            const { taskId, taskType } = action.payload;
            const task = state[taskType].find((t) => t._id === taskId);
            if (task) {
                task.isCollapsed = !task.isCollapsed;
            }
        },
    },
    extraReducers: (builder) => {
        // Fetch Tasks
        builder
            .addCase(fetchTasksAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasksAsync.fulfilled, (state, action) => {
                state.loading = false;
                Object.keys(action.payload).forEach((type) => {
                    state[type] = action.payload[type];
                });
            })
            .addCase(fetchTasksAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error('Failed to fetch tasks');
            });

        // Create Task - Optimistic Update
        builder
            .addCase(createTaskAsync.pending, (state, action) => {
                // Optimistically add the task to the UI
                const { taskData } = action.meta.arg;
                const optimisticTask = {
                    ...taskData,
                    _id: `temp-${Date.now()}`,
                    isCollapsed: true,
                    createdAt: new Date().toISOString(),
                };
                state[taskData.taskType].push(optimisticTask);
            })
            .addCase(createTaskAsync.fulfilled, (state, action) => {
                const { optimisticTask, newTask } = action.payload;
                const taskType = newTask.taskType;
                // Replace the optimistic task with the real one from server
                const index = state[taskType].findIndex(
                    (t) => t._id === optimisticTask._id
                );
                if (index !== -1) {
                    state[taskType][index] = newTask;
                }
                toast.success('Task created successfully');
            })
            .addCase(createTaskAsync.rejected, (state, action) => {
                // Rollback: Remove the optimistic task
                const { optimisticTask } = action.payload;
                const taskType = optimisticTask.taskType;
                state[taskType] = state[taskType].filter(
                    (t) => t._id !== optimisticTask._id
                );
                toast.error('Failed to create task');
            });

        // Update Task - Optimistic Update
        builder
            .addCase(updateTaskAsync.pending, (state, action) => {
                const { taskId, updatedData, previousTask } = action.meta.arg;
                const taskType = previousTask.taskType;
                const task = state[taskType].find((t) => t._id === taskId);
                if (task) {
                    Object.assign(task, updatedData);
                }
            })
            .addCase(updateTaskAsync.fulfilled, (state, action) => {
                const { updatedTask, taskId } = action.payload;
                const taskType = updatedTask.taskType;
                const index = state[taskType].findIndex((t) => t._id === taskId);
                if (index !== -1) {
                    state[taskType][index] = updatedTask;
                }
                toast.success('Task updated successfully');
            })
            .addCase(updateTaskAsync.rejected, (state, action) => {
                // Rollback: Restore the previous task
                const { previousTask } = action.payload;
                const taskType = previousTask.taskType;
                const index = state[taskType].findIndex(
                    (t) => t._id === previousTask._id
                );
                if (index !== -1) {
                    state[taskType][index] = previousTask;
                }
                toast.error('Failed to update task');
            });

        // Delete Task - Optimistic Update
        builder
            .addCase(deleteTaskAsync.pending, (state, action) => {
                const { task } = action.meta.arg;
                const taskType = task.taskType;
                state[taskType] = state[taskType].filter((t) => t._id !== task._id);
            })
            .addCase(deleteTaskAsync.fulfilled, (state, action) => {
                toast.success('Task deleted successfully');
            })
            .addCase(deleteTaskAsync.rejected, (state, action) => {
                // Rollback: Restore the deleted task
                const { task } = action.payload;
                const taskType = task.taskType;
                state[taskType].push(task);
                toast.error('Failed to delete task');
            });

        // Update Task Type - Optimistic Update
        builder
            .addCase(updateTaskTypeAsync.pending, (state, action) => {
                const { task, newType } = action.meta.arg;
                const previousType = task.taskType;
                // Remove from old column
                state[previousType] = state[previousType].filter(
                    (t) => t._id !== task._id
                );
                // Add to new column
                state[newType].push({ ...task, taskType: newType });
            })
            .addCase(updateTaskTypeAsync.fulfilled, (state, action) => {
                toast.success('Task type updated successfully');
            })
            .addCase(updateTaskTypeAsync.rejected, (state, action) => {
                // Rollback: Move task back to previous column
                const { task, previousType } = action.payload;
                const newType = task.taskType;
                // Remove from new column
                state[newType] = state[newType].filter((t) => t._id !== task._id);
                // Add back to previous column
                state[previousType].push(task);
                toast.error('Failed to update task type');
            });

        // Update Checklist - Optimistic Update
        builder
            .addCase(updateChecklistAsync.pending, (state, action) => {
                const { taskId, checklist, task } = action.meta.arg;
                const taskType = task.taskType;
                const taskToUpdate = state[taskType].find((t) => t._id === taskId);
                if (taskToUpdate) {
                    taskToUpdate.checklist = checklist;
                }
            })
            .addCase(updateChecklistAsync.fulfilled, (state, action) => {
                toast.success('Checklist updated successfully');
            })
            .addCase(updateChecklistAsync.rejected, (state, action) => {
                // Rollback: Restore previous checklist
                const { task, previousChecklist } = action.payload;
                const taskType = task.taskType;
                const taskToUpdate = state[taskType].find((t) => t._id === task._id);
                if (taskToUpdate) {
                    taskToUpdate.checklist = previousChecklist;
                }
                toast.error('Failed to update checklist');
            });
    },
});

export const { toggleTaskCollapse } = tasksSlice.actions;

// Selectors
export const selectAllTasks = (state) => state.tasks;
export const selectTasksByType = (type) => (state) => state.tasks[type];
export const selectTasksLoading = (state) => state.tasks.loading;

export default tasksSlice.reducer;

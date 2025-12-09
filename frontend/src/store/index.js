import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['tasks/createTask/pending', 'tasks/updateTask/pending'],
            },
        }),
});

export default store;

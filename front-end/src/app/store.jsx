import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authApi } from '../features/auth/authApi';
import authReducer from '../features/auth/authSlice';
import { companiesApi } from '../features/companies/companiesApi';
import { departmentsApi } from '../features/departments/departmentsApi';
import { employeesApi } from '../features/employees/employeesApi';
import { dashboardApi } from '../features/dashboard/dashboardApi';

// Persist configuration for authentication
const persistConfig = {
  key: 'auth',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [companiesApi.reducerPath]: companiesApi.reducer,
    [departmentsApi.reducerPath]: departmentsApi.reducer,
    [employeesApi.reducerPath]: employeesApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authApi.middleware, companiesApi.middleware ,departmentsApi.middleware , employeesApi.middleware , dashboardApi.middleware),
});

export const persistor = persistStore(store);

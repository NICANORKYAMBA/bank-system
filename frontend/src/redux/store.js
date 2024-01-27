import { configureStore } from '@reduxjs/toolkit';
import registerFormReducer from './reducers/RegisterFormReducers';
import loginFormReducer from './reducers/LoginFormReducers';
import dashboardReducer from './reducers/DashboardReducers';

const store = configureStore({
  reducer: {
    registerForm: registerFormReducer,
    loginForm: loginFormReducer,
    dashboard: dashboardReducer,
  }
});

export default store;

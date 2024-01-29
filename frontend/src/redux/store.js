import { configureStore } from '@reduxjs/toolkit';
import registerFormReducer from './reducers/RegisterFormReducers';
import loginFormReducer from './reducers/LoginFormReducers';
import dashboardReducer from './reducers/DashboardReducers';
import TransactionReducer from './reducers/TransactionReducers';
import formReducer from './reducers/QuickReducers';

const store = configureStore({
  reducer: {
    registerForm: registerFormReducer,
    loginForm: loginFormReducer,
    dashboard: dashboardReducer,
    transaction: TransactionReducer,
    quick: formReducer
  }
});

export default store;

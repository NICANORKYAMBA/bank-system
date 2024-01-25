import { configureStore } from '@reduxjs/toolkit';
import registerFormReducer from './reducers/RegisterFormReducers';
import loginFormReducer from './reducers/LoginFormReducers';

const store = configureStore({
  reducer: {
    registerForm: registerFormReducer,
    loginForm: loginFormReducer
  }
});

export default store;

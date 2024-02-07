import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import registerFormReducer from './reducers/RegisterFormReducers';
import loginFormReducer from './reducers/LoginFormReducers';
import dashboardReducer from './reducers/DashboardReducers';
import TransactionReducer from './reducers/TransactionReducers';
import formReducer from './reducers/QuickReducers';
import createAccountFormReducer from './reducers/CreateAccountFormReducers';
import userReducer from './reducers/userReducer';

const rootReducer = combineReducers({
  registerForm: registerFormReducer,
  loginForm: loginFormReducer,
  dashboard: dashboardReducer,
  transaction: TransactionReducer,
  quick: formReducer,
  createAccountForm: createAccountFormReducer,
  user: userReducer
});

const persistConfig = {
  key: 'root',
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer
});

const persistor = persistStore(store);

export { store, persistor };

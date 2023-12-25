import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducers/reducers';

const store = configureStore({
  reducer: reducer,
});

export default store;
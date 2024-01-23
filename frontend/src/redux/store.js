import rootReducer from './reducers/reducers';

import { createStore } from 'redux';

const store = createStore(rootReducer);

export default store;

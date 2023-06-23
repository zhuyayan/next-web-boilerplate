import { configureStore } from '@reduxjs/toolkit';
import appBarReducer from '../features/layout/layoutSlice';

const store = configureStore({
  reducer: {
    appBar: appBarReducer,
  },
});

export default store;

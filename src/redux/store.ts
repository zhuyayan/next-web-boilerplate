import { configureStore } from '@reduxjs/toolkit';
import appBarReducer from './features/layout-slice'
import loginReducer from './features/login-slice'
import {TypedUseSelectorHook, useSelector} from "react-redux";

const store = configureStore({
  reducer: {
    appBar: appBarReducer,
    login: loginReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default store;

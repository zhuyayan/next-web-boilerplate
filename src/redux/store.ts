import { configureStore } from '@reduxjs/toolkit';
import appBarReducer from './features/layout-slice'
import loginReducer from './features/login-slice'
import rehabReducer from './features/rehab/rehab-slice'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

const store = configureStore({
  reducer: {
    appBar: appBarReducer,
    login: loginReducer,
    rehab: rehabReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default store;

import { configureStore } from '@reduxjs/toolkit';
import appBarReducer from './features/layout-slice'
import loginReducer from './features/login-slice'
import rehabReducer, {rehabApi} from './features/rehab/rehab-slice'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {setupListeners} from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    appBar: appBarReducer,
    login: loginReducer,
    rehab: rehabReducer,
    [rehabApi.reducerPath]: rehabApi.reducer,
  },
  middleware:(getDefaultMiddleware) => {
    return getDefaultMiddleware()
        .concat(rehabApi.middleware)
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default store;

setupListeners(store.dispatch)

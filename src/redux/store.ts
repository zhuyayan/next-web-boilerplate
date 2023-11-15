import { configureStore } from '@reduxjs/toolkit';
import appBarReducer from './features/layout-slice'
import loginReducer from './features/login-slice'
import rehabReducer, {rehabApi} from './features/rehab/rehab-slice'
import assessmentReducer from "@/redux/features/rehab/rehab-assessment-slice";
import suggestionReducer from "@/redux/features/rehab/rehab-suggestion-slice";
import evaluationReducer from "@/redux/features/rehab/rehab-evaluation-slice";
import formFieldsReducer from "@/redux/features/rehab/rehab-formFields-slice";
import strokeEventReducer from "@/redux/features/rehab/rehab-patient-slice";
import strokeStrengthReducer from "@/redux/features/rehab/rehab-strength-slice"
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {setupListeners} from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    appBar: appBarReducer,
    login: loginReducer,
    rehab: rehabReducer,
    assessment: assessmentReducer,
    suggestion: suggestionReducer,
    evaluation: evaluationReducer,
    formField: formFieldsReducer,
    patient: strokeEventReducer,
    strength: strokeStrengthReducer,
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

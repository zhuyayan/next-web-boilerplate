import {ActionReducerMapBuilder, createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {AxiosResponse} from "axios";
import MCTAxiosInstance from "@/utils/mct-request";

export interface AllData
{
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    age: number;
    sex: string;
    i_18_d: string;
    medical_history: string;
    media_stroke_type: number;
    media_stroke_level: number;
    staff: Staff;
    stroke_event: StrokeEvent[];
}

export interface StrokeEvent
{
    e_id: number;
    stroke_type: string;
    stroke_level: string;
    onset_date: string;
    lesion_location: string;
    nihss_score: number;
    medical_history: string;
    pid: number;
}

export interface Staff
{
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    username: string;
    password: string;
}

export const getStrokeEvents = createAsyncThunk<StrokeEvent[], { pid: number }, {}>(
    'getStrokeEvents',
    async({pid}): Promise<any> => {
    const response:AxiosResponse<any, any> = await MCTAxiosInstance.get(`patient/stroke_event/${pid}`);
        console.log("getStrokeEvents async thunk: ", response.data.data.stroke_event);
        return response.data.data.stroke_event;
});

export const putStrokeEvent = createAsyncThunk(
    'putStrokeEvent',
    async ({ strokeEvent }: { strokeEvent: StrokeEvent }): Promise<any> => {
        const response: AxiosResponse<any, any> = await MCTAxiosInstance.put(`patient/stroke_event/${strokeEvent.e_id}`, {
            e_id: strokeEvent.e_id,
            stroke_type: strokeEvent.stroke_type,
            stroke_level: strokeEvent.stroke_level,
            onset_date: strokeEvent.onset_date,
            lesion_location: strokeEvent.lesion_location,
            nihss_score: strokeEvent.nihss_score,
            medical_history: strokeEvent.medical_history,
            pid: strokeEvent.pid,
        });
        return response.data;
    }
);

interface RehabStrokeEventState {
    strokeEventData: StrokeEvent[];
}

const initialState: RehabStrokeEventState = {
    strokeEventData: [],
}

const strokeEventSlice = createSlice({
    name: 'strokeEvents',
    initialState,
    reducers: {},
    extraReducers: (builder: ActionReducerMapBuilder<RehabStrokeEventState>) => {
        builder.addCase(getStrokeEvents.fulfilled, (state, action) => {
            state.strokeEventData = action.payload;
            console.log("stroke event action", action.payload);
        });
    },
});

export default strokeEventSlice.reducer;


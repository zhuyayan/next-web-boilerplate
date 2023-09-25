import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {AxiosResponse} from "axios";
import MCTAxiosInstance from "@/utils/mct-request";

export interface Suggestion {
    suggestion_id: number;
    suggestion: string;
}

export const getSuggestion = createAsyncThunk<Suggestion, {task_id: number}, {}>(
    'getSuggestion',
    async ({task_id}):Promise<any> => {
        const response:AxiosResponse<any, any> = await MCTAxiosInstance.get(`suggestion/${task_id}`)
        console.log("get suggestion async thunk: ", response.data.data)
        return response.data.data;
    });

export const postSuggestion = createAsyncThunk<Suggestion, {task_id: number, suggestion_id: number, suggestion_text: string}, {}>(
    'postSuggestion',
    async ({task_id, suggestion_id, suggestion_text}):Promise<any> => {
        let putSugg: {suggestion_id:number, suggestion_text: string} = {
            suggestion_id: suggestion_id,
            suggestion_text: suggestion_text
        }
        const response:AxiosResponse<any, any> = await MCTAxiosInstance.put(`suggestion/${task_id}`, putSugg)
        console.log("post suggestion async thunk: ", response.data.data)
        //return response.data.data;
    });

interface RehabSuggestionState {
    suggestionData: Suggestion | null
}

const initialState: RehabSuggestionState = {
    suggestionData: null,
}

const suggestionSlice = createSlice({
    name: "suggestion",
    initialState: initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getSuggestion.fulfilled, (state, action) => {
                console.log("getSuggestion.fulfilled", action.payload)
                state.suggestionData = action.payload;
            })
    }
})

export default suggestionSlice.reducer
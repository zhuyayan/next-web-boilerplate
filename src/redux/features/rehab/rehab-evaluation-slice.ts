import {ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosResponse} from "axios";
import MCTAxiosInstance from "@/utils/mct-request";

export interface Evaluation {
    id: number;
    rehab_session_id: number;
    tolerance: string;
    motion_review: string;
    spasm_review: string;
    muscle_tone: string;
    acute_state: string;
    neuro_judgment: string;
    motion_injury: string;
    common_evaluation: CommonEvaluation[];
}

export interface CommonEvaluation {
    id: number;
    rehab_session_id: number;
    evaluation_item: string;
    evaluation_value: string;
}

export const getEvaluation = createAsyncThunk<Evaluation, {task_id: number}, {}>(
    'getEvaluation',
    async ({task_id}):Promise<any> => {
        const response:AxiosResponse<any, any> = await MCTAxiosInstance.get(`train/evaluation?task_id=${task_id}`)
        console.log("get assessment async thunk: ", response.data.data)
        //return convertApiEvaluationToEvaluationModel(response.data.data)
        return response.data.data
    });

interface RehabAssessmentState {
    evaluationData: Evaluation | null
}

const initialState: RehabAssessmentState = {
    evaluationData: null
}

const evaluationSlice = createSlice({
    name: "evaluation",
    initialState: initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getEvaluation.fulfilled, (state, action) => {
                console.log("getEvaluation.fulfilled", action.payload)
                state.evaluationData = action.payload;
            })
    }
})

export default evaluationSlice.reducer


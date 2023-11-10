import {ActionReducerMapBuilder, createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {AxiosResponse} from "axios";
import MCTAxiosInstance from "@/utils/mct-request";

export interface AllData {
    code: number;
    data: {
        form_fields: formField[];
        submission: SubmissionData;
    };
    msg: string;
}
export interface formField {
    id: number;
    name: string;
    label: string;
    help_text:string;
    type: string;
    render_type: string;
    group_id: number;
    group_name: string;
    options: option[];
    dependencies: formField;
    form_field_roles: formFieldRole[];
}

export interface option {
    option_id: number;
    value: string;
    label: string;
}

export interface formFieldRole {
    role_id: number;
    role_name: string;
}

export interface SubmissionField {
    form_field_name: string;
    value: string;
}

export interface SubmissionData {
    fields: SubmissionField[];
    owner_id: number;
}

export const getFormFields = createAsyncThunk<AllData>('getFormFields', async (_, thunkAPI) => {
    const response: AxiosResponse<AllData> = await MCTAxiosInstance.get('form-fields?result_owner_id=456');
    console.log('get form-fields async thunk: ', response.data);
    return response.data;
});


export const submitForm = createAsyncThunk(
    'submitForm',
    async (submissionData: SubmissionData, thunkAPI) => {
        const response: AxiosResponse<any, any> = await MCTAxiosInstance.post('form-fields', {
            form_sub_mission: submissionData,
        });
        console.log("submit form async thunk: ", response.data);
        // 返回修改后的数据或其他响应
        return response.data;
    },
);

interface RehabFormFieldsState {
    formFieldsData: formField[];
    submissionData: SubmissionField[];
}

const initialState: RehabFormFieldsState = {
    formFieldsData: [],
    submissionData: [],
}

const formFieldsSlice = createSlice({
    name: 'formFields',
    initialState,
    reducers: {},
    extraReducers: (builder: ActionReducerMapBuilder<RehabFormFieldsState>) => {
        builder.addCase(getFormFields.fulfilled, (state, action) => {
            state.formFieldsData = action.payload.data.form_fields;
            state.submissionData = action.payload.data.submission.fields;
        });
    },
});



export default formFieldsSlice.reducer
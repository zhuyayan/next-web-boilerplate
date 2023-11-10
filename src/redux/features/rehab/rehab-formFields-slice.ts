import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {AxiosResponse} from "axios";
import MCTAxiosInstance from "@/utils/mct-request";
import {Suggestion} from "@/redux/features/rehab/rehab-suggestion-slice";
import {string} from "postcss-selector-parser";
import {Patient} from "@/redux/features/rehab/rehab-slice";

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

export interface fields {
    form_field_name: string;
    value: string;
}

export interface SubmissionField {
    fields:fields[];
    owner_id:number;
}

export interface SubmissionData {
    formID:number;
    form_sub_mission: SubmissionField;
    result_owner_id: number;
}

export const getFormFields = createAsyncThunk<AllData,{result_owner_id:number}>('getFormFields',
  async ({result_owner_id}):Promise<any> => {
    const response: AxiosResponse<any, any> = await MCTAxiosInstance.get('form-fields',
      {params:{result_owner_id: result_owner_id}});
    console.log('get form-fields async thunk: ', response.data);
    return response.data;
});

export const getFormFieldsTemplate = createAsyncThunk<AllData>('getFormFieldsTemplate', async (_, thunkAPI) => {
    const response: AxiosResponse<AllData> = await MCTAxiosInstance.get('form-fields/template?owner_id=0');
    console.log('get form-fields template async thunk: ', response.data);
    return response.data;
});

// SubmissionData
export const submitForm = createAsyncThunk<FormData, SubmissionData>(
  'submitForm',
  async (submissionData, thunkAPI) => {
      console.log("submitForm", submissionData)
      try {
          const response: AxiosResponse<FormData> = await MCTAxiosInstance.post(
            `form-fields`,
            submissionData
          );
          console.log('submit form async thunk: ', response.data);
          return response.data;
      } catch (error) {
          // 处理错误，例如抛出一个自定义错误对象
          throw new Error('提交表单时发生错误');
      }
  }
);

export const deleteFields = createAsyncThunk<{id: number}, {id: number}, {}>('form-fields', async ({id}):Promise<any> => {
    const response:AxiosResponse<any, any> = await MCTAxiosInstance.delete('form-fields', {params:{ id }});
    console.log("delete form-fields async thunk: ", response.data)
    return {id: id}
});

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
    extraReducers: (builder) => {
        builder.addCase(getFormFields.fulfilled, (state, action) => {
            state.submissionData = action.payload.data;
            console.log("abca", action.payload.data)
        }).addCase(getFormFieldsTemplate.fulfilled,(state, action) => {
            state.formFieldsData = action.payload.data.form_fields;
        });
    },
});

export default formFieldsSlice.reducer
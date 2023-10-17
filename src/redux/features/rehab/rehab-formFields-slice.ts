import {ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosResponse} from "axios";
import MCTAxiosInstance from "@/utils/mct-request";

export interface formField {
    id: number;
    name: string;
    label: string;
    type: string;
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

export const getFormFields = createAsyncThunk<formField>(
    'getFormFields',
    async (_, thunkAPI): Promise<formField> => {
        const response: AxiosResponse<any, any> = await MCTAxiosInstance.get('form-fields');
        console.log("get form-fields async thunk: ", response.data.data)
        return response.data.data
    },
);

interface RehabFormFieldsState {
    formFieldsData: formField[];
}

const initialState: RehabFormFieldsState = {
    formFieldsData: [],
}

// ...

const formFieldsSlice = createSlice({
    name: 'formFields',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getFormFields.fulfilled, (state, action) => {
            state.formFieldsData = action.payload;
        });
    },
});

export default formFieldsSlice.reducer
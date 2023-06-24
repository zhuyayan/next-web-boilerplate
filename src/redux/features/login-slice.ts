import {ActionReducerMapBuilder, createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios, {AxiosResponse} from "axios";
import {WritableDraft} from "immer/dist/types/types-external";

interface LoginState {
    username: string,
    password: string
}

const initialState: LoginState = {
    username: 'zhuyayan',
    password: 'admin',
}

export const fetchData = createAsyncThunk('data/fetchData', async ():Promise<any> => {
    const response:AxiosResponse<any, any> = await axios.get('api/login');
    return response.data;
});

const LoginSlice = createSlice({
    name: 'login',
    initialState: initialState,
    reducers: {
        logIn:(state, action) => {
            console.log("login", action.payload)
            state.username = action.payload
        },
        logOut: (state, action) => {
            state.password = action.payload
        }
    },
    extraReducers: (builder: ActionReducerMapBuilder<LoginState>) => {
        builder
            .addCase(fetchData.pending, (state: WritableDraft<LoginState>) => {
                state.username = ''
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                console.log('action', action.payload)
            })
            .addCase(fetchData.rejected, (state, action) => {
                
            })
    },
})

export const {logIn, logOut} = LoginSlice.actions

export default LoginSlice.reducer
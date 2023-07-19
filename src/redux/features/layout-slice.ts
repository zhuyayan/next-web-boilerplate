import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosResponse} from "axios/index";
import MCTAxiosInstance from "@/utils/mct-request";
import {Prescription} from "@/redux/features/rehab/rehab-slice";

export interface RSConfig {
    Hospital: {
        Name: string
    }
}

let rsConfig: RSConfig = {
    Hospital: {
        Name: ''
    }
}
interface AppBarState {
    height: number
    rsConfig: RSConfig
}

const initialState: AppBarState = {
    height: 64,
    rsConfig: rsConfig
}

function convertApiConfigToConfig(obj: any): RSConfig {
    return {
        Hospital: {
            Name: obj.hospital.name
        }
    }
}
export const fetchConfig = createAsyncThunk<RSConfig>('fetchConfig', async ():Promise<any> => {
    const response:AxiosResponse<any, any> = await MCTAxiosInstance.get('config');
    console.log("fetch config by async thunk: ", response.data.data)
    return convertApiConfigToConfig(response.data.data)
});

export const putConfig = createAsyncThunk<RSConfig, {hospital: {name: string}}, {}>('putConfig', async (arg):Promise<any> => {
    const response:AxiosResponse<any, any> = await MCTAxiosInstance.put('config', arg);
    console.log("put config by async thunk: ", response.data.data)
    return convertApiConfigToConfig(response.data.data)
});

const appBarSlice = createSlice({
    name: 'appBar',
    initialState: initialState,
    reducers: {
        setHeight: (state, action: PayloadAction<number>) => {
            state.height = action.payload;
        },
        setHospitalName: (state, action) => {
            state.rsConfig.Hospital.Name = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchConfig.fulfilled, (state, action) => {
            state.rsConfig.Hospital.Name = action.payload.Hospital.Name
            console.log("fetchConfig -> ", action.payload)
        })
    }
})

export const { setHeight, setHospitalName } = appBarSlice.actions;
export default appBarSlice.reducer;
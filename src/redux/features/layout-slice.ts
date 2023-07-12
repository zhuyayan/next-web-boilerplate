import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppBarState {
    height: number
    hospitalName: string
}

const initialState: AppBarState = {
    height: 64,
    hospitalName: '上海市静安区彭浦社区卫服务中心'
}

const appBarSlice = createSlice({
    name: 'appBar',
    initialState: initialState,
    reducers: {
        setHeight: (state, action: PayloadAction<number>) => {
            state.height = action.payload;
        },
        setHospitalName: (state, action) => {
            state.hospitalName = action.payload
        }
    },
})

export const { setHeight, setHospitalName } = appBarSlice.actions;
export default appBarSlice.reducer;
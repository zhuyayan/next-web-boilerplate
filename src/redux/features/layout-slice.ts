import { createSlice, PayloadAction } from '@reduxjs/toolkit';
const appBarSlice = createSlice({
    name: 'appBar',
    initialState: {height: 64},
    reducers: {
        setHeight: (state, action: PayloadAction<number>) => {
            state.height = action.payload;
        },
    },
})

export const { setHeight } = appBarSlice.actions;
export default appBarSlice.reducer;
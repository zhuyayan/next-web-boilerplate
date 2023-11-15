import {createSlice} from "@reduxjs/toolkit";

export interface StrengthMerge {
  leftStrengthMerge: number[];
  rightStrengthMerge: number[];
}

export interface StrokeStrength {
  strengthMerge: StrengthMerge;
}

const initialState: StrokeStrength = {
  strengthMerge: {
    leftStrengthMerge: [],
    rightStrengthMerge: [],
  }
}

const strokeStrengthSlice = createSlice({
  name: 'strokeStrength',
  initialState,
  reducers: {
    mergePressData:(state, action) =>{
      // console.log("mergePressData", state, action)
      // console.log(typeof state)
      if(action.payload.type == "left") {
        console.log("rightStrengthMerge left")
        state.strengthMerge.leftStrengthMerge = [...state.strengthMerge.leftStrengthMerge, ...action.payload.data];
        console.log(state.strengthMerge.leftStrengthMerge)
      } else if (action.payload.type == "right") {
        console.log("rightStrengthMerge right")
        state.strengthMerge.rightStrengthMerge = [...state.strengthMerge.rightStrengthMerge, ...action.payload.data]
        console.log(state.strengthMerge.rightStrengthMerge)
      }
    },
    clearPressData: (state, action) => {
      console.log("clearPressData", state, action)
    }
  },
});


export const { mergePressData, clearPressData } = strokeStrengthSlice.actions;
export default strokeStrengthSlice.reducer;
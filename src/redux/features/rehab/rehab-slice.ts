import {ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios, {AxiosResponse} from "axios";
import {WritableDraft} from "immer/dist/types/types-external";

export interface MedicalStaff {
  id: number;
  username: string;
  password: string;
  fullName: string;
}

// Default Staff
let medicalStaffList: MedicalStaff[] = [
  { id: 1, username: 'john', password: 'password', fullName: 'John Doe' },
  { id: 2, username: 'jane', password: 'password', fullName: 'Jane Smith' },
  // Add more medical staff members as needed
];

interface RehabState {
  staff: MedicalStaff[]
}

const initialState: RehabState = {
  staff: medicalStaffList,
}

export const fetchData = createAsyncThunk('data/fetchData', async ():Promise<any> => {
  const response:AxiosResponse<any, any> = await axios.get('api/login');
  return response.data;
});

const RehabSlice = createSlice({
  name: 'rehab',
  initialState: initialState,
  reducers: {
    addMedicalStaff:(state, action: PayloadAction<MedicalStaff>) => {
      const maxId = state.staff.reduce((max, item) => {
        return item.id > max ? item.id : max
      }, 0)
      action.payload.id = maxId + 1
      state.staff.push(action.payload)
    },
    editMedicalStaff: (state, action: PayloadAction<MedicalStaff>) => {
      let targetMedicalStaffIndex = state.staff.findIndex((staff) => staff.id === action.payload.id)
      if (targetMedicalStaffIndex !== -1) {
        state.staff[targetMedicalStaffIndex] = {
          ...state.staff[targetMedicalStaffIndex],
          username: action.payload.username,
          password: action.payload.password,
          id: action.payload.id,
          fullName: action.payload.fullName,
        };
      }
    },
    deleteMedicalStaff: (state, action:PayloadAction<number>) => {
      state.staff = state.staff.filter((staff) => staff.id !== action.payload);
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<RehabState>) => {
    builder
        .addCase(fetchData.pending, (state: WritableDraft<RehabState>) => {
        })
        .addCase(fetchData.fulfilled, (state, action) => {
          console.log('action', action.payload)
        })
        .addCase(fetchData.rejected, (state, action) => {

        })
  },
})

export const {addMedicalStaff, editMedicalStaff, deleteMedicalStaff} = RehabSlice.actions

export default RehabSlice.reducer
import {ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosResponse} from "axios";
import {WritableDraft} from "immer/dist/types/types-external";
import MCTAxiosInstance from "@/utils/mct-request";

export interface MedicalStaff {
  id: number;
  username: string;
  password: string;
  fullName: string;
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  medicalHistory: string;
}

// Default Staff
//let medicalStaffList: MedicalStaff[] = [
//  { id: 1, username: 'john', password: 'password', fullName: 'John Doe' },
//  { id: 2, username: 'jane', password: 'password', fullName: 'Jane Smith' },
  // Add more medical staff members as needed
//];
let medicalStaffList: MedicalStaff[] = []
// let patients: Patient[] = [
//   { id: 1, name: 'John Doe', age: 30, gender: 'Male', medicalHistory: 'Lorem ipsum dolor sit amet' },
//   { id: 2, name: 'Jane Smith', age: 40, gender: 'Female', medicalHistory: 'Lorem ipsum dolor sit amet' },
//   // Add more patients as needed
// ];
let patients: Patient[] = []

interface RehabState {
  staff: MedicalStaff[]
  patient: Patient[]
}

const initialState: RehabState = {
  staff: medicalStaffList,
  patient: patients,
}

export const fetchMedicalStaff = createAsyncThunk('fetchMedicalStaff', async ():Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.get(
      'staff',
      {
        params: {
          page: 1,
          size: 10
        }
      }
  );
  return response.data;
});

export const fetchPatients = createAsyncThunk('fetchPatients', async ():Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.get(
      'patient',
      {
        params: {
          page: 1,
          size: 10
      }
    }
  );
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
    addPatient:(state,action: PayloadAction<Patient>)=>{
      const maxId = state.patient.reduce((max, item) => {
        return item.id > max ? item.id : max
      }, 0)
      action.payload.id = maxId + 1
      state.patient.push(action.payload)
    },
    editPatient:(state, action: PayloadAction<Patient>)=>{
      let targetPatientIndex = state.patient.findIndex((p) => p.id === action.payload.id)
      if (targetPatientIndex !== -1) {
        state.patient[targetPatientIndex] = {
          ...state.patient[targetPatientIndex],
          name: action.payload.name,
          age: action.payload.age,
          gender: action.payload.gender,
          medicalHistory: action.payload.medicalHistory
        }
      }
    },
    deletePatient:(state, action: PayloadAction<number>)=>{
      state.patient = state.patient.filter((patient) => patient.id !== action.payload);
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<RehabState>) => {
    builder
        .addCase(fetchPatients.pending, (state: WritableDraft<RehabState>) => {
        })
        .addCase(fetchPatients.fulfilled, (state, action) => {
          state.patient = action.payload.data.patients
          console.log('action', action.payload)
        })
        .addCase(fetchPatients.rejected, (state, action) => {

        })

    builder
        .addCase(fetchMedicalStaff.pending, (state: WritableDraft<RehabState>) => {
        })
        .addCase(fetchMedicalStaff.fulfilled, (state, action) => {
          state.patient = action.payload.data.medicalStaffList
          console.log('action', action.payload)
        })
        .addCase(fetchMedicalStaff.rejected, (state, action) => {

        })
  },

})

export const {
  addMedicalStaff,
  editMedicalStaff,
  deleteMedicalStaff,
  addPatient,
  editPatient,
  deletePatient
} = RehabSlice.actions

export default RehabSlice.reducer
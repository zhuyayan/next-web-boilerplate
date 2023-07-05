import {ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {AxiosResponse} from "axios";
import {WritableDraft} from "immer/dist/types/types-external";
import MCTAxiosInstance from "@/utils/mct-request";
import {genderLabelToValue, getDefaultGenderLabel, getDefaultGenderValue} from "@/utils/mct-utils";

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
  genderLabel: string;
  medicalHistory: string;
  physician:string;
}

// Default Staff
// let medicalStaffList: MedicalStaff[] = [
//   { id: 1, username: 'john', password: 'password', fullName: 'John Doe' },
//   { id: 2, username: 'jane', password: 'password', fullName: 'Jane Smith' },
//   // Add more medical staff members as needed
// ];

// let patients: Patient[] = [
//   { id: 1, name: 'John Doe', age: 30, gender: 'Male', medicalHistory: 'Lorem ipsum dolor sit amet' },
//   { id: 2, name: 'Jane Smith', age: 40, gender: 'Female', medicalHistory: 'Lorem ipsum dolor sit amet' },
//   // Add more patients as needed
// ];

let staffs: MedicalStaff[] = []
let patients: Patient[] = []
let patient: Patient = {
  id: 0,
  name: '',
  age: 0,
  gender: getDefaultGenderValue(),
  genderLabel: getDefaultGenderLabel(),
  medicalHistory: '',
  physician: '',
}

interface RehabState {
  staff: MedicalStaff[]
  patient: Patient[]
  rehabPatient: Patient
}

const initialState: RehabState = {
  staff: staffs,
  patient: patients,
  rehabPatient: patient,
}

function convertAPIPatientToPatient(apiStaff: any): Patient {
  return {
    id: apiStaff.id,
    name: apiStaff.name,
    age: apiStaff.age,
    gender: genderLabelToValue(apiStaff.sex),
    genderLabel: apiStaff.sex,
    medicalHistory: apiStaff.medical_history,
    physician: apiStaff.staff.name,
  };
}

export const fetchPatients = createAsyncThunk<Patient[], {page: number, size: number, id: number}, {}>('fetchPatients', async ({page, size, id}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.get('patient', {params:{ page, size, id}});
  console.log("fetch patient async thunk: ", response.data.data.patients)
  return response.data.data.patients.map(convertAPIPatientToPatient)
});

export const fetchPatientById = createAsyncThunk<Patient, { id: number}, {}>('fetchPatientById', async ({ id}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.get('patient', {params:{ page: 1, size: 10, id}});
  console.log("fetch patient by id async thunk: ", response.data.data.patients)
  let p = response.data.data.patients.map(convertAPIPatientToPatient)
  console.log('p', p)
  return p[0]
});

export const deletePatient = createAsyncThunk<{id: number}, {id: number}, {}>('deletePatient', async ({id}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.delete('patient', {params:{ id }});
  console.log("delete patient async thunk: ", response.data)
  return {id: id}
});

export const addPatient = createAsyncThunk<Patient, { name: string, age: number, sex: string, medical_history: string, staff_id: number}, {}>('addPatient', async ({name, age, sex, medical_history, staff_id}, thunkAPI):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.post('patient',{name, age, sex, medical_history, staff_id})
  console.log("add patient async thunk: ", response.data.data.patients[0])
  return convertAPIPatientToPatient(response.data.data.patients[0])
});

export const editPatient = createAsyncThunk<Patient, { id: number, name: string, age: number, sex: string, medical_history: string, staff_id: number }, {}>('editPatient', async ({id, name, age, sex, medical_history, staff_id}, thunkAPI):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.put('patient',{id, name, age, sex, medical_history, staff_id})
  console.log("edit patient async thunk: ", response.data.data.patients[0])
  return convertAPIPatientToPatient(response.data.data.patients[0])
});

function convertAPIStaffToMedicalStaff(apiStaff: any): MedicalStaff {
  return {
    id: apiStaff.id,
    username: apiStaff.username,
    password: apiStaff.password,
    fullName: apiStaff.name,
  };
}
export const fetchStaffs = createAsyncThunk<MedicalStaff[], {page: number, size: number, id: number}, {}>(
    'fetchStaff',
    async ({page, size, id}):Promise<any> => {
      const response:AxiosResponse<any, any> = await MCTAxiosInstance.get('staff',{ params:{ page, size, id}})
      console.log("fetch staff async thunk: ", response.data.data.staffs)
      return response.data.data.staffs.map(convertAPIStaffToMedicalStaff)
});

export const deleteStaff = createAsyncThunk<{ id: number }, { id: number }, {}>('deleteStaff', async ({id}, thunkAPI):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.delete('staff',{ params:{ id } })
  console.log("delete staff async thunk: ", response.data)
  return {id: id}
});

export const addStaff = createAsyncThunk<MedicalStaff, { name: string, username: string, password: string }, {}>('addStaff', async ({name, username, password}, thunkAPI):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.post('staff',{name, username, password})
  console.log("add staff async thunk: ", response.data.data.staffs[0])
  return convertAPIStaffToMedicalStaff(response.data.data.staffs[0])
});

export const editStaff = createAsyncThunk<MedicalStaff, { id: number, name: string, username: string, password: string }, {}>('editStaff', async ({id, name, username, password}, thunkAPI):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.put('staff',{id, name, username, password})
  console.log("add staff async thunk: ", response.data.data.staffs[0])
  return convertAPIStaffToMedicalStaff(response.data.data.staffs[0])
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
    addPatient1:(state,action: PayloadAction<Patient>)=>{
      const maxId = state.patient.reduce((max, item) => {
        return item.id > max ? item.id : max
      }, 0)
      action.payload.id = maxId + 1
      state.patient.push(action.payload)
    },
    editPatient1:(state, action: PayloadAction<Patient>)=>{
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
    deletePatient1:(state, action: PayloadAction<number>)=>{
      state.patient = state.patient.filter((patient) => patient.id !== action.payload);
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<RehabState>) => {
    builder
        .addCase(fetchPatients.pending, (state: WritableDraft<RehabState>) => {
        })
        .addCase(fetchPatients.fulfilled, (state, action) => {
          state.patient = action.payload
          console.log('fetch_patient_action', action.payload)
        })
        .addCase(fetchPatients.rejected, (state, action) => {

        })
        .addCase(fetchStaffs.fulfilled,(state,action)=>{
          state.staff = action.payload
          console.log('fetch_staff_action', action.payload)
        })
        .addCase(deleteStaff.fulfilled,(state,action)=>{
          // 重新分页查询
          state.staff = state.staff.filter((item) => {
            return item.id != action.payload.id
          })
          console.log('delete_staff_action', action.payload)
        })
        .addCase(addStaff.fulfilled,(state, action) => {
          console.log("add_staff_action", action.payload)
        })
        .addCase(editStaff.fulfilled, (state, action) => {
          let targetPatientIndex = state.staff.findIndex((s) => s.id === action.payload.id)
          if (targetPatientIndex !== -1) {
            state.staff[targetPatientIndex] = {
              ...state.staff[targetPatientIndex],
              id: action.payload.id,
              fullName: action.payload.fullName,
              username: action.payload.username,
              password: action.payload.password,
            }
          }
          console.log("edit_staff_action", action.payload)
        })
        .addCase(fetchPatientById.fulfilled, (state, action) => {
          console.log("fetch_patient_by_id", action.payload)
          state.rehabPatient = action.payload
        })
  },
})

export const {
  addMedicalStaff,
  editMedicalStaff,
} = RehabSlice.actions

export default RehabSlice.reducer
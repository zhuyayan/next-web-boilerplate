import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {AxiosResponse} from "axios";
import {WritableDraft} from "immer/dist/types/types-external";
import MCTAxiosInstance from "@/utils/mct-request";
import {genderLabelToValue, getDefaultGenderLabel, getDefaultGenderValue, timeSampleFormat} from "@/utils/mct-utils";
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

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
  IDNumber:string;
}

export interface Prescription {
  id: number;
  created_at: string;
  part: string;
  mode: string;
  zz: number;
  u: number;
  v: number;
}
export interface PrescriptionRecord {
  id: number
  created_at: string
  eid: string
  pid: string
  state: string
  updated_at: string
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
let prescriptions: Prescription[] = []
let prescriptionRecord: PrescriptionRecord[] = []

let patient: Patient = {
  id: 0,
  name: '',
  age: 0,
  gender: getDefaultGenderValue(),
  genderLabel: getDefaultGenderLabel(),
  medicalHistory: '',
  physician: '',
  IDNumber: '',
}

interface RehabState {
  staff: MedicalStaff[]
  patient: Patient[]
  rehabPatient: Patient
  prescription: Prescription[]
  prescriptionRecord: PrescriptionRecord[]
}

const initialState: RehabState = {
  staff: staffs,
  patient: patients,
  rehabPatient: patient,
  prescription: prescriptions,
  prescriptionRecord: prescriptionRecord,
}

export type Channel = 'redux' | 'general'

export interface EquipmentOnlineWSMessage {
  code: number
  data: string[]
  msg: string
}

export interface RealTimeWSMessage {
  code: number
  data: {
    HT: string
    ID: string
    PID: string
    HTBD: string
    X: number
    Y: number
    ZZ: number
    CC: number
    U: number
    V: number
    TT: number
    WW: number
    S: number
    D: number[]
    CRC: number
  }
  msg: string
}

function isRealTimeWSMessage(object: any): object is RealTimeWSMessage {
  return (
      typeof object === 'object' &&
      object !== null &&
      typeof object.code === 'number' &&
      typeof object.msg === 'string' &&
      typeof object.data === 'object' &&
      object.data !== null &&
      typeof object.data.HT === 'string' &&
      typeof object.data.ID === 'string' &&
      typeof object.data.PID === 'string' &&
      typeof object.data.HTBD === 'string' &&
      typeof object.data.X === 'number' &&
      typeof object.data.Y === 'number' &&
      typeof object.data.ZZ === 'number' &&
      typeof object.data.CC === 'number' &&
      typeof object.data.U === 'number' &&
      typeof object.data.V === 'number' &&
      typeof object.data.TT === 'number' &&
      typeof object.data.WW === 'number' &&
      typeof object.data.S === 'number' &&
      Array.isArray(object.data.D) &&
      object.data.D.every((item: any) => typeof item === 'number') &&
      typeof object.data.CRC === 'number'
  )
}

function isEquipmentOnlineWSMessage(data: any): data is EquipmentOnlineWSMessage {
  return (
      typeof data === 'object' &&
      data !== null &&
      'code' in data &&
      'data' in data &&
      'msg' in data &&
      typeof data.id === 'number' &&
      typeof data.data === 'object' &&
      typeof data.msg === 'string'
  );
}

export interface RealTimeTrainData {
  D: number
}

export function isRealTimeTrainData(data: any): data is RealTimeTrainData {
  return typeof data === 'object' && 'D' in data && typeof data.D === 'number';
}

export const rehabApi = createApi({
  reducerPath: 'rehabApi',
  baseQuery: fetchBaseQuery({baseUrl: '/'}),
  endpoints:(builder) => ({
    getOnlineEquipments: builder.query<string[], Channel>({
      queryFn:() => {
        const data = [""];
        return { data };
      },
      async onCacheEntryAdded(arg,{updateCachedData, cacheDataLoaded, cacheEntryRemoved}){
        const ws = new WebSocket('ws://192.168.2.101:56567/api/v1/equipment/ws')
        try {
          await cacheDataLoaded
          const listener = (event: MessageEvent) => {
            const data: EquipmentOnlineWSMessage = JSON.parse(event.data)
            if (!isEquipmentOnlineWSMessage(data)) {
              // return
            }
            updateCachedData((draft= []) => {
              draft = []
              // Add each item from data.data to the draft
              data.data.forEach(item => draft.push(item))
              return draft
            })
          }
          ws.addEventListener('message', listener)
        }catch {
          console.log("ws error")
        }
        await cacheEntryRemoved
        ws.close()
        console.log("ws closed")
      }
    }),
    getTrainMessage: builder.query<RealTimeTrainData[], Channel>({
      queryFn:(channel) => {
        const data = [{D:0}];
        return { data };
      },
      async onCacheEntryAdded(arg,{updateCachedData, cacheDataLoaded, cacheEntryRemoved}){
        const ws = new WebSocket('ws://192.168.2.101:56567/api/v1/train/ws')
        try {
          const l = (event: MessageEvent) => {
            const data: RealTimeWSMessage = JSON.parse(event.data)
            if (!isRealTimeWSMessage(data)) {
              // return
            }
            updateCachedData((draft) => {
              draft = []
              if (!Array.isArray(draft)) {
                draft= []
              }
              // Add each item from data.data to the draft
              data.data.D.forEach(item => draft.push({D: item}))
              return draft
            })
          }
          ws.addEventListener('message', l)
        }catch {
          console.log("ws error")
        }
        await cacheEntryRemoved
        ws.close()
        console.log("ws closed")
      },
    }),
  }),
})

function convertAPIPatientToPatient(apiStaff: any): Patient {
  return {
    id: apiStaff.id,
    name: apiStaff.name,
    age: apiStaff.age,
    gender: genderLabelToValue(apiStaff.sex),
    genderLabel: apiStaff.sex,
    medicalHistory: apiStaff.medical_history,
    physician: apiStaff.staff.name,
    IDNumber: apiStaff.staff.IDNumber,
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

export const deletePatient = createAsyncThunk<{id: number}, {id: number}, {}>('deletePatient', async ({id}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.delete('patient', {params:{ id }});
  console.log("delete patient async thunk: ", response.data)
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

const BodyPartToNumMapping: { [key: number]: string } = {
  1: "左手",
  2: "右手",
  3: "左腕",
  4: "右腕",
  5: "左踝",
  6: "右踝",
  0: "无效",
};

const ModeToNumMapping: { [key: number]: string } = {
  1: "被动计次模式",
  2: "被动定时模式",
  3: "主动计次模式",
  4: "主动定时模式",
  5: "助力计次模式",
  6: "助力定时模式",
  7: "手动计次模式",
  0: "无效",
};

const StateToNumMapping: { [key: number]: string } = {
  1: "停止态",
  2: "暂停态",
  3: "伸动作态",
  4: "弯曲动作态",
  5: "伸保持态",
  6: "弯曲保持态",
};

function convertAPIPrescriptionToPrescription(apiPrescription: any): Prescription {
  return {
    id: apiPrescription.id,
    created_at: timeSampleFormat(apiPrescription.created_at),
    part: BodyPartToNumMapping[apiPrescription.part],
    mode: ModeToNumMapping[apiPrescription.mode],
    zz: apiPrescription.zz,
    u:apiPrescription.u,
    v:apiPrescription.v,
  }
}

export const fetchPrescriptionById = createAsyncThunk<Prescription[], { id: number}, {}>('fetchPrescriptionById', async ({ id}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.get('prescription', {params:{ page: 1, size: 10, id}});
  console.log("fetch prescription by id async thunk: ", response.data.data.prescriptions)
  let p = response.data.data.prescriptions.map(convertAPIPrescriptionToPrescription)
  console.log('prescription', p)
  return p
});

function convertAPIPrescriptionRecordToPrescriptionRecord(apiPrescriptionRecord: any): PrescriptionRecord {
  return {
    id: apiPrescriptionRecord.id,
    created_at: timeSampleFormat(apiPrescriptionRecord.created_at),
    eid: apiPrescriptionRecord.eid,
    pid: apiPrescriptionRecord.pid,
    state: apiPrescriptionRecord.state,
    updated_at: timeSampleFormat(apiPrescriptionRecord.updated_at),
  }
}
export const fetchPrescriptionRecordById = createAsyncThunk<PrescriptionRecord[], { id: number}, {}>('fetchPrescriptionRecordById', async ({ id}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.get('train', {params:{ page: 1, size: 10, id}});
  console.log("fetch prescription_record by id async thunk: ", response.data.data.tasks)
  let p = response.data.data.tasks.map(convertAPIPrescriptionRecordToPrescriptionRecord)
  console.log('prescription_record', p)
  return p
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
        .addCase(deletePatient.fulfilled,(state,action)=>{
          // 重新分页查询
          state.patient = state.patient.filter((item) => {
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
        .addCase(fetchPrescriptionById.fulfilled, (state, action) => {
          console.log("fetch_prescription_by_id", action.payload)
          state.prescription = action.payload
        })
        .addCase(fetchPrescriptionRecordById.fulfilled, (state, action) => {
          console.log("fetch_prescription_record_by_id", action.payload)
          state.prescriptionRecord = action.payload
        })
  },
})

export const { useGetOnlineEquipmentsQuery, useGetTrainMessageQuery } = rehabApi
export const {
  addMedicalStaff,
  editMedicalStaff,
} = RehabSlice.actions

export const selectTrainMessageResult = rehabApi.endpoints?.getTrainMessage.select("redux")
const selectTrainMessageData = createSelector(
    selectTrainMessageResult,
    msg => msg.data
)

export default RehabSlice.reducer
import {
  ActionReducerMapBuilder,
  createAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {AxiosResponse} from "axios";
import {WritableDraft} from "immer/dist/types/types-external";
import MCTAxiosInstance from "@/utils/mct-request";
import {
  BodyPartToNumMapping,
  genderLabelToValue,
  getDefaultGenderLabel,
  getDefaultGenderValue,
  ModeToNumMapping,
  timeSampleFormat
} from "@/utils/mct-utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {string} from "postcss-selector-parser";
import {saveAs} from "file-saver";

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
  physicianId:number;
  i18d:string;
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

let staffs: MedicalStaff[] = []
let patients: Patient[] = []
let prescriptions: Prescription[] = []
let prescriptionRecord: PrescriptionRecord[] = []
let onlineEquipment: EquipmentOnline[] = []


let patient: Patient = {
  id: 0,
  name: '',
  age: 0,
  gender: getDefaultGenderValue(),
  genderLabel: getDefaultGenderLabel(),
  medicalHistory: '',
  physician: '',
  physicianId: 0,
  i18d: '',
}

interface RehabState {
  staff: MedicalStaff[]
  patient: Patient[]
  rehabPatient: Patient
  prescription: Prescription[]
  prescriptionRecord: PrescriptionRecord[]
  onlineEquipment: EquipmentOnline[]
}

const initialState: RehabState = {
  staff: staffs,
  patient: patients,
  rehabPatient: patient,
  prescription: prescriptions,
  prescriptionRecord: prescriptionRecord,
  onlineEquipment: onlineEquipment,
}

export type Channel = 'redux' | 'general'

export interface EquipmentOnlineSIdClientIdMap {
  client_id: string
  s_id: number
}

export interface EquipmentOnlineWSMessage {
  code: number
  data: EquipmentOnlineSIdClientIdMap[]
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

function isEquipmentOnlineWSMessage(obj: any): obj is EquipmentOnlineWSMessage {
  return (
      obj &&
      typeof obj === "object" &&
      typeof obj.code === "number" &&
      typeof obj.msg === "string" &&
      Array.isArray(obj.data) &&
      obj.data.every((item: EquipmentOnlineSIdClientIdMap) => item.client_id && item.s_id != null)
  )
}

export interface RealTimeTrainData {
  D: number
}

export interface EquipmentOnline {
  sId: number
  clientId: string
}

export function isRealTimeTrainData(data: any): data is RealTimeTrainData {
  return typeof data === 'object' && 'D' in data && typeof data.D === 'number';
}

const latestOnlineEquipmentReceived = createAction<EquipmentOnline[]>(
    'latestOnlineEquipment/latestOnlineEquipmentReceived'
)
export const rehabApi = createApi({
  reducerPath: 'rehabApi',
  baseQuery: fetchBaseQuery({baseUrl: '/'}),
  endpoints:(builder) => ({
    getOnlineEquipments: builder.query<EquipmentOnline[], Channel>({
      queryFn:() => {
        return { data:[{
            sId: 0,
            clientId: "100000",
          }] }
      },
      async onCacheEntryAdded(arg,{updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch}){
        const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_ADDR + 'equipment/ws')
        try {
          await cacheDataLoaded
          const listener = (event: MessageEvent) => {
            const data: EquipmentOnlineWSMessage = JSON.parse(event.data)
            if (!isEquipmentOnlineWSMessage(data)) {
              // return
            }
            updateCachedData((draft) => {
              draft.length = 0
              if(data.data.length == 0) {
                draft.length = 0
                draft.push({sId: -1,clientId: '无在线设备'})
              } else {
                // Add each item from data.data to the draft
                data.data.forEach(item => draft.push({sId: item.s_id, clientId: item.client_id}))
                dispatch(
                    latestOnlineEquipmentReceived(data.data.map(item => ({
                      sId: item.s_id,
                      clientId: item.client_id,
                }))))
              }
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
        // const data = [{D:0}];
        return { data:[] };
      },
      async onCacheEntryAdded(arg,{updateCachedData, cacheDataLoaded, cacheEntryRemoved}){
        const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_ADDR + 'train/ws')
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

function convertAPIPatientToPatient(p: any): Patient {
  return {
    id: p.id,
    name: p.name,
    age: p.age,
    gender: genderLabelToValue(p.sex),
    genderLabel: p.sex,
    medicalHistory: p.medical_history,
    physician: p.staff.name,
    physicianId: p.staff.id,
    i18d: p.i_18_d,
  };
}

function convertAPIStaffToMedicalStaff(apiStaff: any): MedicalStaff {
  return {
    id: apiStaff.id,
    username: apiStaff.username,
    password: apiStaff.password,
    fullName: apiStaff.name,
  };
}

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

export const fetchPatients = createAsyncThunk<Patient[], {page: number, size: number, id: number}, {}>('fetchPatients', async ({page, size, id}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.get('patient', {params:{ page, size, id}});
  console.log("fetch patient async thunk: ", response.data.data.patients)
  return response.data.data.patients.map(convertAPIPatientToPatient)
});

// 查找病人
export const fetchPatientById = createAsyncThunk<Patient, { id: number}, {}>('fetchPatientById', async ({ id}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.get('patient', {params:{ page: 1, size: 10, id}});
  console.log("fetch patient by id async thunk: ", response.data.data.patients)
  let p = response.data.data.patients.map(convertAPIPatientToPatient)
  console.log('p', p)
  return p[0]
});

// 添加病人
export const addPatient = createAsyncThunk<Patient, { name: string, age: number, sex: string, medical_history: string, staff_id: number, i_18_d: string}, {}>('addPatient', async ({name, age, sex, medical_history, staff_id, i_18_d}, thunkAPI):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.post('patient',{name, age, sex, medical_history, staff_id, i_18_d})
  console.log("add patient async thunk: ", response.data.data.patients[0])
  return convertAPIPatientToPatient(response.data.data.patients[0])
});

// 修改病人
export const editPatient = createAsyncThunk<Patient, { id: number, name: string, age: number, sex: string, medical_history: string, staff_id: number, i_18_d: string }, {}>('editPatient', async ({id, name, age, sex, medical_history, staff_id,i_18_d}, thunkAPI):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.put('patient',{id, name, age, sex, medical_history, staff_id, i_18_d})
  console.log("edit patient async thunk: ", response.data.data.patients[0])
  return convertAPIPatientToPatient(response.data.data.patients[0])
});

// 删除病人
export const deletePatient = createAsyncThunk<{id: number}, {id: number}, {}>('deletePatient', async ({id}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.delete('patient', {params:{ id }});
  console.log("delete patient async thunk: ", response.data)
  return {id: id}
});

export const deletePrescription = createAsyncThunk<{id: number}, {id: number}, {}>('deletePrescription', async ({id}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.delete('prescription', {params:{ id }});
  console.log("delete prescription async thunk: ", response.data)
  return {id: id}
});

// 查找医护
export const fetchStaffs = createAsyncThunk<MedicalStaff[], {page: number, size: number, id: number}, {}>(
  'fetchStaff',
  async ({page, size, id}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.get('staff',{ params:{ page, size, id}})
  console.log("fetch staff async thunk: ", response.data.data.staffs)
  return response.data.data.staffs.map(convertAPIStaffToMedicalStaff)
});

// 添加医护
export const addStaff = createAsyncThunk<MedicalStaff, { name: string, username: string, password: string }, {}>('addStaff', async ({name, username, password}, thunkAPI):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.post('staff',{name, username, password})
  console.log("add staff async thunk: ", response.data.data.staffs[0])
  return convertAPIStaffToMedicalStaff(response.data.data.staffs[0])
});

// 修改医护
export const editStaff = createAsyncThunk<MedicalStaff, { id: number, name: string, username: string, password: string }, {}>('editStaff', async ({id, name, username, password}, thunkAPI):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.put('staff',{id, name, username, password})
  console.log("add staff async thunk: ", response.data.data.staffs[0])
  return convertAPIStaffToMedicalStaff(response.data.data.staffs[0])
});

// 删除医护
export const deleteStaff = createAsyncThunk<{ id: number }, { id: number }, {}>('deleteStaff', async ({id}, thunkAPI):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.delete('staff',{ params:{ id } })
  console.log("delete staff async thunk: ", response.data)
  return {id: id}
});

export const addPrescription = createAsyncThunk<Prescription, { pid: number, x: number, y: number , zz: number, u: number, v: number},
    {}>('addPrescription', async ({pid, x, y , zz, u, v}, thunkAPI):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.post('prescription',{pid, x, y , zz, u, v})
  console.log("add prescription async thunk: ", response.data.data.prescriptions[0])
  return convertAPIPrescriptionToPrescription(response.data.data.prescriptions[0])
});

export const editPrescription = createAsyncThunk<Prescription, {id: number, x: number, y: number, zz: number, u: number, v:number}, {}>('editPrescription', async ({id, x, y, zz, u, v}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.put('prescription', { id, x, y, zz, u, v});
  console.log("edit prescription: ", response.data)
  return convertAPIPrescriptionToPrescription(response.data.data.prescriptions[0])
});

export const fetchPrescriptionById = createAsyncThunk<Prescription[], { id: number}, {}>('fetchPrescriptionById', async ({ id}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.get('prescription', {params:{ page: 1, size: 10, id}});
  console.log("fetch prescription by id async thunk: ", response.data.data.prescriptions)
  let p = response.data.data.prescriptions.map(convertAPIPrescriptionToPrescription)
  console.log('prescription', p)
  return p
});

export const fetchPrescriptionByPId = createAsyncThunk<Prescription[], { pid: number}, {}>('fetchPrescriptionByPId', async ({ pid}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.get('prescription', {params:{ page: 1, size: 10000, pid}});
  console.log("fetch prescription by id async thunk: ", response.data.data.prescriptions)
  let p = response.data.data.prescriptions.map(convertAPIPrescriptionToPrescription)
  console.log('prescription', p)
  return p
});

export const sendPrescriptionToEquipment = createAsyncThunk<number, {prescription_id: number, e_id: string}, {}>('sendPrescriptionToEquipment', async ({prescription_id, e_id}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.get('prescription/command', {params:{ prescription_id, e_id}});
  console.log("send prescription to equipment: ", response.data)
  return response.data.code
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

export const exportTaskPressureData = createAsyncThunk<{}, {tId: number, pId: number}, {}>('exportPressureData', async ({tId, pId}):Promise<any> => {
  try {
    const response = await MCTAxiosInstance.get('record', {
      responseType: 'blob',
      params: {t_id:tId, p_id: pId}
    });

    // Create a Blob from the response data
    const fileBlob = new Blob([response.data], { type: response.headers['content-type'] });
    const contentDispositionHeader = response.headers['content-disposition'];
    console.log('Headers -> ', response.headers)
    console.log('contentDispositionHeader -> ', contentDispositionHeader)
    let filename = 'downloadedFile'; // Default filename if the header doesn't have one
    if (contentDispositionHeader) {
      const match = contentDispositionHeader.match(/filename=(?<filename>[^;]+)/);
      if (match && match.groups && match.groups.filename) {
        filename = match.groups.filename;
      }
    }
    const decodedFileName = decodeURIComponent(filename)
    saveAs(fileBlob, decodedFileName);
  } catch (error) {
    throw new Error('File download failed.');
  }
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
        .addCase(fetchPatients.pending, (state: WritableDraft<RehabState>) => {})
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
          console.log('delete_Patient_action', action.payload)
        })
        .addCase(addPatient.fulfilled, (state, action) => {
          state.patient.unshift(action.payload)
        })
        .addCase(editPatient.fulfilled, (state, action) => {
          const updatedPatient = action.payload;
          state.patient = state.patient.map((patient) => {
            if (patient.id === updatedPatient.id) {
              return updatedPatient;
            }
            return patient;
          });
        })
        .addCase(addStaff.fulfilled,(state, action) => {
          state.staff.unshift(action.payload)
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
          console.log("edit staff action", action.payload)
        })
        .addCase(fetchPatientById.fulfilled, (state, action) => {
          console.log("fetch patient by id", action.payload)
          state.rehabPatient = action.payload
        })
        .addCase(fetchPrescriptionById.fulfilled, (state, action) => {
          console.log("fetch prescription by id", action.payload)
          state.prescription = action.payload
        })
        .addCase(fetchPrescriptionByPId.fulfilled, (state, action) => {
          console.log("fetch prescription by pid", action.payload)
          state.prescription = action.payload
        })
        .addCase(fetchPrescriptionRecordById.fulfilled, (state, action) => {
          console.log("fetch prescription record by id", action.payload)
          state.prescriptionRecord = action.payload
        })
        .addCase(sendPrescriptionToEquipment.fulfilled, (state, action) => {
          console.log("send prescription to equipment code -> ", action.payload)
        })

        .addCase(deletePrescription.fulfilled,(state,action)=>{
          // 重新分页查询
          state.prescription = state.prescription.filter((item) => {
            return item.id != action.payload.id
          })
          console.log('delete prescription action', action.payload)
        })
        .addCase(addPrescription.fulfilled, (state, action) => {
          state.prescription.unshift(action.payload)
        })
        .addCase(editPrescription.fulfilled, (state, action) => {
          const updatedPrescription = action.payload;
          state.prescription = state.prescription.map((prescription) => {
            if (prescription.id === updatedPrescription.id) {
              return updatedPrescription;
            }
            return prescription;
          });
          console.log("edit prescription -> ", action.payload)
        })
        .addMatcher(rehabApi.endpoints?.getOnlineEquipments.matchFulfilled, (state, action) => {
          console.log("addMatcher rehabApi getOnlineEquipments fulfilled -> ", action.payload, action.type)
        })
        .addMatcher(latestOnlineEquipmentReceived.match, (state, action) =>{
          console.log("latestOnlineEquipmentReceived.match -> ",state.prescriptionRecord, action)
          state.onlineEquipment = action.payload
        })
  },
})

export const { useGetOnlineEquipmentsQuery, useGetTrainMessageQuery } = rehabApi
export default RehabSlice.reducer
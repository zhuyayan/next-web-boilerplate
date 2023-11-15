import {ActionReducerMapBuilder, createAction, createAsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {AxiosResponse} from "axios";
import {WritableDraft} from "immer/dist/types/types-external";
import MCTAxiosInstance from "@/utils/mct-request";
import {
  BodyPartToNumMapping,
  genderLabelToValue,
  GetCurrentDate,
  getDefaultGenderLabel,
  getDefaultGenderValue,
  GetOneYearAgoDate,
  ModeToNumMapping,
  timeSampleFormat
} from "@/utils/mct-utils";
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {string} from "postcss-selector-parser";
import {saveAs} from "file-saver";
import {Assessment, getAssessment} from "@/redux/features/rehab/rehab-assessment-slice";
import {channel} from "diagnostics_channel";

export interface MedicalStaff {
  id: number;
  username: string;
  password: string;
  fullName: string;
}

export interface PatientStatus {
  id: number;
  pid: number;
  task_id: number;
  min_heart_rate : number;
  max_heart_rate : number;
  avg_heart_rate : number;
  left_max_strength:number;
  left_avg_strength: number;
  right_max_strength:number;
  right_avg_strength: number;

}

export interface RehabEvaluation {
  RehabSessionID: number;
  Tolerance:      string;
  MotionReview:   string;
  SpasmReview:    string;
  MuscleTone:     string;
  AcuteState:     string;
  NeuroJudgment:  string;
  MotionInjury:   string;
}
export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  genderLabel: string;
  medicalHistory: string;
  mediaStrokeType:number;
  mediaStrokeLevel:number;
  physician:string;
  physicianId:number;
  i18d:string;
}

export interface Prescription {
  id: number;
  created_at: string;
  part: string;
  mode: string;
  zz: number | string;
  u: number | string;
  v: number | string;
  duration?: number;
  frequency_per_day: number | string;
  total_days: number | string;
  prescription_record?: PrescriptionRecord[];
}

export interface BalloonPrescription {
  p_id: number;
  e_id:string;
  part: string;
  mode: string;
}


export interface Evaluation {
  pid: number;
  acute_state: string;
  motion_injury: string;
  motion_review: string;
  muscle_tone: string;
  neuro_judgment: string;
  rehab_session_id: number;
  spasm_review: string;
  tolerance: string
}

export interface AddPrescriptionItem {
  part: string;
  mode: string;
  zz: number | string;
  u: number | string;
  v: number | string;
  duration?: number | string;
  frequency_per_day:number;
  total_days:number;
}

export interface PrescriptionRecord {
  id: number;
  created_at: string;
  eid: string;
  pid: string;
  state: string;
  updated_at: string;
}

export interface EvaluateFormProps {
  tolerance: string;
  motionReview: string;
  spasmReview: string;
  muscleTone: string;
  acuteState: string;
  neuroJudgment: string;
  motionInjury: string;
}

// export interface  systemInformation

let staffs: MedicalStaff[] = []
let status: PatientStatus = {
  id: 0,
  pid: 0,
  task_id: 0,
  min_heart_rate : 0,
  max_heart_rate : 0,
  avg_heart_rate : 0,
  left_max_strength: 0,
  left_avg_strength: 0,
  right_max_strength: 0,
  right_avg_strength: 0
}
let patients: Patient[] = []
let prescriptions: Prescription[] = []
let prescriptionRecord: PrescriptionRecord[] = []
let evluation:Evaluation[]=[]
let assessmentResponse: Assessment[]=[]
let onlineEquipment: EquipmentOnline[] = []
let equipmentAll: equipmentAll[] = []
let sysInfo: systemInformation = {
  cpu_usage: "",
  total_memory_gb: "",
  used_memory_gb: "",
  disk_usage: "",
}
let dateCount: DateCount[] = []
let patientDuration: PatientDuration = {
  id: 0,
  name: "",
  sec_duration: 0,
  hour_duration: 0,
  data_count: dateCount,
}

let statistics: Statistics = {
  pid: 0,
  total_rehab_duration: 0,
  stretching_duration: 0,
  bending_duration: 0,
  stretching_count: 0,
  bending_count: 0,
}

let patient: Patient = {
  id: 0,
  name: '',
  age: 0,
  gender: getDefaultGenderValue(),
  genderLabel: getDefaultGenderLabel(),
  medicalHistory: '',
  mediaStrokeType:0,
  mediaStrokeLevel:0,
  physician: '',
  physicianId: 0,
  i18d: '',
}

interface RehabState {
  staff: MedicalStaff[]
  patientStatus: PatientStatus
  patient: Patient[]
  activePatient: Patient[]
  rehabPatient: Patient
  prescription: Prescription[]
  evluation:Evaluation[]
  prescriptionRecord: PrescriptionRecord[]
  onlineEquipment: EquipmentOnline[]
  equipmentAll: equipmentAll[]
  systemInformation: systemInformation
  patientDuration: PatientDuration
  statistics: Statistics
  selectedMenu: string
  // assessmentData: Assessment[]
}

const initialState: RehabState = {
  staff: staffs,
  patientStatus: status,
  patient: patients,
  activePatient: [],
  rehabPatient: patient,
  prescription: prescriptions,
  evluation: evluation,
  prescriptionRecord: prescriptionRecord,
  onlineEquipment: onlineEquipment,
  equipmentAll: equipmentAll,
  systemInformation: sysInfo,
  patientDuration: patientDuration,
  statistics: statistics,
  selectedMenu: '',
  // assessmentData: assessmentResponse
}

export type Channel = 'redux' | 'general'

export interface EquipmentOnlineSIdClientIdMap {
  client_id: string
  s_id: number
}

//蓝牙
export interface EquipmentBlueToothMap {
  topic: string
  content: string
}

export interface EquipmentOnlineWSMessage {
  code: number
  data: EquipmentOnlineSIdClientIdMap[]
  msg: string
}

//蓝牙
export interface EquipmentBlueToothWSMessage {
  code: number
  data: EquipmentBlueToothMap[]
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

function isEquipmentBlueToothWSMessage(obj: any): obj is EquipmentBlueToothWSMessage {
  return (
      obj &&
      typeof obj === "object" &&
      typeof obj.code === "number" &&
      typeof obj.msg === "string" &&
      Array.isArray(obj.data) &&
      obj.data.every((item: EquipmentBlueToothMap) => item.topic && item.content != null)
  )
}

export interface RealTimeTrainData {
  D: number
}

export interface EquipmentOnline {
  sId: number
  clientId: string
}

//蓝牙
export  interface  EquipmentBlueTooth {
  topic: string
  content: string
}

export interface equipmentAll {
  sId: number
  clientId: string
}

export interface  systemInformation {
  cpu_usage: string
  total_memory_gb: string
  used_memory_gb: string
  disk_usage: string
}

export function isRealTimeTrainData(data: any): data is RealTimeTrainData {
  return typeof data === 'object' && 'D' in data && typeof data.D === 'number';
}

const latestOnlineEquipmentReceived = createAction<EquipmentOnline[]>(
    'latestOnlineEquipment/latestOnlineEquipmentReceived'
)

const latestBlueToothEquipmentReceived = createAction<EquipmentOnline[]>(
    'latestBlueToothEquipment/latestBlueToothEquipmentReceived'
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
    getBlueToothEquipments: builder.query<EquipmentBlueTooth[], Channel>({
      queryFn:(channel) => {
        return { data:[{
           topic: "-1",
           content: "000",
          }] };
      },
      async onCacheEntryAdded(arg,{updateCachedData, cacheDataLoaded, cacheEntryRemoved}){
        const ws = new WebSocket('ws://127.0.0.1:18182/subscribe/heartbeat')
        try {
          await cacheDataLoaded
          const listener = (event: MessageEvent) => {
            const data: EquipmentOnlineWSMessage = event.data
            updateCachedData((draft) => {
              console.log('getBlueToothEquipments', draft)
              draft = []
              if (!Array.isArray(draft)) {
                draft= []
              }
              draft.push({topic: "item", content: data})
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
    mediaStrokeType:p.media_stroke_type,
    mediaStrokeLevel:p.media_stroke_level,
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
function convertAPIStatusToStatus(apiStatus: any): PatientStatus {
  return {
    id: apiStatus.id,
    pid:apiStatus.patient_id,
    task_id:apiStatus.task_id,
    min_heart_rate : apiStatus.min_heart_rate,
    max_heart_rate : apiStatus.max_heart_rate,
    avg_heart_rate : apiStatus.avg_heart_rate,
    left_max_strength:apiStatus.left_max_strength,
    left_avg_strength: apiStatus.left_avg_strength,
    right_max_strength: apiStatus.right_max_strength,
    right_avg_strength: apiStatus.right_avg_strength
  };
}

function convertAPIEvaluationToEvaluation(apiEvaluation: any): RehabEvaluation {
  return {
    RehabSessionID: apiEvaluation.rehab_session_id,
    Tolerance: apiEvaluation.tolerance,
    MotionReview: apiEvaluation.motion_review,
    SpasmReview: apiEvaluation.spasm_review,
    MuscleTone: apiEvaluation.muscle_tone,
    AcuteState: apiEvaluation.acute_state,
    NeuroJudgment: apiEvaluation.neuro_judgment,
    MotionInjury: apiEvaluation.motion_injury,
  }
}
function convertAPIPrescriptionToPrescription(apiPrescription: any): Prescription {
  return {
    id: apiPrescription.id,
    created_at: timeSampleFormat(apiPrescription.created_at),
    part: BodyPartToNumMapping[apiPrescription.part],
    mode: ModeToNumMapping[apiPrescription.mode],
    zz: apiPrescription.zz,
    u: apiPrescription.u,
    v: apiPrescription.v,
    duration: apiPrescription.duration,
    frequency_per_day:apiPrescription.frequency_per_day,
    total_days:apiPrescription.total_days,
    prescription_record: apiPrescription.rehabilitation_tasks
    ? apiPrescription.rehabilitation_tasks.map((t:any) => {
      return {
        id: t.id,
        created_at: timeSampleFormat(t.created_at),
        eid: t.eid,
        pid: t.pid,
        state: t.state,
        updated_at: timeSampleFormat(t.updated_at)
      }
    })
        : []
  }
}

export const asyncSysTime = createAsyncThunk<any, {date_time: string}>("asyncSysTime", async ({date_time})=>{
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.put('datetime',{date_time})
  return response.data
})

export const fetchPatients = createAsyncThunk<Patient[],
    {page: number, size: number, id: number, patient_name?: string, staff_ids?: Array<number>, start_time?: string, end_time?: string},
    {}>('fetchPatients', async ({page, size, id,patient_name, staff_ids, start_time,end_time }):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.get('patient', {params:{ page, size, id, patient_name, staff_ids, start_time, end_time}});
  console.log("fetch patient async thunk: ", response.data.data.patients)
  return response.data.data.patients.map(convertAPIPatientToPatient)
});

function convertAPIEquipmentAll(apiEquipmentAll: any): equipmentAll {
  return {
    sId: apiEquipmentAll.sId,
    clientId: apiEquipmentAll.clientId,
  }
}
function convertAPISystemInformation(apiSystemInformation: any): systemInformation {
  return {
    cpu_usage: apiSystemInformation.cpu_usage,
    total_memory_gb: apiSystemInformation.total_memory_gb,
    used_memory_gb: apiSystemInformation.used_memory_gb,
    disk_usage: apiSystemInformation.disk_usage,
  }
}

export const activePatients = createAsyncThunk<Patient[],
    {page: number, size: number, id: number, patient_name?: string, staff_ids?: Array<number>, start_time?: string, end_time?: string}, {}>
('activePatients', async ({page, size, id,patient_name, staff_ids, start_time,end_time }):Promise<any> =>
{
  const response: AxiosResponse<any, any> = await MCTAxiosInstance.get('patient', {
    params: {
      page,
      size,
      id,
      patient_name,
      staff_ids,
      start_time,
      end_time
    }
  });
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
export const addPatient = createAsyncThunk<Patient, { name: string, age: number, sex: string, medical_history: string, stroke_type:number, stroke_level:number,staff_id: number, i_18_d: string},
  {}>('addPatient', async ({name, age, sex, medical_history,  stroke_type, stroke_level, staff_id, i_18_d}, thunkAPI):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.post('patient',{name, age, sex, medical_history, stroke_type, stroke_level, staff_id, i_18_d})
  console.log("add patient async thunk: ", response.data.data.patients[0])
  return convertAPIPatientToPatient(response.data.data.patients[0])
});

// 修改病人
export const editPatient = createAsyncThunk<
    Patient,
    { id: number, name: string, age: number, sex: string, medical_history: string, stroke_type: number, stroke_level: number, staff_id: number, i_18_d: string }, {}>(
    'editPatient',
    async ({id, name, age, sex, medical_history, stroke_type, stroke_level, staff_id,i_18_d}, thunkAPI):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.put('patient',{id, name, age, sex, medical_history, stroke_type, stroke_level, staff_id, i_18_d})
  console.log("edit patient async thunk: ", response.data.data.patients[0])
  return convertAPIPatientToPatient(response.data.data.patients[0])
});

// 删除病人
export const deletePatient = createAsyncThunk<{id: number}, {id: number}, {}>('deletePatient', async ({id}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.delete('patient', {params:{ id }});
  console.log("delete patient async thunk: ", response.data)
  return {id: id}
});

//删除处方
export const deletePrescription = createAsyncThunk<{id: number}, {id: number}, {}>('deletePrescription', async ({id}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.delete(`prescription/${id}`);
  console.log("delete prescription async thunk: ", response.data)
  return {id: id}
});

// 查找医护
export const fetchStaffs = createAsyncThunk<MedicalStaff[], {page: number, size: number, id: number, staff_name?: string}, {}>(
  'fetchStaff',
  async ({page, size, id, staff_name}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.get('staff',{ params:{ page, size, id, staff_name}})
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



// 添加评价
export const addEvaluation = createAsyncThunk<RehabEvaluation, {
  pid: number,
  rehab_session_id : number,
  tolerance : string,
  motion_review : string ,
  spasm_review : string,
  muscle_tone : string,
  acute_state : string,
  neuro_judgment : string,
  motion_injury : string,
}, {}>('addEvaluation', async ({pid , rehab_session_id , tolerance , motion_review , spasm_review , muscle_tone, acute_state, neuro_judgment, motion_injury}, thunkAPI):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.post('train/evaluation',{pid , rehab_session_id , tolerance , motion_review , spasm_review , muscle_tone, acute_state, neuro_judgment, motion_injury })
  console.log("add evaluation async thunk: ", response.data.data.evaluation[0])
  return convertAPIEvaluationToEvaluation(response.data.data.evaluation[0])
});

// 添加处方
export const addPrescription = createAsyncThunk<Prescription, { pid: number, x: number, y: number , zz: number, u: number, v: number,duration:number,frequency_per_day:number,total_days:number},
    {}>('addPrescription', async ({pid, x, y , zz, u, v,duration,frequency_per_day,total_days}, thunkAPI):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.post('prescription',{pid, x, y , zz, u, v,duration,frequency_per_day,total_days})
  console.log("add prescription async thunk: ", response.data.data.prescriptions[0])
  return convertAPIPrescriptionToPrescription(response.data.data.prescriptions[0])
});

// 修改处方
export const editPrescription = createAsyncThunk<Prescription, {id: number, x: number, y: number, zz: number, u: number, v:number,duration:number,frequency_per_day:number,total_days:number},
  {}>('editPrescription', async ({id, x, y, zz, u, v,duration,frequency_per_day,total_days}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.put('prescription', { id, x, y, zz, u, v,duration,frequency_per_day,total_days});
  console.log("edit prescription: ", response.data)
  return convertAPIPrescriptionToPrescription(response.data.data.prescriptions[0])
});

export const fetchEvaluationById = createAsyncThunk<Evaluation[], { task_id: number}, {}>('fetchEvaluationById', async ({task_id}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.get('train/evaluation', {params:{task_id}});
  console.log("fetch Evaluation by id async thunk: ", response.data.data)
  let p = response.data.data.map(convertAPIEvaluationToEvaluation)
  console.log('Evaluation', p)
  return p
});

// 添加指标
export const addStatus = createAsyncThunk<PatientStatus, {pid: number, task_id: number , min_heart_rate : number,max_heart_rate : number,avg_heart_rate : number ,left_max_strength:number, left_avg_strength: number, right_max_strength:number, right_avg_strength: number},
    {}>('addStatus', async ({pid, task_id , min_heart_rate , max_heart_rate , avg_heart_rate,left_max_strength, left_avg_strength, right_avg_strength, right_max_strength}, thunkAPI):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.post('train/status',{pid, task_id, min_heart_rate , max_heart_rate , avg_heart_rate, left_max_strength, left_avg_strength, right_avg_strength, right_max_strength })
  console.log("add status async thunk: ", response.data.data.status[0])
  return convertAPIStatusToStatus(response.data.data.status[0])
});
// 查找指标
export const fetchStatusById = createAsyncThunk<PatientStatus, { pid:number,task_id: number},
    {}>('fetchStatusById', async ({pid,task_id}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.get('train/status', {params:{pid,task_id}});
  console.log("fetch Status by id async thunk: ", response.data.data)
  //let p = response.data.data.map(convertAPIStatusToStatus)
  let p = convertAPIStatusToStatus(response.data.data)
  console.log('PatientStatus', p)
  return p
});
// 更新指标
export const editStatus = createAsyncThunk<PatientStatus, {id: number, min_heart_rate : number,max_heart_rate : number,avg_heart_rate : number, left_max_strength:number, left_avg_strength: number, right_max_strength:number, right_avg_strength: number},
    {}>('editstatus', async ({id, min_heart_rate , max_heart_rate , avg_heart_rate, left_max_strength, left_avg_strength, right_avg_strength, right_max_strength}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.put('train/status', { id, min_heart_rate , max_heart_rate , avg_heart_rate, left_max_strength, left_avg_strength, right_avg_strength, right_max_strength});
  console.log("edit status: ", response.data)
  return convertAPIStatusToStatus(response.data.data.status[0])
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

// 下发处方
export const sendPrescriptionToEquipment = createAsyncThunk<number, {prescription_id: number, e_id: string}, {}>('sendPrescriptionToEquipment', async ({prescription_id, e_id}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.get('prescription/command', {params:{ prescription_id, e_id}});
  console.log("send prescription to equipment: ", response.data)
  return response.data.code
});

// 下发评估
export const sendBalloonPrescriptionToEquipment = createAsyncThunk<number, {p_id: number, e_id: string,x: number,y: number}, {}>('sendBalloonPrescriptionToEquipment', async ({p_id, e_id,x,y}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.get('prescription/balloon/command', {params:{ p_id, e_id,x,y}});
  console.log("send Balloon prescription to equipment: ", response.data)
  return response.data.code
});

//获取系统信息
export const getSystemInformation = createAsyncThunk<systemInformation, {page: number, size: number}, {}>(
    'getSystemInformation',
    async ({page, size}):Promise<any> => {
      const response:AxiosResponse<any, any> = await MCTAxiosInstance.get('system',{ params:{ page, size}})
      console.log("fetch systemInformation async thunk: ", response.data.data.systemInformations)
      return response.data.data
    });

//获取全部设备信息
export const getEquipmentAll = createAsyncThunk<equipmentAll[], {page: number, size: number}>(
    "getEquipmentAll",
    async ({page, size})=>{
      const response: AxiosResponse<any, any> = await MCTAxiosInstance.get('equipment', { params:{ page, size } })
      console.log("getEquipmentAll", response.data.data.equipment)
      return response.data.data.equipment.map(convertAPIEquipmentAll)
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

interface DateCount {
  date: string;
  count: number;
}

interface PatientDuration {
  id: number;
  name: string;
  sec_duration: number;
  hour_duration: number;
  data_count: DateCount[];
}

interface Statistics {
  pid: number;
  total_rehab_duration: number;
  stretching_duration: number;
  bending_duration: number;
  stretching_count: number;
  bending_count: number;
}
export const fetchPatientStatisticsById = createAsyncThunk<PatientDuration, { id: number}, {}>('fetchPatientStatisticsById', async ({ id}):Promise<any> => {
  let start_date = GetOneYearAgoDate()
  let end_date = GetCurrentDate()
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.get('rehab/duration', {params:{ start_date: start_date, end_date: end_date, id}});
  console.log("fetch fetchPatientStatisticsById by id async thunk: ", response.data.data)
  return response.data.data
});

// "total_rehab_duration": 11,
//   "stretching_duration": 65,
//   "bending_duration": 56,
//   "stretching_count": 578,
//   "bending_count": 569

// export const fetchStatusById = createAsyncThunk<PatientStatus, { pid:number,task_id: number},
//   {}>('fetchStatusById', async ({pid,task_id}):Promise<any> => {
//   const response:AxiosResponse<any, any> = await MCTAxiosInstance.get('train/status', {params:{pid,task_id}});
//   console.log("fetch Status by id async thunk: ", response.data.data)
//   //let p = response.data.data.map(convertAPIStatusToStatus)
//   let p = convertAPIStatusToStatus(response.data.data)
//   console.log('PatientStatus', p)
//   return p
// });

// 伸展弯曲时长和次数
export const fetchStatisticsById = createAsyncThunk<Statistics, { pid: number}, {}>('fetchStatisticsById',
  async ({ pid}):Promise<any> => {
  console.log("qqqq",pid)
  // let start_date = GetOneYearAgoDate()
  // let end_date = GetCurrentDate()
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.get(`patient/statistic/${pid}`);
  console.log("fetch fetchStatisticsById by id async thunk: ", response.data.data)
  return response.data.data
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
    selectedMenu: (state, action: PayloadAction<string>) => {
      state.selectedMenu = action.payload
      console.log('selectedMenu', state.selectedMenu)
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
      .addCase(addStatus.fulfilled,(state, action) => {
        state.patientStatus=action.payload
        console.log("add_status_action", action.payload)
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
        .addCase(fetchEvaluationById.fulfilled, (state, action) => {
          console.log("fetch Evaluation by id", action.payload)
          state.evluation = action.payload
        })
        .addCase(fetchStatusById.fulfilled,(state, action) => {
          console.log("fetch Status by id", action.payload)
          state.patientStatus = action.payload
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
      .addCase(sendBalloonPrescriptionToEquipment.fulfilled, (state, action) => {
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
        }).addCase(activePatients.fulfilled,(state, action)=>{
          state.activePatient = action.payload
          console.log('activePatients', action.payload)
        })
        .addCase(fetchPatientStatisticsById.fulfilled, (state, action) => {
          state.patientDuration = action.payload
        })
        .addCase(fetchStatisticsById.fulfilled, (state, action) => {
         state.statistics = action.payload
        })
        .addCase(getSystemInformation.fulfilled, (state, action)=> {
          state.systemInformation = action.payload
        })
        .addCase(getEquipmentAll.fulfilled, (state, action) => {
          state.equipmentAll = action.payload
        })
        // .addCase(getAssessment.fulfilled, (state, action) => {
        //   console.log("getAssessment.fulfilled", action.payload)
        //   state.assessmentData = action.payload;
        // })
        .addMatcher(rehabApi.endpoints?.getOnlineEquipments.matchFulfilled, (state, action) => {
          console.log("addMatcher rehabApi getOnlineEquipments fulfilled -> ", action.payload, action.type)
        })
        .addMatcher(latestOnlineEquipmentReceived.match, (state, action) =>{
          console.log("latestOnlineEquipmentReceived.match -> ",state.prescriptionRecord, action)
          state.onlineEquipment = action.payload
        })
  },
})

export const { selectedMenu } = RehabSlice.actions;
export const { useGetOnlineEquipmentsQuery, useGetTrainMessageQuery, useGetBlueToothEquipmentsQuery } = rehabApi
export default RehabSlice.reducer
import {ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosResponse} from "axios";
import MCTAxiosInstance from "@/utils/mct-request";

export interface Assessment {
  id: number;
  body: {
    id: number;
    name: string;
  };
  part: {
    id: number;
    name: string;
  };
  examination: string;
  levels: AssessmentLevel[];
  selectedAssessment?: SelectedAssessment
}

export interface AssessmentLevel {
  id: number;
  level_label: number;
  description: string;
}

export interface SelectedAssessment {
  id: number;
  selected_assessment_id: number;
  selected_assessment_level_id: number;
}

export const addAssessment = createAsyncThunk<Assessment, {
  body: {
    id: number;
    name: string;
  };
  part: {
    id: number;
    name: string;
  };
  examination: string;
  levels: AssessmentLevel[];
}, {}>('addAssessment', async ({ body, part, examination, levels }, thunkAPI): Promise<Assessment> => {
  const response: AxiosResponse<any, any> = await MCTAxiosInstance.post('assessment', {
    body,
    part,
    examination,
    levels,
  });
  const addedAssessment: Assessment = response.data; // 这里假设API返回了新添加的评估数据
  console.log("add assessment async thunk: ", addedAssessment);
  return addedAssessment;
});

interface ApiAssessmentResponse {
  task_id: number;
  assessment: any[];
  selected_assessment: null | any[] | undefined;
}
function convertApiAssessmentToAssessmentModel(apiAssessmentResp: ApiAssessmentResponse): { assessments: Assessment[], selectedAssessments: Record<number, SelectedAssessment> } {
  console.log("apiAssessment", apiAssessmentResp)
  let selectedAssessmentsObj: Record<number, SelectedAssessment> = {};

  let assessmentsArr =  apiAssessmentResp.assessment.map((a)=>{
    let lvl: AssessmentLevel[] = a.levels.map((l:{id:number,level_label:number,description: string}):AssessmentLevel => {
      return {
        id: l.id,
        level_label: l.level_label,
        description: l.description,
      }
    })
    let slvl: SelectedAssessment | undefined = undefined
    selectedAssessmentsObj[a.id] = {
      id: 0,
      selected_assessment_id: 0,
      selected_assessment_level_id: 0,
    }
    if (apiAssessmentResp.selected_assessment != undefined){
      apiAssessmentResp.selected_assessment.map((s)=>{
        // TODO dispatch调用store的
        if (s.selected_assessment_id == a.id) {
          selectedAssessmentsObj[s.selected_assessment_id] = {
            id: s.id,
            selected_assessment_id: a.id,
            selected_assessment_level_id: s.selected_assessment_level_id != undefined? parseInt(s.selected_assessment_level_id):0
          };
          slvl = {
            id: s.id,
            selected_assessment_id: s.selected_assessment_id,
            selected_assessment_level_id: s.selected_assessment_level_id,
          }
        }
      })
    }
    return {
      id: a.id,
      body: {
        id: a.body.id,
        name: a.body.name,
      },
      part: {
        id: a.part.id,
        name: a.part.name,
      },
      examination: a.examination,
      levels: lvl,
      selectedAssessment: slvl
    }
  })

  return {
    assessments: assessmentsArr,
    selectedAssessments: selectedAssessmentsObj
  }
}

//获取量表信息
export const getAssessment = createAsyncThunk<{assessments: Assessment[], selectedAssessments: Record<number, SelectedAssessment>}, {task_id: number}, {}>(
'getAssessment',
async ({task_id}):Promise<any> => {
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.get(`assessment/${task_id}`)
  console.log("get assessment async thunk: ", response.data.data)
  return convertApiAssessmentToAssessmentModel(response.data.data)
});

export const postAssessment = createAsyncThunk<
    {assessments: Assessment[], selectedAssessments: Record<number, SelectedAssessment>},
    {task_id: number, selectedRecord: Record<number, SelectedAssessment>},
    {}>
(
'postAssessment',
async ({task_id,selectedRecord}):Promise<any> => {
  let postAss:{task_id: number,selected_assessment: Array<{assessment_id: number, assessment_level: number}>} = {
    task_id: 0,
    selected_assessment: []
  }
  let sa : Array<{assessment_id: number, assessment_level: number, id: number}> = []

  for (let key in selectedRecord) {
    if (selectedRecord.hasOwnProperty(key)) {
      console.log(key, selectedRecord[key]);
      sa.push({
        id: selectedRecord[key].id,
        assessment_id: Number(key),
        assessment_level: selectedRecord[key].selected_assessment_level_id,
      })
    }
  }
  postAss.task_id = task_id
  postAss.selected_assessment = sa
  const response:AxiosResponse<any, any> = await MCTAxiosInstance.post('assessment', postAss)
  console.log("get assessment async thunk: ", response.data.data)
  // return convertApiAssessmentToAssessmentModel(response.data.data)
});

interface RehabAssessmentState {
  assessmentData: Assessment[]
  fuglMeyerScores: Record<number, SelectedAssessment>
}

const initialState: RehabAssessmentState = {
  assessmentData: [],
  fuglMeyerScores: {}
}

const assessmentSlice = createSlice({
  name: "assessment",
  initialState: initialState,
  reducers: {
    setFuglMeyerScores:(state, action: PayloadAction<{id: number, newValue: string | null | undefined}>) => {
      const { id, newValue } = action.payload;
      console.log("setFuglMeyerScores", id, newValue)
      if(state.fuglMeyerScores[id]) {
        state.fuglMeyerScores[id] = {
          ...state.fuglMeyerScores[id],
          selected_assessment_level_id: newValue != undefined ? parseInt(newValue) : 0
        }
      }
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<RehabAssessmentState>) => {
    builder
      .addCase(getAssessment.fulfilled, (state, action) => {
        console.log("getAssessment.fulfilled", action.payload)
        const { assessments, selectedAssessments } = action.payload;
        state.assessmentData = assessments;
        state.fuglMeyerScores = selectedAssessments
      })
  }
})
export const {setFuglMeyerScores} = assessmentSlice.actions
export default assessmentSlice.reducer;
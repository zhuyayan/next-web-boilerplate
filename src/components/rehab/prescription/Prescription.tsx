"use client";
// ** MUI Imports
import * as React from 'react';
import { styled as muiStyled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow, {TableRowProps} from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {EChartsTest} from "@/components/rehab/echarts/EChartsTest";
import {
  Box, Card, CardActions, CardContent, Chip, Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl, IconButton,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import styled from "styled-components";
import {SelectChangeEvent} from "@mui/material/Select";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import {
  addStaff,
  addStatus,
  editPrescription,
  EquipmentOnline,
  MedicalStaff,
  Prescription,
  PrescriptionRecord,
  sendPrescriptionToEquipment,
  PatientStatus,
  addEvaluation,
  EvaluateFormProps,
  addPrescription,
  RealTimeTrainData,
  sendBalloonPrescriptionToEquipment,
  BalloonPrescription,
  Prescription as PrescriptionEntity,
  AddPrescriptionItem,
  useGetTrainMessageQuery,
  EquipmentBlueTooth,
  editStatus,
  fetchStatusById
} from "@/redux/features/rehab/rehab-slice";
import {ChangeEvent, createContext, useContext, useEffect, useRef, useState} from "react";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {useDispatch, useSelector} from "react-redux";
import {
  BodyPartToNumMapping,
  ModeToNumMapping,
  NumToBodyPartMapping,
  NumToModeMapping
} from "@/utils/mct-utils";
import {AppDispatch, RootState, useAppDispatch, useAppSelector} from "@/redux/store";
import { deletePrescription } from "@/redux/features/rehab/rehab-slice";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import {Delete as DeleteIcon} from "@mui/icons-material";
import SendAndArchiveIcon from '@mui/icons-material/SendAndArchive';
import DeleteConfirmationDialog from "@/components/rehab/DeleteConfirmationDialog";
import {GetDefaultPrescription} from "@/utils/mct-utils";

import { useForm } from 'react-hook-form';
import {useSnackbar} from "notistack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';

import {string} from "postcss-selector-parser";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";


import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CardHeader from "@mui/material/CardHeader";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {Simulate} from "react-dom/test-utils";
import PrescriptionTable from "@/components/rehab/prescription/PrescriptionTable";
import Divider from "@mui/material/Divider";
import {mergePressData, StrengthMerge, StrokeStrength} from "@/redux/features/rehab/rehab-strength-slice";


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}


// const nextSunday = dayjs().endOf('week').startOf('day');
const nextSunday = dayjs().endOf('week').startOf('day').toDate();

const isWeekend = (date: Dayjs) => {
  const day = date.day();

  return day === 0 || day === 6;
};

const theme = createTheme({
  palette: {
    success: {
      main: '#81c784',
      contrastText: '#ffffff',
    },
  },
});


interface IFormInput {
  mode: string;
  part: string;
  zz: number;
  u: number;
  v: number;
  frequency_per_day: number;
  total_days: number;
}

const StyledDiv = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const StyledTableRow = muiStyled(TableRow)<TableRowProps>(({ theme }) => ({
  '&:nth-of-type(4n-3)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-of-type td, &:last-of-type th': {
    border: 0
  }
}))

interface Column {
  id: 'Keyboard' |'time' | 'pattern' | 'part' | 'count' | 'bendingTimeValue' | 'stretchTimeValue' | 'times' | 'action';
  label: string;
  minWidth?: number;
  align: 'right' | 'left' | 'center';
}

const columns: readonly Column[] = [
  { id: 'Keyboard',
    label: ' ',
    minWidth: 20,
    align: 'left',
  },
  { id: 'time',
    label: '处方编号',
    minWidth: 165,
    align: 'left',
  },
  { id: 'pattern',
    label: '模式',
    minWidth: 120,
    align: 'right',
  },
  {
    id: 'part',
    label: '部位',
    minWidth: 80,
    align: 'right',
  },
  {
    id: 'count',
    label: '训练次数或时间',
    minWidth: 135,
    align: 'right',
  },
  {
    id: 'bendingTimeValue',
    label: '弯曲时长',
    minWidth: 105,
    align: 'right',
  },
  {
    id: 'stretchTimeValue',
    label: '伸展时长',
    minWidth: 105,
    align: 'right',
  },
  {
    id: 'times',
    label: '进度',
    minWidth: 110,
    align: 'center',
  },
  {
    id: 'action',
    label: '操作',
    minWidth: 180,
    align: 'center',
  },
];

const MCTFixedWidthChip = styled(Chip)<{color?: string}>`
  width: 70px;  // 你可以调整这里的宽度值
  background-color: ${props => props.color || 'primary'};
  @media (min-width: 600px) {  // 中屏幕，例如：平板
    width: 60px;
  }

  @media (min-width: 960px) {  // 大屏幕，例如：桌面
    width: 70px;
  }
`;

export default function StickyHeadTable(params: {
  id: string,
  PId: string,
  task_id: string,
  prescription: Prescription[],
  balloonPrescription:BalloonPrescription[],
  status: PatientStatus,
  trainData:RealTimeTrainData[],
  onlineEquipment: EquipmentOnline[] ,
  heartBeats: number[]}) {
  const appDispatch = useAppDispatch()
  // const {data: trainData, error: trainError, isLoading: trainLoading} = useGetTrainMessageQuery("redux")
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  const record = useAppSelector((state: RootState) => state.rehab.prescriptionRecord)
  const status = useAppSelector(state => state.rehab.patientStatus);
  const appThunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  const [device, setDevice] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [balloonOpen, setBalloonOpen] = React.useState(false);
  const [openadd, setOpenAdd] = React.useState(false);
  const [openModify, setOpenModify] = React.useState(false);
  const prescription = useAppSelector((state: RootState) => state.rehab.prescription)
  const [openRecord, setOpenRecord] = React.useState<{ [key: number]: boolean }>(() => {
    const OpenState: { [key: number]: boolean } = {};
    if (params.prescription?.length > 0) {
      OpenState[params.prescription[0].id] = true; // 默认展开第一条记录
    }
    return OpenState;
  });
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription>({
    id: 0,
    created_at: "",
    part: "0",
    mode: "0",
    zz: 10,
    u: 3,
    v: 3,
    duration: 1,
    frequency_per_day: 1,
    total_days: 1,
  })

  const [willEditPrescription, setWillEditPrescription] = useState<Prescription>({
    id: 0,
    created_at: "",
    part: "0",
    mode: "0",
    zz: 10,
    u: 3,
    v: 3,
    duration: 1,
    frequency_per_day: 1,
    total_days: 1,
  })

  const [clientId, setClientId] = useState("")
  const [openDelPrescription, setOpenDelPrescription] = useState(false);
  const [prescriptionToBeDeleted, setPrescriptionToBeDeleted] = useState<Prescription>(GetDefaultPrescription());
  const { enqueueSnackbar } = useSnackbar();
  const [strength, setStrength] = useState<{
    left_max_strength: number,
    left_avg_strength: number,
    right_max_strength: number,
    right_avg_strength: number,
  }>({
    left_avg_strength: 0,
    left_max_strength: 0,
    right_avg_strength: 0,
    right_max_strength: 0,
  });

  // 定义初始状态
  const initialState = {
    pAvg: 0, // 初始化 p_avg 为默认值 0
    // 其他可能的初始状态...
  };

  const STORE_P_AVG = 'STORE_P_AVG';

// 创建一个 action 创建函数，用于存储 p_avg 到 Store 中
  const storePAvg = (pAvg) => {
    return {
      type: STORE_P_AVG,
      payload: pAvg,
    };
  };

// 在 reducer 中处理这个 action
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case STORE_P_AVG:
        return {
          ...state,
          pAvg: action.payload, // 将 p_avg 存入 state 中的 pAvg 字段
        };
      // 其他的 case
      default:
        return state;
    }
  };
  const dispatch = useDispatch();

  const strengthData = useAppSelector((state: RootState) => state.rehab.strengthMerge) as StrengthMerge;

  useEffect(() => {
    console.log("strength changed", strengthData)
  }, [strengthData])

  // 计算肌力平均值和最大值
  let totalAverageSum = 0;
  useEffect(()=>{

    if (willEditBalloonPrescription.mode == "被动评估模式" || willEditBalloonPrescription.mode == "主动评估模式"){
      const trainData = params.trainData || [];
      // console.log("肌力平均值和最大值", willEditBalloonPrescription);
      // 过滤掉小于等于0的数值
      const positiveData = trainData.filter(data => data.D > 0);

      // 计算总和，只添加大于0的数值
      const sum = positiveData.reduce((acc, data) => acc + data.D, 0);

      // 计算平均值
      const average = positiveData.length > 0 ? sum / positiveData.length : 0;

      // 找到最大值
      const max = Math.max(...trainData.map(data => data.D));

      const p_avg = ((200/2.5)*((3.3/4096)*average - 0.2)-100).toFixed(1);
      const p_max = ((200/2.5)*((3.3/4096)*max - 0.2)-100).toFixed(1);
      dispatch(storePAvg(p_avg));
      // console.log('p_平均值:', p_avg);
      // console.log('P_最大值:', p_max);
      let timeThreshold;
      if(willEditBalloonPrescription.mode=="被动评估模式"){
        timeThreshold = 5;
      }else if(willEditBalloonPrescription.mode== "主动评估模式"){
        timeThreshold = 20;
      }

      if (willEditBalloonPrescription.part == "左手") {
        // 左手
        appDispatch(mergePressData({type: "left", data: trainData}))
        const parsedPMax = parseFloat(p_max);
        console.log("left_max_strength", parsedPMax, strength.left_max_strength)
        let left_avg_strength = parseFloat(p_avg)
        console.log("left_avg_strength", left_avg_strength, strength.left_avg_strength)
        let left_max_strength = parsedPMax > strength.left_max_strength? parsedPMax: strength.left_max_strength;
        for (let i = 0; i < timeThreshold; i++) {
          totalAverageSum = totalAverageSum + strength.left_avg_strength;
          console.log("计数",i,totalAverageSum)
        }
        console.log('所有 average 的总和:', totalAverageSum);
        setStrength((prevState)=>({
          ...prevState,
          left_max_strength: left_max_strength,
          left_avg_strength: left_avg_strength,
        }))
      } else if (willEditBalloonPrescription.part == "右手") {
        // 右手
        appDispatch(mergePressData({type: "right", data: trainData}))
        const parsedPMax = parseFloat(p_max);
        console.log("xx", parsedPMax, strength.right_max_strength)
        let right_avg_strength = parseFloat(p_avg)
        let right_max_strength = parsedPMax > strength.right_max_strength? parsedPMax: strength.right_max_strength;
        setStrength((prevState)=>({
          ...prevState,
          right_max_strength: right_max_strength,
          right_avg_strength: right_avg_strength,
        }))
      }
    }
  }, [params.trainData])

  const handleClickOpen = (row: Prescription) => {
    setOpen(true);
    setSelectedPrescription(row);
    setWillEditBalloonPrescription({
      p_id: 0,
      e_id: "",
      part: "0",
      mode: "0",
    });
    console.log("selectedPrescription -> ", row)
  };

  const handleClickModify = (row: Prescription) => {
    setWillEditPrescription(row)
    setOpenModify(true);
  };

  const handleDeletePrescription = (id: number) => {
    (appDispatch as AppDispatch)(deletePrescription({id: id}))
    handleCloseDel()
  };
  const handleClickDel = async (prescription: Prescription) => {
    setOpenDelPrescription(true);
    setPrescriptionToBeDeleted(prescription)
  }
  const handleCloseDel= () => {
    setOpenDelPrescription(false);
    setPrescriptionToBeDeleted(GetDefaultPrescription())
  }

  const handleChange = (event: SelectChangeEvent) => {
    setDevice(event.target.value);
    const clientId = params.onlineEquipment.find(item => item.sId === parseInt(event.target.value))?.clientId;
    console.log("clientId -> ", clientId)
    setClientId(clientId ?? "");
  };

  const handleModeChange = (event: SelectChangeEvent) => {
    console.log(event.target)
    console.log(ModeToNumMapping[parseInt(event.target.value)])
    setWillEditPrescription((prevState) => ({
      ...prevState,
      mode: ModeToNumMapping[parseInt(event.target.value)]
    }))
  };
  const handlePartChange = (event: SelectChangeEvent) => {
    setWillEditPrescription((prevState) => ({
      ...prevState,
      part: BodyPartToNumMapping[parseInt(event.target.value)]
    }))
  };

  //BalloonPrescription
  const [selectedBalloonPrescription, setSelectedBalloonPrescription] = useState<BalloonPrescription>({
    p_id: 0,
    e_id:"",
    part: "0",
    mode: "0",
  })

  const [willEditBalloonPrescription, setWillEditBalloonPrescription] = useState<BalloonPrescription>({
    p_id: 0,
    e_id:"",
    part: "0",
    mode: "0",
  })

  const handleBalloonModeChange = (event: SelectChangeEvent) => {
    console.log(event.target)
    console.log(ModeToNumMapping[parseInt(event.target.value)])
    setWillEditBalloonPrescription((prevState) => ({
      ...prevState,
      mode: ModeToNumMapping[parseInt(event.target.value)]
    }))
  };

  const handleBalloonPartChange = (event: SelectChangeEvent) => {
    setWillEditBalloonPrescription((prevState) => ({
      ...prevState,
      part: BodyPartToNumMapping[parseInt(event.target.value)]
    }))
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleBalloonClose = () => {
    setBalloonOpen(false);
  };
  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleSendCommand = () => {
    appThunkDispatch(sendPrescriptionToEquipment({prescription_id:selectedPrescription.id, e_id: clientId}))
    setOpen(false);
    window.onload = function() {
      window.addEventListener('refresh', function() {
        location.reload(); //父页面仅仅是刷新页面，当然也可以自定义逻辑函数写在里面
      })
    }
  };

  const handleClickBalloonOpen = (row: BalloonPrescription) => {
    //setBalloonOpen(true);
    setSelectedBalloonPrescription(row)
    console.log("selectedBalloobPrescription -> ", row)
  };

  const handleSendBalloonCommand = () => {
    console.log("selectedBalloonPrescription", selectedBalloonPrescription)
    appThunkDispatch(sendBalloonPrescriptionToEquipment({p_id:parseInt(params.id), e_id: clientId, x: NumToBodyPartMapping[selectedBalloonPrescription.part], y: NumToModeMapping[selectedBalloonPrescription.mode]}))
    setBalloonOpen(false);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditPrescription = async () => {
    const isValid = await trigger();
    if (!isValid) {
      // 如果表单无效，就不提交
      console.log("handleEditPrescription isValid", isValid)
      return;
    }
    setIsSubmitting(true);
    appThunkDispatch(editPrescription({
      id: willEditPrescription.id,
      x: NumToBodyPartMapping[willEditPrescription.part],
      y: NumToModeMapping[willEditPrescription.mode],
      zz: Number(willEditPrescription.zz),
      u: Number(willEditPrescription.u),
      v: Number(willEditPrescription.v),
      duration:Number(willEditPrescription.duration),
      frequency_per_day: Number(willEditPrescription.frequency_per_day),
      total_days: Number(willEditPrescription.total_days),
    })).then((prescription) => {
      console.log('The updated prescription is: ', prescription);
      console.log('The updated prescription is: ', typeof prescription);
      enqueueSnackbar('修改成功', {
        variant: 'success',
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        }
      })
    }).catch((error) => {
      console.error('Failed to edit prescription: ', error);
    }).finally(() => {
      setOpenModify(false);
      setIsSubmitting(false);
    })
  }

  const handleCloseModify = () => {
    setOpenModify(false);
  };

  function handleZZChange(e: ChangeEvent<HTMLInputElement>) {
    setWillEditPrescription(prevState => ({
      ...prevState,
      zz: e.target.value === '' ? '' : parseInt(e.target.value)
    }))
  }

  function handleFrequencyPerDayChange(e: ChangeEvent<HTMLInputElement>) {
    setWillEditPrescription(prevState => ({
      ...prevState,
      frequency_per_day: e.target.value === '' ? '' : parseInt(e.target.value)
    }))
  }

  function handleTotalDaysChange(e: ChangeEvent<HTMLInputElement>) {
    setWillEditPrescription(prevState => ({
      ...prevState,
      total_days: e.target.value === '' ? '' : parseInt(e.target.value)
    }))
  }

  function handleUChange(e: ChangeEvent<HTMLInputElement>) {
    setWillEditPrescription(prevState => ({
      ...prevState,
      u: parseInt(e.target.value)
    }))
  }

  function handleVChange(e: ChangeEvent<HTMLInputElement>) {
    setWillEditPrescription(prevState => ({
      ...prevState,
      v: parseInt(e.target.value)
    }))
  }

  const { register, formState: { errors }, clearErrors, trigger } = useForm<IFormInput>({mode: 'onBlur' });

  useEffect(() => {
    if(openModify) {
      clearErrors()
    }
  }, [clearErrors, openModify]);

  const handleRowClick = (rowId: number) => {
    setOpenRecord((prevOpenRows) => ({
      ...prevOpenRows,
      [rowId]: !prevOpenRows[rowId],
    }));
  };

  // 查看指标弹框
  const [openTarget, setOpenTarget] = React.useState(false);
  const handleClickOpenTarget = () => {
    setOpenTarget(true);
  };
  const handleCloseTarget = () => {
    setOpenTarget(false);
  };

  // 查看评价弹框
  const [openEvaluate, setOpenEvaluate] = React.useState(false);
  const handleClickOpenEvaluate = () => {
    setOpenEvaluate(true);
  };
  const handleCloseEvaluate = () => {
    setOpenEvaluate(false);
  };


  const [willAddStatus, setWillAddStatus] = React.useState<PatientStatus>({
    id: 0,
    pid:0,
    task_id:0,
    min_heart_rate : 0,
    max_heart_rate : 0,
    avg_heart_rate : 0,
    left_max_strength: 0,
    left_avg_strength: 0,
    right_max_strength: 0,
    right_avg_strength: 0
  })

  const handleAddStatus = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    let processedValue: string | number = value;
    if (["avg_heart_rate", "max_heart_rate", "min_heart_rate"].includes(id)) {
      processedValue = Number(value);
    }
    console.log('handleAddStatus', id, processedValue)
    setWillAddStatus((prevInputValues) => ({
      ...prevInputValues,
      [id]: processedValue,
    }))
  };

  //保存肌力评估数据
  const handleSaveAddStatus = () => {
    console.log("status data", status)
    if (status.id === 0) {
      appThunkDispatch(addStatus({
        pid: parseInt(params.id),
        task_id: taskId,
        min_heart_rate: status.min_heart_rate,
        max_heart_rate: status.max_heart_rate,
        avg_heart_rate: status.avg_heart_rate,
        left_max_strength: strength.left_max_strength,
        left_avg_strength: strength.left_avg_strength,
        right_max_strength: strength.right_max_strength,
        right_avg_strength: strength.right_avg_strength
      }))
    }
    else {
      appThunkDispatch(editStatus({
        id: status.id,
        min_heart_rate: status.min_heart_rate,
        max_heart_rate: status.max_heart_rate,
        avg_heart_rate: status.avg_heart_rate,
        left_max_strength: strength.left_max_strength,
        left_avg_strength: strength.left_avg_strength,
        right_max_strength: strength.right_max_strength,
        right_avg_strength: strength.right_avg_strength
      }));
    }
    appThunkDispatch(fetchStatusById({pid: parseInt(params.id), task_id: taskId}));
  }

// 医生评价表单
  const [evaluateFormData, setEvaluateFormData] = React.useState<EvaluateFormProps>({
    tolerance: '',
    motionReview: '',
    spasmReview: '',
    muscleTone: '',
    acuteState: '',
    neuroJudgment: '',
    motionInjury: '',
  });
  const handleEvaluationFormDataFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEvaluateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveEvaluate = () => {
    thunkDispatch(addEvaluation({
      acute_state: evaluateFormData.acuteState,
      motion_injury: evaluateFormData.motionInjury,
      motion_review: evaluateFormData.motionReview,
      muscle_tone: evaluateFormData.muscleTone,
      neuro_judgment: evaluateFormData.neuroJudgment,
      pid: parseInt(params.PId),
      rehab_session_id: 0,
      spasm_review: evaluateFormData.spasmReview,
      tolerance: evaluateFormData.tolerance,
    }))
    // setOpenAddStatus(false)
  };

  const [value, setValue] = React.useState(0);


  const handleChangeTest = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const handleClickOpenAddPrescription = () => {
    setOpenAdd(true);
  };
  // 添加处方按钮
  const { register: AddPrescriptionItemRegister,
    formState: { errors: AddPrescriptionItemErrors },
    clearErrors: AddPrescriptionItemClearErrors,
    trigger:AddPrescriptionItemTrigger } = useForm<AddPrescriptionItem>({mode: 'onBlur' });
  const [timesError, setTimesError] = React.useState<string>('');
  const [totalDaysError, setTotalDaysError] = React.useState<string>('');
  const [frequencyPerDayError, setFrequencyPerDayError] = React.useState<string>('');
  const [bendError, setBendError] = React.useState<string>('');
  const [stretchError, setStretchError] = React.useState<string>('');
  const [error, setError] = React.useState(false);
  const [willAddPrescription, setWillAddPrescription] = React.useState<PrescriptionEntity>({
    id: 0,
    created_at: "",
    part: "0",
    mode: "0",
    zz: 3,
    u: 3,
    v: 3,
    duration: 1,
    frequency_per_day: 1,
    total_days: 1,
    prescription_record: [
      {
        id: 123,
        created_at: '2023-08-09 12:00:00',
        eid: "100000",
        pid: "11",
        state: "H_END",
        updated_at: '2023-08-09 12:20:00'
      }
    ],
  })

  const handleAddPrescriptionModeChange = (event: SelectChangeEvent) => {
    console.log(event.target)
    console.log(ModeToNumMapping[parseInt(event.target.value)])
    setWillAddPrescription((prevState) => ({
      ...prevState,
      mode: ModeToNumMapping[parseInt(event.target.value)]
    }))
  };
  const handleAddPrescriptionPartChange = (event: SelectChangeEvent) => {
    console.log(event.target)
    console.log(BodyPartToNumMapping[parseInt(event.target.value)])
    setWillAddPrescription((prevState) => ({
      ...prevState,
      part: BodyPartToNumMapping[parseInt(event.target.value)]
    }))
  };

  const handleSaveAddPrescription = () => {
    console.log(willAddPrescription)
    console.log(NumToBodyPartMapping[willAddPrescription.part])
    console.log(NumToModeMapping[willAddPrescription.mode])
    thunkDispatch(addPrescription({
      pid: parseInt(params.id),
      x: NumToBodyPartMapping[willAddPrescription.part],
      y: NumToModeMapping[willAddPrescription.mode],
      zz: Number(willAddPrescription.zz),
      u: Number(willAddPrescription.u),
      v: Number(willAddPrescription.v),
      duration:Number(willAddPrescription.duration),
      frequency_per_day: Number(willAddPrescription.frequency_per_day),
      total_days: Number(willAddPrescription.total_days),
    }))
    setOpenAdd(false);
  };
  const handleAddPrescriptionDuration = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setWillAddPrescription((prevInputValues) => ({
      ...prevInputValues,
      [id]: parseInt(value),
    }))
  };

  const handleAddPrescriptionFrequencyPerDay = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    console.log(id, value);
    if (value !== '' && value < '1') {
      setFrequencyPerDayError('输入的数字不能小于1');
    } else {
      setFrequencyPerDayError('');
      setWillAddPrescription((prevInputValues) => ({
        ...prevInputValues,
        [id]: parseInt(value),
      }))
    }
  };
  const handleAddPrescriptionTotalDays = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    console.log(id, value);
    if (value !== '' && value < '1') {
      setTotalDaysError('输入的数字不能小于1');
    } else {
      setTotalDaysError('');
      setWillAddPrescription((prevInputValues) => ({
        ...prevInputValues,
        [id]: parseInt(value),
      }))
    }
  };
  const handleAddPrescriptionTimes = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    console.log(id, value);
    if (value !== '' && value < '1') {
      setTimesError('输入的数字不能小于1');
    } else {
      setTimesError('');
      setWillAddPrescription((prevInputValues) => ({
        ...prevInputValues,
        [id]: parseInt(value),
      }))
    }
  };

  const handleAddPrescriptionBend = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    console.log(id, value);
    if (value == '') {
      setBendError('不能为空');
      return
    }
    if (value !== '' && parseInt(value) < 3) {
      setBendError('输入的数字不能小于3');
    } else {
      setBendError('');
      setWillAddPrescription((prevInputValues) => ({
        ...prevInputValues,
        [id]: parseInt(value),
      }))
    }
  };
  const handleAddPrescriptionStretch = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (inputValue !== '' && inputValue < '3') {
      setStretchError('输入的数字不能小于3');
    } else {
      setStretchError('');
      const { id, value } = event.target;
      console.log(id, value)
      setWillAddPrescription((prevInputValues) => ({
        ...prevInputValues,
        [id]: parseInt(value),
      }))
    }
  };
  // const onsetTime = willAddStatus.onset_time !== "" ? dayjs(willAddStatus.onset_time) : null;

  const [selectedTab, setSelectedTab] = React.useState(0); // 初始选中的 tab

  function getUniqueTrainingDays(records: PrescriptionRecord[]): number {
    const uniqueDays = new Set(records.map(record => {
      const date = new Date(record.created_at);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;  // Format: YYYY-MM-DD
    }));
    return uniqueDays.size;
  }


  function handleStrengthChange(event: ChangeEvent<HTMLInputElement>) {
    // console.log(event.target.value)
    // console.log(event.target)
    setStrength(  (prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value
    }))
  }

  const [isReady, setIsReady] = React.useState(true);
  const [taskId, setTaskId] = React.useState(0);
  const handleChildData = (data) => {
    // 在这里处理从子组件传递过来的参数
    console.log('Received data from child:', data);
    setTaskId(parseInt(data));
    setIsReady(false);
  };

  useEffect(()=>{
    appThunkDispatch(fetchStatusById({pid: parseInt(params.id), task_id: taskId}));
  }, [taskId]);

  return (<>
    <Grid container alignItems="center" justifyContent="space-between" sx={{ height: 50 }}>
      <Grid item style={{display: 'flex', alignItems: 'center'}} >
        <CardHeader style={{display:'inline-block'}} title='处方' titleTypographyProps={{ variant: 'h6' }} />
        <Typography style={{display:'inline-block'}} variant="body1" gutterBottom>
          (共
        </Typography>
        <Typography color="primary" style={{display:'inline-block'}} variant="h6" gutterBottom>
          {prescription.length}
        </Typography>
        <Typography style={{display:'inline-block'}} variant="body1" gutterBottom>
          条处方)
        </Typography>
        <Tooltip title="新建处方">
          <IconButton
              style={{float: 'right'}}
              aria-label="add"
              onClick={handleClickOpenAddPrescription}
          >
            <AddCircleIcon sx={{ fontSize: 30 }} color="secondary"/>
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item>

      </Grid>
    </Grid>

    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex',height:800 }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={selectedTab}
        onChange={(event, newValue) => {
          setSelectedTab(newValue);
          handleChangeTest(event, newValue); // 调用原来的事件处理程序
        }}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 2, borderColor: 'divider', width: 230 }}
      >
        {params.prescription?.map((row, index) => (
          <Tab
            sx={{width: '230px', backgroundColor: selectedTab === index ? '#74b2f1' : 'transparent' }}
            key={index}
            label={<>
            <Card key={row.id} sx={{ marginBottom: 0 , backgroundColor: selectedTab === index ? '#b5d3f5' : 'transparent'}}>
              <CardContent>
                <Typography>{row.created_at}</Typography>
                <Typography>{row.mode}  {row.part}</Typography>
                <Typography>训练时长: {row.zz}</Typography>
                <Typography>弯曲定时值: {row.u}</Typography>
                <Typography>伸展定时值: {row.v}</Typography>
                <ThemeProvider theme={theme}>
                  <Typography align='right'>进度：
                    {
                      (() => {
                        let totalDuration = Number(row.frequency_per_day) * Number(row.total_days);
                        let label = row.prescription_record?.length + ' / ' + totalDuration;
                        let color = 'success';
                        if (row.prescription_record?.length == totalDuration) {
                          color = 'success';
                        } else if (row.prescription_record?.length && totalDuration && row.prescription_record.length < totalDuration) {
                          color = 'primary';
                        }
                        return <MCTFixedWidthChip label={label} color={color} />;
                      })()
                    }
                  </Typography>
                </ThemeProvider>
                <Tooltip title="修改处方">
                  <IconButton
                    aria-label="edit"
                    color="secondary"
                    onClick={(event) => {event.stopPropagation(); handleClickModify(row)}}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="删除处方">
                  <IconButton
                    aria-label="delete"
                    // onClick={() => handleDeletePrescription(row.id)}
                    onClick={(event) => {event.stopPropagation(); handleClickDel(row)}}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </CardContent>
            </Card>
          </>} {...a11yProps(index)} />
        ))}
      </Tabs>
      <Box sx={{ width: '85%', paddingLeft: '5px' }}>
        {params.prescription?.map((row, index) => (
            <>
              <TabPanel key={index} value={value} index={index}>
                {/*一天三次，一次十分钟，共需做5天，已做3天*/}
                <Grid container spacing={2}>
                  <Grid item xs={8} md={8}>
                    <Card key={row.id}
                          sx={{ minWidth: 500,backgroundColor: '#9acafc' ,display: 'flex', justifyContent: 'space-between', borderRadius:'20px', boxShadow:'5px 5px 5px #74b2f1' }}>
                        <Typography sx={{ fontSize: 16 ,fontWeight: 'bold',padding:2, fontfamily:'serif'}} color="text.secondary" gutterBottom>
                          方案计划：
                          一天 {row.frequency_per_day} 次，
                          一次 {row.zz} 分钟，
                          共需做 {row.total_days} 天，
                          已做 {getUniqueTrainingDays(row.prescription_record || []) }天
                        </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Tooltip title="下发处方">
                      <IconButton
                          aria-label="edit"
                          color="primary"
                          onClick={(event)=>{event.stopPropagation(); handleClickOpen(row);}}
                      >
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                          下发处方：
                        </Typography>
                        <SendAndArchiveIcon sx={{ fontSize: 40 }} />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Card sx={{ height: 220 ,padding: '5px'}}>
                      <CardHeader style={{display:'inline-block'}} title='康复记录' titleTypographyProps={{ variant: 'h6' }} />
                      <PrescriptionTable record={row.prescription_record? row.prescription_record : []} pid={params.id} status={status} heartBeats={params.heartBeats} task_id={params.task_id} onChildData={handleChildData}/>
                    {/*  prescription_record*/}
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Card sx={{ padding: '5px'}}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                          <Typography variant="h6">历史肌力数据：</Typography>
                        </Grid>
                        <Grid item xs={3} md={3}>
                          <Typography>左手最大肌力：{status.left_max_strength}</Typography>
                        </Grid>
                        <Grid item xs={3} md={3}>
                          <Typography>左手平均肌力：{status.left_avg_strength}</Typography>
                        </Grid>
                        <Grid item xs={3} md={3}>
                          <Typography>右手最大肌力：{status.right_max_strength}</Typography>
                        </Grid>
                        <Grid item xs={3} md={3}>
                          <Typography>右手平均肌力：{status.right_avg_strength}</Typography>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Card id="target-element">
                      <CardHeader title='肌力评估' titleTypographyProps={{ variant: 'h6' }} style={{ textAlign: 'center' }} />
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={4} md={4}>
                            <FormControl sx={{ m: 1, minWidth: 240 }} size="small">
                              <InputLabel id="demo-select-small-label">评估模式</InputLabel>
                              <Select
                                {...register('mode', {required: '训练模式是必需的'})}
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={String(NumToModeMapping[willEditBalloonPrescription.mode])}
                                label="Age1"
                                name="mode"
                                onChange={handleBalloonModeChange}>
                                <MenuItem value={8}>被动评估模式</MenuItem>
                                <MenuItem value={9}>主动评估模式</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={4} md={4}>
                            <FormControl sx={{ m: 1, minWidth: 240 }} size="small">
                              <InputLabel id="demo-select-small-label">评估部位</InputLabel>
                              <Select
                                {...register('part', { required: '训练部位是必需的' })}
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={String(NumToBodyPartMapping[willEditBalloonPrescription.part])}
                                label="Age2"
                                onChange={handleBalloonPartChange}
                                name="part">
                                <MenuItem value={1}>左手</MenuItem>
                                <MenuItem value={2}>右手</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={2} md={2}>
                            <Tooltip title="下发评估">
                              <IconButton
                                aria-label="edit"
                                color="primary"
                                onClick={(event)=>{event.stopPropagation(); setBalloonOpen(true); handleClickBalloonOpen({p_id:parseInt(params.id), e_id: clientId, part:willEditBalloonPrescription.part, mode:willEditBalloonPrescription.mode}); }}
                              >
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                  下发评估：
                                </Typography>
                                <SendAndArchiveIcon sx={{ fontSize: 30 }} />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                          <Grid item xs={2} md={2}>
                            <Button disabled={isReady} onClick={handleSaveAddStatus}>保存评估数据</Button>
                          </Grid>
                        </Grid>
                        <Grid container spacing={4}>
                          <Grid item xs={6} md={6}>
                            <Card sx={{padding:'8px'}}>
                              <Typography sx={{ fontSize: 18}}>
                                左手
                              </Typography>
                              <Divider sx={{padding:'5px'}}/>
                              <Typography sx={{ fontSize: 18,padding:'5px'}}>
                                最大肌力：
                                <TextField
                                id="left_max_strength"
                                size="small"
                                type="number"
                                InputProps={{ readOnly: true }}
                                onChange={handleStrengthChange}
                                value={strength.left_max_strength}
                                />
                              </Typography>
                              <Typography sx={{ fontSize: 18,padding:'5px'}}>
                                平均肌力：
                                <TextField
                                  id="left_avg_strength"
                                  size="small"
                                  type="number"
                                  InputProps={{ readOnly: true }}
                                  onChange={handleStrengthChange}
                                  value={strength.left_avg_strength}
                                />
                              </Typography>
                            </Card>
                          </Grid>
                          <Grid item xs={6} md={6}>
                            <Card sx={{padding:'8px'}}>
                              <Typography sx={{ fontSize: 18}}>
                                右手
                              </Typography>
                              <Divider sx={{padding:'5px'}}/>
                              <Typography sx={{ fontSize: 18,padding:'5px'}}>
                                最大肌力：
                                <TextField
                                  key={strength.right_max_strength}
                                  id="right_max_strength"
                                  size="small"
                                  type="number"
                                  InputProps={{ readOnly: true }}
                                  onChange={handleStrengthChange}
                                  value={strength.right_max_strength}
                                />
                              </Typography>
                              <Typography sx={{ fontSize: 18,padding:'5px'}}>
                                平均肌力：
                                <TextField
                                  id="right_avg_strength"
                                  size="small"
                                  type="number"
                                  InputProps={{ readOnly: true }}
                                  onChange={handleStrengthChange}
                                  value={strength.right_avg_strength}
                                />
                              </Typography>
                            </Card>
                          </Grid>
                        </Grid>
                        {/*<EChartsTest/>*/}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>
            </>
        ))}
      </Box>

    </Box>
      {/*查看评价弹框*/}
      <Dialog
        open={openEvaluate}
        onClose={handleCloseEvaluate}
        aria-describedby="Evaluate"
      >
        <DialogTitle style={{display:'inline-block'}}>{"医生评价"}</DialogTitle>
        <Typography variant='body2' style={{display:'inline-block'}}>&emsp;&emsp;（请医护根据此次训练的直方图对以下信息进行评价）</Typography>
        <DialogContent>
          <DialogContentText id="Evaluate">
            <form>
              <Grid container spacing={0}>
                <Grid item xs={6}>
                  <Box sx={{padding: '8px' }}>
                    <Grid container spacing={0} alignItems="center">
                      <Grid item xs={4}>
                        <label htmlFor="input9">耐受状态:</label>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                            name="tolerance"
                            value={evaluateFormData.tolerance}
                            onChange={handleEvaluationFormDataFormChange}
                            size="small"
                            fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{padding: '8px' }}>
                    <Grid container spacing={0} alignItems="center">
                      <Grid item xs={4}>
                        <label htmlFor="input10">运动评价:</label>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                            name="motionReview"
                            value={evaluateFormData.motionReview}
                            onChange={handleEvaluationFormDataFormChange}
                            size="small"
                            fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{padding: '8px' }}>
                    <Grid container spacing={0} alignItems="center">
                      <Grid item xs={4}>
                        <label htmlFor="input11">痉挛评价:</label>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                            name="spasmReview"
                            value={evaluateFormData.spasmReview}
                            onChange={handleEvaluationFormDataFormChange}
                            size="small"
                            fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{padding: '8px' }}>
                    <Grid container spacing={0} alignItems="center">
                      <Grid item xs={4}>
                        <label htmlFor="input9">肌张力:</label>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                            name="muscleTone"
                            value={evaluateFormData.muscleTone}
                            onChange={handleEvaluationFormDataFormChange}
                            size="small"
                            fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{padding: '8px' }}>
                    <Grid container spacing={0} alignItems="center">
                      <Grid item xs={4}>
                        <label htmlFor="input9">急性期情况:</label>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                            name="acuteState"
                            value={evaluateFormData.acuteState}
                            onChange={handleEvaluationFormDataFormChange}
                            size="small"
                            fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{padding: '8px' }}>
                    <Grid container spacing={0} alignItems="center">
                      <Grid item xs={4}>
                        <label htmlFor="input9">神经科判断:</label>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                            name="neuroJudgment"
                            value={evaluateFormData.neuroJudgment}
                            onChange={handleEvaluationFormDataFormChange}
                            size="small"
                            fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{padding: '8px' }}>
                    <Grid container spacing={0} alignItems="center">
                      <Grid item xs={4}>
                        <label htmlFor="input9">运动损伤度:</label>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                            name="motionInjury"
                            value={evaluateFormData.motionInjury}
                            onChange={handleEvaluationFormDataFormChange}
                            size="small"
                            fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{padding: '8px' }}>
                    <Typography variant='body2' style={{ color: 'red' }}>注：医生在该表格填写完成的评价信息只针对本次康复训练，评价将被保存在本次康复记录的表格中。</Typography>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveEvaluate}>保存评价</Button>
          <Button onClick={handleCloseEvaluate}>关闭</Button>
        </DialogActions>
      </Dialog>

      <DeleteConfirmationDialog
        open={openDelPrescription}
        onClose={handleCloseDel}
        onConfirm={() => handleDeletePrescription(prescriptionToBeDeleted.id)}
        deleteItemName={prescriptionToBeDeleted.created_at}
      />

      <Dialog
        open={open} onClose={handleClose}
        slotProps={{
          backdrop: { sx: {backgroundColor: 'rgba(0, 0, 0, 0.5)'}}}}
        PaperProps={{ elevation: 0 }}>
        <DialogContent>
          <DialogContentText>
            请选择要下发至哪台康复仪
          </DialogContentText>
          <StyledDiv>
            <Box>
              <FormControl sx={{ m: 1, minWidth: 240 }} size="small">
                <InputLabel id="device">康复仪设备</InputLabel>
                <Select
                  labelId="device"
                  id="device"
                  value={device}
                  label="device"
                  onChange={handleChange}
                  name="device"
                >
                  {params.onlineEquipment ? (
                    params.onlineEquipment.map((item) => (
                      <MenuItem key={item.sId} value={item.sId}>
                        {item.clientId}
                      </MenuItem>
                    ))
                  ) : null}
                </Select>
              </FormControl>
            </Box>
          </StyledDiv>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleSendCommand}>确定</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={balloonOpen} onClose={handleBalloonClose}
        slotProps={{
          backdrop: { sx: {backgroundColor: 'rgba(0, 0, 0, 0.5)'}}}}
        PaperProps={{ elevation: 0 }}>
        <DialogContent>
          <DialogContentText>
            请选择将评估模式要下发至哪台康复仪
          </DialogContentText>
          <StyledDiv>
            <Box>
              <FormControl sx={{ m: 1, minWidth: 240 }} size="small">
                <InputLabel id="device">康复仪设备</InputLabel>
                <Select
                  labelId="device"
                  id="device"
                  value={device}
                  label="device"
                  onChange={handleChange}
                  name="device"
                >
                  {params.onlineEquipment ? (
                    params.onlineEquipment.map((item) => (
                      <MenuItem key={item.sId} value={item.sId}>
                        {item.clientId}
                      </MenuItem>
                    ))
                  ) : null}
                </Select>
              </FormControl>
            </Box>
          </StyledDiv>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBalloonClose}>取消</Button>
          <Button onClick={handleSendBalloonCommand}>确定</Button>
        </DialogActions>
      </Dialog>

      <Dialog
          open={openModify} onClose={handleCloseModify}
          slotProps={{
            backdrop: { sx: {backgroundColor: 'rgba(0, 0, 0, 0.5)'}}}}
          PaperProps={{ elevation: 0 }}>
        <DialogTitle>修改处方</DialogTitle>
        <DialogContent>
          <Typography variant='body2' style={{display:'inline-block', color: 'red' }} >（建议：伸展定时值为弯曲定时值的 1.5 倍）</Typography>
          <StyledDiv>
            <Box>
                <FormControl sx={{ m: 1, minWidth: 240 }} size="small">
                  <InputLabel id="demo-select-small-label">训练模式</InputLabel>
                  <Select
                      {...register('mode', {required: '训练模式是必需的'})}
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={String(NumToModeMapping[willEditPrescription.mode])}
                      label="Age1"
                      name="mode"
                      onChange={handleModeChange}>
                    <MenuItem value={1}>被动计次模式</MenuItem>
                    <MenuItem value={2}>被动定时模式</MenuItem>
                    <MenuItem value={3}>主动计次模式</MenuItem>
                    <MenuItem value={4}>主动定时模式</MenuItem>
                    <MenuItem value={5}>助力计次模式</MenuItem>
                    <MenuItem value={6}>助力定时模式</MenuItem>
                    <MenuItem value={7}>手动计次模式</MenuItem>
                    {/*<MenuItem value={8}>被动评估模式</MenuItem>*/}
                    {/*<MenuItem value={9}>主动评估模式</MenuItem>*/}
                  </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 240 }} size="small">
                <InputLabel id="demo-select-small-label">训练部位</InputLabel>
                <Select
                    {...register('part', { required: '训练部位是必需的' })}
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={String(NumToBodyPartMapping[willEditPrescription.part])}
                    label="Age2"
                    onChange={handlePartChange}
                    name="part">
                  <MenuItem value={1}>左手</MenuItem>
                  <MenuItem value={2}>右手</MenuItem>
                  <MenuItem value={3}>左腕</MenuItem>
                  <MenuItem value={4}>右腕</MenuItem>
                  <MenuItem value={5}>左踝</MenuItem>
                  <MenuItem value={6}>右踝</MenuItem>
                </Select>
              </FormControl>
              <TextField
                {...register('total_days', {
                  required: '不能为空',
                  validate: value => (!isNaN(value) && value >= 1) || '值须大于等于1'
                })}
                sx={{ m: 1, minWidth: 160 }}
                value={willEditPrescription.total_days}
                id="outlined-total_days" label="共需训练天数"
                onChange={handleTotalDaysChange}
                error={!!errors.total_days}
                helperText={errors.total_days?.message}
                inputProps={{ type: 'number' }}
                variant="outlined" size="small"/>
              <TextField
                {...register('frequency_per_day', {
                  required: '不能为空',
                  validate: value => (!isNaN(value) && value >= 1) || '值须大于等于1'
                })}
                sx={{ m: 1, minWidth: 160 }}
                value={willEditPrescription.frequency_per_day}
                id="outlined-frequency_per_day" label="每天训练次数"
                onChange={handleFrequencyPerDayChange}
                error={!!errors.frequency_per_day}
                helperText={errors.frequency_per_day?.message}
                inputProps={{ type: 'number' }}
                variant="outlined" size="small"/>
              </Box>
            <Box>
              <TextField
                  {...register('zz', {
                    required: '不能为空',
                    validate: value => (!isNaN(value) && value >= 3) || '值须大于等于3'
                  })}
                  sx={{ m: 1, minWidth: 160 }}
                  value={willEditPrescription.zz}
                  id="outlined-zz" label="训练次数或时间"
                  onChange={handleZZChange}
                  error={!!errors.zz}
                  helperText={errors.zz?.message}
                  inputProps={{ type: 'number' }}
                  variant="outlined" size="small"/>
              <TextField
                  {...register('u', {
                    required: '不能为空',
                    validate: value => (!isNaN(value) && value >= 3) || '值须大于等于3'
                  })}
                  sx={{ m: 1, minWidth: 160 }}
                  value={willEditPrescription.u}
                  id="outlined-u"
                  label="弯曲定时值"
                  onChange={handleUChange}
                  error={!!errors.u}
                  helperText={errors.u?.message}
                  inputProps={{ type: 'number' }}
                  variant="outlined" size="small"/>
              <TextField
                  {...register('v', {
                      required: '不能为空',
                      validate: value => (!isNaN(value) && value >= 3) || '值须大于等于3'
                  })}
                  sx={{ m: 1, minWidth: 160 }}
                  value={willEditPrescription.v}
                  id="outlined-v"
                  label="伸展定时值"
                  onChange={handleVChange}
                  error={ !!errors.v }
                  helperText={errors.v?.message}
                  inputProps={{ type: 'number' }}
                  variant="outlined" size="small"/>
              </Box>
          </StyledDiv>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModify}>取消</Button>
          <Button onClick={handleEditPrescription} disabled={isSubmitting}>确定</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openadd} onClose={handleCloseAdd}>
        <DialogTitle>新建处方</DialogTitle>
        <DialogContent>
          <DialogContentText style={{display:'inline-block'}}>
            确保正确填写所有处方信息
          </DialogContentText>
          <Typography variant='body2' style={{display:'inline-block', color: 'red' }} >（建议：伸展定时值=弯曲定时值的 1.5 倍）</Typography>
          <StyledDiv>
            <Box>
              <FormControl sx={{ m: 1, minWidth: 240 }} size="small">
                <InputLabel>训练模式</InputLabel>
                <Select
                  id="y"
                  name="mode"
                  label="模式"
                  value={String(NumToModeMapping[willAddPrescription.mode])}
                  onChange={handleAddPrescriptionModeChange}>
                  <MenuItem value={1}>被动计次模式</MenuItem>
                  <MenuItem value={2}>被动定时模式</MenuItem>
                  <MenuItem value={3}>主动计次模式</MenuItem>
                  <MenuItem value={4}>主动定时模式</MenuItem>
                  <MenuItem value={5}>助力计次模式</MenuItem>
                  <MenuItem value={6}>助力定时模式</MenuItem>
                  <MenuItem value={7}>手动计次模式</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 240 }} size="small">
                <InputLabel id="demo-select-small-label">训练部位</InputLabel>
                <Select
                  id="x"
                  name="part"
                  label="部位"
                  value={String(NumToBodyPartMapping[willAddPrescription.part])}
                  onChange={handleAddPrescriptionPartChange}>
                  <MenuItem value={1}>左手</MenuItem>
                  <MenuItem value={2}>右手</MenuItem>
                  <MenuItem value={3}>左腕</MenuItem>
                  <MenuItem value={4}>右腕</MenuItem>
                  <MenuItem value={5}>左踝</MenuItem>
                  <MenuItem value={6}>右踝</MenuItem>
                </Select>
              </FormControl>
              {/*<FormControl sx={{ m: 1, minWidth: 240 }} size="small">*/}
              {/*  <TextField*/}
              {/*    {...AddPrescriptionItemRegister<AddPrescriptionItem>('duration', {*/}
              {/*      required: '不能为空',*/}
              {/*      validate: value => {*/}
              {/*        if (typeof value === 'undefined') {*/}
              {/*          return false;*/}
              {/*        }*/}
              {/*        if (typeof value === 'string') {*/}
              {/*          const numberValue = parseFloat(value);*/}
              {/*          return (!isNaN(numberValue) && numberValue >= 1) || '值须大于等于1';*/}
              {/*        }*/}
              {/*        return (!isNaN(value) && value >= 3) || '值须大于等于3';*/}
              {/*      }*/}
              {/*    })}*/}
              {/*    value={willAddPrescription.duration}*/}
              {/*    onChange={handleAddPrescriptionDuration}*/}
              {/*    error={!!AddPrescriptionItemErrors.duration}*/}
              {/*    helperText={AddPrescriptionItemErrors.duration?.message}*/}
              {/*    inputProps={{ type: 'number', min: 1 }}*/}
              {/*    sx={{ m: 1, minWidth: 160 }}*/}
              {/*    id="duration"*/}
              {/*    label="疗程" variant="outlined" size="small"/>*/}
              {/*</FormControl>*/}
                <TextField
                  value={willAddPrescription.total_days}
                  onChange={handleAddPrescriptionTotalDays}
                  error={totalDaysError != ''}
                  helperText={totalDaysError}
                  inputProps={{ type: 'number' }}
                  sx={{ m: 1, minWidth: 160 }}
                  id="total_days"
                  label="共需训练天数" variant="outlined" size="small"/>
                <TextField
                  value={willAddPrescription.frequency_per_day}
                  onChange={handleAddPrescriptionFrequencyPerDay}
                  error={frequencyPerDayError != ''}
                  helperText={frequencyPerDayError}
                  inputProps={{ type: 'number'}}
                  sx={{ m: 1, minWidth: 160 }}
                  id="frequency_per_day"
                  label="每天训练次数" variant="outlined" size="small"/>
            </Box>
            <Box>
              <TextField
                value={willAddPrescription.zz}
                onChange={handleAddPrescriptionTimes}
                error={timesError != ''}
                helperText={timesError}
                inputProps={{ type: 'number' }}
                sx={{ m: 1, minWidth: 160 }}
                id="zz"
                label="训练次数或时间" variant="outlined" size="small"/>
              <TextField
                value={willAddPrescription.u}
                onChange={handleAddPrescriptionBend}
                error={bendError !== ''}
                helperText={bendError}
                inputProps={{ type: 'number' }}
                sx={{ m: 1, minWidth: 160 }}
                id="u"
                label="弯曲定时值" variant="outlined" size="small"/>
              <TextField
                value={willAddPrescription.v}
                onChange={handleAddPrescriptionStretch}
                error={stretchError !== ""}
                helperText={stretchError}
                inputProps={{ type: 'number' }}
                sx={{ m: 1, minWidth: 160 }}
                id="v"
                label="伸展定时值" variant="outlined" size="small"/>
            </Box>
          </StyledDiv>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>取消</Button>
          <Button
            onClick={handleSaveAddPrescription}
            disabled={Boolean(error)}
          >确定</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
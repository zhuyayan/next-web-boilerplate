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
  Prescription as PrescriptionEntity, AddPrescriptionItem
} from "@/redux/features/rehab/rehab-slice";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {useDispatch} from "react-redux";
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


const nextSunday = dayjs().endOf('week').startOf('day');

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

export default function StickyHeadTable(params: { id: string,PId:string,
  prescription:Prescription[],
  onlineEquipment: EquipmentOnline[]}) {
  const appDispatch = useAppDispatch()
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch()
  const appThunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  const [device, setDevice] = React.useState('');
  const [open, setOpen] = React.useState(false);
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
  })
  const [willEditPrescription, setWillEditPrescription] = useState<Prescription>({
    id: 0,
    created_at: "",
    part: "0",
    mode: "0",
    zz: 10,
    u: 3,
    v: 3,
  })


  function createTargetData(
    onsetTime: string,
    medication: string,
    spasmStatus: string,
    minHeartRate: string,
    maxHeartRate: string,
    avgHeartRate: string,
  ) {
    return { onsetTime, medication, spasmStatus, minHeartRate, maxHeartRate,avgHeartRate };
  }
  const rows = [
    // createTargetData('1314', '159', '6.0', '24', '4.0','9'),
  ];

  function createEvaluateData(
    tolerance: number,
    sportsEvaluation: number,
    spasmEvaluation: number,
    muscularTension: number,
    acutePhase: number,
    neurological: number,
    sportsInjury: number
  ) {
    return {
      tolerance,
      sportsEvaluation,
      spasmEvaluation,
      muscularTension,
      acutePhase,
      neurological,
      sportsInjury
    };
  }
  const evaluateData = [createEvaluateData(1314, 159, 6.0, 24, 4.0, 5, 4)];


  const [clientId, setClientId] = useState("")
  const [openDelPrescription, setOpenDelPrescription] = useState(false);
  const [prescriptionToBeDeleted, setPrescriptionToBeDeleted] = useState<Prescription>(GetDefaultPrescription());
  const { enqueueSnackbar } = useSnackbar();
  const handleClickOpen = (row: Prescription) => {
    setOpen(true);
    setSelectedPrescription(row)
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

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleSendCommand = () => {
    appThunkDispatch(sendPrescriptionToEquipment({prescription_id:selectedPrescription.id, e_id: clientId}))
    setOpen(false);
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

  //跳转
  const handleClickMove = () => {
    const targetElement = document.getElementById('target-element');
    targetElement?.scrollIntoView({ behavior: 'smooth'});
  };

  const [willAddStatus, setWillAddStatus] = React.useState<PatientStatus>({
    pid:0,
    onset_time : "",
    medication : "",
    spasm_status : "",
    min_heart_rate : 0,
    max_heart_rate : 0,
    avg_heart_rate : 0,
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

  const handleSaveAddStatus = () => {
    appThunkDispatch(addStatus({
      pid: parseInt(params.id),
      onset_time: willAddStatus.onset_time,
      medication: willAddStatus.medication,
      spasm_status: willAddStatus.spasm_status,
      min_heart_rate: willAddStatus.min_heart_rate,
      max_heart_rate: willAddStatus.max_heart_rate,
      avg_heart_rate: willAddStatus.avg_heart_rate
    }))
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
  const handleAddPrescriptionDuration = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setWillAddPrescription((prevInputValues) => ({
      ...prevInputValues,
      [id]: parseInt(value),
    }))
  };
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
      v: Number(willAddPrescription.v)
    }))
    setOpenAdd(false);
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

  return (<>
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 800 }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChangeTest}
        aria-label="Vertical tabs example"
        // sx={{ borderRight: 2, borderColor: 'divider', width: 230 }}
      >
        <Tab
          sx={{width: '230px'}}
          label={
          <>
            <div>
              <CardHeader style={{display:'inline-block'}} title='处方' titleTypographyProps={{ variant: 'h6' }} />
              <Typography style={{display:'inline-block'}} variant="h7" gutterBottom>
                (共
              </Typography>
              <Typography color="primary" style={{display:'inline-block'}} variant="h6" gutterBottom>
                {prescription.length}
              </Typography>
              <Typography style={{display:'inline-block'}} variant="h7" gutterBottom>
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
            </div>
          </>
        }>
        </Tab>
        {params.prescription?.map(row => (
          <Tab
            sx={{width: '230px'}}
            key={row.id}
            label={<>
            <Card key={row.id} sx={{ marginBottom: 0 }}>
              <CardContent>
                <Typography>{row.created_at}</Typography>
                <Typography>模式: {row.mode}</Typography>
                <Typography>部位: {row.part}</Typography>
                <Typography>训练时长或次数: {row.zz}</Typography>
                <Typography>弯曲定时值: {row.u}</Typography>
                <Typography>伸展定时值: {row.v}</Typography>
                <ThemeProvider theme={theme}>
                  <Typography align='right'>进度：
                    {
                      (() => {
                        let label = row.prescription_record?.length + ' / ' + row.duration;
                        let color = 'success';
                        if (row.prescription_record?.length == row.duration) {
                          color = 'success';
                        } else if (row.prescription_record?.length && row.duration && row.prescription_record.length < row.duration) {
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
          </>} {...a11yProps(1)} />
        ))}
      </Tabs>
      <TabPanel index={0} value={value}></TabPanel>
      {params.prescription?.map(row => (
        <>
          <TabPanel value={value} index={1}>
            {/*一天三次，一次十分钟，共需做5天，已做3天*/}
            <Grid container spacing={2}>
              <Grid item xs={8} md={8}>
                <Card sx={{ minWidth: 500,backgroundColor: '#74b2f1' ,display: 'flex', justifyContent: 'space-between'}}>
                  <CardContent>
                    <Typography sx={{ fontSize: 16 ,fontWeight: 'bold'}} color="text.secondary" gutterBottom>
                      一天三次，一次十分钟，共需做 5 天，已做 3 天
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button style={{backgroundColor: '#2152f3', color: '#ffffff', float: 'right'}} onClick={handleClickOpenTarget}>修改</Button>
                  </CardActions>
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
                {/* 康复记录*/}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom component="div">
                      康复记录
                    </Typography>
                    <Table aria-label="purchases">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">状态</TableCell>
                          <TableCell>康复开始时间</TableCell>
                          <TableCell>康复结束时间</TableCell>
                          <TableCell align="center">时长</TableCell>
                          <TableCell align="center">指标</TableCell>
                          <TableCell align="center">量表及评价</TableCell>
                          <TableCell align="center">操作</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Button style={{backgroundColor: '#f32148', color: '#ffffff', float: 'right'}}>完成</Button>
                          </TableCell>
                          <TableCell>2023-9-8 14:10</TableCell>
                          <TableCell>2023-9-8 14:30</TableCell>
                          <TableCell>20min</TableCell>
                          <TableCell align="center">
                            <Button style={{backgroundColor: '#2196f3', color: '#ffffff', float: 'right'}} onClick={handleClickOpenTarget}>填写指标</Button>
                          </TableCell>
                          <TableCell align="center">
                            <a href={`/rehab/assessment`} target="_blank" rel="noopener noreferrer">
                              <Button style={{backgroundColor: '#2196f3', color: '#ffffff', float: 'right'}}>填写量表</Button>
                            </a>
                          </TableCell>
                          <TableCell align="center">
                            <Button style={{backgroundColor: '#06c426', color: '#ffffff', float: 'right'}} onClick={handleClickMove}>查看直方图</Button>
                          </TableCell>
                        </TableRow>
                        {/*{*/}
                        {/*  row.prescription_record?.map((historyRow: PrescriptionRecord) => (*/}
                        {/*    <TableRow key={historyRow.id}>*/}
                        {/*      <TableCell>完成</TableCell>*/}
                        {/*      <TableCell>{historyRow.eid}</TableCell>*/}
                        {/*      <TableCell>{historyRow.pid}</TableCell>*/}
                        {/*      <TableCell>20min</TableCell>*/}
                        {/*      <TableCell align="center">*/}
                        {/*        <Button color="secondary" onClick={handleClickOpenTarget}>指标</Button>*/}
                        {/*      </TableCell>*/}
                        {/*      <TableCell align="center">*/}
                        {/*        <Button color="secondary" onClick={handleClickOpenEvaluate}>康复评价</Button>*/}
                        {/*      </TableCell>*/}
                        {/*      <TableCell align="center">*/}
                        {/*        <Button color="secondary" onClick={handleClickMove}>查看直方图</Button>*/}
                        {/*      </TableCell>*/}
                        {/*    </TableRow>*/}
                        {/*  ))*/}
                        {/*}*/}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>


              </Grid>
              <Grid item xs={12} md={12}>
                <Card id="target-element">
                  <CardHeader title='当次压力直方图' titleTypographyProps={{ variant: 'h6' }} style={{ textAlign: 'center' }} />
                  <CardContent>
                    <EChartsTest/>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Card></Card>
          </TabPanel>
        </>
      ))}
    </Box>
        {/*<TableContainer>*/}
        {/*  <Table stickyHeader aria-label="sticky table">*/}
        {/*    <TableHead>*/}
        {/*      <TableRow>*/}
        {/*        {columns.map((column) => (*/}
        {/*            <TableCell*/}
        {/*                key={column.id}*/}
        {/*                align={column.align}*/}
        {/*                style={{ minWidth: column.minWidth }}*/}
        {/*            >*/}
        {/*              {column.label}*/}
        {/*            </TableCell>*/}
        {/*        ))}*/}
        {/*      </TableRow>*/}
        {/*    </TableHead>*/}
        {/*    <TableBody>*/}
        {/*      {params.prescription?.map(row => (*/}
        {/*        <React.Fragment key={row.id}>*/}
        {/*          <StyledTableRow*/}
        {/*              style={{height:'30px'}}*/}
        {/*              onClick={() => handleRowClick(row.id)}*/}
        {/*          >*/}
        {/*            <TableCell>*/}
        {/*              <IconButton*/}
        {/*                aria-label="expand row"*/}
        {/*                size="small"*/}
        {/*                // onClick={() => handleRowClick(row.id)}*/}
        {/*              >*/}
        {/*                {openRecord[row.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}*/}
        {/*              </IconButton>*/}
        {/*            </TableCell>*/}
        {/*            <TableCell component='th' scope='row'>*/}
        {/*              {row.created_at}*/}
        {/*            </TableCell>*/}
        {/*            <TableCell align='right'>{row.mode}</TableCell>*/}
        {/*            <TableCell align='right'>{row.part}</TableCell>*/}
        {/*            <TableCell align='right'>{row.zz}</TableCell>*/}
        {/*            <TableCell align='right'>{row.u}</TableCell>*/}
        {/*            <TableCell align='right'>{row.v}</TableCell>*/}

        {/*            <ThemeProvider theme={theme}>*/}
        {/*              <TableCell align='right'>*/}
        {/*                {*/}
        {/*                  (() => {*/}
        {/*                    let label = row.prescription_record?.length + ' / ' + row.duration;*/}
        {/*                    let color = 'success';*/}
        {/*                    if (row.prescription_record?.length == row.duration) {*/}
        {/*                      color = 'success';*/}
        {/*                    } else if (row.prescription_record?.length && row.duration && row.prescription_record.length < row.duration) {*/}
        {/*                      color = 'primary';*/}
        {/*                    }*/}
        {/*                    return <MCTFixedWidthChip label={label} color={color} />;*/}
        {/*                  })()*/}
        {/*                }*/}
        {/*              </TableCell>*/}
        {/*            </ThemeProvider>*/}
        {/*            <TableCell align='center'>*/}
        {/*              /!*<ButtonGroup variant="outlined" aria-label="outlined button group" style={{height:'20px'}}>*!/*/}
        {/*              /!*  <Button color="primary"  onClick={(event)=>{event.stopPropagation(); handleClickOpen(row);}}>下发</Button>*!/*/}
        {/*              /!*  <Button color="primary" onClick={(event) => {event.stopPropagation();handleClickModify(row)}}>修改</Button>*!/*/}
        {/*              /!*  <Button color="secondary" onClick={() => handleDeletePrescription(row.id)}>删除</Button>*!/*/}
        {/*              /!*</ButtonGroup>*!/*/}
        {/*              <Tooltip title="下发处方">*/}
        {/*                <IconButton*/}
        {/*                    aria-label="edit"*/}
        {/*                    color="primary"*/}
        {/*                    onClick={(event)=>{event.stopPropagation(); handleClickOpen(row);}}*/}
        {/*                >*/}
        {/*                  <SendAndArchiveIcon fontSize="small" />*/}
        {/*                </IconButton>*/}
        {/*              </Tooltip>*/}

        {/*              <Tooltip title="修改处方">*/}
        {/*                <IconButton*/}
        {/*                    aria-label="edit"*/}
        {/*                    color="secondary"*/}
        {/*                    onClick={(event) => {event.stopPropagation(); handleClickModify(row)}}*/}
        {/*                >*/}
        {/*                  <EditIcon fontSize="small" />*/}
        {/*                </IconButton>*/}
        {/*              </Tooltip>*/}

        {/*              <Tooltip title="删除处方">*/}
        {/*                <IconButton*/}
        {/*                    aria-label="delete"*/}
        {/*                    // onClick={() => handleDeletePrescription(row.id)}*/}
        {/*                    onClick={(event) => {event.stopPropagation(); handleClickDel(row)}}*/}
        {/*                >*/}
        {/*                  <DeleteIcon fontSize="small" />*/}
        {/*                </IconButton>*/}
        {/*              </Tooltip>*/}
        {/*            </TableCell>*/}
        {/*          </StyledTableRow>*/}
        {/*        <StyledTableRow>*/}
        {/*        /!*  康复记录*!/*/}
        {/*        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>*/}
        {/*          <Collapse in={openRecord[row.id]} timeout="auto" unmountOnExit>*/}
        {/*            <Box sx={{ margin: 1,backgroundColor: 'rgba(177,197,238,0.78)',paddingLeft:3,marginLeft:2}}>*/}
        {/*              <Typography variant="h6" gutterBottom component="div">*/}
        {/*                康复记录*/}
        {/*              </Typography>*/}
        {/*              <Table size="small" aria-label="purchases">*/}
        {/*                <TableHead>*/}
        {/*                  <TableRow>*/}
        {/*                    <TableCell>康复开始时间</TableCell>*/}
        {/*                    <TableCell>康复结束时间</TableCell>*/}
        {/*                    <TableCell align="center">各项指标</TableCell>*/}
        {/*                    <TableCell align="center">医生评价</TableCell>*/}
        {/*                    <TableCell align="center">操作</TableCell>*/}
        {/*                  </TableRow>*/}
        {/*                </TableHead>*/}
        {/*                <TableBody>*/}
        {/*                  {*/}
        {/*                    row.prescription_record?.map((historyRow: PrescriptionRecord) => (*/}
        {/*                        <TableRow key={historyRow.id}>*/}
        {/*                          <TableCell>{historyRow.eid}</TableCell>*/}
        {/*                          <TableCell>{historyRow.pid}</TableCell>*/}
        {/*                          <TableCell align="center">*/}
        {/*                            <Button color="secondary" onClick={handleClickOpenTarget}>病人指标</Button>*/}
        {/*                          </TableCell>*/}
        {/*                          <TableCell align="center">*/}
        {/*                            <Button color="secondary" onClick={handleClickOpenEvaluate}>康复评价</Button>*/}
        {/*                          </TableCell>*/}
        {/*                          <TableCell align="center">*/}
        {/*                            <Button color="secondary" onClick={handleClickMove} >查看直方图</Button>*/}
        {/*                          </TableCell>*/}
        {/*                        </TableRow>*/}
        {/*                    ))*/}
        {/*                  }*/}
        {/*                </TableBody>*/}
        {/*              </Table>*/}
        {/*            </Box>*/}
        {/*          </Collapse>*/}
        {/*        </TableCell>*/}
        {/*      </StyledTableRow>*/}
        {/*        </React.Fragment>*/}
        {/*        ))}*/}
        {/*    </TableBody>*/}
        {/*  </Table>*/}
        {/*</TableContainer>*/}
      {/*</Paper>*/}


      {/*查看指标弹框*/}
      <Dialog
        open={openTarget}
        onClose={handleCloseTarget}
        aria-describedby="Target"
      >
        <DialogTitle>{"病人各项指标"}</DialogTitle>
        <DialogContent>
          {rows.length > 0 ? (
            <DialogContentText id="Target">
              <Table sx={{ minWidth: 500 }} aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>发病时间</TableCell>
                    <TableCell align="right">用药</TableCell>
                    <TableCell align="right">痉挛状态</TableCell>
                    <TableCell align="right">最小心率</TableCell>
                    <TableCell align="right">最大心率</TableCell>
                    <TableCell align="right">平均心率</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.onsetTime}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.onsetTime}
                      </TableCell>
                      <TableCell align="right">{row.medication}</TableCell>
                      <TableCell align="right">{row.spasmStatus}</TableCell>
                      <TableCell align="right">{row.minHeartRate}</TableCell>
                      <TableCell align="right">{row.maxHeartRate}</TableCell>
                      <TableCell align="right">{row.avgHeartRate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogContentText>
          ) : (
            <div>
              {/*<TextField*/}
              {/*  label="发病时间"*/}
              {/*  value={willAddStatus.onset_time}*/}
              {/*  onChange={handleAddStatus}*/}
              {/*  fullWidth*/}
              {/*/>*/}
              {/* Add more input fields for other indicators */}
              <Grid container spacing={0}>
                <Grid item xs={6}>
                  <Box sx={{padding: '8px' }}>
                    <Grid container spacing={0} alignItems="center">
                      <Grid item xs={4}>
                        <label htmlFor="input9">发病时间:</label>
                      </Grid>
                      <Grid item xs={8}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateTimePicker
                            value={willAddStatus.onset_time !== "" ? dayjs(willAddStatus.onset_time) : null}
                            onChange={(newValue) => {
                              // newValue is the selected date and time object
                              const formattedDate = newValue?.format('YYYY-MM-DD HH:mm:ss') || '';
                              setWillAddStatus((prevStatus) => ({
                                ...prevStatus,
                                onset_time: formattedDate,
                              }));
                            }}
                            defaultValue={nextSunday}
                            shouldDisableDate={isWeekend}
                            views={['year', 'month', 'day', 'hours', 'minutes']}
                          />
                        </LocalizationProvider>
                        {/*<TextField*/}
                        {/*  id="onset_time"*/}
                        {/*  value={willAddStatus.onset_time}*/}
                        {/*  onChange={handleAddStatus}*/}
                        {/*  size="small"*/}
                        {/*  fullWidth*/}
                        {/*/>*/}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{padding: '8px' }}>
                    <Grid container spacing={0} alignItems="center">
                      <Grid item xs={4}>
                        <label htmlFor="input10">用药:</label>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                          id="medication"
                          value={willAddStatus.medication}
                          onChange={handleAddStatus}
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
                        <label htmlFor="input11">痉挛状态:</label>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                          id="spasm_status"
                          value={willAddStatus.spasm_status}
                          onChange={handleAddStatus}
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
                        <label htmlFor="input9">最小心率:</label>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                          id="min_heart_rate"
                          value={willAddStatus.min_heart_rate}
                          onChange={handleAddStatus}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{padding: '8px' }}>
                    <Grid container spacing={0} alignItems="center">
                      <Grid item xs={4}>
                        <label htmlFor="input9">最大心率:</label>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                          id="max_heart_rate"
                          value={willAddStatus.max_heart_rate}
                          onChange={handleAddStatus}
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
                        <label htmlFor="input9">平均心率:</label>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                          id="avg_heart_rate"
                          value={willAddStatus.avg_heart_rate}
                          onChange={handleAddStatus}
                          size="small"
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>

            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveAddStatus}>保存指标</Button>
          <Button onClick={handleCloseTarget}>关闭</Button>
        </DialogActions>
      </Dialog>


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
                <Grid item xs={6}>
                  <Box sx={{padding: '8px' }}>
                    {/*<Button style={{float: 'right'}} variant="outlined" onClick={handleSaveEvaluate}>保存评价</Button>*/}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{padding: '8px' }}>
                    <Typography variant='body2' style={{ color: 'red' }}>注：医生在该表格填写完成的评价信息只针对本次康复训练，评价将被保存在本次康复记录的表格中。</Typography>
                  </Box>
                </Grid>
              </Grid>
            </form>
            {/*{evaluateData.map((row, index) => (*/}
            {/*    <Grid container spacing={0} key={index}>*/}
            {/*      <Grid item xs={6}>*/}
            {/*        <Box sx={{padding: '8px' }}>*/}
            {/*          <Grid container spacing={0} alignItems="center">*/}
            {/*            <label htmlFor="input9">耐受状态: {row.tolerance.toFixed(1)}</label>*/}
            {/*          </Grid>*/}
            {/*        </Box>*/}
            {/*      </Grid>*/}
            {/*      <Grid item xs={6}>*/}
            {/*        <Box sx={{padding: '8px' }}>*/}
            {/*          <Grid container spacing={0} alignItems="center">*/}
            {/*            <label htmlFor="input10">运动评价: {row.sportsEvaluation.toFixed(1)}</label>*/}
            {/*          </Grid>*/}
            {/*        </Box>*/}
            {/*      </Grid>*/}
            {/*      <Grid item xs={6}>*/}
            {/*        <Box sx={{padding: '8px' }}>*/}
            {/*          <Grid container spacing={0} alignItems="center">*/}
            {/*            <label htmlFor="input11">痉挛评价: {row.spasmEvaluation.toFixed(1)}</label>*/}
            {/*          </Grid>*/}
            {/*        </Box>*/}
            {/*      </Grid>*/}
            {/*      <Grid item xs={6}>*/}
            {/*        <Box sx={{padding: '8px' }}>*/}
            {/*          <Grid container spacing={0} alignItems="center">*/}
            {/*            <label htmlFor="input11">肌张力: {row.muscularTension.toFixed(1)}</label>*/}
            {/*          </Grid>*/}
            {/*        </Box>*/}
            {/*      </Grid>*/}
            {/*      <Grid item xs={6}>*/}
            {/*        <Box sx={{padding: '8px' }}>*/}
            {/*          <Grid container spacing={0} alignItems="center">*/}
            {/*            <label htmlFor="input11">急性期情况: {row.acutePhase.toFixed(1)}</label>*/}
            {/*          </Grid>*/}
            {/*        </Box>*/}
            {/*      </Grid>*/}
            {/*      <Grid item xs={6}>*/}
            {/*        <Box sx={{padding: '8px' }}>*/}
            {/*          <Grid container spacing={0} alignItems="center">*/}
            {/*            <label htmlFor="input11">神经科判断: {row.neurological.toFixed(1)}</label>*/}
            {/*          </Grid>*/}
            {/*        </Box>*/}
            {/*      </Grid>*/}
            {/*      <Grid item xs={6}>*/}
            {/*        <Box sx={{padding: '8px' }}>*/}
            {/*          <Grid container spacing={0} alignItems="center">*/}
            {/*            <label htmlFor="input11">运动损伤度: {row.sportsInjury.toFixed(1)}</label>*/}
            {/*          </Grid>*/}
            {/*        </Box>*/}
            {/*      </Grid>*/}
            {/*      <Grid item xs={6}>*/}
            {/*        <Box sx={{padding: '8px' }}>*/}

            {/*        </Box>*/}
            {/*      </Grid>*/}
            {/*    </Grid>*/}
            {/*))}*/}

            {/*<Table sx={{ minWidth: 700 }}>*/}
            {/*  <TableHead>*/}
            {/*    <TableRow>*/}
            {/*      <TableCell>耐受程度</TableCell>*/}
            {/*      <TableCell align="right">运动评价</TableCell>*/}
            {/*      <TableCell align="right">痉挛评价</TableCell>*/}
            {/*      <TableCell align="right">肌张力</TableCell>*/}
            {/*      <TableCell align="right">急性期情况</TableCell>*/}
            {/*      <TableCell align="right">神经科判断</TableCell>*/}
            {/*      <TableCell align="right">运动损伤度</TableCell>*/}
            {/*    </TableRow>*/}
            {/*  </TableHead>*/}
            {/*  <TableBody>*/}
            {/*    {evaluateData.map((row) => (*/}
            {/*      <TableRow*/}
            {/*        key={row.tolerance}*/}
            {/*        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}*/}
            {/*      >*/}
            {/*        <TableCell component="th" scope="row">*/}
            {/*          {row.tolerance}*/}
            {/*        </TableCell>*/}
            {/*        <TableCell align="right">{row.sportsEvaluation}</TableCell>*/}
            {/*        <TableCell align="right">{row.spasmEvaluation}</TableCell>*/}
            {/*        <TableCell align="right">{row.muscularTension}</TableCell>*/}
            {/*        <TableCell align="right">{row.acutePhase}</TableCell>*/}
            {/*        <TableCell align="right">{row.neurological}</TableCell>*/}
            {/*        <TableCell align="right">{row.sportsInjury}</TableCell>*/}
            {/*      </TableRow>*/}
            {/*    ))}*/}
            {/*  </TableBody>*/}
            {/*</Table>*/}
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
              <FormControl sx={{ m: 1, minWidth: 240 }} size="small">
                <TextField
                  {...AddPrescriptionItemRegister('duration', {
                    required: '不能为空',
                    validate: value => {
                      if (typeof value === 'undefined') {
                        return false;
                      }
                      if (typeof value === 'string') {
                        const numberValue = parseFloat(value);
                        return (!isNaN(numberValue) && numberValue >= 1) || '值须大于等于1';
                      }
                      return (!isNaN(value) && value >= 3) || '值须大于等于3';
                    }
                  })}
                  value={willAddPrescription.duration}
                  onChange={handleAddPrescriptionDuration}
                  error={!!AddPrescriptionItemErrors.duration}
                  helperText={AddPrescriptionItemErrors.duration?.message}
                  inputProps={{ type: 'number', min: 1 }}
                  sx={{ m: 1, minWidth: 160 }}
                  id="duration"
                  label="疗程" variant="outlined" size="small"/>
              </FormControl>
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
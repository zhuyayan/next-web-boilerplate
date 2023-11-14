"use client";
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Prescription from "@/components/rehab/prescription/Prescription";
import {EChartsTest} from "@/components/rehab/echarts/EChartsTest";
import {quEcharts} from "@/components/rehab/echarts/quEcharts";
import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import styled from "styled-components";

import Select, {SelectChangeEvent} from '@mui/material/Select';
import {ChangeEvent, SyntheticEvent, useCallback, useEffect, useRef, useState} from "react";
import {RootState, useAppSelector} from "@/redux/store";
import {AnyAction} from "redux";
import {useDispatch} from "react-redux";
import {
  fetchPatientStatisticsById,
  fetchPrescriptionByPId,
  Prescription as PrescriptionEntity,
  EvaluateFormProps,
  AddPrescriptionItem,
  PatientStatus,
  addStatus,
  addEvaluation,
  fetchEvaluationById,
  fetchStatusById, useGetBlueToothEquipmentsQuery
} from "@/redux/features/rehab/rehab-slice";
import {
  addPrescription,
  fetchPatientById,
  fetchPrescriptionRecordById,
  useGetOnlineEquipmentsQuery,
  useGetTrainMessageQuery
} from "@/redux/features/rehab/rehab-slice";
import {
  BodyPartToNumMapping,
  ModeToNumMapping,
  NumToBodyPartMapping,
  NumToModeMapping,
  PatientNumClassifyToClassifyLabelMapping, PatientNumStrokeLevelToStrokeLevelLabelMapping
} from "@/utils/mct-utils";
import {IconButton, InputAdornment, TableContainer} from "@mui/material";

import TimerIcon from '@mui/icons-material/Timer';
import Tooltip from "@mui/material/Tooltip";
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';

import { Title } from '@/components/rehab/styles';
import {ThunkDispatch} from "redux-thunk";
import CardMedia from "@mui/material/CardMedia";
import Link from "next/link";
import {useForm} from "react-hook-form";

import dayjs, { Dayjs } from 'dayjs';
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Avatar from "@mui/material/Avatar";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {getStrokeEvents, putStrokeEvent, StrokeEvent} from "@/redux/features/rehab/rehab-patient-slice";
import SaveAsIcon from '@mui/icons-material/SaveAs';

//双击编辑组件
type EditableTextProps = {
  initialText: string | null;
};

const EditableText: React.FC<EditableTextProps> = ({ initialText, handleTextChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText === null ? "" : initialText);
  const inputRef = useRef<HTMLInputElement>(null!);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    handleTextChange(text);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    //handleTextChange(text);
  };

  useEffect(()=>{
    setText(initialText || "")
  },[initialText])

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
      <>
        {isEditing || text === "" ? (
            <TextField
                inputRef={inputRef}
                autoFocus
                value={text}
                onBlur={handleBlur}
                onChange={handleChange}
                size="small"
            />
        ) : (
            <Typography onDoubleClick={handleDoubleClick}>{text}</Typography>
        )}
      </>
  );
};

type EditableDateProps = {
  initialDateString: string;
};

const EditableDate: React.FC<EditableDateProps> = ({ initialDateString, handleWillDateChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDateString !== "" ? new Date(initialDateString) : null);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setIsEditing(false);
    // handleWillDateChange(date.toString());
  };

  useEffect(() => {
    const result: string = selectedDate ? selectedDate.toISOString().split('T')[0].concat(' ').concat(initialDateString.split('T')[1].split('Z')[0]) : "";
    console.log("result", result)
    handleWillDateChange(result);
  }, [selectedDate]);

  useEffect(() => {
    setSelectedDate(initialDateString !== "" ? new Date(initialDateString) : null);
  }, [initialDateString]);

  return (
      <div>
        {isEditing || initialDateString === "" ? (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  renderInput={(params) => <input {...params.inputProps} autoFocus />}
              />
            </LocalizationProvider>
        ) : (
            <Typography onDoubleClick={handleDoubleClick}>{selectedDate ? selectedDate.toISOString().split('T')[0] : initialDateString}</Typography>
        )}
      </div>
  );
};

import {getFormFields, getFormFieldsTemplate, SubmissionField} from "@/redux/features/rehab/rehab-formFields-slice";

const nextSunday = dayjs().endOf('week').startOf('day');

const isWeekend = (date: Dayjs) => {
  const day = date.day();

  return day === 0 || day === 6;
};

const StyledDiv = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const StatisticsCard = styled.div`
  height: 160px;
  padding: 10px;
`;

const StyledBoxContainer = styled(Box)`
  &:not(:first-child) {
    margin: -1px;
  }
`;

const TableWrapper = styled.div`
  border: 1px solid #ccc; /* 设置边框样式，可以根据需要进行调整 */
  margin: 16px;
`;

interface HeartBeat {
  topic: string;
  content: string;
}

export default function MUITable({ params }: { params: { id: string ,task_id:string, pid:string} }) {
  const rehabPatient = useAppSelector((state: RootState) => state.rehab.rehabPatient)
  const prescription = useAppSelector((state: RootState) => state.rehab.prescription)
  const record = useAppSelector((state: RootState) => state.rehab.prescriptionRecord)
  const status = useAppSelector((state: RootState) => state.rehab.patientStatus)
  const patientDuration = useAppSelector((state:RootState) => state.rehab.patientDuration)
  const {data: trainData, error: trainError, isLoading: trainLoading} = useGetTrainMessageQuery("redux")
  const {data: onlineData, isLoading: onlineLoading, error: onlineError} = useGetOnlineEquipmentsQuery("redux")
  const {data: blueToothData, isLoading: blueToothLoading, error: blueToothError} = useGetBlueToothEquipmentsQuery<HeartBeat[]>("redux")
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch()
  const [open, setOpen] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [timesError, setTimesError] = React.useState<string>('')
  const [bendError, setBendError] = React.useState<string>('')
  const [stretchError, setStretchError] = React.useState<string>('')
  const [trainMinus, setTrainMinus] = useState<string>('')
  const [trainDays, setTrainDays] = useState<number>(0)
  const [openAddStatus, setOpenAddStatus] = React.useState(false);

  const [numbers, setNumbers] = useState<number[]>(new Array(120).fill(0));
  const addNumber = (newNumber: number) => {
    setNumbers(prevNumbers => {
      // 添加新数字到数组开头
      const updatedNumbers = [newNumber, ...prevNumbers];
      // 如果数组长度超过120，去掉最旧的数字（数组末尾的数字）
      if (updatedNumbers.length > 120) {
        updatedNumbers.pop(); // 去掉数组末尾的元素
      }
      return updatedNumbers;
    });
  };
  useEffect(()=>{
    blueToothData?.map((item: HeartBeat)=>{
      console.log("blueToothData item", item)
      addNumber(parseInt(item.content));
    })
    // addNumber(parseInt(blueToothData?.content));
    console.log("blueToothData", blueToothData)
    console.log("numbers", numbers)
  }, [blueToothData])

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
      pid: parseInt(params.id),
      rehab_session_id: 0,
      spasm_review: evaluateFormData.spasmReview,
      tolerance: evaluateFormData.tolerance,
    }))
    // setOpenAddStatus(false)
  };

  const [willAddPrescription, setWillAddPrescription] = React.useState<PrescriptionEntity>({
    id: 0,
    created_at: "",
    part: "0",
    mode: "0",
    zz: 3,
    u: 3,
    v: 3,
    duration: 1,
    frequency_per_day:1,
    total_days:1,
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

  const handleAddPrescriptionDuration = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setWillAddPrescription((prevInputValues) => ({
      ...prevInputValues,
      [id]: parseInt(value),
    }))
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
      frequency_per_day:Number(willAddPrescription.frequency_per_day),
      total_days:Number(willAddPrescription.total_days)
    }))
    setOpen(false);
  };

  const { register: AddPrescriptionItemRegister, formState: { errors: AddPrescriptionItemErrors }, clearErrors: AddPrescriptionItemClearErrors, trigger:AddPrescriptionItemTrigger } = useForm<AddPrescriptionItem>({mode: 'onBlur' });

  const strokeEventResponse = useAppSelector((state: RootState) => state.patient.strokeEventData);
  const [lastEvent, setLastEvent] = React.useState<StrokeEvent | null>(null);
  const [willEditStrokeEvent, setWillEditStrokeEvent] = React.useState<StrokeEvent | null>(null);

  useEffect(() => {
    // thunkDispatch(fetchPrescriptionById({id: parseInt(params.id)}))
    console.log(123123)
    thunkDispatch(fetchPrescriptionByPId({pid: parseInt(params.id)}))
    thunkDispatch(fetchEvaluationById({task_id: parseInt(params.task_id)}))
    thunkDispatch(fetchStatusById({task_id: parseInt(params.task_id),pid:parseInt(params.pid)}))
    thunkDispatch(fetchPatientById({id: parseInt(params.id)}))
    thunkDispatch(fetchPrescriptionRecordById({id: parseInt(params.id)}))
    thunkDispatch(fetchPatientStatisticsById({id: parseInt(params.id)}))
    thunkDispatch(getStrokeEvents({pid: parseInt(params.id)}))
    console.log("patient id: ", params.id)
    console.log("patient pid: ", params.pid)
    console.log("patient task_id: ", params.task_id)
  },[params.id, thunkDispatch])

  useEffect(() => {
    console.log("strokeEventResponse changed", strokeEventResponse)
    if (strokeEventResponse.length > 0) {
      setLastEvent(strokeEventResponse[0]);
      setWillEditStrokeEvent(strokeEventResponse[0]);
    }
  },[strokeEventResponse])

  const handleLesionLocationChange = (text: string) => {
    setWillEditStrokeEvent((prevState: StrokeEvent) => ({
      ...prevState,
      lesion_location: text,
    }));
  };

  const handleOnsetDataChange = (text: string) => {
    setWillEditStrokeEvent((prevState: StrokeEvent) => ({
      ...prevState,
      onset_date: text,
    }));
  };

  const handleNihssScoreChange = (text: string) => {
    setWillEditStrokeEvent((prevState: StrokeEvent) => ({
      ...prevState,
      nihss_score: parseInt(text),
    }));
  };

  const handleMedicalHistoryChange = (text: string) => {
    setWillEditStrokeEvent((prevState: StrokeEvent) => ({
      ...prevState,
      medical_history: text,
    }));
  };

  //提交修改
  const handleEditStrokeEvent = () => {
    console.log("WillStrokeEvent", willEditStrokeEvent);
    thunkDispatch(putStrokeEvent({ strokeEvent: willEditStrokeEvent!}))
  };

  useEffect(() => {
    setTrainDays(patientDuration.data_count.length)
    setTrainMinus((patientDuration.sec_duration/60).toFixed(0))
    console.log("1111111111111", patientDuration)
  }, [patientDuration])

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

  const [willAddStatus, setWillAddStatus] = React.useState<PatientStatus>({
    id: 0,
    pid:0,
    task_id:0,
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
    thunkDispatch(addStatus({
      pid: parseInt(params.id),
      task_id:parseInt(params.task_id),
      min_heart_rate: willAddStatus.min_heart_rate,
      max_heart_rate: willAddStatus.max_heart_rate,
      avg_heart_rate: willAddStatus.avg_heart_rate
    }))
    setOpenAddStatus(false)
  };

  const [stretchValue, setStretchValue] = useState<string>('1')

  const handleStretchChange = (event: SyntheticEvent, newValue: string) => {
    setStretchValue(newValue)
  }
  const [bendValue, setBendValue] = useState<string>('1')

  const handleBendChange = (event: SyntheticEvent, newValue: string) => {
    setBendValue(newValue)
  }

  const submissionResponseData = useAppSelector((state: RootState) => state.formField.submissionData);
  useEffect(()=>{
    thunkDispatch(getFormFields({result_owner_id: rehabPatient.id}))
  },[params,thunkDispatch])
  // submissionData
  const [submissionData, setSubmissionData] = useState<SubmissionField>({
    fields: [],
    owner_id: 0,
  });

  return (
    <>
      <Container>
        <Box sx={{marginBottom:5}}>
          <Grid container spacing={8}>
            <Grid item xs={12} md={8} sm={10} lg={6} xl={4}>
              <div >
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Title >康复管理</Title>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container justifyContent="flex-end">
                      <Tooltip title="返回病人列表">
                        <Link href={`/rehab/patient`} passHref>
                          <IconButton
                            aria-label="back"
                            color="primary"
                          >
                            <AssignmentReturnIcon fontSize="medium" />
                          </IconButton>
                        </Link>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid container item xs={12} md={12} spacing={2}>
              <Grid item xs={6} md={6}>
                {/*病人card*/}
                {/*<Card  sx={{height: 160}}>*/}
                {/*  <CardContent>*/}
                {/*      <Box sx={{ mr: 2, mb: 1, display: 'flex', flexDirection: 'column' }}>*/}
                {/*        <Typography variant='h6'>{rehabPatient.name}</Typography>*/}
                {/*        <Typography variant='caption'>{rehabPatient.genderLabel}, {rehabPatient.age}, ID：{rehabPatient.i18d}</Typography>*/}
                {/*      </Box>*/}
                {/*  </CardContent>*/}
                {/*</Card>*/}
                <Card sx={{ backgroundColor: 'rgba(191,215,237,0.8)', height: 160}} >
                  <CardContent>
                    <br />
                    <Grid container spacing={2}>
                      <Grid item xs={5}>
                        <Typography component="div">
                          姓名：{rehabPatient.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={3.5}>
                        <Typography component="div">
                          年龄：{rehabPatient.age} 岁
                        </Typography>
                      </Grid>
                      <Grid item xs={3.5}>
                        <Typography component="div">
                          性别：{rehabPatient.genderLabel}
                        </Typography>
                      </Grid>
                    </Grid>
                    <br />
                    <Divider />
                    <br />
                    <Grid container spacing={2}>
                      <Grid item xs={5}>
                        <Typography component="div">
                          ID：{rehabPatient.i18d}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} md={2}>
                <StatisticsCard style={{ backgroundColor: 'rgba(88,133,175,0.8)' }}>
                  <TabContext value={bendValue}>
                    <TabList onChange={handleBendChange} aria-label='card navigation example'>
                      <Tab value='1' label='时长' />
                      <Tab value='2' label='次数' />
                    </TabList>
                    <CardMedia
                      style={{
                        position: 'absolute',
                        width: 50, // 图片的宽度
                        height: 50, // 图片的高度
                      }}
                      component="img"
                      src="/images/fist.png"
                      alt="Image"
                    />
                    <CardContent  sx={{ textAlign: 'right' }}>
                      <TabPanel value='1' sx={{ p: 0 }}>
                        <Typography variant="h4" color="primary" style={{display:'inline-block'}}>
                          {trainMinus}
                        </Typography>
                        <Divider />
                        <Typography variant="body2" color="text.secondary">
                          弯曲总时长 / 分钟
                        </Typography>
                      </TabPanel>
                      <TabPanel value='2' sx={{ p: 0 }}>
                        <Typography variant="h4" color="primary" style={{ textAlign: 'right' }}>
                          666
                        </Typography>
                        <Divider />
                        <Typography variant="body2" color="text.secondary" style={{ textAlign: 'right' }}>
                          弯曲总次数 / 次
                        </Typography>
                      </TabPanel>
                    </CardContent>
                  </TabContext>
                </StatisticsCard>
              </Grid>
              <Grid item xs={6} md={2} alignItems="center" justifyContent="center">
                <StatisticsCard style={{ backgroundColor: 'rgba(96,163,217,0.8)'  }}>
                  <TabContext value={stretchValue}>
                    <TabList onChange={handleStretchChange} aria-label='card navigation example'>
                      <Tab value='1' label='时长' />
                      <Tab value='2' label='次数' />
                    </TabList>
                    <CardMedia
                      style={{
                        position: 'absolute',
                        width: 50, // 图片的宽度
                        height: 50, // 图片的高度
                      }}
                      component="img"
                      src="/images/hand.png"
                      alt="Image"
                    />
                    <CardContent  sx={{ textAlign: 'right' }}>
                      <TabPanel value='1' sx={{ p: 0 }}>
                        <Typography variant="h4" color="primary" style={{display:'inline-block'}}>
                          {record.length}
                        </Typography>
                        <Divider />
                        <Typography variant="body2" color="text.secondary">
                          伸展总时长 / 分钟
                        </Typography>
                      </TabPanel>
                      <TabPanel value='2' sx={{ p: 0 }}>
                        <Typography variant="h4" color="primary" style={{ textAlign: 'right' }}>
                          666
                        </Typography>
                        <Divider />
                        <Typography variant="body2" color="text.secondary" style={{ textAlign: 'right' }}>
                          伸展总次数 / 次
                        </Typography>
                      </TabPanel>
                    </CardContent>
                  </TabContext>
                </StatisticsCard>
              </Grid>
              <Grid item xs={6} md={2}>
                <StatisticsCard style={{ backgroundColor: 'rgba(0,116,183,0.8)' }}>
                  <Typography sx={{ float:"left" }}>
                    <TimerIcon  sx={{ color: '#7442f6', fontSize: 50 }}/>
                  </Typography>
                  <CardContent sx={{ textAlign: 'right' }}>
                    <Typography variant="h3" color="primary" sx={{display:'inline-block'}}>
                      {trainDays}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      总训练天数
                    </Typography>
                    <Divider sx={{padding:'5px'}}/>
                    <Typography sx={{ fontSize: 10 }} color="text.secondary">
                      时间 / 天
                    </Typography>
                  </CardContent>
                </StatisticsCard>
              </Grid>
            </Grid>


            <Grid item xs={12} md={12}>
              <Card>
                <CardHeader style={{display:'inline-block'}} title='病人详细信息' titleTypographyProps={{ variant: 'h5' }}></CardHeader>
                {/*<Button style={{float: 'right'}} onClick={handleEditStrokeEvent}>保存修改</Button>*/}
                <Tooltip title="保存修改">
                  <IconButton
                      style={{float: 'right'}}
                      onClick={handleEditStrokeEvent}>
                    <SaveAsIcon color="primary"/>
                  </IconButton>
                </Tooltip>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={6}>
                      <Box sx={{padding: '8px' }}>
                        <Grid container spacing={0} alignItems="center" justify-items="center">
                          <Grid item xs={4} justifyContent="center" style={{ display: 'flex', alignItems: 'center', height: '30px' }}>
                            <label htmlFor="input9">病变部位:</label>
                          </Grid>
                          <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', height: '30px' }}>
                            <EditableText initialText={lastEvent?.lesion_location ?? ""} handleTextChange={handleLesionLocationChange}/>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid  item xs={6} md={6}>
                      <Box sx={{padding: '8px' }}>
                        <Grid container spacing={0} alignItems="center">
                          <Grid item xs={4} justifyContent="center" style={{ display: 'flex', alignItems: 'center', height: '30px' }}>
                            <label htmlFor="input9">发病日期:</label>
                          </Grid>
                          <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', height: '30px' }}>
                            <EditableDate initialDateString={lastEvent?.onset_date ?? ""} handleWillDateChange={handleOnsetDataChange}/>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                  <br/>
                  <Divider/>
                  <br/>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={6}>
                      <Box sx={{padding: '8px' }}>
                        <Grid container spacing={0} alignItems="center" justify-items="center">
                          <Grid item xs={4} justifyContent="center" style={{ display: 'flex', alignItems: 'center', height: '30px' }}>
                            <label htmlFor="input9">BIHSS评分:</label>
                          </Grid>
                          <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', height: '30px' }}>
                            <EditableText initialText={lastEvent?.nihss_score.toString() ?? ""} handleTextChange={handleNihssScoreChange}/>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid  item xs={6} md={6}>
                      <Box sx={{padding: '8px' }}>
                        <Grid container spacing={0} alignItems="center" justify-items="center">
                          <Grid item xs={4} justifyContent="center" style={{ display: 'flex', alignItems: 'center', height: '30px' }}>
                            <label htmlFor="input9">诊断:</label>
                          </Grid>
                          <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', height: '30px' }}>
                            <EditableText initialText={lastEvent?.medical_history ?? ""} handleTextChange={handleMedicalHistoryChange}/>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={12}>
              <Card>
                <CardHeader style={{display:'inline-block'}} title='评估记录' titleTypographyProps={{ variant: 'h5' }}></CardHeader>
                <a href={`/rehab/assessment/${rehabPatient.id}/0/`} target="_blank" rel="noopener noreferrer">
                  <Tooltip title="新建评估">
                    <IconButton
                        style={{float: 'right'}}
                        aria-label="add"
                    >
                      <AddCircleIcon sx={{ fontSize: 48 }} color="primary"/>
                    </IconButton>
                  </Tooltip>
                </a>
                <Card>
                  <TableWrapper>
                    <TableContainer sx={{ maxHeight: 140 }}>
                      <Table stickyHeader aria-label="sticky table" size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ borderLeft: '1px solid #ccc', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }} align="center">量表填写时间</TableCell>
                            <TableCell style={{ borderLeft: '1px solid #ccc', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }} align="center">量表及评价</TableCell>
                            {/*<TableCell style={{ borderLeft: '1px solid #ccc', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }} align="center">评估完成率</TableCell>*/}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {/* 表格内容 */}
                          <TableRow>
                            <TableCell style={{ borderLeft: '1px solid #ccc' }} align="center">
                              <Typography variant="body2" color="text.secondary">
                                2023-08-30 10:20:47
                              </Typography>
                            </TableCell>
                            <TableCell style={{ borderLeft: '1px solid #ccc' }} align="center">
                              <a target="_blank" rel="noopener noreferrer">
                                {/*<a href={`/rehab/assessment/${row.id}`} target="_blank" rel="noopener noreferrer">*/}
                                <Button style={{backgroundColor: '#2196f3', color: '#ffffff'}}>查看量表</Button>
                              </a>
                            </TableCell>
                            {/*<TableCell style={{ borderLeft: '1px solid #ccc' }} align="center">*/}
                            {/*  <Typography variant="body2" color="text.secondary">*/}
                            {/*    90 %*/}
                            {/*  </Typography>*/}
                            {/*</TableCell>*/}
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ borderLeft: '1px solid #ccc' }} align="center">
                              <Typography variant="body2" color="text.secondary">
                                2023-11-06 16:20:47
                              </Typography>
                            </TableCell>
                            <TableCell style={{ borderLeft: '1px solid #ccc' }} align="center">
                              <a target="_blank" rel="noopener noreferrer">
                                {/*<a href={`/rehab/assessment/${row.id}`} target="_blank" rel="noopener noreferrer">*/}
                                <Button style={{backgroundColor: '#2196f3', color: '#ffffff'}}>查看量表</Button>
                              </a>
                            </TableCell>
                            {/*<TableCell style={{ borderLeft: '1px solid #ccc' }} align="center">*/}
                            {/*  <Typography variant="body2" color="text.secondary">*/}
                            {/*    80 %*/}
                            {/*  </Typography>*/}
                            {/*</TableCell>*/}
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ borderLeft: '1px solid #ccc' }} align="center">
                              <Typography variant="body2" color="text.secondary">
                                2023-08-30 10:20:47
                              </Typography>
                            </TableCell>
                            <TableCell style={{ borderLeft: '1px solid #ccc' }} align="center">
                              <a target="_blank" rel="noopener noreferrer">
                                {/*<a href={`/rehab/assessment/${row.id}`} target="_blank" rel="noopener noreferrer">*/}
                                <Button style={{backgroundColor: '#2196f3', color: '#ffffff'}}>查看量表</Button>
                              </a>
                            </TableCell>
                            {/*<TableCell style={{ borderLeft: a'1px solid #ccc' }} align="center">*/}
                            {/*  <Typography variant="body2" color="text.secondary">*/}
                            {/*    90 %*/}
                            {/*  </Typography>*/}
                            {/*</TableCell>*/}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </TableWrapper>
                </Card>
              </Card>
            </Grid>

            {/*处方*/}
            <Grid item xs={12} md={12}>
              <Card sx={{ padding: '2px' }}>
                <div>
                  <CardHeader style={{display:'inline-block'}} title='康复仪训练报告' titleTypographyProps={{ variant: 'h5' }} />
                </div>
                <Divider />
                <Prescription
                  id={params.id}
                  PId={params.pid}
                  task_id={params.task_id}
                  prescription={prescription}
                  status={status}
                  onlineEquipment={onlineData || []}
                  heartBeats={numbers || []}
                />
              </Card>
            </Grid>
            <br/>

            {/*直方图*/}
            {/*<Grid item xs={12} md={12}>*/}
            {/*  <Card sx={{ padding: '10px'}}>*/}
            {/*    <CardHeader title='训练历史压力数据直方图' titleTypographyProps={{ variant: 'h6' }} style={{ textAlign: 'center' }} />*/}
            {/*    <CardContent>*/}

            {/*    </CardContent>*/}
            {/*  </Card>*/}
            {/*</Grid>*/}
            {/*<br/>*/}

            {/*压力数据折线图*/}
            {/*<Grid item xs={6} md={5.5}>*/}
            {/*  <Card sx={{ height: 365 ,padding: '10px'}}>*/}
            {/*    <CardHeader title='实时压力数据折线图' titleTypographyProps={{ variant: 'h6' }} />*/}
            {/*    {*/}
            {/*      trainLoading ? <></> : <PrescriptionLine trainData={trainData || []}></PrescriptionLine>*/}
            {/*    }*/}
            {/*  </Card>*/}
            {/*</Grid>*/}

            {/*康复记录*/}
            {/*<Grid item xs={6} md={6.5}>*/}
            {/*  <Card sx={{ height: 365 ,padding: '10px'}}>*/}
            {/*    <CardHeader style={{display:'inline-block'}} title='康复记录' titleTypographyProps={{ variant: 'h6' }} />*/}
            {/*    <PrescriptionTable record={record} pid={params.id}/>*/}
            {/*  </Card>*/}
            {/*</Grid>*/}
          </Grid>
          <br/>
        </Box>
        <br/>
      </Container>
    </>
  )
}

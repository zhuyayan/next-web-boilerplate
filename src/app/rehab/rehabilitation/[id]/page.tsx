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
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import styled from "styled-components";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {ChangeEvent, useEffect, useState} from "react";
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
  fetchStatusById
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
import {IconButton, TableContainer} from "@mui/material";

import TimerIcon from '@mui/icons-material/Timer';
import Tooltip from "@mui/material/Tooltip";
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';

import { Title } from '@/components/rehab/styles';
import {ThunkDispatch} from "redux-thunk";
import CardMedia from "@mui/material/CardMedia";
import Link from "next/link";
import {useForm} from "react-hook-form";

import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {string} from "postcss-selector-parser";
import PrescriptionLine from "@/components/rehab/prescription/PrescriptionLine";
import Test from "@/components/rehab/prescription/Test";
import PrescriptionTest from "@/components/rehab/prescription/PrescriptionTest";
import PrescriptionTable from "@/components/rehab/prescription/PrescriptionTable";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";

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
  background-color: rgb(182, 212, 246);
  height: 150px;
  padding: 10px;
`;

const StyledBoxContainer = styled(Box)`
  &:not(:first-child) {
    margin: -1px;
  }
`;

export default function MUITable({ params }: { params: { id: string ,task_id:string, pid:string} }) {
  const rehabPatient = useAppSelector((state: RootState) => state.rehab.rehabPatient)
  const prescription = useAppSelector((state: RootState) => state.rehab.prescription)
  const record = useAppSelector((state: RootState) => state.rehab.prescriptionRecord)
  const status = useAppSelector((state: RootState) => state.rehab.patientStatus)
  const patientDuration = useAppSelector((state:RootState) => state.rehab.patientDuration)
  const {data: trainData, error: trainError, isLoading: trainLoading} = useGetTrainMessageQuery("redux")
  const {data: onlineData, isLoading: onlineLoading, error: onlineError} = useGetOnlineEquipmentsQuery("redux")
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch()
  const [open, setOpen] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [timesError, setTimesError] = React.useState<string>('')
  const [bendError, setBendError] = React.useState<string>('')
  const [stretchError, setStretchError] = React.useState<string>('')
  const [trainMinus, setTrainMinus] = useState<string>('')
  const [trainDays, setTrainDays] = useState<number>(0)

  const { register: AddPrescriptionItemRegister, formState: { errors: AddPrescriptionItemErrors }, clearErrors: AddPrescriptionItemClearErrors, trigger:AddPrescriptionItemTrigger } = useForm<AddPrescriptionItem>({mode: 'onBlur' });



  const [openAddStatus, setOpenAddStatus] = React.useState(false);

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

  useEffect(() => {
    // thunkDispatch(fetchPrescriptionById({id: parseInt(params.id)}))
    thunkDispatch(fetchPrescriptionByPId({pid: parseInt(params.id)}))
    thunkDispatch(fetchEvaluationById({task_id: parseInt(params.task_id)}))
    thunkDispatch(fetchStatusById({task_id: parseInt(params.task_id),pid:parseInt(params.pid)}))
    thunkDispatch(fetchPatientById({id: parseInt(params.id)}))
    thunkDispatch(fetchPrescriptionRecordById({id: parseInt(params.id)}))
    thunkDispatch(fetchPatientStatisticsById({id: parseInt(params.id)}))
    console.log("patient id: ", params.id)
    console.log("patient pid: ", params.pid)
    console.log("patient task_id: ", params.task_id)
  },[params.id, thunkDispatch])

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
    pid:0,
    task_id:0,
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
    thunkDispatch(addStatus({
      pid: parseInt(params.id),
      task_id:parseInt(params.task_id),
      onset_time: willAddStatus.onset_time,
      medication: willAddStatus.medication,
      spasm_status: willAddStatus.spasm_status,
      min_heart_rate: willAddStatus.min_heart_rate,
      max_heart_rate: willAddStatus.max_heart_rate,
      avg_heart_rate: willAddStatus.avg_heart_rate
    }))
    setOpenAddStatus(false)
  };

  return (
    <>
      <Container>
        <Box sx={{marginBottom:5}}>
          <Grid container spacing={8}>
            <Grid item xs={12} md={12}>
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
                <Card sx={{ backgroundColor: 'rgba(227,236,255,0.78)', height: 150}} >
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={5}>
                        <Typography component="div">
                          分类：{PatientNumClassifyToClassifyLabelMapping[String(rehabPatient.mediaStrokeType)]}
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography component="div">
                          Brunnstrom分期：{PatientNumStrokeLevelToStrokeLevelLabelMapping[String(rehabPatient.mediaStrokeLevel)]}
                        </Typography>
                      </Grid>
                      <Divider />
                      <br />
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
                    <Divider />
                    <br />
                    <Grid container spacing={2}>
                      <Grid item xs={5}>
                        <Typography component="div">
                          ID：{rehabPatient.i18d}
                        </Typography>
                      </Grid>
                      <Grid item xs={3.5}>
                        <Typography component="div">
                          诊断：{rehabPatient.medicalHistory}
                        </Typography>
                      </Grid>
                      <Grid item xs={3.5}>
                        <Typography component="div">
                          主治医生：{rehabPatient.physician}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider />
                    <br />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} md={2}>
                <StatisticsCard>
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
                  {/*<Typography style={{ float:"left" }}>*/}
                  {/*  /!*<AccessTimeFilledIcon style={{ color: '#69acee', fontSize: 50 }}/>*!/*/}
                  {/*</Typography>*/}
                  <CardContent style={{ textAlign: 'right' }}>
                    <Typography variant="h3" color="primary" style={{display:'inline-block'}}>
                      {trainMinus}<br />
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      弯曲总时长
                    </Typography>
                    <Divider style={{padding:'5px'}}/>
                    <Typography sx={{ fontSize: 6 }} color="text.secondary">
                      时间 / 分钟
                    </Typography>
                  </CardContent>
                </StatisticsCard>
              </Grid>
              <Grid item xs={6} md={2} alignItems="center" justifyContent="center">
                <StatisticsCard>
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
                  {/*<Typography sx={{ float:"left" }}>*/}
                  {/*  <AssessmentIcon  sx={{ color: '#0a94a1', fontSize: 50 }}/>*/}
                  {/*</Typography>*/}
                  <CardContent sx={{ textAlign: 'right' }}>
                    <Typography variant="h3" color="primary" sx={{display:'inline-block'}}>
                      {record.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      伸展总时长
                    </Typography>
                    <Divider sx={{padding:'5px'}}/>
                    <Typography sx={{ fontSize: 6 }} color="text.secondary">
                      时间 / 分钟
                    </Typography>
                  </CardContent>
                </StatisticsCard>
              </Grid>
              <Grid item xs={6} md={2}>
                <StatisticsCard>
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
                    <Typography sx={{ fontSize: 6 }} color="text.secondary">
                      时间 / 天
                    </Typography>
                  </CardContent>
                </StatisticsCard>
              </Grid>
            </Grid>

            <Grid item xs={12} md={12}>
              <Card>
                <CardHeader style={{display:'inline-block'}} title='量表记录' titleTypographyProps={{ variant: 'h6' }}></CardHeader>
                <Divider />
                <TableContainer sx={{ maxHeight: 280 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">量表填写时间</TableCell>
                        <TableCell>量表及评价</TableCell>
                        <TableCell align="center">操作</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                          <TableCell align="center">
                            <Typography variant="body2" color="text.secondary">
                              2023-08-30 10:20:47
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Button style={{backgroundColor: '#2196f3', color: '#ffffff'}}>查看量表</Button>
                          </TableCell>
                          <TableCell align="center">
                          </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
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
                  onlineEquipment={onlineData || []}/>
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

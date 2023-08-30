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
  EvaluateFormProps, TargetFormProps, AddPrescriptionItem, PatientStatus, addStatus, addEvaluation
} from "@/redux/features/rehab/rehab-slice";
import {
  addPrescription,
  fetchPatientById,
  fetchPrescriptionRecordById,
  useGetOnlineEquipmentsQuery,
  useGetTrainMessageQuery
} from "@/redux/features/rehab/rehab-slice";
import {BodyPartToNumMapping, ModeToNumMapping, NumToBodyPartMapping, NumToModeMapping} from "@/utils/mct-utils";
import {IconButton} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
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

export default function MUITable({ params }: { params: { id: string } }) {
  const rehabPatient = useAppSelector((state: RootState) => state.rehab.rehabPatient)
  const prescription = useAppSelector((state: RootState) => state.rehab.prescription)
  const record = useAppSelector((state: RootState) => state.rehab.prescriptionRecord)
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
  const [trainDuration, setTrainDuration] = useState<number>(0)
  // 病人各项指标
  const [targetFormData, setTargetFormData] = React.useState<TargetFormProps>({
    onsetTime: '',
    medication: '',
    spasmStatus: '',
    minHeartRate: '',
    maxHeartRate: '',
    avgHeartRate: '',
  });

  const { register: AddPrescriptionItemRegister, formState: { errors: AddPrescriptionItemErrors }, clearErrors: AddPrescriptionItemClearErrors, trigger:AddPrescriptionItemTrigger } = useForm<AddPrescriptionItem>({mode: 'onBlur' });

  const handleTargetFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTargetFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleSaveTarget = () => {
  //   onSaveTarget(targetFormData);
  // };

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
      v: Number(willAddPrescription.v)
    }))
    setOpen(false);
  };

  useEffect(() => {
    // thunkDispatch(fetchPrescriptionById({id: parseInt(params.id)}))
    thunkDispatch(fetchPrescriptionByPId({pid: parseInt(params.id)}))
    thunkDispatch(fetchPatientById({id: parseInt(params.id)}))
    thunkDispatch(fetchPrescriptionRecordById({id: parseInt(params.id)}))
    thunkDispatch(fetchPatientStatisticsById({id: parseInt(params.id)}))
    console.log("patient id: ", params.id)
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
                  <CardHeader title=' ' titleTypographyProps={{ variant: 'h5' }} />
                  <CardContent>
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

          {/*直方图*/}
          <Grid item xs={12} md={12}>
            <Card sx={{ padding: '10px'}}>
              <CardHeader title='训练历史压力数据直方图' titleTypographyProps={{ variant: 'h6' }} style={{ textAlign: 'center' }} />
              <CardContent>
                <EChartsTest/>
              </CardContent>
            </Card>
          </Grid>
          <br/>

            {/*处方*/}
          <Grid item xs={12} md={12}>
            <Card sx={{ padding: '10px' }}>
              <Card>
                <CardContent>
                  <div>
                    请在病人训练前和训练中将下面表格填写完整：
                  </div>
                  <br/>
                  <Typography variant="h6">病人各项指标</Typography>
                    <Grid container spacing={0}>
                      <Grid item xs={4.5}>
                        <Box sx={{padding: '8px' }}>
                          <Grid container spacing={0} alignItems="center">
                            <Grid item xs={3}>
                              <label htmlFor="input9">发病时间:</label>
                            </Grid>
                            <Grid item xs={9}>
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
                      <Grid item xs={3}>
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
                      <Grid item xs={3}>
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
                      <Grid item xs={1.5}>
                        <Box sx={{padding: '8px' }}>
                        </Box>
                      </Grid>
                      <Grid item xs={4.5}>
                        <Box sx={{padding: '8px' }}>
                          <Grid container spacing={0} alignItems="center">
                            <Grid item xs={3}>
                              <label htmlFor="input9">最小心率:</label>
                            </Grid>
                            <Grid item xs={9}>
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
                      <Grid item xs={3}>
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
                      <Grid item xs={3}>
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
                      <Grid item xs={1.5}>
                        <Box sx={{padding: '8px' }}>
                          <Button
                              style={{float: 'right'}}
                              variant="outlined"
                              size="small"
                              onClick={handleSaveAddStatus}>保存指标</Button>
                        </Box>
                      </Grid>
                    </Grid>
                  <br/>
                </CardContent>
              </Card>
              <div>
                <br/>
                <CardHeader style={{display:'inline-block'}} title='处方' titleTypographyProps={{ variant: 'h5' }} />
                <Typography style={{display:'inline-block'}} variant="h6" gutterBottom>
                  (共
                </Typography>
                <Typography color="primary" style={{display:'inline-block'}} variant="h5" gutterBottom>
                  {prescription.length}
                </Typography>
                <Typography style={{display:'inline-block'}} variant="h6" gutterBottom>
                  条处方)
                </Typography>
                <Tooltip title="新建处方">
                  <IconButton
                      style={{float: 'right'}}
                      aria-label="add"
                      onClick={handleClickOpen}
                  >
                    <AddCircleIcon sx={{ fontSize: 48 }} color="secondary"/>
                  </IconButton>
                </Tooltip>
              </div>


              <Prescription PId={params.id} prescription={prescription} onlineEquipment={onlineData || []}/>
              <br/>
              <Card id="target-element">
                <CardHeader title='当次压力直方图' titleTypographyProps={{ variant: 'h6' }} style={{ textAlign: 'center' }} />
                <CardContent>
                  <EChartsTest/>
                </CardContent>
              </Card>
              <br/>


              {/*<div style={{ borderCollapse: 'collapse' }}>*/}
              {/*  <Card>*/}
              {/*    <CardContent>*/}
              {/*      <div>*/}
              {/*        请医护根据此次训练的直方图对以下信息进行评价：*/}
              {/*      </div>*/}
              {/*      <br/>*/}
              {/*      <Typography variant="h6">医生评价</Typography>*/}
              {/*      <form>*/}
              {/*        <Grid container spacing={0}>*/}
              {/*          <Grid item xs={3}>*/}
              {/*            <Box sx={{padding: '8px' }}>*/}
              {/*              <Grid container spacing={0} alignItems="center">*/}
              {/*                <Grid item xs={4}>*/}
              {/*                  <label htmlFor="input9">耐受状态:</label>*/}
              {/*                </Grid>*/}
              {/*                <Grid item xs={8}>*/}
              {/*                  <TextField*/}
              {/*                    name="tolerance"*/}
              {/*                    value={evaluateFormData.tolerance}*/}
              {/*                    onChange={handleEvaluationFormDataFormChange}*/}
              {/*                    size="small"*/}
              {/*                    fullWidth*/}
              {/*                  />*/}
              {/*                </Grid>*/}
              {/*              </Grid>*/}
              {/*            </Box>*/}
              {/*          </Grid>*/}
              {/*          <Grid item xs={3}>*/}
              {/*            <Box sx={{padding: '8px' }}>*/}
              {/*              <Grid container spacing={0} alignItems="center">*/}
              {/*                <Grid item xs={4}>*/}
              {/*                  <label htmlFor="input10">运动评价:</label>*/}
              {/*                </Grid>*/}
              {/*                <Grid item xs={8}>*/}
              {/*                  <TextField*/}
              {/*                    name="motionReview"*/}
              {/*                    value={evaluateFormData.motionReview}*/}
              {/*                    onChange={handleEvaluationFormDataFormChange}*/}
              {/*                    size="small"*/}
              {/*                    fullWidth*/}
              {/*                  />*/}
              {/*                </Grid>*/}
              {/*              </Grid>*/}
              {/*            </Box>*/}
              {/*          </Grid>*/}
              {/*          <Grid item xs={3}>*/}
              {/*            <Box sx={{padding: '8px' }}>*/}
              {/*              <Grid container spacing={0} alignItems="center">*/}
              {/*                <Grid item xs={4}>*/}
              {/*                  <label htmlFor="input11">痉挛评价:</label>*/}
              {/*                </Grid>*/}
              {/*                <Grid item xs={8}>*/}
              {/*                  <TextField*/}
              {/*                    name="spasmReview"*/}
              {/*                    value={evaluateFormData.spasmReview}*/}
              {/*                    onChange={handleEvaluationFormDataFormChange}*/}
              {/*                    size="small"*/}
              {/*                    fullWidth*/}
              {/*                  />*/}
              {/*                </Grid>*/}
              {/*              </Grid>*/}
              {/*            </Box>*/}
              {/*          </Grid>*/}
              {/*          <Grid item xs={3}>*/}
              {/*            <Box sx={{padding: '8px' }}>*/}
              {/*              <Grid container spacing={0} alignItems="center">*/}
              {/*                <Grid item xs={4}>*/}
              {/*                  <label htmlFor="input9">肌张力:</label>*/}
              {/*                </Grid>*/}
              {/*                <Grid item xs={8}>*/}
              {/*                  <TextField*/}
              {/*                    name="muscleTone"*/}
              {/*                    value={evaluateFormData.muscleTone}*/}
              {/*                    onChange={handleEvaluationFormDataFormChange}*/}
              {/*                    size="small"*/}
              {/*                    fullWidth*/}
              {/*                  />*/}
              {/*                </Grid>*/}
              {/*              </Grid>*/}
              {/*            </Box>*/}
              {/*          </Grid>*/}
              {/*          <Grid item xs={3}>*/}
              {/*            <Box sx={{padding: '8px' }}>*/}
              {/*              <Grid container spacing={0} alignItems="center">*/}
              {/*                <Grid item xs={4}>*/}
              {/*                  <label htmlFor="input9">急性期情况:</label>*/}
              {/*                </Grid>*/}
              {/*                <Grid item xs={8}>*/}
              {/*                  <TextField*/}
              {/*                    name="acuteState"*/}
              {/*                    value={evaluateFormData.acuteState}*/}
              {/*                    onChange={handleEvaluationFormDataFormChange}*/}
              {/*                    size="small"*/}
              {/*                    fullWidth*/}
              {/*                  />*/}
              {/*                </Grid>*/}
              {/*              </Grid>*/}
              {/*            </Box>*/}
              {/*          </Grid>*/}
              {/*          <Grid item xs={3}>*/}
              {/*            <Box sx={{padding: '8px' }}>*/}
              {/*              <Grid container spacing={0} alignItems="center">*/}
              {/*                <Grid item xs={4}>*/}
              {/*                  <label htmlFor="input9">神经科判断:</label>*/}
              {/*                </Grid>*/}
              {/*                <Grid item xs={8}>*/}
              {/*                  <TextField*/}
              {/*                    name="neuroJudgment"*/}
              {/*                    value={evaluateFormData.neuroJudgment}*/}
              {/*                    onChange={handleEvaluationFormDataFormChange}*/}
              {/*                    size="small"*/}
              {/*                    fullWidth*/}
              {/*                  />*/}
              {/*                </Grid>*/}
              {/*              </Grid>*/}
              {/*            </Box>*/}
              {/*          </Grid>*/}
              {/*          <Grid item xs={3}>*/}
              {/*            <Box sx={{padding: '8px' }}>*/}
              {/*              <Grid container spacing={0} alignItems="center">*/}
              {/*                <Grid item xs={4}>*/}
              {/*                  <label htmlFor="input9">运动损伤度:</label>*/}
              {/*                </Grid>*/}
              {/*                <Grid item xs={8}>*/}
              {/*                  <TextField*/}
              {/*                    name="motionInjury"*/}
              {/*                    value={evaluateFormData.motionInjury}*/}
              {/*                    onChange={handleEvaluationFormDataFormChange}*/}
              {/*                    size="small"*/}
              {/*                    fullWidth*/}
              {/*                  />*/}
              {/*                </Grid>*/}
              {/*              </Grid>*/}
              {/*            </Box>*/}
              {/*          </Grid>*/}
              {/*          <Grid item xs={3}>*/}
              {/*            <Box sx={{padding: '8px' }}>*/}
              {/*              <Button style={{float: 'right'}} variant="outlined" onClick={handleSaveEvaluate}>保存评价</Button>*/}
              {/*            </Box>*/}
              {/*          </Grid>*/}
              {/*        </Grid>*/}
              {/*      </form>*/}
              {/*      <br/>*/}
              {/*      <div style={{ color: 'red', fontSize: '10px' }}>*/}
              {/*        注：医生在该表格填写完成的评价信息只针对本次康复训练，评价将被保存在本次康复记录的表格中。*/}
              {/*      </div>*/}
              {/*    </CardContent>*/}
              {/*  </Card>*/}
              {/*</div>*/}
            </Card>
          </Grid>

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
          {/*      <PrescriptionTable record={record} pid={params.id}/>*/}
          {/*    </Card>*/}
          {/*  </Grid>*/}
        </Grid>
          <br/>
        </Box>
        <br/>
      </Container>

      <Dialog open={open} onClose={handleClose}>
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
          <Button onClick={handleClose}>取消</Button>
          <Button
              onClick={handleSaveAddPrescription}
              disabled={Boolean(error)}
          >确定</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

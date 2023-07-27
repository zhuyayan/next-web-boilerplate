"use client";
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Container from '@mui/material/Container';
import Prescription from "@/components/rehab/prescription/Prescription";
import PrescriptionTable from "@/components/rehab/prescription/PrescriptionTable";
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
import PrescriptionLine from "@/components/rehab/prescription/PrescriptionLine";
import {ChangeEvent, useEffect} from "react";
import {RootState, useAppSelector} from "@/redux/store";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {useDispatch} from "react-redux";
import {fetchPrescriptionByPId, Prescription as PrescriptionEntity} from "@/redux/features/rehab/rehab-slice";
import {
  addPrescription,
  fetchPatientById,
  fetchPrescriptionById, fetchPrescriptionRecordById,
  useGetOnlineEquipmentsQuery,
  useGetTrainMessageQuery
} from "@/redux/features/rehab/rehab-slice";
import {BodyPartToNumMapping, ModeToNumMapping, NumToBodyPartMapping, NumToModeMapping} from "@/utils/mct-utils";
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import {IconButton} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SendAndArchiveIcon from '@mui/icons-material/SendAndArchive';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import TimerIcon from '@mui/icons-material/Timer';
import Tooltip from "@mui/material/Tooltip";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import DownloadIcon from '@mui/icons-material/Download';
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import SmsIcon from "@mui/icons-material/Sms";
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';

const StyledDiv = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

export default function MUITable({ params }: { params: { id: string } }) {
  const rehabPatient = useAppSelector((state: RootState) => state.rehab.rehabPatient)
  const prescription = useAppSelector((state: RootState) => state.rehab.prescription)
  const record = useAppSelector((state: RootState) => state.rehab.prescriptionRecord)
  const {data: trainData, error: trainError, isLoading: trainLoading} = useGetTrainMessageQuery("redux")
  const {data: onlineData, isLoading: onlineLoading, error: onlineError} = useGetOnlineEquipmentsQuery("redux")
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch()
  const [open, setOpen] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [timesError, setTimesError] = React.useState<string>('')
  const [bendError, setBendError] = React.useState<string>('')
  const [stretchError, setStretchError] = React.useState<string>('')

  const [willAddPrescription, setWillAddPrescription] = React.useState<PrescriptionEntity>({
    id: 0,
    created_at: "",
    part: "0",
    mode: "0",
    zz: 3,
    u: 3,
    v: 3,
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
      zz: willAddPrescription.zz,
      u: willAddPrescription.u,
      v: willAddPrescription.v
    }))
    setOpen(false);
  };

  useEffect(() => {
    // thunkDispatch(fetchPrescriptionById({id: parseInt(params.id)}))
    thunkDispatch(fetchPrescriptionByPId({pid: parseInt(params.id)}))
    thunkDispatch(fetchPatientById({id: parseInt(params.id)}))
    thunkDispatch(fetchPrescriptionRecordById({id: parseInt(params.id)}))
    console.log("patient id: ", params.id)
  },[params.id, thunkDispatch])

  useEffect(() => {
    console.log('trainData ->', trainData)
  }, [trainData])

  useEffect(() => {
    console.log('onlineData ->', onlineData)
  }, [onlineData])

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

  //导出excel
  const handleExportExcel = () => {
    let sheetFilter = ["creat_at", "update_at", "state"];
    let option: {
      fileName?: string;
      datas?: any;
    } = {};
    option.fileName = '康复记录-' + rehabPatient.name;
    option.datas = [
      {
        sheetData: record,
        sheetName: '康复记录',
        sheetFilter: sheetFilter,
        sheetHeader: ['康复开始时间', '康复结束时间', '状态'],
        columnWidths: [20,20,10]
      },
    ];

    // let toExcel = new ExportJsonExcel(option); //生成
    // toExcel.saveExcel(); //保存
  }

  return (
    <>
      <Container>
        <Grid container spacing={8}>
          <Grid item xs={12} md={12}>
              <Typography style={{display:'inline-block'}} variant="h2" component="h1" sx={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>
                康复管理
              </Typography>
              <Tooltip title="返回病人列表">
                <IconButton
                    aria-label="back"
                    color="primary"
                    onClick={()=> {window.location.href="/rehab/patient"}}
                >
                  <AssignmentReturnIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
            <br />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
            {/*病人card*/}
          <Grid container item xs={6} md={12} spacing={2}>
              <Grid item xs={6} md={6}>
                <Card sx={{ backgroundColor: '#ffffff', height: 150}} >
                  <CardHeader title=' ' titleTypographyProps={{ variant: 'h5' }} />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography component="div">
                          姓名：{rehabPatient.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography component="div">
                          年龄：{rehabPatient.age}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography component="div">
                          性别：{rehabPatient.genderLabel}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider />
                    <br />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography component="div">
                          ID：{rehabPatient.i18d}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography component="div">
                          病史：{rehabPatient.medicalHistory}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
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
                <Card sx={{height: 150}}>
                  <AccessTimeFilledIcon color="secondary" sx={{fontSize: 50 }}/>
                  <CardContent style={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="primary" style={{display:'inline-block'}}>
                      0小时 <br />
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      总训练时长
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} md={2} alignItems="center" justifyContent="center">
                <Card sx={{height: 150}}>
                  <AssessmentIcon color="secondary" sx={{ fontSize: 50 }}/>
                  <CardContent style={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="primary" style={{display:'inline-block'}}>
                      {record.length}次
                    </Typography>
                    <br />
                    <Typography variant="body2" color="text.secondary">
                      总训练次数
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} md={2}>
                <Card sx={{height: 150}}>
                  <TimerIcon color="secondary" sx={{ fontSize: 50 }}/>
                  <CardContent style={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="primary" style={{display:'inline-block'}}>
                      4天
                    </Typography>
                    <br />
                    <Typography variant="body2" color="text.secondary">
                      总训练天数
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/*处方*/}
          <Grid item xs={6} md={12}>
            <Card sx={{ padding: '10px' ,height: 365}}>
              <div>
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
                <Tooltip title="添加处方">
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
            </Card>
          </Grid>
            <br/>

            {/*压力数据折线图*/}
          <Grid item xs={6} md={5.5}>
            <Card sx={{ height: 365 ,padding: '10px'}}>
              <CardHeader title='实时压力数据折线图' titleTypographyProps={{ variant: 'h6' }} />
              {
                trainLoading ? <></> : <PrescriptionLine trainData={trainData || []}></PrescriptionLine>
              }
            </Card>
          </Grid>

            {/*康复记录*/}
          <Grid item xs={6} md={6.5}>
            <Card sx={{ height: 365 ,padding: '10px'}}>
              <CardHeader style={{display:'inline-block'}} title='康复记录' titleTypographyProps={{ variant: 'h6' }} />
              <Typography style={{display:'inline-block'}} variant="subtitle1" gutterBottom>
                (共
              </Typography>
              <Typography color="primary" style={{display:'inline-block'}} variant="h6" gutterBottom>
                {record.length}
              </Typography>
              <Typography style={{display:'inline-block'}} variant="subtitle1" gutterBottom>
                条康复记录，累计康复时长*小时)
              </Typography>
              {/*<Button style={{display:'inline-block', float:'right', width: '110px'}} variant="outlined" onClick={handleExportExcel}>*/}
              {/*  导出Excel*/}
              {/*</Button>*/}
{/*<<<<<<< HEAD*/}
{/*                </Box>*/}
{/*                <PrescriptionTable record={record} pid={params.id}/>*/}
{/*=======*/}
{/*              <Tooltip title="导出Excel">*/}
{/*                <IconButton*/}
{/*                  style={{float: 'right'}}*/}
{/*                  aria-label="downExcel"*/}
{/*                  onClick={handleExportExcel}>*/}
{/*                  <DownloadForOfflineIcon sx={{ fontSize: 48 }} color="primary"/>*/}
{/*                </IconButton>*/}
{/*              </Tooltip>*/}
                <PrescriptionTable record={record} pid={params.id}/>
{/*>>>>>>> b947107066843c58258ffd1e7099b1137367af03*/}
              </Card>
            </Grid>
        </Grid>
        <br/>
      </Container>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>添加处方</DialogTitle>
        <DialogContent>
          <DialogContentText>
            请正确填写处方各项信息
          </DialogContentText>
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

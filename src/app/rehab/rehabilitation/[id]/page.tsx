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
import Select, { SelectChangeEvent } from '@mui/material/Select';
import PrescriptionLine from "@/components/rehab/prescription/PrescriptionLine";
import {ChangeEvent, useEffect} from "react";
import {RootState, useAppSelector} from "@/redux/store";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {useDispatch} from "react-redux";
import {
  addPrescription,
  addStaff,
  fetchPatientById,
  fetchPrescriptionById, fetchPrescriptionRecordById, MedicalStaff,
  useGetOnlineEquipmentsQuery,
  useGetTrainMessageQuery
} from "@/redux/features/rehab/rehab-slice";

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
  // const { data, error, isLoading } = useGetMessagesQuery('redux');

  const [willAddPrescription, setWillAddPrescription] = React.useState<Prescription>({
    "PID": 1,
    "X": 1,
    "Y": 1,
    "ZZ" :500,
    "U":8,
    "V":7
  })

  const handleAddPrescription = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    console.log(id, value)
    setWillAddPrescription((prevInputValues) => ({
      ...prevInputValues,
      [id]: value,
    }))
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const [age1, setAge1] = React.useState('');

  const handleTPChange = (event: SelectChangeEvent) => {
    setAge1(event.target.value);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSaveAddPrescription = () => {
    thunkDispatch(addPrescription({Y: willAddPrescription.Y, X: willAddPrescription.X, ZZ: willAddPrescription.ZZ, U: willAddPrescription.U, V: willAddPrescription.V}))
    // setOpenAddPrescription(false);
    setOpen(false);
  };

  useEffect(() => {
    thunkDispatch(fetchPrescriptionById({id: parseInt(params.id)}))
    thunkDispatch(fetchPatientById({id: parseInt(params.id)}))
    thunkDispatch(fetchPrescriptionRecordById({id: parseInt(params.id)}))
    console.log("patient id: ", params.id)
  },[params.id, thunkDispatch])

  useEffect(() => {
    console.log('trainData ->', trainData)
  }, [trainData, useEffect])

  useEffect(() => {
    console.log('onlineData ->', onlineData)
  }, [onlineData, useEffect])

  return (
    <>
      <Container>
        <Grid container spacing={8}>
          <Grid item xs={12} md={12}>
              <Typography variant="h2" component="h1" sx={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>
                康复管理
              </Typography>
            <br />
          </Grid>
        </Grid>
        {/*病人card*/}
          <Grid container spacing={2}>
            <Grid item xs={6} md={2}>
              <Card sx={{ backgroundColor: '#ffffff', height: 365}} >
                <CardHeader title='病人信息' titleTypographyProps={{ variant: 'h5' }} />
                <br />
                <CardContent>
                  <Typography component="div">
                    姓名：{rehabPatient.name}
                  </Typography>
                  <Divider />
                    <br />
                  <Typography component="div">
                    年龄：{rehabPatient.age}<br/>
                  </Typography>
                  <Divider />
                    <br />
                  <Typography component="div">
                    性别：{rehabPatient.genderLabel}<br/>
                  </Typography>
                  <Divider />
                    <br />
                  <Typography component="div">
                    病史：{rehabPatient.medicalHistory}<br/>
                  </Typography>
                  <Divider />
                    <br />
                  <Typography component="div">
                    主治医生：{rehabPatient.physician}<br/>
                  </Typography>
                  <Divider />
                </CardContent>
              </Card>
            </Grid>

            {/*处方*/}
          <Grid item xs={6} md={10}>
            <Card sx={{ padding: '10px' ,height: 365}}>
              <CardHeader title='处方' titleTypographyProps={{ variant: 'h5' }} />
                <Button style={{float: 'right'}} startIcon={<AddCircleOutlineIcon />} variant="outlined" onClick={handleClickOpen}>
                  添加处方
                </Button>
              <Prescription PId={params.id} prescription={prescription}/>
            </Card>
          </Grid>
            <br/>
          {/*压力数据折线图*/}
          <Grid item xs={6} md={6}>
            <Card sx={{ height: 365 ,padding: '10px'}}>
              <CardHeader title='实时压力数据折线图' titleTypographyProps={{ variant: 'h6' }} />
              {
                trainLoading ? <></> : <PrescriptionLine trainData={trainData}></PrescriptionLine>
              }
              {/*<PrescriptionLine trainData={data}></PrescriptionLine>*/}
            </Card>
          </Grid>
          {/*康复记录*/}
            <Grid item xs={6} md={6}>
              <Card sx={{ height: 365 ,padding: '10px'}}>
                <CardHeader title='康复记录' titleTypographyProps={{ variant: 'h6' }} />
                <PrescriptionTable record={record} />
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
                <Select id="Y"
                  // value={willAddPrescription.Y}

                  label="模式"
                  onChange={handleAddPrescription}>
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
                <Select id="X"
                    // value={willAddPrescription.X}
                    label="部位"
                    onChange={handleAddPrescription}>
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
              <TextField value={willAddPrescription.ZZ} onChange={handleAddPrescription} sx={{ m: 1, minWidth: 160 }} id="ZZ" label="训练次数或时间" variant="outlined" size="small"/>
              <TextField value={willAddPrescription.U} onChange={handleAddPrescription} sx={{ m: 1, minWidth: 160 }} id="U" label="弯曲定时值" variant="outlined" size="small"/>
              <TextField value={willAddPrescription.V} onChange={handleAddPrescription} sx={{ m: 1, minWidth: 160 }} id="V" label="伸展定时值" variant="outlined" size="small"/>
            </Box>
          </StyledDiv>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleSaveAddPrescription}>确定</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

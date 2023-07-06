"use client";
// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Container from '@mui/material/Container';

// ** Demo Components Imports
import Prescription from "@/components/rehab/prescription/Prescription";
import PrescriptionTable from "@/components/rehab/prescription/PrescriptionTable";
import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

//dialog
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
import {useEffect} from "react";
import {RootState, useAppSelector} from "@/redux/store";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {useDispatch} from "react-redux";
import {fetchPatientById} from "@/redux/features/rehab/rehab-slice";

const StyledDiv = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

export default function MUITable({ params }: { params: { id: string } }) {
  const rehabPatient = useAppSelector((state: RootState) => state.rehab.rehabPatient)
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [age1, setAge1] = React.useState('');
  const [age2, setAge2] = React.useState('');

  const handleTPChange = (event: SelectChangeEvent) => {
    setAge1(event.target.value);
  };

  const handlePartChange = (event: SelectChangeEvent) => {
    setAge2(event.target.value);
  };

  useEffect(() => {
    thunkDispatch(fetchPatientById({id: parseInt(params.id)}))
    console.log("patient id: ", params.id)
  }, [useEffect])
  return (
      <Container>
        <Grid container spacing={8}>
          <Grid item xs={12} md={12}>
              <Typography variant="h2" component="h1" sx={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>
                康复管理
              </Typography>
          </Grid>
        </Grid>
          <Grid container spacing={2}>
          {/*病人card*/}
            <Grid item xs={6} md={2}>
              <Card sx={{ backgroundColor: '#c9d8e8'}}>
                <CardContent>
                  <Typography component="div">
                    {rehabPatient.name}
                  </Typography>
                  <Typography variant="body2">
                    <br />
                  </Typography>
                  <Divider />
                  <Typography variant="body2">
                    <br />
                  </Typography>
                  <Typography component="div">
                    {rehabPatient.id}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

          {/*处方*/}
          <Grid item xs={6} md={10}>
            <Card>
              <CardHeader title='处方' titleTypographyProps={{ variant: 'h5' }} />
                <Button startIcon={<AddCircleOutlineIcon />} variant="outlined" onClick={handleClickOpen}>
                  添加处方
                </Button>
              <div>
                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>添加处方</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      请正确填写处方各项信息
                    </DialogContentText>
                    <StyledDiv>
                      <Box>
                        <FormControl sx={{ m: 1, minWidth: 240 }} size="small">
                          <InputLabel id="demo-select-small-label">训练模式</InputLabel>
                          <Select
                              labelId="demo-select-small-label"
                              id="demo-select-small"
                              value={age1}
                              label="Age1"
                              onChange={handleTPChange}
                          >
                            <MenuItem value={10}>被动计次模式</MenuItem>
                            <MenuItem value={20}>被动定时模式</MenuItem>
                            <MenuItem value={30}>主动计次模式</MenuItem>
                            <MenuItem value={40}>主动定时模式</MenuItem>
                            <MenuItem value={50}>主动计次模式</MenuItem>
                            <MenuItem value={60}>助力计次模式</MenuItem>
                            <MenuItem value={70}>助力定时模式</MenuItem>
                            <MenuItem value={80}>手动计次模式</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl sx={{ m: 1, minWidth: 240 }} size="small">
                          <InputLabel id="demo-select-small-label">训练部位</InputLabel>
                          <Select
                              labelId="demo-select-small-label"
                              id="demo-select-small"
                              value={age2}
                              label="Age2"
                              onChange={handlePartChange}
                          >
                            <MenuItem value={10}>左手</MenuItem>
                            <MenuItem value={20}>右手</MenuItem>
                            <MenuItem value={30}>左腕</MenuItem>
                            <MenuItem value={40}>右腕</MenuItem>
                            <MenuItem value={50}>左踝</MenuItem>
                            <MenuItem value={60}>右踝</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>

                      <Box>
                        <TextField sx={{ m: 1, minWidth: 160 }} id="outlined-basic" label="训练次数或时间" variant="outlined" size="small"/>
                        <TextField sx={{ m: 1, minWidth: 160 }} id="outlined-basic" label="弯曲定时值" variant="outlined" size="small"/>
                        <TextField sx={{ m: 1, minWidth: 160 }} id="outlined-basic" label="伸展定时值" variant="outlined" size="small"/>
                      </Box>

                    </StyledDiv>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    <Button onClick={handleClose}>确定</Button>
                  </DialogActions>
                </Dialog>
              </div>
              <Prescription />
            </Card>
          </Grid>

          {/*压力数据折线图*/}
          <Grid item xs={6} md={6}>
            <Card>
              <CardHeader title='压力数据折线图' titleTypographyProps={{ variant: 'h6' }} />
              <PrescriptionLine />
            </Card>
          </Grid>

          {/*康复记录*/}
            <Grid item xs={6} md={6}>
              <Card>
                <CardHeader title='康复记录' titleTypographyProps={{ variant: 'h6' }} />
                <PrescriptionTable />
              </Card>
            </Grid>
        </Grid>
      </Container>

  )
}

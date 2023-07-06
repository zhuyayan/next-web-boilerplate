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
import {useEffect} from "react";
import {RootState, useAppSelector} from "@/redux/store";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {useDispatch} from "react-redux";
import {fetchPatientById, useGetMessagesQuery} from "@/redux/features/rehab/rehab-slice";

const StyledDiv = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

export default function MUITable({ params }: { params: { id: string } }) {
  const rehabPatient = useAppSelector((state: RootState) => state.rehab.rehabPatient)
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch()
  const [open, setOpen] = React.useState(false)
  const [mode, setMode] = React.useState<string>('')
  const [part, setPart] = React.useState<string>('')
  const { data, error, isLoading } = useGetMessagesQuery('redux');
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false)
  }

  const handleModeChange = (event: SelectChangeEvent) => {
    setMode(event.target.value)
  }

  const handlePartChange = (event: SelectChangeEvent) => {
    setPart(event.target.value)
  }

  useEffect(() => {
    thunkDispatch(fetchPatientById({id: parseInt(params.id)}))
    console.log("patient id: ", params.id)
  }, [useEffect])
  return (
    <>
      <Container>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <Box position="absolute" top="10%" left="10%">
              <Typography variant='h4'>
                康复管理
              </Typography>
            </Box>
          </Grid>
          <Box position="absolute" top="20%" left="8%">
            <Grid item xs={3}>
              <Card sx={{ minWidth: 275 ,backgroundColor: '#fff'}}>
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
                    {rehabPatient.id}<br/>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Box>

          <Box position="absolute" top="10%" right="2%" sx={{width: 950, height: 300,}}>
            <Card>
              <CardHeader title='处方' titleTypographyProps={{ variant: 'h5' }} />
              <Box position="absolute" top="5%" right="5%">
                <Button startIcon={<AddCircleOutlineIcon />} variant="outlined" onClick={handleClickOpen}>
                  添加处方
                </Button>
              </Box>
              <Prescription />
            </Card>
          </Box>
          <Box position="absolute" bottom="1%" right="5%">
            <Grid item xs={12}>
              <Card>
                <CardHeader title='康复记录' titleTypographyProps={{ variant: 'h6' }} />
                <PrescriptionTable />
              </Card>
            </Grid>
          </Box>

          <Box position="absolute" bottom="1%" left="10%">
            <Grid item xs={12}>
              <Card>
                <CardHeader title='压力数据折线图' titleTypographyProps={{ variant: 'h6' }} />
                <PrescriptionLine />
              </Card>
            </Grid>
          </Box>
        </Grid>
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
                  value={mode}
                  label="模式"
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
                    value={part}
                    label="部位"
                    onChange={handlePartChange}>
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
    </>
  )
}

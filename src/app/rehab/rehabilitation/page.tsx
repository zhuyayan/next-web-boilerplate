"use client";
// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

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

const MUITable = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const StyledDiv = styled.div`
        display: flex;
        gap: 10px;
        margin-top: 20px;
    `;

  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5'>
            康复管理
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Card sx={{ minWidth: 275 ,backgroundColor: 'rgba(128, 128, 128, 0.5)'}}>
            <CardContent>
              <Typography component="div">
                name
              </Typography>
              <Typography component="div">
                病人id
              </Typography>
              <Typography variant="body2">
                <br />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='处方' titleTypographyProps={{ variant: 'h6' }} />
            <div>
              <Button variant="outlined" onClick={handleClickOpen}>
                添加处方
              </Button>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>添加处方</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    请正确填写处方各项信息
                  </DialogContentText>
                  <StyledDiv>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                      <InputLabel id="demo-select-small-label">训练模式</InputLabel>
                      <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={age}
                          label="Age"
                          onChange={handleChange}
                      >
                        <MenuItem value={10}>被动计次模式</MenuItem>
                        <MenuItem value={20}>被动定时模式</MenuItem>
                        <MenuItem value={30}>主动计次模式</MenuItem>
                        <MenuItem value={40}>主动定时模式</MenuItem>
                        <MenuItem value={50}>主动计次模式</MenuItem>
                        <MenuItem value={60}>助力计次模式</MenuItem>
                        <MenuItem value={50}>助力定时模式</MenuItem>
                        <MenuItem value={60}>手动计次模式</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                      <InputLabel id="demo-select-small-label">训练部位</InputLabel>
                      <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={age}
                          label="Age"
                          onChange={handleChange}
                      >
                        <MenuItem value={10}>左手</MenuItem>
                        <MenuItem value={20}>右手</MenuItem>
                        <MenuItem value={30}>左腕</MenuItem>
                        <MenuItem value={40}>右腕</MenuItem>
                        <MenuItem value={50}>左踝</MenuItem>
                        <MenuItem value={60}>右踝</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField sx={{ m: 1, minWidth: 120 }} id="outlined-basic" label="训练次数或时间" variant="outlined" size="small"/>
                    <TextField sx={{ m: 1, minWidth: 120 }} id="outlined-basic" label="弯曲定时值" variant="outlined" size="small"/>
                    <TextField sx={{ m: 1, minWidth: 120 }} id="outlined-basic" label="伸展定时值" variant="outlined" size="small"/>
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
        <Grid item xs={8}>
          <Card>
            <CardHeader title='康复记录' titleTypographyProps={{ variant: 'h6' }} />
            <PrescriptionTable />
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='压力数据折线图' titleTypographyProps={{ variant: 'h6' }} />
            <PrescriptionLine />
          </Card>
        </Grid>

      </Grid>
  )
}

export default MUITable

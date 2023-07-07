import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import styled from "styled-components";
import {SelectChangeEvent} from "@mui/material/Select";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
// <<<<<<< HEAD
// import {ChangeEvent, useEffect, useState} from "react";
// import {
//   editStaff,
//   fetchPatientById,
//   fetchPrescriptionById,
//   MedicalStaff,
//   Patient, Prescription, PrescriptionRecord
// } from "@/redux/features/rehab/rehab-slice";
// =======
// import {ChangeEvent, useState} from "react";
// import {editStaff, MedicalStaff, Patient, useGetMessagesQuery} from "@/redux/features/rehab/rehab-slice";
// >>>>>>> 47807e9eb34d4e5c0b50fab2360e35cf7d6166da
import {getDefaultGenderLabel, getDefaultGenderValue} from "@/utils/mct-utils";
import {RootState, useAppDispatch, useAppSelector} from "@/redux/store";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {useDispatch} from "react-redux";
import {Prescription} from "@/redux/features/rehab/rehab-slice";

const StyledDiv = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

interface Column {
  id: 'time' | 'pattern' | 'part' | 'count' | 'bendingtimevalue' | 'stretchtimevalue' | 'action';
  label: string;
  minWidth?: number;
  align: 'right' | 'left' | 'center';
}

const columns: readonly Column[] = [
  { id: 'time',
    label: '处方创建时间',
    minWidth: 100,
    align: 'left',
  },
  { id: 'pattern',
    label: '训练模式',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'part',
    label: '训练部位',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'count',
    label: '训练次数或时间',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'bendingtimevalue',
    label: '弯曲定时值',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'stretchtimevalue',
    label: '伸展定时值',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'action',
    label: '操作',
    minWidth: 100,
    align: 'center',
  },
];

const createData = (time: number, pattern: number, part: number, count: number, bendingtimevalue: number, stretchtimevalue: number) => {
  return { time, pattern, part, count, bendingtimevalue, stretchtimevalue}
}

const rows = [
  createData(20230627, 159, 6, 24, 4, 3),
  createData(20230622, 237, 9, 37, 4.3, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),

];

export default function StickyHeadTable(params: {PId:string,
  prescription:Prescription[]}) {
  // const prescription = useAppSelector((state: RootState) => state.rehab.prescription)
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch()
  const [age1, setAge1] = React.useState('');
  const [age2, setAge2] = React.useState('');
  const [device, setDevice] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [openModify, setOpenModify] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickModify = () => {
    setOpenModify(true);
  };

// <<<<<<< HEAD
// =======
//   const rehabPatient = useAppSelector((state: RootState) => state.rehab.rehabPatient)
//   const [age1, setAge1] = React.useState('');
//   const [age2, setAge2] = React.useState('');
//   const [device, setDevice] = React.useState('');
//   const { data, error, isLoading } = useGetMessagesQuery('redux');
//
// >>>>>>> 47807e9eb34d4e5c0b50fab2360e35cf7d6166da
  const handleChange = (event: SelectChangeEvent) => {
    setDevice(event.target.value);
  };

  const handleTPChange = (event: SelectChangeEvent) => {
    setAge1(event.target.value);
  };

  const handlePartChange = (event: SelectChangeEvent) => {
    setAge2(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseModify = () => {
    setOpenModify(false);
  };

  // useEffect(() => {
  //   thunkDispatch(fetchPrescriptionById({id: parseInt(params.PId)}))
  // })

  return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ height: 265 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                    <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {params.prescription.map(row => (
                  <TableRow
                      key={row.created_at}
                      style={{height:'30px'}}
                      sx={{
                        '&:last-of-type td, &:last-of-type th': {
                          border: 0
                        },
                      }}
                  >
                    <TableCell component='th' scope='row'>
                      {row.created_at}
                    </TableCell>
                    <TableCell align='right'>{row.mode}</TableCell>
                    <TableCell align='right'>{row.part}</TableCell>
                    <TableCell align='right'>{row.zz}</TableCell>
                    <TableCell align='right'>{row.u}</TableCell>
                    <TableCell align='right'>{row.v}</TableCell>
                    <TableCell align='right'>
                      <ButtonGroup variant="outlined" aria-label="outlined button group" style={{height:'20px'}}>
                        <Button color="primary"  onClick={handleClickOpen}>下发</Button>
                        <Button color="primary" onClick={handleClickModify}>修改</Button>
                        <Button color="secondary">删除</Button>
                      </ButtonGroup>
                    </TableCell>
                    <div>
                      <Dialog open={open} onClose={handleClose} BackdropProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.06)' } }} PaperProps={{ elevation: 0 }}>
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
                                >
                                  {/*{data ? (*/}
                                  {/*    data.map((item) => (*/}
                                  {/*        <MenuItem key={item.id} value={item.id}>*/}
                                  {/*          {item.name}*/}
                                  {/*        </MenuItem>*/}
                                  {/*    ))*/}
                                  {/*) : null}*/}
                                </Select>
                              </FormControl>
                            </Box>
                          </StyledDiv>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>取消</Button>
                          <Button onClick={handleClose}>确定</Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                    <div>
                      <Dialog open={openModify} onClose={handleCloseModify} BackdropProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.06)' } }} PaperProps={{ elevation: 0 }}>
                        <DialogTitle>修改处方</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            请正确修改处方各项信息
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
                          <Button onClick={handleCloseModify}>取消</Button>
                          <Button onClick={handleCloseModify}>确定</Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </Paper>
  );
}

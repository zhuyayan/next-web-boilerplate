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

import {
  editPrescription,
  EquipmentOnline,
  Prescription,
  sendPrescriptionToEquipment
} from "@/redux/features/rehab/rehab-slice";
import {ChangeEvent, useState} from "react";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {useDispatch} from "react-redux";
import {BodyPartToNumMapping, ModeToNumMapping, NumToBodyPartMapping, NumToModeMapping} from "@/utils/mct-utils";

import {getDefaultGenderLabel, getDefaultGenderValue} from "@/utils/mct-utils";
import {RootState, useAppDispatch, useAppSelector} from "@/redux/store";
import {deletePatient, deletePrescription} from "@/redux/features/rehab/rehab-slice";
import prescriptionTable from "@/components/rehab/prescription/PrescriptionTable";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";


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
    minWidth: 165,
    align: 'left',
  },
  { id: 'pattern',
    label: '训练模式',
    minWidth: 120,
    align: 'right',
  },
  {
    id: 'part',
    label: '训练部位',
    minWidth: 90,
    align: 'right',
  },
  {
    id: 'count',
    label: '训练次数或时间',
    minWidth: 135,
    align: 'right',
  },
  {
    id: 'bendingtimevalue',
    label: '弯曲定时值',
    minWidth: 105,
    align: 'right',
  },
  {
    id: 'stretchtimevalue',
    label: '伸展定时值',
    minWidth: 105,
    align: 'right',
  },
  {
    id: 'action',
    label: '操作',
    minWidth: 220,
    align: 'center',
  },
];

export default function StickyHeadTable(params: {PId:string,
  prescription:Prescription[],
  onlineEquipment: EquipmentOnline[]}) {
  const prescription = useAppSelector((state: RootState) => state.rehab.prescription)
  const appDispatch = useAppDispatch()
  const appThunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  const [device, setDevice] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [openModify, setOpenModify] = React.useState(false);
  const [value, setValue] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [timeserror, setTimesError] = React.useState(false)
  const [benderror, setBendError] = React.useState(false)
  const [stretcherror, setStretchError] = React.useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription>({
    id: 0,
    created_at: "",
    part: "0",
    mode: "0",
    zz: 0,
    u: 0,
    v: 0,
  })
  const [willEditPrescription, setWillEditPrescription] = useState<Prescription>({
    id: 0,
    created_at: "",
    part: "0",
    mode: "0",
    zz: 0,
    u: 0,
    v: 0,
  })
  const [clientId, setClientId] = useState("")

  const handleDeletePrescription = (id: number) => {
    appDispatch(deletePrescription({id: id}))
  };

  const handleClickOpen = (row: Prescription) => {
    setOpen(true);
    setSelectedPrescription(row)
    console.log("selectedPrescription -> ", row)
  };

  const handleClickModify = (row: Prescription) => {
    setWillEditPrescription(row)
    setOpenModify(true);
  };

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
    console.log(event.target)
    console.log(BodyPartToNumMapping[parseInt(event.target.value)])
    setWillEditPrescription((prevState) => ({
      ...prevState,
      part: BodyPartToNumMapping[parseInt(event.target.value)]
    }))
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSendCommand = () => {
    appThunkDispatch(sendPrescriptionToEquipment({prescription_id:selectedPrescription.id, e_id: clientId}))
    setOpen(false);
  };

  const handleEditPrescription = () => {
    appThunkDispatch(editPrescription({
      id: willEditPrescription.id,
      x: NumToBodyPartMapping[willEditPrescription.part],
      y: NumToModeMapping[willEditPrescription.mode],
      zz: willEditPrescription.zz,
      u: willEditPrescription.u,
      v: willEditPrescription.v,
    }))
    setOpenModify(false);
  }

  const handleCloseModify = () => {
    setOpenModify(false);
  };

  function handleZZChange(e: ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value;
    setValue(inputValue);
    if (inputValue !== '' && inputValue < '1') {
      setTimesError('输入的数字不能小于1');
    } else {
      setWillEditPrescription(prevState => ({
        ...prevState,
        zz: parseInt(inputValue)
      }));
    }
  }
  const handleAddPrescriptionBend = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setValue(inputValue);
    if (inputValue !== '' && inputValue < '3') {
      setStretchError('输入的数字不能小于3');
    } else {
      setStretchError('');
      setWillEditPrescription(prevState => ({
        ...prevState,
        u: parseInt(e.target.value)
      }));
    }
  };
  function handleUChange(e: ChangeEvent<HTMLInputElement>) {
    // setWillEditPrescription(prevState => ({
    //   ...prevState,
    //   u: parseInt(e.target.value)
    // }));
    const inputValue = e.target.value;
    setValue(inputValue);
    if (inputValue !== '' && inputValue < '3') {
      setBendError('输入的数字不能小于3');
    } else {
      setBendError('');
      setWillEditPrescription(prevState => ({
        ...prevState,
        u: parseInt(e.target.value)
      }));
    }
  }

  function handleVChange(e: ChangeEvent<HTMLInputElement>) {
    // setWillEditPrescription(prevState => ({
    //   ...prevState,
    //   v: parseInt(e.target.value)
    // }));
    const inputValue = e.target.value;
    setValue(inputValue);
    if (inputValue !== '' && inputValue < '3') {
      setStretchError('输入的数字不能小于3');
    } else {
      setStretchError('');
      setWillEditPrescription(prevState => ({
        ...prevState,
        v: parseInt(inputValue)
      }));
    }
  }

  return (<>
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
                    <TableCell align='left'>
                      <ButtonGroup variant="outlined" aria-label="outlined button group" style={{height:'20px'}}>
                        <Button color="primary"  onClick={(event)=>{event.stopPropagation(); handleClickOpen(row);}}>下发</Button>
                        <Button color="primary" onClick={(event) => {event.stopPropagation();handleClickModify(row)}}>修改</Button>
                        <Button color="secondary" onClick={() => handleDeletePrescription(prescription.id)}>删除</Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
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
                        value={NumToModeMapping[willEditPrescription.mode]}
                        label="Age1"
                        name="mode"
                        onChange={handleModeChange}
                    >
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
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={NumToBodyPartMapping[willEditPrescription.part]}
                        label="Age2"
                        onChange={handlePartChange}
                        name="part"
                    >
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
                      sx={{ m: 1, minWidth: 160 }}
                      value={willEditPrescription.zz}
                      id="outlined-zz" label="训练次数或时间"
                      onChange={handleZZChange}
                      error={Boolean(timeserror)}
                      helperText={timeserror}
                      inputProps={{ type: 'number' }}
                      variant="outlined" size="small"/>
                  <TextField
                      sx={{ m: 1, minWidth: 160 }}
                      value={willEditPrescription.u}
                      id="outlined-u"
                      label="弯曲定时值"
                      onChange={handleUChange}
                      error={Boolean(benderror)}
                      helperText={benderror}
                      inputProps={{ type: 'number' }}
                      variant="outlined" size="small"/>
                  <TextField
                      sx={{ m: 1, minWidth: 160 }}
                      value={willEditPrescription.v}
                      id="outlined-v"
                      label="伸展定时值"
                      onChange={handleVChange}
                      error={Boolean(stretcherror)}
                      helperText={stretcherror}
                      inputProps={{ type: 'number' }}
                      variant="outlined" size="small"/>
                </Box>
              </StyledDiv>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModify}>取消</Button>
              <Button onClick={handleEditPrescription} disabled={Boolean(error)}>确定</Button>
            </DialogActions>
          </Dialog>
    </>
  );
}

"use client";
import React, {useState, useEffect, ChangeEvent} from 'react';
import {
  Container,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  ButtonGroup,
  Icon,
  Stack, Breadcrumbs,
  Tabs, Tab, Autocomplete,
  IconButton, Input, InputAdornment,
  OutlinedInput
} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Link from 'next/link';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import styled from "styled-components";
import {fetchPatients, fetchStaffs, MedicalStaff, Patient} from "@/redux/features/rehab/rehab-slice";
import {addPatient, editPatient, deletePatient} from "@/redux/features/rehab/rehab-slice";
import {AppDispatch, RootState, useAppDispatch, useAppSelector} from "@/redux/store";
import {useDispatch} from "react-redux";
import Box from "@mui/material/Box";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {AccountCircle, Delete as DeleteIcon} from "@mui/icons-material";
import {
  genderValueToLabel,
  getDefaultGenderLabel,
  getDefaultGenderValue,
  GetDefaultPatient
} from "@/utils/mct-utils";
import SearchIcon from '@mui/icons-material/Search';
import {string} from "postcss-selector-parser";
import EditIcon from '@mui/icons-material/Edit';
import SmsIcon from '@mui/icons-material/Sms';
import Tooltip from '@mui/material/Tooltip';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import DeleteConfirmationDialog from '@/components/rehab/DeleteConfirmationDialog';
import { Title } from '@/components/rehab/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const StyledDiv = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

export default function PatientList() {
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  const appDispatch = useAppDispatch();
  const dispatch = useDispatch();
  const patientList = useAppSelector((state: RootState) => state.rehab.patient);
  const medicalStaffList = useAppSelector((state: RootState) => state.rehab.staff);
  const [patientToBeDeleted, setPatientToBeDeleted] = useState<Patient>(GetDefaultPatient());
  const [open, setOpen] = React.useState(false);
  const [openDelPatient, setOpenDelPatient] = React.useState(false);
  const [openAddPatient, setOpenAddPatient] = React.useState(false);
  const [willEditPatient, setWillEditPatient] = useState<Patient>({
    id: 0,
    name: '',
    age: 0,
    gender: getDefaultGenderValue(),
    genderLabel: getDefaultGenderLabel(),
    medicalHistory: '',
    physician: '',
    physicianId: 0,
    i18d: '',
  });
  const [willAddPatient, setWillAddPatient] = useState<Patient>({
    id: 0,
    name: '',
    age: 0,
    gender: getDefaultGenderValue(),
    genderLabel: getDefaultGenderLabel(),
    medicalHistory: '',
    physician: '',
    physicianId: 0,
    i18d: '',
  });

  useEffect(() => {
    thunkDispatch(fetchPatients({page: 1, size: 1000, id: 0}))
  }, [thunkDispatch]);

  useEffect(() => {
    thunkDispatch(fetchStaffs({page: 1, size: 1000, id: 0}))
  }, [thunkDispatch]);

  const handleAddPatient = () => {
    // 使用 id 页面需要调整
    thunkDispatch(addPatient({
      name: willAddPatient.name,
      age: willAddPatient.age,
      sex: willAddPatient.genderLabel,
      medical_history: willAddPatient.medicalHistory,
      staff_id: willAddPatient.physicianId,
      i_18_d: willAddPatient.i18d
    }))
    handleAddPatientClose()
  };


  const handleClickDel = async (patient: Patient) => {
    setPatientToBeDeleted(patient)
    setOpenDelPatient(true);
  }
  const handleDeletePatient = (id: number) => {
    (appDispatch as AppDispatch)(deletePatient({id: id}))
    handleCloseDel()
  };

  const [addPatientOpen, setAddPatientOpen] = React.useState(false);


  const getPatientById = (id: number) => {
    return patientList.find((p) => p.id === id);
  }
  const handleEditClickOpen = (id: number) => {
    let selectedPatient = getPatientById(id)
    console.log('selectedPatient', selectedPatient)
    if (selectedPatient === undefined) {
    } else {
      setOpen(true);
      console.log('selectedPatient', selectedPatient)
      setWillEditPatient(selectedPatient)
    }
  };

  const handleCloseDel= () => {
    setOpenDelPatient(false);
    setPatientToBeDeleted(GetDefaultPatient())
  }
  const handleClose = () => {
    setOpen(false);
  };

  const handleEditPatient = () => {
    // 使用 id 页面需要调整
    (appDispatch as AppDispatch)(editPatient({
      id: willEditPatient.id,
      name: willEditPatient.name,
      age: willEditPatient.age,
      sex: willEditPatient.genderLabel,
      medical_history: willEditPatient.medicalHistory,
      staff_id: willEditPatient.physicianId,
      i_18_d: willEditPatient.i18d,
    }))
    handleClose()
  }
  const handleAddPatientOpen = () => {
    setAddPatientOpen(true)
  }
  const handleAddPatientClose = () => {
    setAddPatientOpen(false)
  }

  const handleAddPatientInput = (event: ChangeEvent<HTMLInputElement>) => {
    const {id, value} = event.target;
    setWillAddPatient((prevInputValues) => ({
      ...prevInputValues,
      [id]: value,
    }));
  };

  const handleAddPatientAgeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const {id, value} = event.target;
    setWillAddPatient((prevInputValues) => ({
      ...prevInputValues,
      [id]: parseInt(value),
    }));
  };

  const handleEditPatientInput = (event: ChangeEvent<HTMLInputElement>) => {
    const {id, value} = event.target;
    console.log(id, value)
    setWillEditPatient((prevInputValues) => ({
      ...prevInputValues,
      [id]: value,
    }));
  };

  const handleEditPatientAgeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const {id, value} = event.target;
    console.log(id, value)
    setWillEditPatient((prevInputValues) => ({
      ...prevInputValues,
      [id]: parseInt(value),
    }));
  };

  const [gender, setGender] = React.useState('');
  const [physician, setPhysician] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    const {value} = event.target;
    console.log("value: ", value)
    console.log("event.target.value", event.target.value)
    setWillEditPatient((prevInputValues) => ({
      ...prevInputValues,
      ["gender"]: value,
      ["genderLabel"]: genderValueToLabel(String(value)),
    }));
    setGender(event.target.value);
  };

  const handleChangePhysician = (event: SelectChangeEvent) => {
    const {value} = event.target;
    console.log("value: ", value)
    console.log("event.target.value", event.target.value)
    setWillEditPatient((prevInputValues) => ({
      ...prevInputValues,
      ["physicianId"]: parseInt(value),
    }));
    setPhysician(event.target.value);
  };

  //分页
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }

  const handleAddPatientGenderChange = (event: SelectChangeEvent) => {
    const {value} = event.target;
    setWillAddPatient((prevInputValues) => ({
      ...prevInputValues,
      ["gender"]: value,
      ["genderLabel"]: genderValueToLabel(String(value)),
    }));
  };

  const handleAddPatientPhysicianChange = (event: SelectChangeEvent) => {
    const {value} = event.target;
    console.log("handleAddPatientPhysicianChange", value)
    setWillAddPatient((prevInputValues) => ({
      ...prevInputValues,
      ["physicianId"]: parseInt(value),
    }));
  };

  const [doctorName, setDoctorName] = React.useState<string[]>([]);

  const handleSelectChange = (event: SelectChangeEvent<typeof doctorName>) => {
    const {
      target: { value },
    } = event;
    setDoctorName(
        typeof value === 'string' ? value.split(',') : value,
    );
  };

    return (
      <Container>
        <Box>
          <Stack direction="row" spacing={1}>
            <Box flexGrow={1}>
              <Title>病人列表</Title>
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <FormControl sx={{ m: 1, width: 240}}>
                  <InputLabel id="demo-multiple-checkbox-label">主治医生</InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={doctorName}
                    onChange={handleSelectChange}
                    input={<OutlinedInput label="主治医生" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                  >
                    {medicalStaffList.map((medicalStaff) => (
                      <MenuItem key={medicalStaff.id} value={medicalStaff.fullName}>
                        <Checkbox checked={doctorName.indexOf(medicalStaff.fullName) > -1} />
                        <ListItemText primary={medicalStaff.fullName} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ m: 1, width: 480}}>
                  <OutlinedInput
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="输入病人姓名进行查询"
                      inputProps={{ 'aria-label': '输入病人姓名进行查询' }}
                      startAdornment={
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      }
                  />
                </FormControl>
                <Tooltip title="添加病人">
                  <IconButton
                      style={{float: 'right'}}
                      aria-label="add"
                      onClick={handleAddPatientOpen}>
                    <AddCircleIcon sx={{ fontSize: 54 }} color="secondary"/>
                  </IconButton>
                </Tooltip>


              </Paper>
            </Box>
            {/*<Box>*/}
            {/*  <Button  style={{float: 'right'}} startIcon={<AddCircleOutlineIcon/>} variant="outlined" onClick={handleAddPatientOpen}>*/}
            {/*    添加病人*/}
            {/*  </Button>*/}
            {/*</Box>*/}
          </Stack>
        </Box>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          </Box>
          <TableContainer sx={{ maxHeight: 620}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{m: 1, minWidth: 100}} align='center'>姓名</TableCell>
                  <TableCell sx={{m: 1, minWidth: 100}} align='center'>年龄</TableCell>
                  <TableCell sx={{m: 1, minWidth: 100}} align='center'>性别</TableCell>
                  <TableCell sx={{m: 1, minWidth: 150}} align='center'>病史</TableCell>
                  <TableCell sx={{m: 1, minWidth: 100}} align='center'>主治医生</TableCell>
                  <TableCell sx={{m: 1, minWidth: 200}} align='center'>身份证号</TableCell>
                  <TableCell sx={{m: 1, minWidth: 300}} align='center'>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patientList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell align='center'>{patient.name}</TableCell>
                          <TableCell align='center'>{patient.age}</TableCell>
                          <TableCell align='center'>{patient.genderLabel}</TableCell>
                          <TableCell align='center'>{patient.medicalHistory}</TableCell>
                          <TableCell align='center'>{patient.physician}</TableCell>
                          <TableCell align='center'>{patient.i18d}</TableCell>
                          <TableCell align='center'>

                            {/*<Link href={`/rehab/rehabilitation/` + patient.id} passHref>*/}
                            {/*  */}
                            {/*</Link>*/}

                            <Tooltip title="查看详细信息">
                              <IconButton
                                  aria-label="more"
                                  color="primary"
                                  onClick={()=> {window.location.href="rehabilitation/"+patient.id}}
                              >
                                <SmsIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="修改信息">
                              <IconButton
                                  aria-label="edit"
                                  color="secondary"
                                  onClick={() => handleEditClickOpen(patient.id)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="删除">
                              <IconButton
                                  aria-label="delete"
                                  // color="secondary"
                                  // onClick={() => handleDeletePatient(patient.id)}
                                  onClick = {() => handleClickDel(patient)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {/*<Dialog open={openDelPatient} onClose={handleCloseDel}>*/}
                            {/*  <DialogTitle>确认操作</DialogTitle>*/}
                            {/*  <DialogContent>*/}
                            {/*    <DialogContentText>*/}
                            {/*      是否确认删除该条病人信息？*/}
                            {/*    </DialogContentText>*/}
                            {/*  </DialogContent>*/}
                            {/*  <DialogActions>*/}
                            {/*    <Button onClick={() => handleDeletePatient(patient.id)}>确认删除</Button>*/}
                            {/*    <Button onClick={handleCloseDel}>取消</Button>*/}
                            {/*  </DialogActions>*/}
                            {/*</Dialog>*/}
                          </TableCell>
                        </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box>
            <TablePagination
                labelRowsPerPage="每页行数:"
                nextIconButtonProps={{
                  'aria-label': '下一页',
                  'title': '下一页'
            }}
                backIconButtonProps={{
                  'aria-label': '上一页',
                  'title': '上一页'
            }}
                labelDisplayedRows={({from, to, count}) => `${from}-${to} 共 ${count}`}
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={patientList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}/>
          </Box>
        </Paper>
        <DeleteConfirmationDialog
          open={openDelPatient}
          onClose={handleCloseDel}
          onConfirm={() => handleDeletePatient(patientToBeDeleted.id)}
          deleteItemName={patientToBeDeleted.name}
        />
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>修改病人信息</DialogTitle>
            <DialogContent>
              <Box component="form">
                <StyledDiv>
                  <TextField
                      sx={{ m: 1, minWidth: 110 }}
                      id="name"
                      value={willEditPatient.name}
                      onChange={handleEditPatientInput}
                      label="姓名" variant="outlined" size="small"/>
                  <TextField
                      sx={{ m: 1, minWidth: 80 }}
                      id="age"
                      value={willEditPatient.age}
                      onChange={handleEditPatientAgeInput}
                      label="年龄" variant="outlined" size="small"/>
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="gender">性别</InputLabel>
                    <Select
                        labelId="gender"
                        id="gender"
                        // value={willEditPatient.gender.toString()}
                        value={String(willEditPatient.gender)}
                        label="性别"
                        onChange={handleChange}
                    >
                      <MenuItem value={10}>男</MenuItem>
                      <MenuItem value={21}>女</MenuItem>
                    </Select>
                  </FormControl>
                </StyledDiv>
                <StyledDiv>
                  <TextField
                      sx={{ m: 1, minWidth: 340 }}
                      id="i18d"
                      value={willEditPatient.i18d}
                      onChange={handleEditPatientInput}
                      label="身份证号" variant="outlined" size="small"/>
                  <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
                    <InputLabel id="physician">主治医生</InputLabel>
                    <Select
                        labelId="physician"
                        id="physician"
                        value={String(willEditPatient.physicianId)}
                        label="主治医生"
                        onChange={handleChangePhysician}
                    >
                      {medicalStaffList.map((medicalStaff) =>
                          <MenuItem value={medicalStaff.id} key={medicalStaff.id}>{medicalStaff.fullName}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </StyledDiv>
                <TextField
                    sx={{ m: 1, minWidth: 400 }}
                    id="medicalHistory"
                    value={willEditPatient.medicalHistory}
                    onChange={handleEditPatientInput}
                    label="病史" variant="outlined" size="small"
                    multiline
                    rows={4} />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>取消</Button>
              <Button onClick={handleEditPatient}>确定</Button>
            </DialogActions>
          </Dialog>
        <Dialog open={addPatientOpen} onClose={handleAddPatientClose}>
            <DialogTitle>添加病人</DialogTitle>
            <DialogContent>
              <DialogContentText>
                请正确填写病人各项信息
              </DialogContentText>
              <Box component="form">
                <StyledDiv>
                  <TextField sx={{m: 1, minWidth: 110}}
                             id="name"
                             onChange={handleAddPatientInput}
                             label="姓名" variant="outlined" size="small"/>
                  <TextField sx={{m: 1, minWidth: 80}}
                             id="age"
                             onChange={handleAddPatientAgeInput}
                             label="年龄" variant="outlined" size="small"/>
                  <FormControl sx={{m: 1, minWidth: 120}} size="small">
                    <InputLabel id="gender">性别</InputLabel>
                    <Select
                        labelId="gender"
                        id="gender"
                        label="性别"
                        onChange={handleAddPatientGenderChange}
                    >
                      <MenuItem value={10}>男</MenuItem>
                      <MenuItem value={21}>女</MenuItem>
                    </Select>
                  </FormControl>
                </StyledDiv>
                <StyledDiv>
                  <TextField sx={{m: 1, minWidth: 340}}
                             id="i18d"
                             value={willAddPatient.i18d}
                             onChange={handleAddPatientInput}
                             label="身份证号" variant="outlined" size="small"/>
                  <FormControl sx={{m: 1, minWidth: 160}} size="small">
                    <InputLabel id="physician">主治医生</InputLabel>
                    <Select
                        labelId="physician"
                        id="physician"
                        value={String(willAddPatient.physicianId)}
                        label="主治医生"
                        onChange={handleAddPatientPhysicianChange}
                    >
                      {medicalStaffList.map((medicalStaff) =>
                          <MenuItem value={medicalStaff.id} key={medicalStaff.id}>{medicalStaff.fullName}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </StyledDiv>
                <TextField sx={{m: 1, minWidth: 400}}
                           id="medicalHistory"
                           value={willAddPatient.medicalHistory}
                           onChange={handleAddPatientInput}
                           label="病史" variant="outlined" size="small"
                           multiline
                           rows={4}/>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAddPatientClose}>取消</Button>
              <Button onClick={handleAddPatient}>确定</Button>
            </DialogActions>
          </Dialog>
      </Container>
  );
}

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
} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import Link from 'next/link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import styled from "styled-components";
import {fetchPatients, Patient} from "@/redux/features/rehab/rehab-slice";
import {addPatient, editPatient, deletePatient} from "@/redux/features/rehab/rehab-slice";
import {RootState, useAppSelector} from "@/redux/store";
import {useDispatch} from "react-redux";
import Box from "@mui/material/Box";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {Delete as DeleteIcon} from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";


const StyledDiv = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const StyledButton = styled(Button)`
  && {
    background-color: #1976d1;
    color: #ffffff;
  }`;


export default function PatientList() {
  const patientList = useAppSelector((state: RootState) => state.rehab.patient)
  const dispatch = useDispatch()
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  const [willEditPatient, setWillEditPatient] = useState<Patient>({
    id: 0,
    name: '',
    age: 0,
    gender: '',
    medicalHistory: '',
    physician:'tom',
  });
  const [willAddPatient, setWillAddPatient] = useState<Patient>({
    id: 0,
    name: '',
    age: 0,
    gender: '男',
    medicalHistory: '',
    physician:'lily',
  });

  useEffect(() => {
    thunkDispatch(fetchPatients({page: 1, size: 100, id: 0}))
  }, [thunkDispatch]);

  const handleAddPatient = () => {
    // 使用 id 页面需要调整
    thunkDispatch(addPatient({ name: willAddPatient.name, age: willAddPatient.age, sex: willAddPatient.gender, medical_history: willAddPatient.medicalHistory, staff_id: 1}))
    handleAddPatientClose()
  };

  const handleDeletePatient = (id: number) => {
    thunkDispatch(deletePatient({id: id}))
  };

  const [addPatientOpen, setAddPatientOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const getPatientById = (id: number) => {
    return patientList.find((p) => p.id === id);
  }
  const handleEditClickOpen = (id: number) => {
    let selectedPatient = getPatientById(id)
    if (selectedPatient === undefined) {
    } else {
      setOpen(true);
      setWillEditPatient(selectedPatient)
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditPatient = () => {
    // 使用 id 页面需要调整
    thunkDispatch(editPatient({ id: willEditPatient.id, name: willEditPatient.name, age: willEditPatient.age, sex: willEditPatient.gender, medical_history: willEditPatient.medicalHistory, staff_id: 1 }))
    setOpen(false)
  }
  const handleAddPatientOpen = () => {
    setAddPatientOpen(true)
  }
  const handleAddPatientClose = () => {
    setAddPatientOpen(false)
  }

  const handleAddPatientInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    console.log(id, value)
    setWillAddPatient((prevInputValues) => ({
      ...prevInputValues,
      [id]: value,
    }));
  };

  const handleEditPatientInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    console.log(id, value)
    setWillEditPatient((prevInputValues) => ({
      ...prevInputValues,
      [id]: value,
    }));
  };

  const [gender, setGender] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setGender(event.target.value);
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
  };

  return (
      <Container>
        <Typography variant="h2" component="h1" sx={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>病人列表</Typography>
        <div>
          <Button startIcon={<AddCircleOutlineIcon />}  variant="outlined" onClick={handleAddPatientOpen}>
            添加病人
          </Button>
          <Dialog open={addPatientOpen} onClose={handleAddPatientClose}>
            <DialogTitle>添加病人</DialogTitle>
            <DialogContent>
              <DialogContentText>
                请正确填写病人各项信息
              </DialogContentText>
              <Box component="form">
                <StyledDiv>
                  <TextField sx={{ m: 1, minWidth: 110 }}
                             id="name"
                             value={willAddPatient.name}
                             onChange={handleAddPatientInput}
                             label="姓名" variant="outlined" size="small"/>
                  <TextField sx={{ m: 1, minWidth: 110 }}
                             id="age"
                             value={willAddPatient.age}
                             onChange={handleAddPatientInput}
                             label="年龄" variant="outlined" size="small"/>
                  <FormControl sx={{ m: 1, minWidth: 80 }} size="small">
                    <InputLabel id="gender">性别</InputLabel>
                    <Select
                        labelId="gender"
                        id="gender"
                        value={gender}
                        label="性别"
                        onChange={handleChange}
                    >
                      <MenuItem value={10}>男</MenuItem>
                      <MenuItem value={21}>女</MenuItem>
                    </Select>
                  </FormControl>
                  {/*<TextField sx={{ m: 1, minWidth: 120 }}*/}
                  {/*           id="gender"*/}
                  {/*           value={willAddPatient.gender}*/}
                  {/*           onChange={handleAddPatientInput}*/}
                  {/*           label="性别" variant="outlined" size="small"/>*/}
                </StyledDiv>
                <StyledDiv>
                  <TextField sx={{ m: 1, minWidth: 110 }}
                             id="medicalHistory"
                             value={willEditPatient.medicalHistory}
                             onChange={handleEditPatientInput}
                             label="病史" variant="outlined" size="small"
                             multiline
                             rows={4} />
                  <TextField sx={{ m: 1, minWidth: 110 }}
                             id="physician"
                             value={willAddPatient.physician}
                             onChange={handleAddPatientInput}
                             label="主治医生" variant="outlined" size="small"/>
                </StyledDiv>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAddPatientClose}>取消</Button>
              <Button onClick={handleAddPatient}>确定</Button>
            </DialogActions>
          </Dialog>
        </div>
        <TableContainer sx={{ maxHeight: 620}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>姓名</TableCell>
                <TableCell>年龄</TableCell>
                <TableCell>性别</TableCell>
                <TableCell>病史</TableCell>
                <TableCell>主治医生</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patientList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.id}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.medicalHistory}</TableCell>
                    <TableCell>{patient.physician}</TableCell>
                    <TableCell>
                      <Stack spacing={1} direction="row">
                      <Link href={`/rehab/rehabilitation/` + patient.id} passHref>
                        <StyledButton style={{height:'23px'}} variant="contained" color="primary">
                          查看康复信息
                        </StyledButton>
                      </Link>
                      <StyledButton
                          style={{height:'23px'}}
                          variant="contained"
                          color="primary"
                          onClick={ () => handleEditClickOpen(patient.id) }
                      >
                        修改
                      </StyledButton>
                      <StyledButton style={{height:'23px'}} variant="contained" color="primary" startIcon={<DeleteIcon/>} onClick={() => handleDeletePatient(patient.id)}>
                        删除
                      </StyledButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={patientList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>修改病人信息</DialogTitle>
          <DialogContent>
            <Box component="form">
              <StyledDiv>
                <TextField sx={{ m: 1, minWidth: 110 }}
                           id="name"
                           value={willEditPatient.name}
                           onChange={handleEditPatientInput}
                           label="姓名" variant="outlined" size="small"/>
                <TextField sx={{ m: 1, minWidth: 110 }}
                           id="age"
                           value={willEditPatient.age}
                           onChange={handleEditPatientInput}
                           label="年龄" variant="outlined" size="small"/>
                <FormControl sx={{ m: 1, minWidth: 80 }} size="small">
                  <InputLabel id="gender">性别</InputLabel>
                  <Select
                      labelId="gender"
                      id="gender"
                      value={gender}
                      label="性别"
                      onChange={handleChange}
                  >
                    <MenuItem value={10}>男</MenuItem>
                    <MenuItem value={21}>女</MenuItem>
                  </Select>
                </FormControl>
              </StyledDiv>
            <StyledDiv>
                <TextField sx={{ m: 1, minWidth: 110 }}
                           id="medicalHistory"
                           value={willEditPatient.medicalHistory}
                           onChange={handleEditPatientInput}
                           label="病史" variant="outlined" size="small"
                           multiline
                           rows={4} />
                <TextField sx={{ m: 1, minWidth: 110 }}
                           id="physician"
                           value={willAddPatient.physician}
                           onChange={handleAddPatientInput}
                           label="主治医生" variant="outlined" size="small"/>
              </StyledDiv>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button onClick={handleEditPatient}>确定</Button>
          </DialogActions>
        </Dialog>
      </Container>
  );
}

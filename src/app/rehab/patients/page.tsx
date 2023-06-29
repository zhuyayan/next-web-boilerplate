"use client";
import React, { useState, useEffect } from 'react';
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
import Link from 'next/link';

//dialog
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import styled from "styled-components";

import { getPatients, addPatient, deletePatient, updatePatient } from './api/patients_list';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  medicalHistory: string;
}

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [newPatient, setNewPatient] = useState<Patient>({
    id: 0,
    name: '',
    age: 0,
    gender: '',
    medicalHistory: '',
  });

  useEffect(() => {
    const fetchPatients = () => {
      const fetchedPatients = getPatients();
      setPatients(fetchedPatients);
    };

    fetchPatients();
  }, []);

  const handleAddPatient = () => {
    const addedPatient = addPatient(newPatient);
    setPatients([...patients, addedPatient]);
    setNewPatient({
      id: 0,
      name: '',
      age: 0,
      gender: '',
      medicalHistory: '',
    });
  };

  const handleDeletePatient = (id: number) => {
    deletePatient(id);
    const updatedPatients = patients.filter((patient) => patient.id !== id);
    setPatients(updatedPatients);
  };

  const handleUpdatePatient = (id: number, updatedPatient: Partial<Patient>) => {
    const updated = updatePatient(id, updatedPatient);
    if (updated) {
      const updatedPatients = patients.map((patient) => (patient.id === id ? updated : patient));
      setPatients(updatedPatients);
    }
  };

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

  return (
      <Container>
        <Typography variant="h2">病人列表</Typography>
        <div>
          <Button variant="outlined" onClick={handleClickOpen}>
            添加病人
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>添加病人</DialogTitle>
            <DialogContent>
              <DialogContentText>
                请正确填写处方各项信息
              </DialogContentText>
              <StyledDiv>
                <TextField sx={{ m: 1, minWidth: 120 }} id="id" label="病人id" variant="outlined" size="small"/>
                <TextField sx={{ m: 1, minWidth: 120 }} id="name" label="姓名" variant="outlined" size="small"/>
                <TextField sx={{ m: 1, minWidth: 120 }} id="age" label="年龄" variant="outlined" size="small"/>
                <TextField sx={{ m: 1, minWidth: 120 }} id="gender" label="性别" variant="outlined" size="small"/>
                <TextField sx={{ m: 1, minWidth: 120 }} id="medicalHistory" label="病史" variant="outlined" size="small"/>
              </StyledDiv>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>取消</Button>
              <Button onClick={handleClose}>确定</Button>
            </DialogActions>
          </Dialog>
        </div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>姓名</TableCell>
                <TableCell>年龄</TableCell>
                <TableCell>性别</TableCell>
                <TableCell>病史</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.id}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.medicalHistory}</TableCell>
                    <TableCell>
                      {/*<Link href={`/patient/${patient.id}`} passHref>*/}
                      <Link href={`/rehabilitation_management`} passHref>
                        <Button variant="contained" color="primary">
                          查看康复信息
                        </Button>
                      </Link>
                      {/*<Button*/}
                      {/*    variant="contained"*/}
                      {/*    color="primary"*/}
                      {/*    onClick={() => handleUpdatePatient(patient.id, { name: 'Updated Name', age: 35 })}*/}
                      {/*>*/}
                      <Button
                          variant="contained"
                          color="primary"
                          onClick={handleClickOpen}
                      >
                        修改
                      </Button>
                      <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>添加医护</DialogTitle>
                        <DialogContent>
                          <StyledDiv>
                            <TextField sx={{ m: 1, minWidth: 120 }} id="id" label="病人id" variant="outlined" size="small"/>
                            <TextField sx={{ m: 1, minWidth: 120 }} id="name" label="姓名" variant="outlined" size="small"/>
                            <TextField sx={{ m: 1, minWidth: 120 }} id="age" label="年龄" variant="outlined" size="small"/>
                            <TextField sx={{ m: 1, minWidth: 120 }} id="gender" label="性别" variant="outlined" size="small"/>
                            <TextField sx={{ m: 1, minWidth: 120 }} id="medicalHistory" label="病史" variant="outlined" size="small"/>
                          </StyledDiv>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>取消</Button>
                          <Button onClick={handleClose}>确定</Button>
                        </DialogActions>
                      </Dialog>

                      <Button variant="contained" color="primary" onClick={() => handleDeletePatient(patient.id)}>
                        删除
                      </Button>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
  );
}

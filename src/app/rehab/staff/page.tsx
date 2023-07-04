"use client";
import React, {ChangeEvent, useEffect} from 'react';
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import {addMedicalStaff, deleteMedicalStaff, editMedicalStaff, MedicalStaff} from "@/redux/features/rehab/rehab-slice";
import styled from "styled-components";
import {useDispatch} from "react-redux";
// import {ThunkDispatch} from "redux-thunk";
// import {AnyAction} from "redux";
import {RootState, useAppSelector} from "@/redux/store";
import Box from "@mui/material/Box";
import {Delete as DeleteIcon} from "@mui/icons-material";
import Stack from "@mui/material/Stack";
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


export default function MedicalStaffManagement() {
  const dispatch = useDispatch()
  // const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  const medicalStaffList = useAppSelector((state: RootState) => state.rehab.staff)
  const [open, setOpen] = React.useState(false);
  const [openAddStaff, setOpenAddStaff] = React.useState(false);
  const [willEditStaff, setWillEditStaff] = React.useState<MedicalStaff>({
    id: 0,
    username: '',
    password: '',
    fullName: '',
  })
  const [willAddStaff, setWillAddStaff] = React.useState<MedicalStaff>({
    id: 0,
    username: '',
    password: '',
    fullName: '',
  })

  useEffect(() => {
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    console.log(id, value)
    setWillEditStaff((prevInputValues) => ({
      ...prevInputValues,
      [id]: value,
    }));
  };

  const getMedicalStaffById = (id: number) => {
    return medicalStaffList.find((staff) => staff.id === id);
  }

  const handleAddMedicalStaff = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setWillAddStaff((prevInputValues) => ({
      ...prevInputValues,
      [id]: value,
    }))
  };

  const handleSaveAddMedicalStaff = () => {
    dispatch(addMedicalStaff(willAddStaff))
    setOpenAddStaff(false)
  };

  const handleDeleteMedicalStaff = (id: number) => {
    dispatch(deleteMedicalStaff(id))
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddStaffClickOpen = () => {
    setOpenAddStaff(true)
  }

  const handleAddStaffClickClose = () => {
    setOpenAddStaff(false)
  }

  const handleEditRowOpen = (id:number) => {
    let selectedStaff = getMedicalStaffById(id)
    if (selectedStaff === undefined) {
    } else {
      handleClickOpen()
      setWillEditStaff(selectedStaff)
    }
  }
  const handleEditRow = () => {
    dispatch(editMedicalStaff(willEditStaff))
    handleClose()
  }

  return (
      <Container>
        <Typography variant="h2" component="h1" sx={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333'}}>医护用户管理</Typography>
        <div>
          <Button startIcon={<AddCircleOutlineIcon /> } variant="outlined" onClick={handleAddStaffClickOpen}>
            添加医护
          </Button>
          <Dialog open={openAddStaff} onClose={handleAddStaffClickClose}>
            <DialogTitle>添加医护</DialogTitle>
            <DialogContent>
              <Box>
                <StyledDiv>
                  <TextField sx={{ m: 1, minWidth: 120 }} id="username"
                             value={willAddStaff.username}
                             onChange={handleAddMedicalStaff}
                             label="用户名" variant="outlined" size="small"/>
                  <TextField sx={{ m: 1, minWidth: 120 }} id="password"
                             value={willAddStaff.password}
                             onChange={handleAddMedicalStaff}
                             label="密码" variant="outlined" size="small"/>
                  <TextField sx={{ m: 1, minWidth: 120 }} id="fullName"
                             value={willAddStaff.fullName}
                             onChange={handleAddMedicalStaff}
                             label="全名" variant="outlined" size="small"/>
                </StyledDiv>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAddStaffClickClose}>取消</Button>
              <Button onClick={handleSaveAddMedicalStaff}>确定</Button>
            </DialogActions>
          </Dialog>
        </div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>用户名</TableCell>
                <TableCell>密码</TableCell>
                <TableCell>全名</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicalStaffList.map((medicalStaff) => (
                  <TableRow key={medicalStaff.id}>
                    <TableCell>{medicalStaff.id}</TableCell>
                    <TableCell>{medicalStaff.username}</TableCell>
                    <TableCell>{medicalStaff.password}</TableCell>
                    <TableCell>{medicalStaff.fullName}</TableCell>
                    <TableCell>
                      <Stack spacing={1} direction="row">
                        <StyledButton variant="outlined" onClick={() => handleEditRowOpen(medicalStaff.id)}>
                          修改
                        </StyledButton>
                        <StyledButton variant="contained" startIcon={<DeleteIcon/>}  onClick={() => handleDeleteMedicalStaff(medicalStaff.id)}>
                          删除
                        </StyledButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>修改</DialogTitle>
          <DialogContent>
            <Box component="form">
              <StyledDiv>
                <TextField
                    sx={{ m: 1, minWidth: 120 }}
                    id="username"
                    value={willEditStaff.username}
                    onChange={handleInputChange}
                    label="用户名" variant="outlined" size="small"/>
                <TextField
                    sx={{ m: 1, minWidth: 120 }}
                    id="password"
                    value={willEditStaff.password}
                    onChange={handleInputChange}
                    label="密码" variant="outlined" size="small"/>
                <TextField
                    sx={{ m: 1, minWidth: 120 }}
                    id="fullName"
                    value={willEditStaff.fullName}
                    onChange={handleInputChange}
                    label="全名" variant="outlined" size="small"/>
              </StyledDiv>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button onClick={handleEditRow}>确定</Button>
          </DialogActions>
        </Dialog>
      </Container>
  );
}
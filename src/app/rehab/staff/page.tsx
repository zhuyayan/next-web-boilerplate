"use client";
import React, {ChangeEvent, useEffect} from 'react';
import {
  Button, ButtonGroup,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  deleteStaff,
  fetchStaffs,
  MedicalStaff, addStaff, editStaff, deletePatient,
} from "@/redux/features/rehab/rehab-slice";
import styled from "styled-components";
import {useDispatch} from "react-redux";
import {AppDispatch, RootState, useAppSelector} from "@/redux/store";
import Box from "@mui/material/Box";
import {Delete as DeleteIcon} from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {useAppDispatch} from "@/redux/store";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";

const StyledDiv = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const StyledTableRow = styled(TableRow)`
  & td.MuiTableCell-root {
  padding: 14px;
  }`;

const chineseLocalization = {
  components: {
    MuiTablePagination: {
      labelRowsPerPage: '每页行数:',
      backIconButtonText: '上一页',
      nextIconButtonText: '下一页',
    }
  }
};

export default function MedicalStaffManagement() {
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch()
  const appDispatch = useAppDispatch()
  const medicalStaffList = useAppSelector((state: RootState) => state.rehab.staff)
  const [open, setOpen] = React.useState(false);
  const [openAddStaff, setOpenAddStaff] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordsVisibility, setPasswordsVisibility] = React.useState<{[id: number]: boolean}>({});
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
    thunkDispatch(fetchStaffs({page: 1, size: 100, id: 0}))
  }, [thunkDispatch]);

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
    console.log(id, value)
    setWillAddStaff((prevInputValues) => ({
      ...prevInputValues,
      [id]: value,
    }))
  };

  const handleSaveAddMedicalStaff = () => {
    thunkDispatch(addStaff({name: willAddStaff.fullName, password: willAddStaff.password, username: willAddStaff.username}))
    setOpenAddStaff(false)
  };

  const handleDeleteMedicalStaff = (id: number) => {
    if (window.confirm('是否确认删除该医护信息？')) {
      (appDispatch as AppDispatch)(deleteStaff({id: id}))
    }

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
    (appDispatch as AppDispatch)(editStaff({ id: willEditStaff.id, name: willEditStaff.fullName, username: willEditStaff.username, password: willEditStaff.password }))
    handleClose()
  }

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
// 切换密码隐藏状态函数
  const handleTogglePasswordVisibility = (id: number) => {
    setPasswordsVisibility((prevPasswordsVisibility) => ({
      ...prevPasswordsVisibility,
      [id]: !prevPasswordsVisibility[id],
    }));
  };

  return (
    <Container>
      <Typography variant="h2" component="h1" sx={{ fontSize: '2.0rem', fontWeight: 'bold', color: '#333'}}>医护管理</Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <FormControl sx={{ m: 1, width: 640}}>
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
        <Tooltip title="添加医护">
            <IconButton
                style={{float: 'right'}}
                aria-label="add"
                onClick={handleAddStaffClickOpen}
            >
              <AddCircleIcon sx={{ fontSize: 54 }} color="secondary"/>
            </IconButton>
          </Tooltip>
        <Dialog open={openAddStaff} onClose={handleAddStaffClickClose}>
            <DialogTitle>添加医护</DialogTitle>
            <DialogContent>
              <Box>
                <StyledDiv>
                  <TextField
                      sx={{ m: 1, minWidth: 120 }} id="username"
                      value={willAddStaff.username}
                      onChange={handleAddMedicalStaff}
                      label="用户名" variant="outlined" size="small"/>
                  <TextField
                      sx={{ m: 1, minWidth: 120 }} id="password"
                      value={willAddStaff.password}
                      onChange={handleAddMedicalStaff}
                      label="密码" variant="outlined" size="small"/>
                  <TextField
                      sx={{ m: 1, minWidth: 120 }} id="fullName"
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
        <TableContainer sx={{ maxHeight: 620}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='center'>名字</TableCell>
                <TableCell align='center'>登录名</TableCell>
                <TableCell align='center' style={{width: 300}}>密码</TableCell>
                <TableCell align='center'>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicalStaffList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((medicalStaff) => (
                  <StyledTableRow key={medicalStaff.id}>
                    <TableCell align='center'>{medicalStaff.fullName}</TableCell>
                    <TableCell align='center'>{medicalStaff.username}</TableCell>
                    <TableCell align='center'>
                      {/*{medicalStaff.password}*/}
                      {passwordsVisibility[medicalStaff.id] ? (
                          medicalStaff.password
                      ) : (
                          '*****   '
                      )}
                      <IconButton
                          onClick={() => handleTogglePasswordVisibility(medicalStaff.id)}
                          size='small'
                      >
                        {passwordsVisibility[medicalStaff.id] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell align='center'>
                      <Tooltip title="修改信息">
                        <IconButton
                            aria-label="edit"
                            color="primary"
                            onClick={() => handleEditRowOpen(medicalStaff.id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="删除">
                        <IconButton
                            aria-label="delete"
                            onClick={() => handleDeleteMedicalStaff(medicalStaff.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
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
          count={medicalStaffList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}/>
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
      </Paper>
    </Container>
  )
}

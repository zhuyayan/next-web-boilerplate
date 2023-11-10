// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  IconButton, InputLabel, MenuItem, Select
} from "@mui/material";
import {
  addStatus,
  exportTaskPressureData, PatientStatus, fetchStatusById,
  PrescriptionRecord,
} from "@/redux/features/rehab/rehab-slice";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {useDispatch, useSelector} from "react-redux";
import React, {ChangeEvent, useState} from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import dayjs, {Dayjs} from "dayjs";
import { useEffect } from 'react';
import {RootState, useAppDispatch, useAppSelector} from "@/redux/store";
import {right} from "@popperjs/core";
import Typography from "@mui/material/Typography";
import SendAndArchiveIcon from "@mui/icons-material/SendAndArchive";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import Tooltip from "@mui/material/Tooltip";
import {SelectChangeEvent} from "@mui/material/Select";


// const StyledTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     color: theme.palette.common.black,
//     backgroundColor: theme.palette.common.white
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14
//   }
// }))
//
// const StyledTableRow = styled(TableRow)<TableRowProps>(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover
//   },
//   // hide last border
//   '&:last-of-type td, &:last-of-type th': {
//     border: 0
//   }
// }))

const PrescriptionTable = (params: {
  record: PrescriptionRecord[],
  status: PatientStatus,
  pid: string,
  task_id: string}) => {
  const appThunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  function handleExport(row: PrescriptionRecord) {
    appThunkDispatch(exportTaskPressureData({pId: Number(params.pid), tId: row.id}))
  }

  // 查看指标弹框
  const [openStatus, setOpenStatus] = React.useState(false);
  const [openBindDevice, setOpenBindDevice] = React.useState(false);

  const [taskid, setTaskid] = useState(0);

  const handleClickOpenStatus = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const taskId = event.currentTarget.dataset.taskId;
    setTaskid(Number(taskId));
    await thunkDispatch(fetchStatusById({ pid: parseInt(params.pid), task_id: Number(taskId) }));
    setOpenStatus(true);
  };
  const handleBindDevice = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const taskId = event.currentTarget.dataset.taskId;
    setTaskid(Number(taskId));
    await thunkDispatch(fetchStatusById({ pid: parseInt(params.pid), task_id: Number(taskId) }));
    setOpenBindDevice(true);
  };

  const handleCloseStatus = () => {
    setOpenStatus(false);
  };
  const handleCloseBindDevice = () => {
    setOpenBindDevice(false);
  };

  const thunkDispatch = useAppDispatch();
  const statusData = useAppSelector(state => state.rehab.patientStatus);

  useEffect(() => {
    if (statusData) {
      setWillAddStatus(statusData);
    }
  }, [statusData, taskid]);

  const [willAddStatus, setWillAddStatus] = React.useState<PatientStatus>({
    pid: 0,
    task_id: 0,
    min_heart_rate: 0,
    max_heart_rate: 0,
    avg_heart_rate: 0,
  })

  // 查看评价弹框
  const [openEvaluate, setOpenEvaluate] = React.useState(false);
  const handleClickOpenEvaluate = () => {
    setOpenEvaluate(true);
  };
  const handleCloseEvaluate = () => {
    setOpenEvaluate(false);
  };
  // const onsetTime = willAddStatus.onset_time !== "" ? dayjs(willAddStatus.onset_time) : null;
  // const nextSunday = dayjs().endOf('week').startOf('day').toDate();
  // const isWeekend = (date: Dayjs) => {
  //   const day = date.day();
  //
  //   return day === 0 || day === 6;
  // };

  //跳转
  const handleClickMove = () => {
    const targetElement = document.getElementById('target-element');
    targetElement?.scrollIntoView({ behavior: 'smooth'});
  };

  const handleAddStatus = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    let processedValue: string | number = value;
    if (["avg_heart_rate", "max_heart_rate", "min_heart_rate"].includes(id)) {
      processedValue = Number(value);
    }
    console.log('handleAddStatus', id, processedValue)
    setWillAddStatus((prevInputValues) => ({
      ...prevInputValues,
      [id]: processedValue,
    }))
  };

  const handleSaveAddStatus = () => {
    appThunkDispatch(addStatus({
      pid: parseInt(params.pid),
      task_id: taskid,
      min_heart_rate: willAddStatus.min_heart_rate,
      max_heart_rate: willAddStatus.max_heart_rate,
      avg_heart_rate: willAddStatus.avg_heart_rate
    }));
    setOpenStatus(false);
  };

  const [heartrate, setHeartRate] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setHeartRate(event.target.value as string);
  };

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 140 }}>
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">状态</TableCell>
                <TableCell>康复开始时间</TableCell>
                <TableCell>康复结束时间</TableCell>
                <TableCell align="center">心率</TableCell>
                <TableCell align="center">评估</TableCell>
                <TableCell align="center">肌力</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {params.record.map(row => (
                // row.prescription_record?.map((historyRow: PrescriptionRecord) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Button
                        style={{
                          backgroundColor:
                            // historyRow.created_at === historyRow.updated_at ? '#f32148' : '#06c426' ,
                            row.state === 'BEGIN' || row.state === 'BEGIN' ? '#f32148' : '#06c426',
                          color: '#ffffff',
                          float: 'right',
                        }}
                      >
                        {row.state === 'BEGIN' || row.state === 'BEGIN' ? '进行中' : '完成'}
                        {/*BEGIN：正常启动
                        N_END ：正常结束
                        H_END ：手动结束
                        PAUSE ：暂停
                        RENEW：恢复 */}
                        {/*{historyRow.created_at === historyRow.updated_at ? '进行中' : '完成'}*/}
                      </Button>
                    </TableCell>
                    <TableCell>{row.created_at}</TableCell>
                    {/*<TableCell>{historyRow.updated_at}</TableCell>*/}
                    <TableCell>{row.created_at === row.updated_at ? ' ' : row.updated_at}</TableCell>
                    <TableCell>
                      <Button style={{backgroundColor: '#2196f3', color: '#ffffff', float: 'left'}} onClick={handleClickOpenStatus} data-task-id={row.id}>手动录入</Button>
                      <Button style={{backgroundColor: '#2196f3', color: '#ffffff', float: 'right'}} onClick={handleBindDevice}>绑定设备</Button>
                    </TableCell>
                    <TableCell align="center">
                      <a href={`/rehab/assessment/${row.pid}/${row.id}/`} target="_blank" rel="noopener noreferrer">
                        <Button style={{backgroundColor: '#2196f3', color: '#ffffff', float: 'right'}}>填写量表</Button>
                      </a>
                    </TableCell>
                    <TableCell align="center">
                      <Button style={{backgroundColor: '#06c426', color: '#ffffff', float: 'right'}} onClick={handleClickMove}>进行肌力评估</Button>
                    </TableCell>
                    {/*<TableCell align='center'>*/}
                    {/*  <Tooltip title="导出">*/}
                    {/*    <IconButton*/}
                    {/*      aria-label="download"*/}
                    {/*      color="primary"*/}
                    {/*      onClick={(event)=>{event.stopPropagation(); handleExport(row);}}>*/}
                    {/*      <DownloadIcon fontSize="small" />*/}
                    {/*    </IconButton>*/}
                    {/*  </Tooltip>*/}
                    {/*</TableCell>*/}
                  </TableRow>
                // ))
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/*查看/填写指标弹框*/}
  <Dialog
    open={openStatus}
    onClose={handleCloseStatus}
    aria-describedby="Status"
  >
    <DialogTitle>{"病人心率数据"}</DialogTitle>
    <DialogContent>
      {/*<TextField*/}
      {/*  label="发病时间"*/}
      {/*  value={willAddStatus.onset_time}*/}
      {/*  onChange={handleAddStatus}*/}
      {/*  fullWidth*/}
      {/*/>*/}
      {/* Add more input fields for other indicators */}
      <Grid container spacing={0}>
        {/*<Grid item xs={6}>*/}
        {/*  <Box sx={{padding: '8px' }}>*/}
        {/*    <Grid container spacing={0} alignItems="center">*/}
        {/*      <Grid item xs={4}>*/}
        {/*        <label htmlFor="input9">发病时间:</label>*/}
        {/*      </Grid>*/}
        {/*      <Grid item xs={8}>*/}
        {/*        <LocalizationProvider dateAdapter={AdapterDayjs}>*/}
        {/*          <DateTimePicker*/}
        {/*            value={onsetTime as any}*/}
        {/*            onChange={(newValue) => {*/}
        {/*              // newValue is the selected date and time object*/}
        {/*              const formattedDate = newValue?.format('YYYY-MM-DD HH:mm:ss') || '';*/}
        {/*              setWillAddStatus((prevStatus) => ({*/}
        {/*                ...prevStatus,*/}
        {/*                onset_time: formattedDate,*/}
        {/*              }));*/}
        {/*            }}*/}
        {/*            defaultValue={nextSunday as any}*/}
        {/*            shouldDisableDate={isWeekend}*/}
        {/*            views={['year', 'month', 'day', 'hours', 'minutes']}*/}
        {/*          />*/}
        {/*        </LocalizationProvider>*/}
        {/*        <TextField*/}
        {/*          id="onset_time"*/}
        {/*          value={willAddStatus.onset_time}*/}
        {/*          onChange={handleAddStatus}*/}
        {/*          size="small"*/}
        {/*          fullWidth*/}
        {/*        />*/}
        {/*      </Grid>*/}
        {/*    </Grid>*/}
        {/*  </Box>*/}
        {/*</Grid>*/}
        {/*<Grid item xs={6}>*/}
        {/*  <Box sx={{padding: '8px' }}>*/}
        {/*    <Grid container spacing={0} alignItems="center">*/}
        {/*      <Grid item xs={4}>*/}
        {/*        <label htmlFor="input10">用药:</label>*/}
        {/*      </Grid>*/}
        {/*      <Grid item xs={8}>*/}
        {/*        <TextField*/}
        {/*          id="medication"*/}
        {/*          value={willAddStatus.medication}*/}
        {/*          onChange={handleAddStatus}*/}
        {/*          size="small"*/}
        {/*          fullWidth*/}
        {/*        />*/}
        {/*      </Grid>*/}
        {/*    </Grid>*/}
        {/*  </Box>*/}
        {/*</Grid>*/}
        {/*<Grid item xs={6}>*/}
        {/*  <Box sx={{padding: '8px' }}>*/}
        {/*    <Grid container spacing={0} alignItems="center">*/}
        {/*      <Grid item xs={4}>*/}
        {/*        <label htmlFor="input11">痉挛状态:</label>*/}
        {/*      </Grid>*/}
        {/*      <Grid item xs={8}>*/}
        {/*        <TextField*/}
        {/*          id="spasm_status"*/}
        {/*          value={willAddStatus.spasm_status}*/}
        {/*          onChange={handleAddStatus}*/}
        {/*          size="small"*/}
        {/*          fullWidth*/}
        {/*        />*/}
        {/*      </Grid>*/}
        {/*    </Grid>*/}
        {/*  </Box>*/}
        {/*</Grid>*/}
        <Grid item xs={6}>
          <Box sx={{padding: '8px' }}>
            <Grid container spacing={0} alignItems="center">
              <Grid item xs={4}>
                <label htmlFor="input9">最小心率:</label>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  id="min_heart_rate"
                  value={willAddStatus.min_heart_rate !== 0 ? willAddStatus.min_heart_rate : statusData.min_heart_rate || ''}
                  onChange={handleAddStatus}
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{padding: '8px' }}>
            <Grid container spacing={0} alignItems="center">
              <Grid item xs={4}>
                <label htmlFor="input9">最大心率:</label>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  id="max_heart_rate"
                  value={willAddStatus.max_heart_rate !== 0 ? willAddStatus.max_heart_rate : statusData.max_heart_rate || ''}
                  onChange={handleAddStatus}
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{padding: '8px' }}>
            <Grid container spacing={0} alignItems="center">
              <Grid item xs={4}>
                <label htmlFor="input9">平均心率:</label>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  id="avg_heart_rate"
                  value={willAddStatus.avg_heart_rate !== 0 ? willAddStatus.avg_heart_rate : statusData.avg_heart_rate || ''}
                  onChange={handleAddStatus}
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleSaveAddStatus}>保存</Button>
      <Button onClick={handleCloseStatus}>关闭</Button>
    </DialogActions>
  </Dialog>
      <Dialog
          open={openBindDevice}
          onClose={handleCloseBindDevice}
          aria-describedby="BindDevice"
      >
        <DialogTitle>{"绑定心率设备"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Grid container spacing={0} alignItems="center">
                <Grid item xs={4}>
                  <label htmlFor="input9">选择心率手环:</label>
                </Grid>
                <Grid item xs={4}>
                  <Box>
                    <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                      <InputLabel id="device">心率设备</InputLabel>
                      <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={heartrate}
                          label="HeartRate"
                          onChange={handleChange}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Tooltip title="开始监测">
                    <IconButton
                        aria-label="edit"
                        color="primary"
                        // onClick={(event)=>{event.stopPropagation(); handleClickOpen(row);}}
                    >
                      <PlayCircleOutlineIcon sx={{ fontSize: 30 }} />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{padding: '8px' }}>
                <Grid container spacing={0} alignItems="center">
                  <Grid item xs={4}>
                    <label htmlFor="input9">最大心率:</label>
                  </Grid>
                  <Grid item xs={8}>

                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{padding: '8px' }}>
                <Grid container spacing={0} alignItems="center">
                  <Grid item xs={4}>
                    <label htmlFor="input9">平均心率:</label>
                  </Grid>
                  <Grid item xs={8}>

                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBindDevice}>保存</Button>
          <Button onClick={handleCloseBindDevice}>关闭</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
export default PrescriptionTable
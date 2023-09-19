// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import { styled } from '@mui/material/styles'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableRow, { TableRowProps } from '@mui/material/TableRow'
import TableCell, { TableCellProps, tableCellClasses } from '@mui/material/TableCell'
import {Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, IconButton} from "@mui/material";
import {
  addStatus,
  exportTaskPressureData, PatientStatus, Prescription,
  PrescriptionRecord, StatusFormProps,
} from "@/redux/features/rehab/rehab-slice";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {useDispatch} from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import React, {ChangeEvent} from "react";
import DownloadIcon from "@mui/icons-material/Download";
import {string} from "postcss-selector-parser";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import dayjs, {Dayjs} from "dayjs";


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

const PrescriptionTable = (params: {record: Prescription[],status:StatusFormProps[], pid: string}) => {
  const appThunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  function handleExport(row: PrescriptionRecord) {
    appThunkDispatch(exportTaskPressureData({pId: Number(params.pid), tId: row.id}))
  }

  // 查看指标弹框
  const [openStatus, setOpenStatus] = React.useState(false);
  const handleClickOpenStatus = () => {
    setOpenStatus(true);
  };
  const handleCloseStatus = () => {
    setOpenStatus(false);
  };


  const [willAddStatus, setWillAddStatus] = React.useState<PatientStatus>({
    pid:0,
    onset_time : "",
    medication : "",
    spasm_status : "",
    min_heart_rate : 0,
    max_heart_rate : 0,
    avg_heart_rate : 0,
  })

  // 查看评价弹框
  const [openEvaluate, setOpenEvaluate] = React.useState(false);
  const handleClickOpenEvaluate = () => {
    setOpenEvaluate(true);
  };
  const handleCloseEvaluate = () => {
    setOpenEvaluate(false);
  };
  const onsetTime = willAddStatus.onset_time !== "" ? dayjs(willAddStatus.onset_time) : null;
  const nextSunday = dayjs().endOf('week').startOf('day').toDate();
  const isWeekend = (date: Dayjs) => {
    const day = date.day();

    return day === 0 || day === 6;
  };

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
      onset_time: willAddStatus.onset_time,
      medication: willAddStatus.medication,
      spasm_status: willAddStatus.spasm_status,
      min_heart_rate: willAddStatus.min_heart_rate,
      max_heart_rate: willAddStatus.max_heart_rate,
      avg_heart_rate: willAddStatus.avg_heart_rate
    }));
    setOpenStatus(false);
  }

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 280 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center">状态</TableCell>
                <TableCell>康复开始时间</TableCell>
                <TableCell>康复结束时间</TableCell>
                <TableCell align="center">指标</TableCell>
                <TableCell align="center">量表及评价</TableCell>
                <TableCell align="center">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {params.record.map(row => (
                row.prescription_record?.map((historyRow: PrescriptionRecord) => (
                  <TableRow key={historyRow.id}>
                    <TableCell>
                      <Button
                        style={{
                          backgroundColor:
                            // historyRow.created_at === historyRow.updated_at ? '#f32148' : '#06c426' ,
                            historyRow.state === 'N_END' || historyRow.state === 'H_END' ? '#06c426' : '#f32148',
                          color: '#ffffff',
                          float: 'right',
                        }}
                      >
                        {historyRow.state === 'N_END' || historyRow.state === 'H_END' ? '完成' : '进行中'}
                        {/*BEGIN：正常启动
                        N_END ：正常结束
                        H_END ：手动结束
                        PAUSE ：暂停
                        RENEW：恢复 */}
                        {/*{historyRow.created_at === historyRow.updated_at ? '进行中' : '完成'}*/}
                      </Button>
                    </TableCell>
                    <TableCell>{historyRow.created_at}</TableCell>
                    {/*<TableCell>{historyRow.updated_at}</TableCell>*/}
                    <TableCell>{historyRow.created_at === historyRow.updated_at ? ' ' : historyRow.updated_at}</TableCell>
                    <TableCell>
                      <Button style={{backgroundColor: '#2196f3', color: '#ffffff', float: 'right'}} onClick={handleClickOpenStatus}>填写指标</Button>
                    </TableCell>
                    <TableCell align="center">
                      <a href={`/rehab/assessment/${historyRow.id}`} passHref target="_blank" rel="noopener noreferrer">
                        <Button style={{backgroundColor: '#2196f3', color: '#ffffff', float: 'right'}}>填写量表</Button>
                      </a>
                    </TableCell>
                    <TableCell align="center">
                      <Button style={{backgroundColor: '#06c426', color: '#ffffff', float: 'right'}} onClick={handleClickMove}>查看直方图</Button>
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
                ))
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
    <DialogTitle>{"病人各项指标"}</DialogTitle>
    <DialogContent>
      {params.status.length > 0 ? (
        <DialogContentText id="Status">
          <Table sx={{ minWidth: 500 }} aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>发病时间</TableCell>
                {/*<TableCell align="right">用药</TableCell>*/}
                <TableCell align="right">痉挛状态</TableCell>
                <TableCell align="right">最小心率</TableCell>
                <TableCell align="right">最大心率</TableCell>
                <TableCell align="right">平均心率</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {params.status.map(row => (
                <TableRow
                  key={row.onsetTime}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.onsetTime}
                  </TableCell>
                  {/*<TableCell align="right">{row.medication}</TableCell>*/}
                  <TableCell align="right">{row.spasmStatus}</TableCell>
                  <TableCell align="right">{row.minHeartRate}</TableCell>
                  <TableCell align="right">{row.maxHeartRate}</TableCell>
                  <TableCell align="right">{row.avgHeartRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContentText>
      ) : (
        <div>
          {/*<TextField*/}
          {/*  label="发病时间"*/}
          {/*  value={willAddStatus.onset_time}*/}
          {/*  onChange={handleAddStatus}*/}
          {/*  fullWidth*/}
          {/*/>*/}
          {/* Add more input fields for other indicators */}
          <Grid container spacing={0}>
            <Grid item xs={6}>
              <Box sx={{padding: '8px' }}>
                <Grid container spacing={0} alignItems="center">
                  <Grid item xs={4}>
                    <label htmlFor="input9">发病时间:</label>
                  </Grid>
                  <Grid item xs={8}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        value={onsetTime as any}
                        onChange={(newValue) => {
                          // newValue is the selected date and time object
                          const formattedDate = newValue?.format('YYYY-MM-DD HH:mm:ss') || '';
                          setWillAddStatus((prevStatus) => ({
                            ...prevStatus,
                            onset_time: formattedDate,
                          }));
                        }}
                        defaultValue={nextSunday as any}
                        shouldDisableDate={isWeekend}
                        views={['year', 'month', 'day', 'hours', 'minutes']}
                      />
                    </LocalizationProvider>
                    {/*<TextField*/}
                    {/*  id="onset_time"*/}
                    {/*  value={willAddStatus.onset_time}*/}
                    {/*  onChange={handleAddStatus}*/}
                    {/*  size="small"*/}
                    {/*  fullWidth*/}
                    {/*/>*/}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
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
            <Grid item xs={6}>
              <Box sx={{padding: '8px' }}>
                <Grid container spacing={0} alignItems="center">
                  <Grid item xs={4}>
                    <label htmlFor="input11">痉挛状态:</label>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      id="spasm_status"
                      value={willAddStatus.spasm_status}
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
                    <label htmlFor="input9">最小心率:</label>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      id="min_heart_rate"
                      value={willAddStatus.min_heart_rate}
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
                      value={willAddStatus.max_heart_rate}
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
                      value={willAddStatus.avg_heart_rate}
                      onChange={handleAddStatus}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>

        </div>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={handleSaveAddStatus}>保存指标</Button>
      <Button onClick={handleCloseStatus}>关闭</Button>
    </DialogActions>
  </Dialog>
    </>
  )
}
export default PrescriptionTable
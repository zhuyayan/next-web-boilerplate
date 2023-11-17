"use client";
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Prescription from "@/components/rehab/prescription/Prescription";
import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import styled from "styled-components";
import {SyntheticEvent, useEffect, useRef, useState} from "react";
import {RootState, useAppSelector} from "@/redux/store";
import {AnyAction} from "redux";
import {useDispatch} from "react-redux";
import {
  fetchPatientStatisticsById,
  fetchPrescriptionByPId,
  AddPrescriptionItem,
  fetchEvaluationById,
  fetchStatusById, useGetBlueToothEquipmentsQuery, fetchStatisticsById, RealTimeTrainData
} from "@/redux/features/rehab/rehab-slice";
import {
  fetchPatientById,
  fetchPrescriptionRecordById,
  useGetOnlineEquipmentsQuery,
  useGetTrainMessageQuery
} from "@/redux/features/rehab/rehab-slice";

import {IconButton, TableContainer} from "@mui/material";

import TimerIcon from '@mui/icons-material/Timer';
import Tooltip from "@mui/material/Tooltip";
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';

import { Title } from '@/components/rehab/styles';
import {ThunkDispatch} from "redux-thunk";
import CardMedia from "@mui/material/CardMedia";
import Link from "next/link";
import {useForm} from "react-hook-form";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {
  getStrokeEvents,
  postStrokeEvent,
  putStrokeEvent,
  StrokeEvent
} from "@/redux/features/rehab/rehab-patient-slice";
import SaveAsIcon from '@mui/icons-material/SaveAs';

//双击编辑组件
type EditableTextProps = {
  initialText: string | null;
  handleTextChange: (text: string) => void;
};

const EditableText: React.FC<EditableTextProps> = ({ initialText, handleTextChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText === null ? "" : initialText);
  const inputRef = useRef<HTMLInputElement>(null!);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    handleTextChange(text);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  useEffect(()=>{
    setText(initialText || "")
  },[initialText])

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
      <>
        {isEditing || text === "" ? (
            <TextField
                inputRef={inputRef}
                autoFocus
                value={text}
                onBlur={handleBlur}
                onChange={handleChange}
                size="small"
            />
        ) : (
            <Typography onDoubleClick={handleDoubleClick}>{text}</Typography>
        )}
      </>
  );
};

type EditableDateProps = {
  initialDateString: string;
  handleWillDateChange: (text: string) => void;
};

const EditableDate: React.FC<EditableDateProps> = ({ initialDateString, handleWillDateChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDateString !== "" ? new Date(initialDateString) : null);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setIsEditing(false);
    // handleWillDateChange(date.toString());
  };

  useEffect(() => {
      const result: string = selectedDate ? selectedDate.toISOString().split('T')[0].concat(' ').concat(initialDateString.split('T')[1].split('Z')[0]) : "";
      handleWillDateChange(result);
  }, [selectedDate]);

  useEffect(() => {
    setSelectedDate(initialDateString !== "" ? new Date(initialDateString) : null);
  }, [initialDateString]);

  return (
      <div>
        {isEditing || initialDateString === "" ? (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  //renderInput={(params) => <TextField {...params.inputProps} autoFocus />}
              />
            </LocalizationProvider>
        ) : (
            <Typography onDoubleClick={handleDoubleClick}>{selectedDate ? selectedDate.toISOString().split('T')[0] : initialDateString}</Typography>
        )}
      </div>
  );
};

import {getFormFields} from "@/redux/features/rehab/rehab-formFields-slice";
import PrescriptionLine from "@/components/rehab/prescription/PrescriptionLine";


const StatisticsCard = styled.div`
  height: 160px;
  padding: 10px;
`;

const TableWrapper = styled.div`
  border: 1px solid #ccc; /* 设置边框样式，可以根据需要进行调整 */
  margin: 16px;
`;

export default function MUITable({ params }: { params: { id: string ,task_id:string, pid:string,trainData:RealTimeTrainData[]} }) {
  const rehabPatient = useAppSelector((state: RootState) => state.rehab.rehabPatient);
  const prescription = useAppSelector((state: RootState) => state.rehab.prescription);
  const status = useAppSelector((state: RootState) => state.rehab.patientStatus);
  const statistics = useAppSelector((state:RootState) => state.rehab.statistics);
  const {data: trainData, error: trainError, isLoading: trainLoading} = useGetTrainMessageQuery("redux");
  const {data: onlineData, isLoading: onlineLoading, error: onlineError} = useGetOnlineEquipmentsQuery("redux");
  const { data: blueToothData, isLoading: blueToothLoading, error: blueToothError } = useGetBlueToothEquipmentsQuery("redux");
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  interface HeartBeat {
    topic: string;
    content: string;
  }
  const [numbers, setNumbers] = useState<number[]>(new Array(120).fill(0));
  const addNumber = (newNumber: number) => {
    setNumbers(prevNumbers => {
      // 添加新数字到数组开头
      const updatedNumbers = [newNumber, ...prevNumbers];
      // 如果数组长度超过120，去掉最旧的数字（数组末尾的数字）
      if (updatedNumbers.length > 120) {
        updatedNumbers.pop(); // 去掉数组末尾的元素
      }
      return updatedNumbers;
    });
  };
  useEffect(()=>{
    blueToothData?.map((item: HeartBeat)=>{
      console.log("blueToothData item", item)
      addNumber(parseInt(item.content));
    })
    // addNumber(parseInt(blueToothData?.content));
    console.log("blueToothData", blueToothData)
    console.log("numbers", numbers)
  }, [blueToothData])

  const { register: AddPrescriptionItemRegister, formState: { errors: AddPrescriptionItemErrors }, clearErrors: AddPrescriptionItemClearErrors, trigger:AddPrescriptionItemTrigger } = useForm<AddPrescriptionItem>({mode: 'onBlur' });

  const strokeEventResponse = useAppSelector((state: RootState) => state.patient.strokeEventData);
  const [lastEvent, setLastEvent] = React.useState<StrokeEvent | null>(null);
  const [willEditStrokeEvent, setWillEditStrokeEvent] = React.useState<StrokeEvent | null>(null);
  useEffect(() => {
    thunkDispatch(fetchPrescriptionByPId({pid: parseInt(params.id)}))
    thunkDispatch(fetchEvaluationById({task_id: parseInt(params.task_id)}))
    thunkDispatch(fetchStatusById({task_id: parseInt(params.task_id),pid:parseInt(params.pid)}))
    thunkDispatch(fetchPatientById({id: parseInt(params.id)}))
    thunkDispatch(fetchPrescriptionRecordById({id: parseInt(params.id)}))
    thunkDispatch(fetchPatientStatisticsById({id: parseInt(params.id)}))
    thunkDispatch(fetchStatisticsById({pid: parseInt(params.id)}))
    thunkDispatch(getStrokeEvents({pid: parseInt(params.id)}))
    thunkDispatch(getFormFields({result_owner_id: parseInt(params.id)}))
    console.log("patient id: ", params.id)
    console.log("patient pid: ", params.pid)
    console.log("patient task_id: ", params.task_id)
  },[params.id, thunkDispatch])

  useEffect(() => {
    console.log("strokeEventResponse changed", strokeEventResponse)
    if (strokeEventResponse?.length > 0) {
      setLastEvent(strokeEventResponse[0]);
      setWillEditStrokeEvent(strokeEventResponse[0]);
    }
    else {
      setLastEvent({
        e_id: 0,
        stroke_type: "",
        stroke_level: "",
        onset_date: "2000-01-01T00:00:00Z",
        lesion_location: "没有数据",
        nihss_score: 0,
        medical_history: "没有数据",
        pid: parseInt(params.id)
      });
      setWillEditStrokeEvent({
        e_id: 0,
        stroke_type: "",
        stroke_level: "",
        onset_date: "2000-01-01 00:00:00",
        lesion_location: "没有数据",
        nihss_score: 0,
        medical_history: "没有数据",
        pid: parseInt(params.id)
      })
    }
    console.log("NODATA")
  },[strokeEventResponse])

  const handleLesionLocationChange = (text: string) => {
    setWillEditStrokeEvent((prevState: StrokeEvent | null) => {
      if (prevState === null) {
        return null;
      }
      // 如果 prevState 不是 null，则更新状态
      return { ...prevState, lesion_location: text };
    });
  };


  const handleOnsetDataChange = (text: string) => {
    setWillEditStrokeEvent((prevState: StrokeEvent | null) => {
      if (!prevState) {
        // 处理 prevState 为 null 的情况
        return null; // 或者返回合适的默认值
      }
      return { ...prevState, onset_date: text };
    });
  };

  const handleNihssScoreChange = (text: string) => {
    setWillEditStrokeEvent((prevState: StrokeEvent | null) => {
      if (!prevState) {
        // 处理 prevState 为 null 的情况
        return null; // 或者返回合适的默认值
      }
      return { ...prevState, nihss_score: parseInt(text, 10) || 0 };
    });
  };

  const handleMedicalHistoryChange = (text: string) => {
    setWillEditStrokeEvent((prevState: StrokeEvent | null) => {
      if (!prevState) {
        // 处理 prevState 为 null 的情况
        return null; // 或者返回合适的默认值
      }
      return { ...prevState, medical_history: text };
    });
  };


  //提交修改
  const handleEditStrokeEvent = () => {
    if (strokeEventResponse?.length > 0) {
      thunkDispatch(putStrokeEvent({ strokeEvent: willEditStrokeEvent!}))
    }
    else {
      thunkDispatch(postStrokeEvent({ strokeEvent: willEditStrokeEvent!}))
    }
  };

  const [stretchValue, setStretchValue] = useState<string>('1')

  const handleStretchChange = (event: SyntheticEvent, newValue: string) => {
    setStretchValue(newValue)
  }
  const [bendValue, setBendValue] = useState<string>('1')

  const handleBendChange = (event: SyntheticEvent, newValue: string) => {
    setBendValue(newValue)
  }

  const submissionResponseData = useAppSelector((state: RootState) => state.formField.submissionData);

  return (
    <>
      <Container>
        <Box sx={{marginBottom:5}}>
          <Grid container spacing={8}>
            <Grid item xs={12} md={8} sm={10} lg={6} xl={4}>
              <div>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Title >康复管理</Title>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container justifyContent="flex-end">
                      <Tooltip title="返回病人列表">
                        <Link href={`/rehab/patient`} passHref>
                          <IconButton
                            aria-label="back"
                            color="primary"
                          >
                            <AssignmentReturnIcon fontSize="medium" />
                          </IconButton>
                        </Link>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid container item xs={12} md={12} spacing={2}>
              <Grid item xs={6} md={6}>
                <Card sx={{ backgroundColor: 'rgba(191,215,237,0.8)', height: 160}} >
                  <CardContent>
                    <br />
                    <Grid container spacing={2}>
                      <Grid item xs={5}>
                        <Typography component="div">
                          姓名：{rehabPatient.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={3.5}>
                        <Typography component="div">
                          年龄：{rehabPatient.age} 岁
                        </Typography>
                      </Grid>
                      <Grid item xs={3.5}>
                        <Typography component="div">
                          性别：{rehabPatient.genderLabel}
                        </Typography>
                      </Grid>
                    </Grid>
                    <br />
                    <Divider />
                    <br />
                    <Grid container spacing={2}>
                      <Grid item xs={5}>
                        <Typography component="div">
                          ID：{rehabPatient.i18d}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} md={2}>
                <StatisticsCard style={{ backgroundColor: 'rgba(88,133,175,0.8)' }}>
                  <TabContext value={bendValue}>
                    <TabList onChange={handleBendChange} aria-label='card navigation example'>
                      <Tab value='1' label='时长' />
                      <Tab value='2' label='次数' />
                    </TabList>
                    <CardMedia
                      style={{
                        position: 'absolute',
                        width: 50, // 图片的宽度
                        height: 50, // 图片的高度
                      }}
                      component="img"
                      src="/images/fist.png"
                      alt="Image"
                    />
                    <CardContent  sx={{ textAlign: 'right' }}>
                      <TabPanel value='1' sx={{ p: 0 }}>
                        <Typography variant="h4" color="primary" style={{display:'inline-block'}}>
                          {statistics.bending_duration}
                        </Typography>
                        <Divider />
                        <Typography variant="body2" color="text.secondary">
                          弯曲总时长 / 分钟
                        </Typography>
                      </TabPanel>
                      <TabPanel value='2' sx={{ p: 0 }}>
                        <Typography variant="h4" color="primary" style={{ textAlign: 'right' }}>
                          {statistics.bending_count}
                        </Typography>
                        <Divider />
                        <Typography variant="body2" color="text.secondary" style={{ textAlign: 'right' }}>
                          弯曲总次数 / 次
                        </Typography>
                      </TabPanel>
                    </CardContent>
                  </TabContext>
                </StatisticsCard>
              </Grid>
              <Grid item xs={6} md={2} alignItems="center" justifyContent="center">
                <StatisticsCard style={{ backgroundColor: 'rgba(96,163,217,0.8)'  }}>
                  <TabContext value={stretchValue}>
                    <TabList onChange={handleStretchChange} aria-label='card navigation example'>
                      <Tab value='1' label='时长' />
                      <Tab value='2' label='次数' />
                    </TabList>
                    <CardMedia
                      style={{
                        position: 'absolute',
                        width: 50, // 图片的宽度
                        height: 50, // 图片的高度
                      }}
                      component="img"
                      src="/images/hand.png"
                      alt="Image"
                    />
                    <CardContent  sx={{ textAlign: 'right' }}>
                      <TabPanel value='1' sx={{ p: 0 }}>
                        <Typography variant="h4" color="primary" style={{display:'inline-block'}}>
                          {statistics.stretching_duration}
                        </Typography>
                        <Divider />
                        <Typography variant="body2" color="text.secondary">
                          伸展总时长 / 分钟
                        </Typography>
                      </TabPanel>
                      <TabPanel value='2' sx={{ p: 0 }}>
                        <Typography variant="h4" color="primary" style={{ textAlign: 'right' }}>
                          {statistics.stretching_count}
                        </Typography>
                        <Divider />
                        <Typography variant="body2" color="text.secondary" style={{ textAlign: 'right' }}>
                          伸展总次数 / 次
                        </Typography>
                      </TabPanel>
                    </CardContent>
                  </TabContext>
                </StatisticsCard>
              </Grid>
              <Grid item xs={6} md={2}>
                <StatisticsCard style={{ backgroundColor: 'rgba(0,116,183,0.8)' }}>
                  <Typography sx={{ float:"left" }}>
                    <TimerIcon  sx={{ color: '#7442f6', fontSize: 50 }}/>
                  </Typography>
                  <CardContent sx={{ textAlign: 'right' }}>
                    <Typography variant="h3" color="primary" sx={{display:'inline-block'}}>
                      {statistics.total_rehab_duration}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      总训练天数
                    </Typography>
                    <Divider sx={{padding:'5px'}}/>
                    <Typography sx={{ fontSize: 10 }} color="text.secondary">
                      时间 / 天
                    </Typography>
                  </CardContent>
                </StatisticsCard>
              </Grid>
            </Grid>

            <Grid item xs={12} md={12}>
              <Card>
                <CardHeader style={{display:'inline-block',height: '28px'}} title='病人详细信息' titleTypographyProps={{ variant: 'h6' }}></CardHeader>
                <Tooltip title="保存修改">
                  <IconButton
                      style={{float: 'right'}}
                      onClick={handleEditStrokeEvent}>
                    <SaveAsIcon color="primary"/>
                  </IconButton>
                </Tooltip>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={6}>
                      <Box sx={{padding: '8px' }}>
                        <Grid container spacing={0} alignItems="center" justify-items="center">
                          <Grid item xs={4} justifyContent="center" style={{ display: 'flex', alignItems: 'center', height: '28px' }}>
                            <label htmlFor="input9">病变部位:</label>
                          </Grid>
                          <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', height: '28px' }}>
                            <EditableText initialText={lastEvent?.lesion_location ?? "没有数据"} handleTextChange={handleLesionLocationChange}/>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid  item xs={6} md={6}>
                      <Box sx={{padding: '8px' }}>
                        <Grid container spacing={0} alignItems="center">
                          <Grid item xs={4} justifyContent="center" style={{ display: 'flex', alignItems: 'center', height: '28px' }}>
                            <label htmlFor="input9">发病日期:</label>
                          </Grid>
                          <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', height: '28px' }}>
                            <EditableDate initialDateString={lastEvent?.onset_date ?? "2000-01-01T00:00:00Z"} handleWillDateChange={handleOnsetDataChange}/>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                  <Divider sx={{padding: '5px'}}/>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={6}>
                      <Box sx={{padding: '8px' }}>
                        <Grid container spacing={0} alignItems="center" justify-items="center">
                          <Grid item xs={4} justifyContent="center" style={{ display: 'flex', alignItems: 'center', height: '26px' }}>
                            <label htmlFor="input9">BIHSS评分:</label>
                          </Grid>
                          <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', height: '26px' }}>
                            <EditableText initialText={lastEvent?.nihss_score.toString() ?? "没有数据"} handleTextChange={handleNihssScoreChange}/>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid  item xs={6} md={6}>
                      <Box sx={{padding: '8px' }}>
                        <Grid container spacing={0} alignItems="center" justify-items="center">
                          <Grid item xs={4} justifyContent="center" style={{ display: 'flex', alignItems: 'center', height: '26px' }}>
                            <label htmlFor="input9">诊断:</label>
                          </Grid>
                          <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', height: '26px' }}>
                            <EditableText initialText={lastEvent?.medical_history ?? "没有数据"} handleTextChange={handleMedicalHistoryChange}/>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={12}>
              <Card>
                <CardHeader style={{display:'inline-block'}} title='评估记录' titleTypographyProps={{ variant: 'h5' }}></CardHeader>
                <a href={`/rehab/assessment/${rehabPatient.id}/0/`} target="_blank" rel="noopener noreferrer">
                  <Tooltip title="新建评估">
                    <IconButton
                        style={{float: 'right'}}
                        aria-label="add"
                    >
                      <AddCircleIcon sx={{ fontSize: 48 }} color="primary"/>
                    </IconButton>
                  </Tooltip>
                </a>
                <Card>
                  <TableWrapper>
                    <TableContainer sx={{ maxHeight: 140 }}>
                      <Table stickyHeader aria-label="sticky table" size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ borderLeft: '1px solid #ccc', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }} align="center">量表填写时间</TableCell>
                            <TableCell style={{ borderLeft: '1px solid #ccc', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }} align="center">量表及评价</TableCell>
                            {/*<TableCell style={{ borderLeft: '1px solid #ccc', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }} align="center">评估完成率</TableCell>*/}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {/* 表格内容 */}
                          {submissionResponseData && submissionResponseData.map(field => (
                            <TableRow key={field.owner_id}>
                          {/*    <TableRow>*/}
                            <TableCell style={{ borderLeft: '1px solid #ccc' }} align="center">
                            <Typography variant="body2" color="text.secondary">
                          {field.assessment_time}
                            </Typography>
                            </TableCell>
                            <TableCell style={{ borderLeft: '1px solid #ccc' }} align="center">
                              <a href={`/rehab/assessment/${params.id}/${field.owner_id}/`} target="_blank" rel="noopener noreferrer">
                                <Button style={{backgroundColor: '#2196f3', color: '#ffffff'}}>查看量表</Button>
                              </a>
                            </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </TableWrapper>
                </Card>
              </Card>
            </Grid>

            {/*处方*/}
            <Grid item xs={12} md={12}>
              <Card sx={{ padding: '2px' }}>
                <div>
                  <CardHeader style={{display:'inline-block'}} title='康复仪训练报告' titleTypographyProps={{ variant: 'h5' }} />
                </div>
                <Divider />
                <Prescription
                  id={params.id}
                  PId={params.pid}
                  task_id={params.task_id}
                  prescription={prescription}
                  status={status}
                  trainData={trainData || []}
                  onlineEquipment={onlineData || []}
                  heartBeats={numbers || []}
                  balloonPrescription={[]}
                />
              </Card>
            </Grid>
            <br/>
            {/*压力数据折线图*/}
            <Grid item xs={6} md={5.5}>
              <Card sx={{ height: 365 ,padding: '10px'}}>
                <CardHeader title='实时压力数据折线图' titleTypographyProps={{ variant: 'h6' }} />
                {
                  trainLoading ? <></> : <PrescriptionLine trainData={trainData || []}></PrescriptionLine>
                }
              </Card>
            </Grid>
          </Grid>
          <br/>
        </Box>
        <br/>
      </Container>
    </>
  )
}

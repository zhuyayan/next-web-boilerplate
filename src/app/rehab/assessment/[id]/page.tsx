"use client";
import {
  Container,
  IconButton, Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { Title } from '@/components/rehab/styles';
import { Button, FormControl, Typography } from '@mui/material';
import React, {useEffect, useState} from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Grid from '@mui/material/Grid';
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Card } from '@mui/material';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import Tooltip from "@mui/material/Tooltip";
import {
  addEvaluation, EvaluateFormProps
} from "@/redux/features/rehab/rehab-slice";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {useDispatch} from "react-redux";
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useCallback } from 'react';
import {RootState, useAppDispatch, useAppSelector} from "@/redux/store";
import {
  Assessment,
  AssessmentLevel,
  getAssessment, postAssessment,
  setFuglMeyerScores
} from "@/redux/features/rehab/rehab-assessment-slice";
import styled from "styled-components";
import {getSuggestion, postSuggestion} from "@/redux/features/rehab/rehab-suggestion-slice";
import {CommonEvaluation, getEvaluation} from "@/redux/features/rehab/rehab-evaluation-slice";
import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {formField, getFormFields, option} from "@/redux/features/rehab/rehab-formFields-slice";


export default function FuglMeyerAssessment( { params }: { params: { id: string } } ) {
  const [selectedAssessment, setSelectedAssessment] = useState<string>(''); // 用于存储用户选择的评定量表
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch()
  const [components, setComponents] = useState<JSX.Element[]>([]);
  const [inputValue, setInputValue] = useState('');
  const appDispatch = useAppDispatch()
  const assessmentResponseData = useAppSelector((state: RootState) => state.assessment.assessmentData);
  const formFieldsRespomseData = useAppSelector((state: RootState) => state.formField.formFieldsData);
  const suggestionResponseData = useAppSelector((state: RootState) => state.suggestion.suggestionData);
  const [suggestionText, setSuggestionText] = useState('')
  const evaluationResponseData = useAppSelector((state: RootState) => state.evaluation.evaluationData);
  const [isModified, setIsModified] = useState(false);
  const fuglMeyerScores = useAppSelector((state: RootState) => state.assessment.fuglMeyerScores);
  useEffect(()=>{
    console.log("params->TaskID", params.id)
    thunkDispatch(getAssessment({task_id: parseInt(params.id)}))
    thunkDispatch(getSuggestion({task_id: parseInt(params.id)}))
    thunkDispatch(getEvaluation({task_id: parseInt(params.id)}))
    thunkDispatch(getFormFields())
  },[params.id,thunkDispatch])

  const handleAddComponent = useCallback(() => {
    if (inputValue.trim() !== '') {
      const newComponent = (
          <Grid item xs={3}>
            <Box sx={{ padding: '8px' }}>
              <Grid container spacing={0} alignItems="center">
                <Grid item xs={4}>
                  <label htmlFor={inputValue}>{inputValue}:</label>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                      name={inputValue}
                      value=""
                      //需要有内容变化函数
                      size="small"
                      fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
      );

      setComponents((prevComponents) => [...prevComponents, newComponent]);
      setInputValue('');
    }
  }, [inputValue]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }, []);


  // 处理选择量表的函数
  const handleAssessmentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedAssessment(event.target.value as string);
  };

  // 处理提交选择的函数
  const handleSubmit = () => {
    // 在这里处理提交选择的逻辑，例如导航到相关页面 addAssessment
    console.log('用户选择的评定量表:', selectedAssessment);
    thunkDispatch(postAssessment({task_id: parseInt(params.id), selectedRecord: fuglMeyerScores}))
  };

  // 医生评价表单
  const [evaluateFormData, setEvaluateFormData] = React.useState<EvaluateFormProps>({
    tolerance: '',
    motionReview: '',
    spasmReview: '',
    muscleTone: '',
    acuteState: '',
    neuroJudgment: '',
    motionInjury: '',
  });

  const handleEvaluationFormDataFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEvaluateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeMediaStrokeLevel = (event: SelectChangeEvent) => {
    const {value} = event.target;
    console.log("value: ", value)
    console.log("event.target.value", event.target.value)
    setEvaluateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // setMediaStrokeLevel(event.target.value);
  };

  const selectedStyle = {
    height: '40px',
    margin: '0 16px 0 16px',
    borderRadius: '50px',
    border: '2px solid #F3F4F6',
    backgroundColor: '#0ED145',
    color: '#ffffff'
  };

  const notSelectedStyle = {
    height: '40px',
    margin: '0 16px 0 16px',
    borderRadius: '50px',
    border: '2px solid #F3F4F6',
    backgroundColor: '#66CBF8',
    color: '#ffffff'
  };

  //自定义量表

  const [openScale, setOpenScale] = useState(false);
  const [openEvaluate, setOpenEvaluate] = useState(false);
  const handleEditScale = () => {
    setOpenScale(true);
  };
  const handleCloseScale = () => {
    setOpenScale(false);
  };

  //自定义评价内容
  const handleEditEvaluate = () => {
    setOpenEvaluate(true);
  };
  const handleCloseEvaluate = () => {
    setOpenEvaluate(false);
  };

  const handleSaveEvaluate = () => {
    thunkDispatch(addEvaluation({
      acute_state: evaluateFormData.acuteState,
      motion_injury: evaluateFormData.motionInjury,
      motion_review: evaluateFormData.motionReview,
      muscle_tone: evaluateFormData.muscleTone,
      neuro_judgment: evaluateFormData.neuroJudgment,
      pid: parseInt(params.PId),
      rehab_session_id: 0,
      spasm_review: evaluateFormData.spasmReview,
      tolerance: evaluateFormData.tolerance,
    }))
    // setOpenAddStatus(false)
  };

  //保存医生建议
  const handleSaveSuggestion = () => {
    thunkDispatch(postSuggestion({task_id: parseInt(params.id), suggestion_id: suggestionResponseData?.suggestion_id || 1, suggestion_text: suggestionText}))
  };

  const [showEvaluate1, setShowEvaluate1] = useState(true);
  const [showEvaluate2, setShowEvaluate2] = useState(true);
  const [showEvaluate3, setShowEvaluate3] = useState(true);
  const [showEvaluate4, setShowEvaluate4] = useState(true);
  const [showEvaluate5, setShowEvaluate5] = useState(true);
  const [showEvaluate6, setShowEvaluate6] = useState(true);
  const [showEvaluate7, setShowEvaluate7] = useState(true);

  function handleFuglMeyerAssessmentChange(id: number, newValue: string | undefined | null) {
    thunkDispatch(setFuglMeyerScores({id, newValue}));
  }

  const StyledTableCell = styled(TableCell)`
    background-color: #f0f0f0;
    border-left: 1px solid #ccc;
  `;

  const TableWrapper = styled.div`
  border: 1px solid #ccc; /* 设置边框样式，可以根据需要进行调整 */
  margin: 16px;
`;

  const [degrees, setDegrees] = useState({
    leftThumbMP: '',
    rightThumbMP: '',
    leftThumbIP: '',
    rightThumbIP: '',
    leftRadialAbduction: '',
    rightRadialAbduction: '',
    leftThumbOpposition: '',
    rightThumbOpposition:'',
  });

  const handleInputDegreesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setDegrees((prevDegrees) => ({
      ...prevDegrees,
      [name]: value,
    }));
  };

  //保存评估
  const handleSaveDegrees = () => {

  };

  const initialDegrees = {
    leftHand: {
      finger1: { MCP: '', PIP: '', DIP: '' },
      finger2: { MCP: '', PIP: '', DIP: '' },
      finger3: { MCP: '', PIP: '', DIP: '' },
    },
    rightHand: {
      finger1: { MCP: '', PIP: '', DIP: '' },
      finger2: { MCP: '', PIP: '', DIP: '' },
      finger3: { MCP: '', PIP: '', DIP: '' },
    },
  };

  const [degree, setDegree] = useState(initialDegrees);

  const handleInputDegreeChange = (event) => {
    const { name, value } = event.target;
    const [hand, finger, joint] = name.split('-');
    setDegrees((prevDegrees) => ({
      ...prevDegrees,
      [hand]: {
        ...prevDegrees[hand],
        [finger]: {
          ...prevDegrees[hand][finger],
          [joint]: value,
        },
      },
    }));
  };
  const initialSuggestionValue = isModified ? '' : suggestionResponseData?.suggestion;

  //根据组名把获取的formField分组
  const groupByGroupName = (formFieldsResponseData: formField[]) => {
    const groupedFields: formField[][] = [];

    for (let i = 0; i < formFieldsResponseData.length; i++) {
      const currentField = formFieldsResponseData[i];
      const previousField = i > 0 ? formFieldsResponseData[i - 1] : null;

      if (!previousField || currentField.group_name !== previousField.group_name) {
        groupedFields.push([currentField]);
      } else {
        groupedFields[groupedFields.length - 1].push(currentField);
      }
    }

    return groupedFields;
  };

  const groupedFields = groupByGroupName(formFieldsRespomseData);

  //根据不同group返回相应量表的样式
  const renderGroupTable = (group: formField[]) => {
    switch (group[0].group_name) {
      case "User Information":
        return (
            <></>
        );
      case "Brunnstrom":
        return (
            <>
              <Card style={{ marginTop: '10px', marginBottom: '20px' }} sx={{ padding: '10px' }}>
                <Grid container spacing={0}>
                  <Grid item xs={12} style={{display: 'flex', alignItems: 'center'}}>
                    <Title>{group[0].group_name}</Title>
                  </Grid>

                  {group.map((field, index) => (
                      <Grid key={index} item xs={6}>
                        <Box sx={{padding: '8px' }}>
                          <Grid container spacing={0} alignItems="center">
                            <Grid item xs={4}>
                              <label>{field.label}</label>
                            </Grid>
                            <Grid item xs={8}>
                              {renderFormField(field.type, field.name, field.options)}
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                  ))}
                </Grid>
              </Card>
            </>
        );
      case "肌力评估":
        return (
            <>
              <Card style={{paddingBottom:'20px',padding:'8px' ,marginTop:'20px'}}>
                <Title>肌力评估</Title>
                <Typography variant='body2' style={{ color: 'red' }}>握力指数=握力（kg）/体重（kg）× 100%。正常握力指数≥50％</Typography>
                <TableWrapper>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>部位</StyledTableCell>
                          <StyledTableCell>左手</StyledTableCell>
                          <StyledTableCell>右手</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <StyledTableCell>握力</StyledTableCell>
                          <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                            <TextField
                                name="leftThumbMP"
                                value={degrees.leftThumbMP}
                                onChange={handleInputDegreesChange}
                                type="number"
                                size="small"
                            />
                          </TableCell>
                          <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                            <TextField
                                name="leftThumbIP"
                                value={degrees.leftThumbIP}
                                onChange={handleInputDegreesChange}
                                type="number"
                                size="small"
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TableWrapper>
                <Box sx={{padding: '8px',marginBottom:'16px' }}>
                  <Button style={{float: 'right'}} variant="outlined" onClick={handleSaveDegrees}>保存评估</Button>
                </Box>
              </Card>
            </>
        );
      case "手关节活动度评估":
        return (
            <>
              <Card style={{paddingBottom:'20px',padding:'8px' }}>
                {/*定义其用一个函数进行保存处理，用户填写的数据放在一个store里面，填写数据点击保存使其先渲染在页面上*/}
                <Title>手关节活动度评估</Title>
                <Typography variant='body2' style={{ color: 'red' }}>拇指对指：通过使用刻度尺测量拇指指腹至小指指腹的距离来评估。</Typography>
                <TableWrapper>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>部位</StyledTableCell>
                          <StyledTableCell>MP 屈曲（0°-50°）</StyledTableCell>
                          <StyledTableCell>IP 屈曲（0°-80°~90°）</StyledTableCell>
                          <StyledTableCell>桡侧外展（0°-50°）</StyledTableCell>
                          <StyledTableCell>拇指对指</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <StyledTableCell>左拇指</StyledTableCell>
                          <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                            <TextField
                                name="leftThumbMP"
                                value={degrees.leftThumbMP}
                                onChange={handleInputDegreesChange}
                                type="number"
                                size="small"
                            />
                          </TableCell>
                          <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                            <TextField
                                name="leftThumbIP"
                                value={degrees.leftThumbIP}
                                onChange={handleInputDegreesChange}
                                type="number"
                                size="small"
                            />
                          </TableCell>
                          <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                            <TextField
                                name="leftRadialAbduction"
                                value={degrees.leftRadialAbduction}
                                onChange={handleInputDegreesChange}
                                type="number"
                                size="small"
                            />
                          </TableCell>
                          <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                            <Grid container spacing={2}>
                              <Grid item xs={9}>
                                <TextField
                                    name="leftThumbOpposition"
                                    value={degrees.leftThumbOpposition}
                                    onChange={handleInputDegreesChange}
                                    type="number"
                                    size="small"
                                />
                              </Grid>
                              <Grid item xs={3}>
                                <Typography variant='body2' style={{ color: 'red' }}>CM</Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <StyledTableCell>右拇指</StyledTableCell>
                          <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                            <TextField
                                name="rightThumbMP"
                                value={degrees.rightThumbMP}
                                onChange={handleInputDegreesChange}
                                type="number"
                                size="small"
                            />
                          </TableCell>
                          <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                            <TextField
                                name="rightThumbIP"
                                value={degrees.rightThumbIP}
                                onChange={handleInputDegreesChange}
                                type="number"
                                size="small"
                            />
                          </TableCell>
                          <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                            <TextField
                                name="rightRadialAbduction"
                                value={degrees.rightRadialAbduction}
                                onChange={handleInputDegreesChange}
                                type="number"
                                size="small"
                            />
                          </TableCell>
                          <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                            <TextField
                                name="rightThumbOpposition"
                                value={degrees.rightThumbOpposition}
                                onChange={handleInputDegreesChange}
                                type="number"
                                size="small"
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TableWrapper>

                <TableWrapper>
                  <TableContainer>
                    <Table aria-label="hand degrees table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell></StyledTableCell>
                          <StyledTableCell align="center" colSpan={3}>左手</StyledTableCell>
                          <StyledTableCell align="center" colSpan={3}>右手</StyledTableCell>
                        </TableRow>
                        <TableRow>
                          <StyledTableCell></StyledTableCell>
                          <StyledTableCell>MCP（0°-90°）</StyledTableCell>
                          <StyledTableCell>PIP（0°-110°）</StyledTableCell>
                          <StyledTableCell>DIP（0°-80°）</StyledTableCell>
                          <StyledTableCell>MCP（0°-90°）</StyledTableCell>
                          <StyledTableCell>PIP（0°-110°）</StyledTableCell>
                          <StyledTableCell>DIP（0°-80°）</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {['食指', '中指', '无名指'].map((finger, index) => (
                            <TableRow key={index}>
                              <StyledTableCell>{finger}</StyledTableCell>
                              <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                                <TextField
                                    name={`leftHand-finger${index + 1}-MCP`}
                                    value={degree.leftHand[`finger${index + 1}`].MCP}
                                    onChange={handleInputDegreeChange}
                                    size="small"
                                />
                              </TableCell>
                              <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                                <TextField
                                    name={`leftHand-finger${index + 1}-PIP`}
                                    value={degree.leftHand[`finger${index + 1}`].PIP}
                                    onChange={handleInputDegreeChange}
                                    size="small"
                                />
                              </TableCell>
                              <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                                <TextField
                                    name={`leftHand-finger${index + 1}-DIP`}
                                    value={degree.leftHand[`finger${index + 1}`].DIP}
                                    onChange={handleInputDegreeChange}
                                    size="small"
                                />
                              </TableCell>
                              <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                                <TextField
                                    name={`rightHand-finger${index + 1}-MCP`}
                                    value={degree.rightHand[`finger${index + 1}`].MCP}
                                    onChange={handleInputDegreeChange}
                                    size="small"
                                />
                              </TableCell>
                              <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                                <TextField
                                    name={`rightHand-finger${index + 1}-PIP`}
                                    value={degree.rightHand[`finger${index + 1}`].PIP}
                                    onChange={handleInputDegreeChange}
                                    size="small"
                                />
                              </TableCell>
                              <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                                <TextField
                                    name={`rightHand-finger${index + 1}-DIP`}
                                    value={degree.rightHand[`finger${index + 1}`].DIP}
                                    onChange={handleInputDegreeChange}
                                    size="small"
                                />
                              </TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TableWrapper>
                <Box sx={{padding: '8px',marginBottom:'16px' }}>
                  <Button style={{float: 'right'}} variant="outlined" onClick={handleSaveDegrees}>保存评估</Button>
                </Box>
              </Card>
            </>
        );
      case "捏力评估":
        return (
            <>
              <Card style={{paddingBottom:'20px',padding:'8px' ,marginTop:'20px'}}>
                {/*定义其用一个函数进行保存处理，用户填写的数据放在一个store里面，填写数据点击保存使其先渲染在页面上*/}
                <Title>捏力评估</Title>
                <Typography variant='body2' style={{ color: 'red' }}>用拇指与其他手指相对捏压捏力计，反映拇对掌肌及屈曲肌的肌力，正常值约为握力的 30%。</Typography>
                <TableWrapper>
                  <TableContainer>
                    <Table aria-label="hand degrees table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell></StyledTableCell>
                          <StyledTableCell align="center" colSpan={4}>对指</StyledTableCell>
                          <StyledTableCell align="center" colSpan={4}>测捏</StyledTableCell>
                        </TableRow>
                        <TableRow>
                          <StyledTableCell></StyledTableCell>
                          <StyledTableCell>拇指-食指</StyledTableCell>
                          <StyledTableCell>拇指-中指</StyledTableCell>
                          <StyledTableCell>拇指-环指</StyledTableCell>
                          <StyledTableCell>拇指-小指</StyledTableCell>
                          <StyledTableCell>拇指-食指</StyledTableCell>
                          <StyledTableCell>拇指-中指</StyledTableCell>
                          <StyledTableCell>拇指-环指</StyledTableCell>
                          <StyledTableCell>拇指-小指</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {['左手', '右手'].map((finger, index) => (
                            <TableRow key={index}>
                              <StyledTableCell>{finger}</StyledTableCell>
                              <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                                <TextField
                                    name={`leftHand-finger${index + 1}-MCP`}
                                    value={degree.leftHand[`finger${index + 1}`].MCP}
                                    onChange={handleInputDegreeChange}
                                    size="small"
                                />
                              </TableCell>
                              <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                                <TextField
                                    name={`leftHand-finger${index + 1}-PIP`}
                                    value={degree.leftHand[`finger${index + 1}`].PIP}
                                    onChange={handleInputDegreeChange}
                                    size="small"
                                />
                              </TableCell>
                              <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                                <TextField
                                    name={`leftHand-finger${index + 1}-DIP`}
                                    value={degree.leftHand[`finger${index + 1}`].DIP}
                                    onChange={handleInputDegreeChange}
                                    size="small"
                                />
                              </TableCell>
                              <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                                <TextField
                                    name={`rightHand-finger${index + 1}-MCP`}
                                    value={degree.rightHand[`finger${index + 1}`].MCP}
                                    onChange={handleInputDegreeChange}
                                    size="small"
                                />
                              </TableCell>
                              <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                                <TextField
                                    name={`rightHand-finger${index + 1}-PIP`}
                                    value={degree.rightHand[`finger${index + 1}`].PIP}
                                    onChange={handleInputDegreeChange}
                                    size="small"
                                />
                              </TableCell>
                              <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                                <TextField
                                    name={`rightHand-finger${index + 1}-DIP`}
                                    value={degree.rightHand[`finger${index + 1}`].DIP}
                                    onChange={handleInputDegreeChange}
                                    size="small"
                                />
                              </TableCell>
                              <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                                <TextField
                                    name={`rightHand-finger${index + 1}-DIP`}
                                    value={degree.rightHand[`finger${index + 1}`].DIP}
                                    onChange={handleInputDegreeChange}
                                    size="small"
                                />
                              </TableCell>
                              <TableCell style={{ borderLeft: '1px solid #ccc' }}>
                                <TextField
                                    name={`rightHand-finger${index + 1}-DIP`}
                                    value={degree.rightHand[`finger${index + 1}`].DIP}
                                    onChange={handleInputDegreeChange}
                                    size="small"
                                />
                              </TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TableWrapper>
                <Box sx={{padding: '8px',marginBottom:'16px' }}>
                  <Button style={{float: 'right'}} variant="outlined" onClick={handleSaveDegrees}>保存评估</Button>
                </Box>
              </Card>
            </>
        );
      case "Fugl-Meyer":
        return (
            <>
              <Card style={{ marginTop: '20px', marginBottom: '20px' }} sx={{ padding: '20px' }}>
                <Title>Fugl-Meyer评定量表（手部）</Title>
                <Typography variant='h6'>请医护根据此次训练情况对以下信息进行评价：</Typography>
                <Grid container spacing={0}>
                  {group.map((field, index) => (
                      <>
                        <Grid key={index} item xs={12} alignItems="center">
                          <Typography variant="h6">
                            （{index+1}）{field.label}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} alignItems="center">
                          <ToggleButtonGroup
                              // value={fuglMeyerScores[index]}
                              exclusive
                              // onChange={}
                              // aria-label={`test-${index}`}
                          >
                            {
                              field.options.map((l: option)=> {
                                let selected
                                if (fuglMeyerScores[index] != null && fuglMeyerScores[index] != undefined) {
                                  selected = Number(fuglMeyerScores[index].selected_assessment_level_id) === l.option_id
                                }
                                return (
                                    <ToggleButton key={l.option_id} value={l.option_id} style={selected ? selectedStyle : notSelectedStyle} aria-label={`level-${l.option_id}`}>
                                      {l.label}
                                    </ToggleButton>
                                )
                              })
                            }
                          </ToggleButtonGroup>
                        </Grid>
                      </>
                  ))}
                </Grid>
                <Grid item xs={12} alignItems="center">
                  <Button style={{backgroundColor: '#2196f3', color: '#ffffff', float: 'right'}} onClick={handleSubmit}>
                    保存
                  </Button>
                </Grid>
              </Card>
            </>
        );
      default:
        return (
            <>
              <Card style={{ marginTop: '10px', marginBottom: '20px' }} sx={{ padding: '10px' }}>
                <Grid container spacing={0}>
                  <Grid item xs={12} style={{display: 'flex', alignItems: 'center'}}>
                    <Title>{group[0].group_name}</Title>
                  </Grid>

                  {group.map((field, index) => (
                      <Grid key={index} item xs={3}>
                        <Box sx={{padding: '8px' }}>
                          <Grid container spacing={0} alignItems="center">
                            <Grid item xs={4}>
                              <label>{field.label}</label>
                            </Grid>
                            <Grid item xs={8}>
                              {renderFormField(field.type, field.name, field.options)}
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                  ))}
                </Grid>
              </Card>
            </>
        );
    }
  }

  //根据type返回组件
  const renderFormField = (fieldType, fieldName, options) => {
    if (fieldType === 'text') {
      return (
          <TextField
              name={fieldName}
              value=""
              size="small"
              fullWidth
          />
      );
    } else if (options !== null) {
      return (
          <Select
              name={fieldName}
              value=""
              fullWidth
              variant="outlined"
              size="small"
          >
            {options.map((option) => (
                <MenuItem key={option.option_id} value={option.value}>
                  {option.label}
                </MenuItem>
            ))}
          </Select>
      );
    } else if (fieldType === 'date' || fieldType === 'time') {
      return (
          <TextField
              name={fieldName}
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
          />
      );
    } else if (fieldType === 'password') {
      return (
          <TextField
              name={fieldName}
              type="password"
              size="small"
              fullWidth
          />
      );
    } else if (fieldType === 'number') {
      return (
          <TextField
              name={fieldName}
              type="number"
              size="small"
              fullWidth
          />
      );
    } else if (fieldType === 'file') {
      return (
          <Input
              type="file"
              name={fieldName}
              inputProps={{ multiple: false }}
              onChange={(event) => {
                console.log(event.target.files[0]);
              }}
          />
      );
    } else {
      return (
          <TextField
              name={fieldName}
              value=""
              size="small"
              fullWidth
          />
      );
    }
  };

  return (
    <>
      <Container>
        <FormControl fullWidth>
          {groupedFields.map((group, index) => (
              <>
                {renderGroupTable(group)}
              </>
          ))}
        </FormControl>

        <FormControl fullWidth>
          <Card style={{ marginBottom: '30px', marginTop:'0px' }} sx={{ padding: '20px' }}>
            <Title>医生建议：</Title>
            <TextField
              name="suggestion"
              multiline
              rows={4}
              fullWidth
              placeholder="请按照本次训练情况在此输入医生建议"
              value = {suggestionText || initialSuggestionValue}
              onChange={(event) => {
                setSuggestionText(event.target.value)
                setIsModified(true);
              }}

            />
            <Typography variant='body2' style={{ color: 'red' }}>注：填写完毕后请点击保存按钮进行手动保存。</Typography>
            <Grid container spacing={0}>
              <Grid item xs={6} style={{display: 'flex', alignItems: 'center'}}>
              </Grid>
              <Grid item xs={6} alignItems="center">
                <Box sx={{padding: '8px' }}>
                  <Button style={{float: 'right'}} variant="outlined" onClick={handleSaveSuggestion}>保存建议</Button>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </FormControl>
      </Container>
    </>
  )
}


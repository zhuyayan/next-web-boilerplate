"use client";
import {
  Container,
  IconButton,
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


export default function FuglMeyerAssessment( { params }: { params: { id: string } } ) {
  const [selectedAssessment, setSelectedAssessment] = useState<string>(''); // 用于存储用户选择的评定量表
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch()
  const [components, setComponents] = useState<JSX.Element[]>([]);
  const [inputValue, setInputValue] = useState('');
  const appDispatch = useAppDispatch()
  const assessmentResponseData = useAppSelector((state: RootState) => state.assessment.assessmentData);
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

  // 评定量表选项
  const assessmentOptions = [
    { value: 'assessment1', label: '评定量表1' },
    { value: 'assessment2', label: '评定量表2' },
    // 添加更多评定量表选项
  ];

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

  return (
    <>
      <Container>
        <FormControl fullWidth>
          <Grid container spacing={0}>
            <Grid item xs={4} style={{display: 'flex', alignItems: 'center'}}>
              <Title>训练后状态：</Title>
            </Grid>
            <Grid item xs={4} style={{display: 'flex', alignItems: 'center'}}>
            </Grid>
            <Grid item xs={4} alignItems="center">
              <Tooltip title="自定义评价内容">
                <IconButton
                    style={{float: 'right'}}
                    aria-label="setEvaluate"
                    onClick={handleEditEvaluate}
                >
                  <EditCalendarIcon sx={{ fontSize: 36 }} color="secondary"/>
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <Card style={{ marginTop: '0px', marginBottom: '20px' }} sx={{ padding: '20px' }}>
            <Typography variant='h6'>请医护根据此次训练情况对以下信息进行评价：</Typography>
            <form>
              <Grid container spacing={0}>
                {
                  showEvaluate1 &&
                    <Grid item xs={3}>
                      <Box sx={{padding: '8px' }}>
                        <Grid container spacing={0} alignItems="center">
                          <Grid item xs={4}>
                            <label htmlFor="input9">耐受状态:</label>
                          </Grid>
                          <Grid item xs={8}>
                          <TextField
                              name="tolerance"
                              value={evaluateFormData.tolerance}
                              onChange={handleEvaluationFormDataFormChange}
                              size="small"
                              fullWidth
                          />
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                }
                {showEvaluate2 && <Grid item xs={3}>
                  <Box sx={{padding: '8px' }}>
                    <Grid container spacing={0} alignItems="center">
                      <Grid item xs={4}>
                        <label htmlFor="input10">运动评价:</label>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                            name="motionReview"
                            value={evaluateFormData.motionReview}
                            onChange={handleEvaluationFormDataFormChange}
                            size="small"
                            fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>}
                {showEvaluate3 && <Grid item xs={3}>
                  <Box sx={{padding: '8px' }}>
                    <Grid container spacing={0} alignItems="center">
                      <Grid item xs={4}>
                        <label htmlFor="input11">痉挛评价:</label>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                            name="spasmReview"
                            value={evaluateFormData.spasmReview}
                            onChange={handleEvaluationFormDataFormChange}
                            size="small"
                            fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>}
                {showEvaluate4 && <Grid item xs={3}>
                  <Box sx={{padding: '8px' }}>
                    <Grid container spacing={0} alignItems="center">
                      <Grid item xs={4}>
                        <label htmlFor="input9">肌张力:</label>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                            name="muscleTone"
                            value={evaluateFormData.muscleTone}
                            onChange={handleEvaluationFormDataFormChange}
                            size="small"
                            fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>}
                {showEvaluate5 && <Grid item xs={3}>
                  <Box sx={{padding: '8px' }}>
                    <Grid container spacing={0} alignItems="center">
                      <Grid item xs={4}>
                        <label htmlFor="input9">急性期情况:</label>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                            name="acuteState"
                            value={evaluateFormData.acuteState}
                            onChange={handleEvaluationFormDataFormChange}
                            size="small"
                            fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>}
                {showEvaluate6 && <Grid item xs={3}>
                  <Box sx={{padding: '8px' }}>
                    <Grid container spacing={0} alignItems="center">
                      <Grid item xs={4}>
                        <label htmlFor="input9">神经科判断:</label>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                            name="neuroJudgment"
                            value={evaluateFormData.neuroJudgment}
                            onChange={handleEvaluationFormDataFormChange}
                            size="small"
                            fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>}
                {showEvaluate7 && <Grid item xs={3}>
                  <Box sx={{padding: '8px' }}>
                    <Grid container spacing={0} alignItems="center">
                      <Grid item xs={4}>
                        {showEvaluate7 && <label htmlFor="input9">运动损伤度:</label>}
                      </Grid>
                      <Grid item xs={8}>
                        {showEvaluate7 && <TextField
                            name="motionInjury"
                            value={evaluateFormData.motionInjury}
                            onChange={handleEvaluationFormDataFormChange}
                            size="small"
                            fullWidth
                        />}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>}

                {components.map((component, index) => component)}

                <Grid item xs={12}>
                  <Box sx={{padding: '8px' }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Grid item>
                        <Typography variant='body2' style={{ color: 'red' }}>注：医生在该表格填写完成的评价信息只针对本次康复训练，评价将被保存在本次康复记录的表格中。</Typography>
                      </Grid>
                      <Grid item>
                        <Button variant="outlined" onClick={handleSaveEvaluate}>保存评价</Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Card>
        </FormControl>
        <FormControl fullWidth>
          <Title>Fugl-Meyer评定量表（手部）</Title>
          <Grid container spacing={0}>
            <Grid item xs={4} style={{display: 'flex', alignItems: 'center'}}>
              <Typography variant="h5">
                请选择评定量表
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={4} alignItems="center">
            <Tooltip title="自定义评价内容">
              <IconButton
                  style={{float: 'right'}}
                  aria-label="setEvaluate"
                  onClick={handleEditEvaluate}
              >
                <EditCalendarIcon sx={{ fontSize: 36 }} color="secondary"/>
              </IconButton>
            </Tooltip>
          </Grid>
          <Card style={{ marginTop: '0px', marginBottom: '20px' }} sx={{ padding: '20px' }}>
          <Typography variant='h6'>请医护根据此次训练情况对以下信息进行评价：</Typography>
          <Grid container spacing={0}>
              {assessmentResponseData.map((assessment: Assessment) => (
                  <div key={assessment.id}>
                    <Grid item xs={12} alignItems="center">
                      <Typography variant="h6">
                        {assessment.examination}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} alignItems="center">
                      <ToggleButtonGroup
                          value={fuglMeyerScores[assessment.id]}
                          exclusive
                          onChange={(event, newValue) => handleFuglMeyerAssessmentChange(assessment.id, newValue)}
                          aria-label={`test-${assessment.id}`}
                      >
                        {
                          assessment.levels.map((l: AssessmentLevel)=> {
                            let selected
                            if (fuglMeyerScores[assessment.id] != null && fuglMeyerScores[assessment.id] != undefined) {
                              selected = Number(fuglMeyerScores[assessment.id].selected_assessment_level_id) === l.id
                            }
                            return (
                                <ToggleButton key={l.id} value={l.id} style={selected ? selectedStyle : notSelectedStyle} aria-label={`level-${l.id}`}>
                                  {l.level_label}分: {l.description}
                                </ToggleButton>
                            )
                          })
                        }
                      </ToggleButtonGroup>
                    </Grid>
                  </div>
              ))}
            </Grid>
          <Grid item xs={12} alignItems="center">
            <Button style={{backgroundColor: '#2196f3', color: '#ffffff', float: 'right'}} onClick={handleSubmit}>
              保存
            </Button>
          </Grid>
        </Card>
        </FormControl>

        <FormControl fullWidth>
          <Title>医生建议：</Title>
          <Card style={{ marginTop: '0px' }} sx={{ padding: '20px' }}>
            <TextField
                name="advice"
                multiline
                rows={4}
                fullWidth
                placeholder="请按照本次训练情况在此输入医生建议"
            />
            <Grid container spacing={0}>
              <Grid item xs={6} style={{display: 'flex', alignItems: 'center'}}>
                <Box sx={{padding: '8px' }}>
                  <Typography variant='body2' style={{ color: 'red' }}>注：填写完毕后请点击保存按钮进行手动保存。</Typography>
                  <Grid container spacing={0} alignItems="center">
                    <Grid item xs={4}>
                      <label htmlFor="input9">耐受状态:</label>
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        name="tolerance"
                        value = {evaluationResponseData?.tolerance}
                        // value={evaluateFormData.tolerance}
                        onChange={handleEvaluationFormDataFormChange}
                        size="small"
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={6} alignItems="center">
                <Box sx={{padding: '8px' }}>
                  <Grid container spacing={0} alignItems="center">
                    <Grid item xs={4}>
                      <label htmlFor="input10">运动评价:</label>
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        name="motionReview"
                        value = {evaluationResponseData?.motion_review}
                        // value={evaluateFormData.motionReview}
                        onChange={handleEvaluationFormDataFormChange}
                        size="small"
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              {showEvaluate3 && <Grid item xs={3}>
                <Box sx={{padding: '8px' }}>
                  <Grid container spacing={0} alignItems="center">
                    <Grid item xs={4}>
                      <label htmlFor="input11">痉挛评价:</label>
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        name="spasmReview"
                        value = {evaluationResponseData?.spasm_review}
                        // value={evaluateFormData.spasmReview}
                        onChange={handleEvaluationFormDataFormChange}
                        size="small"
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>}
              {showEvaluate4 && <Grid item xs={3}>
                <Box sx={{padding: '8px' }}>
                  <Grid container spacing={0} alignItems="center">
                    <Grid item xs={4}>
                      <label htmlFor="input9">肌张力:</label>
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        name="muscleTone"
                        value = {evaluationResponseData?.muscle_tone}
                        // value={evaluateFormData.muscleTone}
                        onChange={handleEvaluationFormDataFormChange}
                        size="small"
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>}
              {showEvaluate5 && <Grid item xs={3}>
                <Box sx={{padding: '8px' }}>
                  <Grid container spacing={0} alignItems="center">
                    <Grid item xs={4}>
                      <label htmlFor="input9">急性期情况:</label>
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        name="acuteState"
                        value = {evaluationResponseData?.acute_state}
                        // value={evaluateFormData.acuteState}
                        onChange={handleEvaluationFormDataFormChange}
                        size="small"
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>}
              {showEvaluate6 && <Grid item xs={3}>
                <Box sx={{padding: '8px' }}>
                  <Grid container spacing={0} alignItems="center">
                    <Grid item xs={4}>
                      <label htmlFor="input9">神经科判断:</label>
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        name="neuroJudgment"
                        value = {evaluationResponseData?.neuro_judgment}
                        onChange={handleEvaluationFormDataFormChange}
                        size="small"
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>}
              {showEvaluate7 && <Grid item xs={3}>
                <Box sx={{padding: '8px' }}>
                  <Grid container spacing={0} alignItems="center">
                    <Grid item xs={4}>
                      {showEvaluate7 && <label htmlFor="input9">运动损伤度:</label>}
                    </Grid>
                    <Grid item xs={8}>
                      {showEvaluate7 && <TextField
                          name="motionInjury"
                          value = {evaluationResponseData?.motion_injury}
                          onChange={handleEvaluationFormDataFormChange}
                          size="small"
                          fullWidth
                      />}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>}

              <Grid item xs={12}>
                <Box sx={{padding: '8px' }}>
                  <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                      <Typography variant='body2' style={{ color: 'red' }}>注：医生在该表格填写完成的评价信息只针对本次康复训练，评价将被保存在本次康复记录的表格中。</Typography>
                    </Grid>
                    <Grid item>
                      <Button variant="outlined" onClick={handleSaveEvaluate}>保存评价</Button>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </FormControl>
      </Container>

      <Dialog open={openEvaluate} onClose={handleCloseEvaluate}>
        <DialogTitle>自定义量表</DialogTitle>
        <DialogContent>
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

        <Title>医生建议：</Title>
        <Card style={{ marginTop: '0px' }} sx={{ padding: '20px' }}>
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
          <Grid container spacing={0}>

            <Grid item xs={8} style={{display: 'flex', alignItems: 'center'}}>
              <Typography variant="body1">
                &gt; 耐受状态
              </Typography>
            </Grid>
            <Grid item xs={4} style={{display: 'flex', alignItems: 'center'}}>
              <Button color={showEvaluate1 ? "primary" : "error"} onClick={() => setShowEvaluate1(!showEvaluate1)}>
                {showEvaluate1 ? "将会显示" : "不会显示"}
              </Button>
            </Grid>

            <Grid item xs={8} style={{display: 'flex', alignItems: 'center'}}>
              <Typography variant="body1">
                &gt; 运动评价
              </Typography>
            </Grid>
            <Grid item xs={4} style={{display: 'flex', alignItems: 'center'}}>
              <Button color={showEvaluate2 ? "primary" : "error"} onClick={() => setShowEvaluate2(!showEvaluate2)}>
                {showEvaluate2 ? "将会显示" : "不会显示"}
              </Button>
            </Grid>

            <Grid item xs={8} style={{display: 'flex', alignItems: 'center'}}>
              <Typography variant="body1">
                &gt; 痉挛评价
              </Typography>
            </Grid>
            <Grid item xs={4} style={{display: 'flex', alignItems: 'center'}}>
              <Button color={showEvaluate3 ? "primary" : "error"} onClick={() => setShowEvaluate3(!showEvaluate3)}>
                {showEvaluate3 ? "将会显示" : "不会显示"}
              </Button>
            </Grid>

            <Grid item xs={8} style={{display: 'flex', alignItems: 'center'}}>
              <Typography variant="body1">
                &gt; 肌张力
              </Typography>
            </Grid>
            <Grid item xs={4} style={{display: 'flex', alignItems: 'center'}}>
              <Button color={showEvaluate4 ? "primary" : "error"} onClick={() => setShowEvaluate4(!showEvaluate4)}>
                {showEvaluate4 ? "将会显示" : "不会显示"}
              </Button>
            </Grid>

            <Grid item xs={8} style={{display: 'flex', alignItems: 'center'}}>
              <Typography variant="body1">
                &gt; 急性期情况
              </Typography>
            </Grid>
            <Grid item xs={4} style={{display: 'flex', alignItems: 'center'}}>
              <Button color={showEvaluate5 ? "primary" : "error"} onClick={() => setShowEvaluate5(!showEvaluate5)}>
                {showEvaluate5 ? "将会显示" : "不会显示"}
              </Button>
            </Grid>

            <Grid item xs={8} style={{display: 'flex', alignItems: 'center'}}>
              <Typography variant="body1">
                &gt; 神经科判断
              </Typography>
            </Grid>
            <Grid item xs={4} style={{display: 'flex', alignItems: 'center'}}>
              <Button color={showEvaluate6 ? "primary" : "error"} onClick={() => setShowEvaluate6(!showEvaluate6)}>
                {showEvaluate6 ? "将会显示" : "不会显示"}
              </Button>
            </Grid>

            <Grid item xs={8} style={{display: 'flex', alignItems: 'center'}}>
              <Typography variant="body1">
                &gt; 运动损伤度
              </Typography>
            </Grid>
            <Grid item xs={4} style={{display: 'flex', alignItems: 'center'}}>
              <Button color={showEvaluate7 ? "primary" : "error"} onClick={() => setShowEvaluate7(!showEvaluate7)}>
                {showEvaluate7 ? "将会显示" : "不会显示"}
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{padding: '8px' }}>
                <Grid container spacing={0} alignItems="center" justifyContent="space-between">
                  <Grid item xs={2.5}>
                    <label>输入新增项：</label>
                  </Grid>
                  <Grid item xs={5.5}>
                    <TextField
                        value={inputValue}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                    />
                  </Grid>
                  <Grid item xs={1}>

                  </Grid>
                  <Grid item xs={3}>
                    <Button onClick={handleAddComponent}>
                      添加新增项
                    </Button>
                  </Grid>
                </Grid>
                <Button style={{float: 'right'}} variant="outlined" onClick={handleSaveSuggestion}>保存建议</Button>
              </Box>
            </Grid>
          </Grid>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEvaluate}>完成</Button>
        </DialogActions>
      </Dialog>
    </>

  )
}


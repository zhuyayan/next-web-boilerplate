"use client";
import {Container, IconButton} from "@mui/material";
import { Title } from '@/components/rehab/styles';
import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import styled from 'styled-components';
import React, {useEffect, useState} from 'react';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Grid from '@mui/material/Grid';
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Card } from '@mui/material';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import Tooltip from "@mui/material/Tooltip";
import {
  addEvaluation, Assessment, AssessmentResponse, EvaluateFormProps, getAssessment, SelectedAssessment
} from "@/redux/features/rehab/rehab-slice";
import {ThunkDispatch} from "redux-thunk";
import {string} from "postcss-selector-parser";
import {AnyAction} from "redux";
import {useDispatch} from "react-redux";
import DialogContentText from "@mui/material/DialogContentText";
import {NumToBodyPartMapping, NumToModeMapping} from "@/utils/mct-utils";
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useCallback } from 'react';
import {addAssessment, editPatient, deletePatient} from "@/redux/features/rehab/rehab-slice";
import {RootState, useAppDispatch, useAppSelector} from "@/redux/store";

export default function FuglMeyerAssessment( { params }: { params: { id: string } } ) {
  const [selectedAssessment, setSelectedAssessment] = useState<string>(''); // 用于存储用户选择的评定量表
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch()
  const [components, setComponents] = useState<JSX.Element[]>([]);
  const [inputValue, setInputValue] = useState('');
  const appDispatch = useAppDispatch()
  const assessmentResponseData = useAppSelector((state: RootState) => state.rehab.assessmentData);

  useEffect(()=>{
    console.log("params->TaskID", params.id)
    thunkDispatch(getAssessment({task_id: parseInt(params.id)}))
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

  const handleInputChange = useCallback((event) => {
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

  // const handleAddPatient = () => {
  //   thunkDispatch(addAssessment({
  //
  //   }))

  // };


  // 处理提交选择的函数
  const handleSubmit = () => {
    // 在这里处理提交选择的逻辑，例如导航到相关页面 addAssessment
    console.log('用户选择的评定量表:', selectedAssessment);
  };


  const [alignment1, setAlignment1] = React.useState<string>('000');
  const [alignment2, setAlignment2] = React.useState<string>('000');
  const [alignment3, setAlignment3] = React.useState<string>('000');
  const [alignment4, setAlignment4] = React.useState<string>('000');
  const [alignment5, setAlignment5] = React.useState<string>('000');
  const [alignment6, setAlignment6] = React.useState<string>('000');
  const [alignment7, setAlignment7] = React.useState<string>('000');
  const [alignment8, setAlignment8] = React.useState<string>('000');
  const [alignment9, setAlignment9] = React.useState<string>('000');
  const [alignment10, setAlignment10] = React.useState<string>('000');

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

  const handleAlignment1 = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment1(newAlignment);
  };

  const handleAlignment2 = (
      event: React.MouseEvent<HTMLElement>,
      newAlignment: string,
  ) => {
    setAlignment2(newAlignment);
  };

  const handleAlignment3 = (
      event: React.MouseEvent<HTMLElement>,
      newAlignment: string,
  ) => {
    setAlignment3(newAlignment);
  };

  const handleAlignment4 = (
      event: React.MouseEvent<HTMLElement>,
      newAlignment: string,
  ) => {
    setAlignment4(newAlignment);
  };

  const handleAlignment5 = (
      event: React.MouseEvent<HTMLElement>,
      newAlignment: string,
  ) => {
    setAlignment5(newAlignment);
  };

  const handleAlignment6 = (
      event: React.MouseEvent<HTMLElement>,
      newAlignment: string,
  ) => {
    setAlignment6(newAlignment);
  };

  const handleAlignment7 = (
      event: React.MouseEvent<HTMLElement>,
      newAlignment: string,
  ) => {
    setAlignment7(newAlignment);
  };

  const handleAlignment8 = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment8(newAlignment);
  };
  const handleAlignment9 = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment9(newAlignment);
  };
  const handleAlignment10 = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment10(newAlignment);
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
  const handleSaveAdvice = () => {

  };

  //是否显示
  const [showAlignment1, setShowAlignment1] = useState(true);
  const [showAlignment2, setShowAlignment2] = useState(true);
  const [showAlignment3, setShowAlignment3] = useState(true);
  const [showAlignment4, setShowAlignment4] = useState(true);
  const [showAlignment5, setShowAlignment5] = useState(true);
  const [showAlignment6, setShowAlignment6] = useState(true);
  const [showAlignment7, setShowAlignment7] = useState(true);
  const [showAlignment8, setShowAlignment8] = useState(true);
  const [showAlignment9, setShowAlignment9] = useState(true);
  const [showAlignment10, setShowAlignment10] = useState(true);


  const [showEvaluate1, setShowEvaluate1] = useState(true);
  const [showEvaluate2, setShowEvaluate2] = useState(true);
  const [showEvaluate3, setShowEvaluate3] = useState(true);
  const [showEvaluate4, setShowEvaluate4] = useState(true);
  const [showEvaluate5, setShowEvaluate5] = useState(true);
  const [showEvaluate6, setShowEvaluate6] = useState(true);
  const [showEvaluate7, setShowEvaluate7] = useState(true);

  return (
    <Container>
      <Title>Fugl-Meyer评定量表（手部）</Title>
      <FormControl fullWidth>
        <Grid container spacing={0}>
          <Grid item xs={4} style={{display: 'flex', alignItems: 'center'}}>
            <Typography variant="h5">
              请选择评定量表
            </Typography>
          </Grid>
          <Grid item xs={4} style={{display: 'flex', alignItems: 'center'}}>
            {/*<InputLabel id="assessment-label">评定量表</InputLabel>*/}

            {/*<Select*/}
            {/*  labelId="assessment-label"*/}
            {/*  id="assessment-select"*/}
            {/*  value={selectedAssessment}*/}
            {/*  onChange={handleAssessmentChange}*/}
            {/*>*/}
            {/*  {assessmentOptions.map((option) => (*/}
            {/*    <MenuItem key={option.value} value={option.value}>*/}
            {/*      {option.label}*/}
            {/*    </MenuItem>*/}
            {/*  ))}*/}
            {/*</Select>*/}
          </Grid>
          <Grid item xs={4} alignItems="center">
            <Tooltip title="自定义量表">
              <IconButton
                  style={{float: 'right'}}
                  aria-label="set"
                  onClick={handleEditScale}
              >
                <EditCalendarIcon sx={{ fontSize: 36 }} color="secondary"/>
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>

        <Card style={{ marginBottom: '20px' }} sx={{ paddingLeft: '40px', paddingTop: '10px', paddingRight: '10px', paddingBottom: '10px' }}>
          <Grid container spacing={0}>
            {assessmentResponseData.map((assessment: Assessment) => (
                <div key={assessment.id}>
                  <Grid item xs={12} alignItems="center">
                    <Typography variant="h6">
                      &gt; {assessment.examination}
                    </Typography>
                  </Grid>
                </div>
            ))}
          </Grid>
        </Card>


        {/*<Grid item xs={12} alignItems="center">*/}
        {/*  <ToggleButtonGroup*/}
        {/*      value={alignment1}*/}
        {/*      exclusive*/}
        {/*      onChange={handleAlignment1}*/}
        {/*      aria-label="test1"*/}
        {/*  >*/}
        {/*    <ToggleButton value="010" style={alignment1 === "010" ? selectedStyle : notSelectedStyle} aria-label="test1 0">*/}
        {/*      0分: 不能屈曲*/}
        {/*    </ToggleButton>*/}
        {/*    <ToggleButton value="011" style={alignment1 === "011" ? selectedStyle : notSelectedStyle} aria-label="test1 1">*/}
        {/*      1分: 能屈曲但不充分*/}
        {/*    </ToggleButton>*/}
        {/*    <ToggleButton value="012" style={alignment1 === "012" ? selectedStyle : notSelectedStyle} aria-label="test1 2">*/}
        {/*      2分: (与健侧比较)能完全主动屈曲*/}
        {/*    </ToggleButton>*/}
        {/*  </ToggleButtonGroup>*/}
        {/*</Grid>*/}


        {/*  <Grid item xs={12} alignItems="center">*/}
        {/*    <Button style={{backgroundColor: '#2196f3', color: '#ffffff', float: 'right'}} onClick={handleSubmit}>*/}
        {/*      提交*/}
        {/*    </Button>*/}
        {/*  </Grid>*/}
        <Grid container spacing={0}>
          <Grid item xs={4} style={{display: 'flex', alignItems: 'center'}}>
            <Title>训练后状态：</Title>
          </Grid>
          <Grid item xs={4} style={{display: 'flex', alignItems: 'center'}}>
            {/*<InputLabel id="assessment-label">评定量表</InputLabel>*/}

            {/*<Select*/}
            {/*  labelId="assessment-label"*/}
            {/*  id="assessment-select"*/}
            {/*  value={selectedAssessment}*/}
            {/*  onChange={handleAssessmentChange}*/}
            {/*>*/}
            {/*  {assessmentOptions.map((option) => (*/}
            {/*    <MenuItem key={option.value} value={option.value}>*/}
            {/*      {option.label}*/}
            {/*    </MenuItem>*/}
            {/*  ))}*/}
            {/*</Select>*/}
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
              {showEvaluate1 && <Grid item xs={3}>
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
              </Grid>}
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
              </Box>
            </Grid>
            <Grid item xs={6} alignItems="center">
              <Box sx={{padding: '8px' }}>
                <Button style={{float: 'right'}} variant="outlined" onClick={handleSaveAdvice}>保存建议</Button>
              </Box>
            </Grid>
          </Grid>
        </Card>

        <br/>
        <br/>
        <Dialog open={openScale} onClose={handleCloseScale}>
          <DialogTitle>自定义量表</DialogTitle>
          <DialogContent>
            <Grid container spacing={0}>

              <Grid item xs={9} style={{display: 'flex', alignItems: 'center'}}>
                <Typography variant="body1">
                  &gt; 手指共同屈曲
                </Typography>
              </Grid>
              <Grid item xs={3} style={{display: 'flex', alignItems: 'center'}}>
                <Button color={showAlignment1 ? "primary" : "error"} onClick={() => setShowAlignment1(!showAlignment1)}>
                  {showAlignment1 ? "将会显示" : "不会显示"}
                </Button>
              </Grid>

              <Grid item xs={9} style={{display: 'flex', alignItems: 'center'}}>
                <Typography variant="body1">
                  &gt; 手指共同伸展
                </Typography>
              </Grid>
              <Grid item xs={3} style={{display: 'flex', alignItems: 'center'}}>
                <Button color={showAlignment2 ? "primary" : "error"} onClick={() => setShowAlignment2(!showAlignment2)}>
                  {showAlignment2 ? "将会显示" : "不会显示"}
                </Button>
              </Grid>

              <Grid item xs={9} style={{display: 'flex', alignItems: 'center'}}>
                <Typography variant="body1">
                  &gt; 握力1: 掌指关节伸展并且近端和远端指间关节屈曲，检测抗阻握力
                </Typography>
              </Grid>
              <Grid item xs={3} style={{display: 'flex', alignItems: 'center'}}>
                <Button color={showAlignment3 ? "primary" : "error"} onClick={() => setShowAlignment3(!showAlignment3)}>
                  {showAlignment3 ? "将会显示" : "不会显示"}
                </Button>
              </Grid>

              <Grid item xs={9} style={{display: 'flex', alignItems: 'center'}}>
                <Typography variant="body1">
                  &gt; 握力2: 所有关节于0位时，拇指内收
                </Typography>
              </Grid>
              <Grid item xs={3} style={{display: 'flex', alignItems: 'center'}}>
                <Button color={showAlignment4 ? "primary" : "error"} onClick={() => setShowAlignment4(!showAlignment4)}>
                  {showAlignment4 ? "将会显示" : "不会显示"}
                </Button>
              </Grid>

              <Grid item xs={9} style={{display: 'flex', alignItems: 'center'}}>
                <Typography variant="body1">
                  &gt; 握力3: 患者拇食指可夹住一支铅笔
                </Typography>
              </Grid>
              <Grid item xs={3} style={{display: 'flex', alignItems: 'center'}}>
                <Button color={showAlignment5 ? "primary" : "error"} onClick={() => setShowAlignment5(!showAlignment5)}>
                  {showAlignment5 ? "将会显示" : "不会显示"}
                </Button>
              </Grid>

              <Grid item xs={9} style={{display: 'flex', alignItems: 'center'}}>
                <Typography variant="body1">
                  &gt; 握力4: 能握住个圆筒物体
                </Typography>
              </Grid>
              <Grid item xs={3} style={{display: 'flex', alignItems: 'center'}}>
                <Button color={showAlignment6 ? "primary" : "error"} onClick={() => setShowAlignment6(!showAlignment6)}>
                  {showAlignment6 ? "将会显示" : "不会显示"}
                </Button>
              </Grid>

              <Grid item xs={9} style={{display: 'flex', alignItems: 'center'}}>
                <Typography variant="body1">
                  &gt; 握力5: 查握球形物体，如网球
                </Typography>
              </Grid>
              <Grid item xs={3} style={{display: 'flex', alignItems: 'center'}}>
                <Button color={showAlignment7 ? "primary" : "error"} onClick={() => setShowAlignment7(!showAlignment7)}>
                  {showAlignment7 ? "将会显示" : "不会显示"}
                </Button>
              </Grid>

              <Grid item xs={9} style={{display: 'flex', alignItems: 'center'}}>
                <Typography variant="body1">
                  &gt; 震颤
                </Typography>
              </Grid>
              <Grid item xs={3} style={{display: 'flex', alignItems: 'center'}}>
                <Button color={showAlignment8 ? "primary" : "error"} onClick={() => setShowAlignment8(!showAlignment8)}>
                  {showAlignment8 ? "将会显示" : "不会显示"}
                </Button>
              </Grid>

              <Grid item xs={9} style={{display: 'flex', alignItems: 'center'}}>
                <Typography variant="body1">
                  &gt; 辩距不良
                </Typography>
              </Grid>
              <Grid item xs={3} style={{display: 'flex', alignItems: 'center'}}>
                <Button color={showAlignment9 ? "primary" : "error"} onClick={() => setShowAlignment9(!showAlignment9)}>
                  {showAlignment9 ? "将会显示" : "不会显示"}
                </Button>
              </Grid>

              <Grid item xs={9} style={{display: 'flex', alignItems: 'center'}}>
                <Typography variant="body1">
                  &gt; 速度
                </Typography>
              </Grid>
              <Grid item xs={3} style={{display: 'flex', alignItems: 'center'}}>
                <Button color={showAlignment10 ? "primary" : "error"} onClick={() => setShowAlignment10(!showAlignment10)}>
                  {showAlignment10 ? "将会显示" : "不会显示"}
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseScale}>完成</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openEvaluate} onClose={handleCloseEvaluate}>
          <DialogTitle>自定义量表</DialogTitle>
          <DialogContent>
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
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEvaluate}>完成</Button>
          </DialogActions>
        </Dialog>
      </FormControl>
    </Container>
)
}


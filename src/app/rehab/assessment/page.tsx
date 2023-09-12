"use client";
import {Container, IconButton} from "@mui/material";
import { Title } from '@/components/rehab/styles';
import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import styled from 'styled-components';
import React, { useState } from 'react';
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
  addEvaluation, EvaluateFormProps
} from "@/redux/features/rehab/rehab-slice";
import {ThunkDispatch} from "redux-thunk";
import {string} from "postcss-selector-parser";
import {AnyAction} from "redux";
import {useDispatch} from "react-redux";
import DialogContentText from "@mui/material/DialogContentText";
import {NumToBodyPartMapping, NumToModeMapping} from "@/utils/mct-utils";
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

export default function FuglMeyerAssessment( params: { PId: string} ) {
  const [selectedAssessment, setSelectedAssessment] = useState<string>(''); // 用于存储用户选择的评定量表
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch()

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
    // 在这里处理提交选择的逻辑，例如导航到相关页面
    console.log('用户选择的评定量表:', selectedAssessment);
  };


  const [alignment1, setAlignment1] = React.useState<string | null>('000');
  const [alignment2, setAlignment2] = React.useState<string | null>('000');
  const [alignment3, setAlignment3] = React.useState<string | null>('000');
  const [alignment4, setAlignment4] = React.useState<string | null>('000');
  const [alignment5, setAlignment5] = React.useState<string | null>('000');
  const [alignment6, setAlignment6] = React.useState<string | null>('000');
  const [alignment7, setAlignment7] = React.useState<string | null>('000');
  const [alignment8, setAlignment8] = React.useState<string | null>('000');
  const [alignment9, setAlignment9] = React.useState<string | null>('000');
  const [alignment10, setAlignment10] = React.useState<string | null>('000');

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
    newAlignment: string | null,
  ) => {
    setAlignment1(newAlignment);
  };

  const handleAlignment2 = (
      event: React.MouseEvent<HTMLElement>,
      newAlignment: string | null,
  ) => {
    setAlignment2(newAlignment);
  };

  const handleAlignment3 = (
      event: React.MouseEvent<HTMLElement>,
      newAlignment: string | null,
  ) => {
    setAlignment3(newAlignment);
  };

  const handleAlignment4 = (
      event: React.MouseEvent<HTMLElement>,
      newAlignment: string | null,
  ) => {
    setAlignment4(newAlignment);
  };

  const handleAlignment5 = (
      event: React.MouseEvent<HTMLElement>,
      newAlignment: string | null,
  ) => {
    setAlignment5(newAlignment);
  };

  const handleAlignment6 = (
      event: React.MouseEvent<HTMLElement>,
      newAlignment: string | null,
  ) => {
    setAlignment6(newAlignment);
  };

  const handleAlignment7 = (
      event: React.MouseEvent<HTMLElement>,
      newAlignment: string | null,
  ) => {
    setAlignment7(newAlignment);
  };

  const handleAlignment8 = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null,
  ) => {
    setAlignment8(newAlignment);
  };
  const handleAlignment9 = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null,
  ) => {
    setAlignment9(newAlignment);
  };
  const handleAlignment10 = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null,
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
  const [showEvaluate8, setShowEvaluate8] = useState(true);
  const [showEvaluate9, setShowEvaluate9] = useState(true);
  const [showEvaluate10, setShowEvaluate10] = useState(true);


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
            <Grid item xs={12} alignItems="center">
              {showAlignment1 &&
                  <Typography variant="h6">
                    &gt; 手指共同屈曲
                  </Typography>}
            </Grid>
            <Grid item xs={12} alignItems="center">
              {showAlignment1 &&
                  <ToggleButtonGroup
                      value={alignment1}
                      exclusive
                      onChange={handleAlignment1}
                      aria-label="test1"
                  >
                    <ToggleButton value="010" style={alignment1 === "010" ? selectedStyle : notSelectedStyle} aria-label="test1 0">
                      0分: 不能屈曲
                    </ToggleButton>
                    <ToggleButton value="011" style={alignment1 === "011" ? selectedStyle : notSelectedStyle} aria-label="test1 1">
                      1分: 能屈曲但不充分
                    </ToggleButton>
                    <ToggleButton value="012" style={alignment1 === "012" ? selectedStyle : notSelectedStyle} aria-label="test1 2">
                      2分: (与健侧比较)能完全主动屈曲
                    </ToggleButton>
                  </ToggleButtonGroup>}
            </Grid>
            <Grid item xs={12} alignItems="center">
              {showAlignment2 &&
                  <Typography variant="h6">
                    &gt; 手指共同伸展
                  </Typography>}
            </Grid>
            <Grid item xs={12} alignItems="center">
              {showAlignment2 &&
                  <ToggleButtonGroup
                      value={alignment2}
                      exclusive
                      onChange={handleAlignment2}
                      aria-label="test2"
                  >
                    <ToggleButton value="020" style={alignment2 === "020" ? selectedStyle : notSelectedStyle} aria-label="test1 0">
                      0分: 不能伸
                    </ToggleButton>
                    <ToggleButton value="021" style={alignment2 === "021" ? selectedStyle : notSelectedStyle} aria-label="test1 1">
                      1分: 能放松主动屈曲的手指
                    </ToggleButton>
                    <ToggleButton value="022" style={alignment2 === "022" ? selectedStyle : notSelectedStyle} aria-label="test1 2">
                      2分: 能充分主动的伸展
                    </ToggleButton>
                  </ToggleButtonGroup>}
            </Grid>
            <Grid item xs={12} alignItems="center">
              {showAlignment3 &&
                  <Typography variant="h6">
                    &gt; 握力1: 掌指关节伸展并且近端和远端指间关节屈曲，检测抗阻握力
                  </Typography>}
            </Grid>
            <Grid item xs={12} alignItems="center">
              {showAlignment3 &&
                  <ToggleButtonGroup
                      value={alignment3}
                      exclusive
                      onChange={handleAlignment3}
                      aria-label="test3"
                  >
                    <ToggleButton value="030" style={alignment3 === "030" ? selectedStyle : notSelectedStyle} aria-label="test1 0">
                      0分: 不能保持要求位置
                    </ToggleButton>
                    <ToggleButton value="031" style={alignment3 === "031" ? selectedStyle : notSelectedStyle} aria-label="test1 1">
                      1分: 握力微弱
                    </ToggleButton>
                    <ToggleButton value="032" style={alignment3 === "032" ? selectedStyle : notSelectedStyle} aria-label="test1 2">
                      2分: 能够抵抗相当大的阻力抓握
                    </ToggleButton>
                  </ToggleButtonGroup>}
            </Grid>
            <Grid item xs={12} alignItems="center">
              {showAlignment4 &&
                  <Typography variant="h6">
                    &gt; 握力2: 所有关节于0位时，拇指内收
                  </Typography>}
            </Grid>
            <Grid item xs={12} alignItems="center">
              {showAlignment4 &&
                  <ToggleButtonGroup
                      value={alignment4}
                      exclusive
                      onChange={handleAlignment4}
                      aria-label="test4"
                  >
                    <ToggleButton value="040" style={alignment4=== "040" ? selectedStyle : notSelectedStyle} aria-label="test1 0">
                      0分: 不能进行
                    </ToggleButton>
                    <ToggleButton value="041" style={alignment4 === "041" ? selectedStyle : notSelectedStyle} aria-label="test1 1">
                      1分: 能用拇指捏住一张纸但不能抵抗拉力
                    </ToggleButton>
                    <ToggleButton value="042" style={alignment4 === "042" ? selectedStyle : notSelectedStyle} aria-label="test1 2">
                      2分: 可牢牢捏住纸
                    </ToggleButton>
                  </ToggleButtonGroup>}
            </Grid>
            <Grid item xs={12} alignItems="center">
              {showAlignment5 &&
                  <Typography variant="h6">
                    &gt; 握力3: 患者拇食指可夹住一支铅笔
                  </Typography>}
            </Grid>
            <Grid item xs={12} alignItems="center">
              {showAlignment5 &&
                  <ToggleButtonGroup
                      value={alignment5}
                      exclusive
                      onChange={handleAlignment5}
                      aria-label="test5"
                  >
                    <ToggleButton value="050" style={alignment5 === "050" ? selectedStyle : notSelectedStyle} aria-label="test1 0">
                      0分: 不能进行
                    </ToggleButton>
                    <ToggleButton value="051" style={alignment5 === "051" ? selectedStyle : notSelectedStyle} aria-label="test1 1">
                      1分: 能用拇指捏住一支铅笔但不能抵抗拉力
                    </ToggleButton>
                    <ToggleButton value="052" style={alignment5 === "052" ? selectedStyle : notSelectedStyle} aria-label="test1 2">
                      2分: 可牢牢捏住铅笔
                    </ToggleButton>
                  </ToggleButtonGroup>}
            </Grid>
            <Grid item xs={12} alignItems="center">
              {showAlignment6 &&
                  <Typography variant="h6">
                    &gt; 握力4: 能握住个圆筒物体
                  </Typography>}
            </Grid>
            <Grid item xs={12} alignItems="center">
              {showAlignment6 &&
                  <ToggleButtonGroup
                      value={alignment6}
                      exclusive
                      onChange={handleAlignment6}
                      aria-label="test6"
                  >
                    <ToggleButton value="060" style={alignment6 === "060" ? selectedStyle : notSelectedStyle} aria-label="test1 0">
                      0分: 不能进行
                    </ToggleButton>
                    <ToggleButton value="061" style={alignment6 === "061" ? selectedStyle : notSelectedStyle} aria-label="test1 1">
                      1分: 能用拇指捏住圆筒物体但不能抵抗拉力
                    </ToggleButton>
                    <ToggleButton value="062" style={alignment6 === "062" ? selectedStyle : notSelectedStyle} aria-label="test1 2">
                      2分: 可牢牢捏住圆筒物体
                    </ToggleButton>
                  </ToggleButtonGroup>}
            </Grid>
            <Grid item xs={12} alignItems="center">
              {showAlignment7 &&
                  <Typography variant="h6">
                    &gt; 握力5: 查握球形物体，如网球
                  </Typography>}
            </Grid>
            <Grid item xs={12} alignItems="center">
              {showAlignment7 &&
                  <ToggleButtonGroup
                      value={alignment7}
                      exclusive
                      onChange={handleAlignment7}
                      aria-label="test7"
                  >
                    <ToggleButton value="070" style={alignment7 === "070" ? selectedStyle : notSelectedStyle} aria-label="test1 0">
                      0分: 不能进行
                    </ToggleButton>
                    <ToggleButton value="071" style={alignment7 === "071" ? selectedStyle : notSelectedStyle} aria-label="test1 1">
                      1分: 能用拇指捏住球形物体但不能抵抗拉力
                    </ToggleButton>
                    <ToggleButton value="072" style={alignment7 === "072" ? selectedStyle : notSelectedStyle} aria-label="test1 2">
                      2分: 可牢牢捏住球形物体
                    </ToggleButton>
                  </ToggleButtonGroup>}
            </Grid>
            <Grid item xs={12} alignItems="center">
              {showAlignment8 &&
                  <Typography variant="h6">
                      手协调性与速度 : 指鼻试验 (快速连续进行5次)
                  </Typography>}
            </Grid>
            <Grid item xs={12} alignItems="center">
              {showAlignment8 &&
                  <Typography variant="h6">
                      &gt; 震颤
                  </Typography>}
            </Grid>
            <Grid item xs={12} alignItems="center">
              {showAlignment8 &&
                  <ToggleButtonGroup
                      value={alignment8}
                      exclusive
                      onChange={handleAlignment8}
                      aria-label="test8"
                  >
                      <ToggleButton value="080" style={alignment8 === "080" ? selectedStyle : notSelectedStyle} aria-label="test1 0">
                          0分: 明显震颤
                      </ToggleButton>
                      <ToggleButton value="081" style={alignment8 === "081" ? selectedStyle : notSelectedStyle} aria-label="test1 1">
                          1分: 轻度震颤
                      </ToggleButton>
                      <ToggleButton value="082" style={alignment8 === "082" ? selectedStyle : notSelectedStyle} aria-label="test1 2">
                          2分: 无震颤
                      </ToggleButton>
                  </ToggleButtonGroup>}
            </Grid>
            <Grid item xs={12} alignItems="center">
              {showAlignment9 &&
                  <Typography variant="h6">
                      &gt; 辩距不良
                  </Typography>}
            </Grid>
            <Grid item xs={12} alignItems="center">
              {showAlignment9 &&
                  <ToggleButtonGroup
                      value={alignment9}
                      exclusive
                      onChange={handleAlignment9}
                      aria-label="test9"
                  >
                      <ToggleButton value="090" style={alignment9 === "090" ? selectedStyle : notSelectedStyle} aria-label="test1 0">
                          0分: 明显的或不规则辨距障碍
                      </ToggleButton>
                      <ToggleButton value="091" style={alignment9 === "091" ? selectedStyle : notSelectedStyle} aria-label="test1 1">
                          1分: 轻度的规则的辩距障碍
                      </ToggleButton>
                      <ToggleButton value="092" style={alignment9 === "092" ? selectedStyle : notSelectedStyle} aria-label="test1 2">
                          2分: 无辩距障碍
                      </ToggleButton>
                  </ToggleButtonGroup>}
            </Grid>
            <Grid item xs={12} alignItems="center">
              {showAlignment8 &&
                  <Typography variant="h6">
                      &gt; 速度
                  </Typography>}
            </Grid>
            <Grid item xs={12} alignItems="center">
              {showAlignment10 &&
                  <ToggleButtonGroup
                      value={alignment10}
                      exclusive
                      onChange={handleAlignment10}
                      aria-label="test10"
                  >
                      <ToggleButton value="100" style={alignment10 === "100" ? selectedStyle : notSelectedStyle} aria-label="test1 0">
                          0分: 较健侧慢6秒
                      </ToggleButton>
                      <ToggleButton value="101" style={alignment10 === "101" ? selectedStyle : notSelectedStyle} aria-label="test1 1">
                          1分: 较健侧慢2-5秒
                      </ToggleButton>
                      <ToggleButton value="102" style={alignment10 === "102" ? selectedStyle : notSelectedStyle} aria-label="test1 2">
                          2分: 两侧差别少于2秒
                      </ToggleButton>
                  </ToggleButtonGroup>}
            </Grid>
            <Grid item xs={12} alignItems="center">
              <Button style={{backgroundColor: '#2196f3', color: '#ffffff', float: 'right'}} onClick={handleSubmit}>
                提交
              </Button>
            </Grid>
          </Grid>
        </Card>

        <Grid container spacing={0}>
          <Grid item xs={4} style={{display: 'flex', alignItems: 'center'}}>
            <Title>医生评价：</Title>
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
              <Grid item xs={3}>
                <Box sx={{padding: '8px' }}>
                  <Grid container spacing={0} alignItems="center">
                    <Grid item xs={4}>
                      {showEvaluate1 && <label htmlFor="input9">耐受状态:</label>}
                    </Grid>
                    <Grid item xs={8}>
                      {showEvaluate1 && <TextField
                          name="tolerance"
                          value={evaluateFormData.tolerance}
                          onChange={handleEvaluationFormDataFormChange}
                          size="small"
                          fullWidth
                      />}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{padding: '8px' }}>
                  <Grid container spacing={0} alignItems="center">
                    <Grid item xs={4}>
                      {showEvaluate2 && <label htmlFor="input10">运动评价:</label>}
                    </Grid>
                    <Grid item xs={8}>
                      {showEvaluate2 && <TextField
                          name="motionReview"
                          value={evaluateFormData.motionReview}
                          onChange={handleEvaluationFormDataFormChange}
                          size="small"
                          fullWidth
                      />}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{padding: '8px' }}>
                  <Grid container spacing={0} alignItems="center">
                    <Grid item xs={4}>
                      {showEvaluate3 && <label htmlFor="input11">痉挛评价:</label>}
                    </Grid>
                    <Grid item xs={8}>
                      {showEvaluate3 && <TextField
                          name="spasmReview"
                          value={evaluateFormData.spasmReview}
                          onChange={handleEvaluationFormDataFormChange}
                          size="small"
                          fullWidth
                      />}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{padding: '8px' }}>
                  <Grid container spacing={0} alignItems="center">
                    <Grid item xs={4}>
                      {showEvaluate4 && <label htmlFor="input9">肌张力:</label>}
                    </Grid>
                    <Grid item xs={8}>
                      {showEvaluate4 && <TextField
                          name="muscleTone"
                          value={evaluateFormData.muscleTone}
                          onChange={handleEvaluationFormDataFormChange}
                          size="small"
                          fullWidth
                      />}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{padding: '8px' }}>
                  <Grid container spacing={0} alignItems="center">
                    <Grid item xs={4}>
                      {showEvaluate5 && <label htmlFor="input9">急性期情况:</label>}
                    </Grid>
                    <Grid item xs={8}>
                      {showEvaluate5 && <TextField
                          name="acuteState"
                          value={evaluateFormData.acuteState}
                          onChange={handleEvaluationFormDataFormChange}
                          size="small"
                          fullWidth
                      />}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{padding: '8px' }}>
                  <Grid container spacing={0} alignItems="center">
                    <Grid item xs={4}>
                      {showEvaluate6 && <label htmlFor="input9">神经科判断:</label>}
                    </Grid>
                    <Grid item xs={8}>
                      {showEvaluate6 && <TextField
                          name="neuroJudgment"
                          value={evaluateFormData.neuroJudgment}
                          onChange={handleEvaluationFormDataFormChange}
                          size="small"
                          fullWidth
                      />}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={3}>
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
              </Grid>
              <Grid item xs={3}>
                <Box sx={{padding: '8px' }}>
                  <Button style={{float: 'right'}} variant="outlined" onClick={handleSaveEvaluate}>保存评价</Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{padding: '8px' }}>
                  <Typography variant='body2' style={{ color: 'red' }}>注：医生在该表格填写完成的评价信息只针对本次康复训练，评价将被保存在本次康复记录的表格中。</Typography>
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
                <Button color={showAlignment8 ? "primary" : "error"} onClick={() => setShowAlignment8(!showAlignment7)}>
                  {showAlignment8 ? "将会显示" : "不会显示"}
                </Button>
              </Grid>
              <Grid item xs={9} style={{display: 'flex', alignItems: 'center'}}>
                <Typography variant="body1">
                  &gt; 辩距不良
                </Typography>
              </Grid>
              <Grid item xs={3} style={{display: 'flex', alignItems: 'center'}}>
                <Button color={showAlignment9 ? "primary" : "error"} onClick={() => setShowAlignment9(!showAlignment7)}>
                  {showAlignment9 ? "将会显示" : "不会显示"}
                </Button>
              </Grid>
              <Grid item xs={9} style={{display: 'flex', alignItems: 'center'}}>
                <Typography variant="body1">
                  &gt; 速度
                </Typography>
              </Grid>
              <Grid item xs={3} style={{display: 'flex', alignItems: 'center'}}>
                <Button color={showAlignment10 ? "primary" : "error"} onClick={() => setShowAlignment10(!showAlignment7)}>
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


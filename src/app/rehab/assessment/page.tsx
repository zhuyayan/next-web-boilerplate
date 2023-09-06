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

export default function FuglMeyerAssessment() {
  const [selectedAssessment, setSelectedAssessment] = useState<string>(''); // 用于存储用户选择的评定量表
  const [open, setOpen] = React.useState(false)

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

  const handleClickOpen = () => {
    setOpen(true);
  };


  return (
    <Container>
      <Title>Fugl-Meyer评定量表</Title>
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
                  onClick={handleClickOpen}
              >
                <EditCalendarIcon sx={{ fontSize: 36 }} color="secondary"/>
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>

        <Card sx={{ paddingLeft: '40px', paddingTop: '10px', paddingRight: '10px', paddingBottom: '10px' }}>
          <Grid container spacing={0}>
            <Grid item xs={12} alignItems="center">
              <Typography variant="h6">
                (1) 手指共同屈曲
              </Typography>
            </Grid>
            <Grid item xs={12} alignItems="center">
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
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} alignItems="center">
              <Typography variant="h6">
                (2) 手指共同伸展
              </Typography>
            </Grid>
            <Grid item xs={12} alignItems="center">
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
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} alignItems="center">
              <Typography variant="h6">
                (3) 握力1: 掌指关节伸展并且近端和远端指间关节屈曲，检测抗阻握力
              </Typography>
            </Grid>
            <Grid item xs={12} alignItems="center">
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
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} alignItems="center">
              <Typography variant="h6">
                (4) 握力2: 所有关节于0位时，拇指内收
              </Typography>
            </Grid>
            <Grid item xs={12} alignItems="center">
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
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} alignItems="center">
              <Typography variant="h6">
                (5) 握力3: 患者拇食指可夹住一支铅笔
              </Typography>
            </Grid>
            <Grid item xs={12} alignItems="center">
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
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} alignItems="center">
              <Typography variant="h6">
                (6) 握力4: 能握住个圆筒物体
              </Typography>
            </Grid>
            <Grid item xs={12} alignItems="center">
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
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} alignItems="center">
              <Typography variant="h6">
                (7) 握力5: 查握球形物体，如网球
              </Typography>
            </Grid>
            <Grid item xs={12} alignItems="center">
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
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} alignItems="center">
              <Button style={{backgroundColor: '#2196f3', color: '#ffffff', float: 'right'}} onClick={handleSubmit}>
                提交
              </Button>
            </Grid>
          </Grid>
        </Card>

      </FormControl>
    </Container>
)
}


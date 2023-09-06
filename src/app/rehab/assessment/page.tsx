"use client";
import {Container} from "@mui/material";
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

export default function FuglMeyerAssessment() {
  const [selectedAssessment, setSelectedAssessment] = useState<string>(''); // 用于存储用户选择的评定量表

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

  const [alignment, setAlignment] = React.useState<string | null>('left');

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null,
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <Container>
      <Title>Fugl-Meyer评定量表</Title>
      <Typography variant="h5">请选择评定量表</Typography>
      <FormControl fullWidth>
        {/*<InputLabel id="assessment-label">评定量表</InputLabel>*/}
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleAlignment}
          aria-label="text alignment"
        >
          <ToggleButton value="left" aria-label="left aligned">
            0 分:不能屈曲
          </ToggleButton>
          <ToggleButton value="center" aria-label="centered">
            1 分:能屈曲但不充分
          </ToggleButton>
          <ToggleButton value="right" aria-label="right aligned">
            2分:(与健侧比较)能完全主动屈曲
          </ToggleButton>
          {/*<ToggleButton value="justify" aria-label="justified">*/}
          {/*  <FormatAlignJustifyIcon />*/}
          {/*</ToggleButton>*/}
        </ToggleButtonGroup>
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
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        提交
      </Button>
    </Container>
)
}


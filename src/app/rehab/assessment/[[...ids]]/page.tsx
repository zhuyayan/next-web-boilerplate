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
import {
  formField,
  getFormFields,
  getFormFieldsTemplate,
  option,
  submitForm,
  SubmissionField,
  SubmissionData, fields,
} from "@/redux/features/rehab/rehab-formFields-slice";


export default function FuglMeyerAssessment( { params }: { params: { ids: [] } } ) {
  const [selectedAssessment, setSelectedAssessment] = useState<string>(''); // 用于存储用户选择的评定量表
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  const [components, setComponents] = useState<JSX.Element[]>([]);
  const [inputValue, setInputValue] = useState('');
  const appDispatch = useAppDispatch()
  const assessmentResponseData = useAppSelector((state: RootState) => state.assessment.assessmentData);
  const formFieldsResponseData = useAppSelector((state: RootState) => state.formField.formFieldsData);
  const submissionResponseData = useAppSelector((state: RootState) => state.formField.submissionData);
  const suggestionResponseData = useAppSelector((state: RootState) => state.suggestion.suggestionData);
  const [suggestionText, setSuggestionText] = useState('')
  const evaluationResponseData = useAppSelector((state: RootState) => state.evaluation.evaluationData);
  const [isModified, setIsModified] = useState(false);
  const fuglMeyerScores = useAppSelector((state: RootState) => state.assessment.fuglMeyerScores);
  const pid = parseInt(params.ids[0])
  const task_id = parseInt(params.ids[1])
  useEffect(()=>{
    thunkDispatch(getAssessment({task_id: task_id}))
    thunkDispatch(getSuggestion({task_id: task_id}))
    thunkDispatch(getEvaluation({task_id: task_id}))
    thunkDispatch(getFormFields({result_owner_id: pid}))
    thunkDispatch(getFormFieldsTemplate())
  },[params,thunkDispatch])

  const [groupedFields, setGroupedFields] = useState<formField[][]>([]);
  useEffect(()=>{
    setGroupedFields(groupByGroupName(formFieldsResponseData));
  },[formFieldsResponseData])

  const [submissionData, setSubmissionData] = useState<SubmissionField>({
    fields: [],
    owner_id: 0,
  });

  useEffect(() => {
    let selectedSubmissionData = submissionResponseData?.filter((item) => {
      if(item.owner_id == task_id){
        return item
      }
    })
    if(selectedSubmissionData?.length){
      setSubmissionData(selectedSubmissionData[0]);
    }
  },[submissionResponseData])

  useEffect(() => {
    console.log("submissionData", submissionData)
    if (submissionData.fields) {
      console.log("submissionData.fields", submissionData.fields)
      const fields = submissionData.fields.reduce((acc, field) => {
        return {
          ...acc,
          [field.form_field_name]: field.value
        };
      }, {});
      setTextFields(fields);
    }
    console.log("textFields", textFields);
  }, [submissionData]);

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

  //保存医生建议
  const handleSaveSuggestion = () => {
    thunkDispatch(postSuggestion({task_id: parseInt(params[1]), suggestion_id: suggestionResponseData?.suggestion_id || 1, suggestion_text: suggestionText}))
  };

  // function handleFuglMeyerAssessmentChange(id: number, newValue: string | undefined | null) {
  //   thunkDispatch(setFuglMeyerScores({id, newValue}));
  // }

  const StyledTableCell = styled(TableCell)`
    background-color: #f0f0f0;
    border-left: 1px solid #ccc;
  `;

  const TableWrapper = styled.div`
  border: 1px solid #ccc; /* 设置边框样式，可以根据需要进行调整 */
  margin: 16px;
`;

  const [textFields, setTextFields] = useState({}); // 状态中存储文本框的name和value
  const handleInputTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTextFields((prevTextFields) => ({
      ...prevTextFields,
      [name]: value, // 更新相应的name和value
    }));
  };

  //量表选中状态
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: string }>({});
  const handleToggleButtonChange = (fieldName: string, value: string) => {
    setSelectedValues(prevState => ({
      ...prevState,
      [fieldName]: value
    }));
  };

  const handleInputFuglChange = (name: string, value: string) => {
    if (name && value) {
      setTextFields((prevTextFields) => ({
        ...prevTextFields,
        [name]: value,
      }));
    }
  };

  // 将 textFields 转换为 SubmissionField 数组
  const submissionFields: SubmissionField[] = Object.entries(textFields).map(([name, value]) => ({
    form_field_name: name,
    value: value as string, // 使用类型断言将未知类型的 value 转换为字符串类型
  }));

  //保存
  const handleSubmitAll = () => {
    // 构建 submissionData 对象
    const submissionData: SubmissionData = {
      form_sub_mission: {
        fields: submissionFields,
        owner_id: task_id
      },
      result_owner_id: pid
    };
    // 调用异步操作
    console.log("submissionData", submissionData)
    thunkDispatch(submitForm(submissionData));
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

  //const groupedFields = groupByGroupName(formFieldsResponseData);
  const uniqueStringsLeft: Set<string> = new Set();
  const uniqueStringsRight: Set<string> = new Set();
  let uniqueArrayLeft: string[];
  let uniqueArrayRight: string[];

  //根据不同group返回相应量表的样式
  const renderGroupTable = (group: formField[]) => {
    if (group[0].group_name === 'Fugl-Meyer') {
      return (
          <>
            <Card style={{ marginTop: '20px', marginBottom: '20px' }} sx={{ padding: '20px' }}>
              <Title>{group[0].group_name}</Title>
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
                            value={selectedValues[field.name] || ''}
                            exclusive
                            onChange={(event, value) => {
                              handleToggleButtonChange(field.name, value);
                              handleInputFuglChange(field.name, value);
                            }}
                        >
                          {field.options.map((l: option) => {
                            const selected = (selectedValues[field.name] || textFields[field.name as keyof typeof textFields])  === l.value;
                            return (
                                <ToggleButton
                                    key={l.option_id}
                                    value={l.value}
                                    style={selected ? selectedStyle : notSelectedStyle}
                                >
                                  {l.label}
                                </ToggleButton>
                            );
                          })}
                        </ToggleButtonGroup>
                      </Grid>
                    </>
                ))}
              </Grid>
              <Grid item xs={12} alignItems="center">
                <Button style={{backgroundColor: '#2196f3', color: '#ffffff', float: 'right'}} onClick={handleSubmitAll}>
                  保存所有数据
                </Button>
              </Grid>
            </Card>
          </>
      );
    }
    else if (group[0].group_name === 'User Information') {
      return (
          <></>
      );
    }

    if (group[0].render_type === 'table') {
      uniqueStringsLeft.clear();
      uniqueStringsRight.clear();
      group.forEach((item) => {
        const parts = item.help_text.split(",");
        const beforeComma = parts[0];
        const afterComma = parts[1];

        if (!uniqueStringsLeft.has(beforeComma)) {
          uniqueStringsLeft.add(beforeComma);
        }
        if (!uniqueStringsRight.has(afterComma)) {
          uniqueStringsRight.add(afterComma);
        }
      });
      uniqueArrayLeft = Array.from(uniqueStringsLeft);
      uniqueArrayRight = Array.from(uniqueStringsRight);
      let num: number;

      num = group.length/uniqueArrayLeft.length;


      return (
          <>
            <Card style={{ paddingBottom: '20px', padding: '8px', marginTop: '20px' }}>
              <Title>{group[0].group_name}</Title>
              <TableWrapper>
                <TableContainer>
                  <Table aria-label="hand degrees table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell></StyledTableCell>
                        {uniqueArrayRight.map((str, index) => (
                            <StyledTableCell key ={index} align="center">{str}</StyledTableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {uniqueArrayLeft.map((finger, index) => (
                          <TableRow key={index}>
                            <StyledTableCell align="center">{finger}</StyledTableCell>
                            {group.slice(index * num, (index + 1) * num).map((item) => (
                                <TableCell style={{ borderLeft: '1px solid #ccc' }} align="center" key={item.name}>
                                  <TextField
                                      name={item.name}
                                      value={textFields[ item.name as keyof typeof textFields] || ''} // 设置文本框的值为状态中存储的值
                                      //value={item.name}
                                      onChange={handleInputTextChange} // 绑定onChange事件处理函数
                                      size="small"
                                  />
                                </TableCell>
                            ))}
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TableWrapper>
            </Card>
          </>
      );
    }
    else {
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
  const renderFormField = (fieldType: string, fieldName: string, options: option[]) => {
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
              value={textFields[fieldName as keyof typeof textFields] || ""} // set default label to empty string if no value is present
              fullWidth
              variant="outlined"
              size="small"
              onChange={(event) => {
                const name = event.target.name;
                const value = event.target.value;
                handleInputFuglChange(name, value);
              }}
          >
            {options.map((option: option) => (
                <MenuItem
                    key={option.option_id}
                    value={option.value}
                    selected={option.value === textFields[fieldName as keyof typeof textFields]}
                >
                  {option.label}
                </MenuItem>
            ))}
          </Select>
      );
    } else {
      return (
          <TextField
              name={fieldName}
              value={textFields[ fieldName as keyof typeof textFields] || ''} // 设置文本框的值为状态中存储的值
              //value={fieldName}
              onChange={handleInputTextChange} // 绑定onChange事件处理函数
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


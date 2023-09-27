'use client';
import React, {useEffect, useState} from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {RootState, useAppSelector} from "@/redux/store";
import {fetchPatients} from "@/redux/features/rehab/rehab-slice";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {useDispatch} from "react-redux";
import {Title} from "@/components/rehab/styles";
import { Card } from '@mui/material';
import Divider from '@mui/material/Divider';


interface Group {
  groupName: string;
  priority: number;
}

interface childGroup {
  fatherGroupName: string;
  childGroupName: string;
}

export default function Page() {
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  const [fields, setFields] = useState([]);
  const [currentField, setCurrentField] = useState({
    label: '',
    group:'分组1',
    type: 'text',
    options: [],
    optionLabel: '', // New state for the label of the new option
    dependency: '',
    owner: '',
  });
  const [groups, setGroups] = useState<Group[]>([]);
  const [childGroups, setChildGroups] = useState<childGroup[]>([]);
  const [groupName, setGroupName] = useState("");
  const [childGroupName, setChildGroupName] = useState("");
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const patientList = useAppSelector((state: RootState) => state.rehab.patient);

  useEffect(() => {
    thunkDispatch(fetchPatients({page: 1, size: 1000, id: 0}))
  }, [thunkDispatch]);

  const handleCurrentGroup = (name:string) => {
    const selectedGroup = groups.find(groupItem => groupItem.groupName === name);
    if (selectedGroup) {
      setCurrentGroup({
        groupName: selectedGroup.groupName,
        priority: selectedGroup.priority,
      });
    }
  };

  const handleAddGroup = () => {
    if (groupName.trim() === "") return;

    const newGroup: Group = {
      groupName,
      priority: groups.length + 1, // 设置默认优先级为0
    };

    setGroups((prevGroups) => [...prevGroups, newGroup]);
    setGroupName("");
  };

  const handleAddChildGroup = () => {
    if (childGroupName.trim() === "") return;

    const newChildGroup: childGroup = {
      fatherGroupName: currentGroup?.groupName || '',
      childGroupName: childGroupName,
    };

    setChildGroups((prevChildGroups) => [...prevChildGroups, newChildGroup]);
    setChildGroupName("");
  };

  const handleUpdatePriority = (index: number, value: number) => {
    setGroups((prevGroups) => {
      const updatedGroups = [...prevGroups];
      if (index >= 0 && index < updatedGroups.length) {
        // 获取原始组对象
        const groupToUpdate = updatedGroups[index];
        // 更新优先级
        groupToUpdate.priority = value;
      }
      return updatedGroups;
    });
  };

  const handleAddField = () => {
    setFields([...fields, currentField]);
    setCurrentField({
      label: '',
      group: currentGroup?.groupName || '',
      type: 'text',
      options: [],
      optionLabel: '',
      dependency: '无依赖',
      owner: '所有人',
    });
  };

  const handleOptionAdd = () => {
    if (currentField.optionLabel) {
      setCurrentField(prev => ({
        ...prev,
        options: [...prev.options, {
          label: prev.optionLabel,
          value: prev.optionLabel.toLowerCase().replace(/ /g, "_") // Convert label to a value format
        }],
        optionLabel: ''
      }));
    }
  };
  return (
      <Box sx={{ marginTop: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Title>自定义量表页面</Title>
        <Paper elevation={3} sx={{ margin: 1, padding: 3, width: '96%' }} style={{ backgroundColor: '#fafafa' }}>

          <Grid container spacing={2}>
            {/* 左侧 */}
            <Grid item xs={12} sm={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                      fullWidth
                      size={"small"}
                      label="分组名称"
                      variant="outlined"
                      // value={currentField.group}
                      onChange={(e) => {
                        setCurrentField({ ...currentField, group: e.target.value })
                        setGroupName(e.target.value)
                      }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Button style={{backgroundColor: '#2196f3', color: '#ffffff', float: 'left'}} onClick={handleAddGroup}>
                    新建分组
                  </Button>
                </Grid>
              </Grid>

              <div style={{ marginBottom: '10px' }}></div>
              <Divider/>
              <br/>

              <Grid container spacing={3}>
                <Grid item xs={4} >
                  <FormControl fullWidth>
                    <InputLabel>选择分组</InputLabel>
                    <Select
                        label={"选择分组"}
                        size={"small"}
                        value = {currentGroup?.groupName}
                        // value={currentField.group}
                        onChange={(e) => {
                          setCurrentField({ ...currentField, group: e.target.value })
                          handleCurrentGroup(e.target.value)
                        }}
                    >
                      {groups.map((groupItem, index) => (
                          <MenuItem key={index} value={groupItem.groupName}>{groupItem.groupName}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={4}>
                  <TextField
                      fullWidth
                      size={"small"}
                      label="子组名称"
                      variant="outlined"
                      // value={currentField.group}
                      onChange={(e) => {
                        setChildGroupName(e.target.value)
                      }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button style={{backgroundColor: '#2196f3', color: '#ffffff', float: 'left'}} onClick={handleAddChildGroup}>
                    新建子组
                  </Button>
                </Grid>
              </Grid>

              <div style={{ marginBottom: '10px' }}></div>
              <Divider/>
              <br/>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                      fullWidth
                      size={"small"}
                      label="新建选项名称"
                      variant="outlined"
                      value={currentField.label}
                      onChange={(e) => setCurrentField({ ...currentField, label: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>设置分组</InputLabel>
                    <Select
                        label={"设置分组"}
                        size={"small"}
                        value = {currentGroup?.groupName}
                        // value={currentField.group}
                        onChange={(e) => {
                          setCurrentField({ ...currentField, group: e.target.value })
                          handleCurrentGroup(e.target.value)
                        }}
                    >
                      {groups.map((groupItem, index) => (
                          <MenuItem key={index} value={groupItem.groupName}>{groupItem.groupName}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>选项类型</InputLabel>
                    <Select
                        label={"选项类型"}
                        size={"small"}
                        value={currentField.type}
                        onChange={(e) => setCurrentField({ ...currentField, type: e.target.value })}
                    >
                      <MenuItem value="text">Text</MenuItem>
                      <MenuItem value="number">Number</MenuItem>
                      <MenuItem value="select">Select</MenuItem>
                      <MenuItem value="radio">Radio</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                      fullWidth
                      size={"small"}
                      label="所在组优先级"
                      variant="outlined"
                      value={currentGroup?.priority}
                      InputLabelProps={{ shrink: !!currentGroup?.priority }}
                      onChange={(e) => setCurrentField({ ...currentField, label: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>依赖</InputLabel>
                    <Select
                        label={"依赖"}
                        size={"small"}
                        value="无依赖"
                        onChange={(e) => {
                          setCurrentField({ ...currentField, dependency: e.target.value })
                        }}
                    >
                      <MenuItem value="无依赖">无依赖</MenuItem>
                      {fields.map((field, index) => (
                          field.group === currentGroup?.groupName && (
                            <MenuItem key={index} value={field.label}>{field.label}</MenuItem>
                          )
                      ))}
                    </Select>
                  </FormControl>
                  {/*<TextField*/}
                  {/*    fullWidth*/}
                  {/*    size={"small"}*/}
                  {/*    label="依赖"*/}
                  {/*    variant="outlined"*/}
                  {/*    value={currentField.label}*/}
                  {/*    onChange={(e) => setCurrentField({ ...currentField, label: e.target.value })}*/}
                  {/*/>*/}
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>拥有者</InputLabel>
                    <Select
                        label={"拥有者"}
                        size={"small"}
                        value = "所有人"
                        onChange={(e) => {setCurrentField({ ...currentField, owner: e.target.value })}}
                    >
                      <MenuItem value="所有人">所有人</MenuItem>
                      {patientList.map((patient, index) => (
                        <MenuItem key={index} value={patient.name}>{patient.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/*<TextField*/}
                  {/*    fullWidth*/}
                  {/*    size={"small"}*/}
                  {/*    label="拥有者"*/}
                  {/*    variant="outlined"*/}
                  {/*    value={currentField.label}*/}
                  {/*    onChange={(e) => setCurrentField({ ...currentField, label: e.target.value })}*/}
                  {/*/>*/}
                </Grid>
                {(currentField.type === 'select' || currentField.type === 'radio') && (
                    <React.Fragment>
                      {/*{currentField.options.map((option, index) => (*/}
                      {/*    <Grid item xs={12} md={4} key={index}>*/}
                      {/*      <TextField*/}
                      {/*          fullWidth*/}
                      {/*          label={`Option ${index + 1}`}*/}
                      {/*          variant="outlined"*/}
                      {/*          value={option.label}*/}
                      {/*          disabled // We make this field disabled to show the label but prevent further editing*/}
                      {/*      />*/}
                      {/*    </Grid>*/}
                      {/*))}*/}
                      <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="新选项"
                            size={"small"}
                            variant="outlined"
                            value={currentField.optionLabel}
                            onChange={(e) => setCurrentField({ ...currentField, optionLabel: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Button variant="outlined" onClick={handleOptionAdd} sx={{ marginRight: 2 }}>添加选项</Button>
                      </Grid>
                      <Grid item xs={12} md={4}>

                      </Grid>

                    </React.Fragment>
                )}

                {(currentField.type === 'select' || currentField.type === 'radio') && currentField.options.map((option, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <TextField
                          fullWidth
                          label={`选项 ${index + 1}`}
                          variant="outlined"
                          value={option.label}
                          onChange={(e) => {
                            const newOptions = [...currentField.options];
                            newOptions[index] = e.target.value;
                            setCurrentField({ ...currentField, options: newOptions });
                          }}
                      />
                    </Grid>
                ))}
                <Grid item xs={12}>
                  <Button style={{backgroundColor: '#2196f3', color: '#ffffff', float: 'left'}} variant="contained" color="primary" onClick={handleAddField}>添加可填写项</Button>
                </Grid>
              </Grid>
            </Grid>

            {/* 右侧 */}
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" color='#2196f3' gutterBottom>分组优先级：</Typography>
              <Paper style={{ maxHeight: "280px", overflow: "auto" }}>
                <TableContainer>
                  <Table sx={{ minWidth: 400 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" style={{ width: '15%' }}>ID</TableCell>
                        <TableCell align="center">分组名称</TableCell>
                        <TableCell align="center" style={{ width: '25%' }}>优先级</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {groups.map((group, index) => (
                          <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell align="center" component="th" scope="row">{index + 1}</TableCell>
                            <TableCell align="center">{group.groupName}</TableCell>
                            <TableCell align="center">
                              <Select
                                  label={"优先级"}
                                  size={"small"}
                                  value={group.priority}
                                  onChange={(e) => handleUpdatePriority(index, parseInt(e.target.value))}
                              >
                                {groups.map((groupItem, index) => (
                                    <MenuItem key={index} value={index + 1}>{index + 1}</MenuItem>
                                ))}
                              </Select>
                            </TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              <br/>
              <Typography variant="h6" color='#2196f3' gutterBottom>子组信息（测试用）：</Typography>
              <Paper style={{ maxHeight: "280px", overflow: "auto" }}>
                <TableContainer>
                  <Table sx={{ minWidth: 400 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" style={{ width: '10%' }}>ID</TableCell>
                        <TableCell align="center" style={{ width: '45%' }}>子组名称</TableCell>
                        <TableCell align="center" style={{ width: '45%' }}>所属分组（父组）</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {childGroups.map((childGroup, index) => (
                          <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell align="center" component="th" scope="row">{index + 1}</TableCell>
                            <TableCell align="center">{childGroup.childGroupName}</TableCell>
                            <TableCell align="center">{childGroup.fatherGroupName}</TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>

          <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #ccc' }} />

          <Typography variant="h5" gutterBottom>预览：</Typography>
          {groups.map((group, index) => (
              <>
                <Title key={index}>{group.groupName}</Title>
                <Card style={{paddingBottom:'20px',padding:'8px' }}>

                  {childGroups.map((childGroup, index) => {
                    let displayedIndex = 0;
                    return (
                        group.groupName === childGroup.fatherGroupName && (
                            <>
                              <br/>
                              <Typography key={index}>{childGroup.childGroupName}</Typography>
                              <TableContainer>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell align="center" style={{ width: '10%' }}>ID</TableCell>
                                      <TableCell align="center" style={{ width: '40%' }}>选项名称</TableCell>
                                      <TableCell align="center" style={{ width: '10%' }}>选项类型</TableCell>
                                      <TableCell align="center" style={{ width: '40%' }}>选项</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {fields.map((field, index) => (
                                        field.group === group.groupName && (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                              <TableCell align="center" component="th" scope="row">
                                                {++displayedIndex}
                                              </TableCell>
                                              <TableCell align="center">{field.label}</TableCell>
                                              <TableCell align="center">{field.type}</TableCell>
                                              <TableCell align="center">
                                                {field.options.length ? (
                                                    <Typography>
                                                      {field.options.map(opt => opt.label).join(', ')}
                                                    </Typography>
                                                ) : null}
                                              </TableCell>
                                            </TableRow>
                                        )
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </>
                        )
                    );

                  })}

                </Card>
                <br/>
              </>
          ))}
        </Paper>
      </Box>
  );
}
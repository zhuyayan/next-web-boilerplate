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
  Container,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {width} from "@mui/system";
import {RootState, useAppSelector} from "@/redux/store";
import {fetchPatients} from "@/redux/features/rehab/rehab-slice";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {useDispatch} from "react-redux";

interface Group {
  groupName: string;
  priority: number;
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
  const [groupName, setGroupName] = useState("");
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
      group:'分组1',
      type: 'text',
      options: [],
      optionLabel: '',
      dependency: '',
      owner: '',
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
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ padding: 3, width: '100%' }}>

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
                    <InputLabel>所在分组</InputLabel>
                    <Select
                        label={"所在分组"}
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
                        value={currentField.group}
                        onChange={(e) => {
                          setCurrentField({ ...currentField, dependency: e.target.value })
                        }}
                    >
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
                        value = {currentGroup?.groupName}
                        onChange={(e) => {setCurrentField({ ...currentField, owner: e.target.value })}}
                    >
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
                      {currentField.options.map((option, index) => (
                          <Grid item xs={12} md={4} key={index}>
                            <TextField
                                fullWidth
                                label={`Option ${index + 1}`}
                                variant="outlined"
                                value={option.label}
                                disabled // We make this field disabled to show the label but prevent further editing
                            />
                          </Grid>
                      ))}
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
                        <Button variant="outlined" onClick={handleOptionAdd} sx={{ marginRight: 2 }}>添加可选项</Button>
                      </Grid>
                    </React.Fragment>
                )}

                {(currentField.type === 'select' || currentField.type === 'radio') && currentField.options.map((option, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <TextField
                          fullWidth
                          label={`Option ${index + 1}`}
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
              <Typography variant="h6" gutterBottom>大组优先级：</Typography>
              <Paper style={{ maxHeight: "280px", overflow: "auto" }}>
                <TableContainer>
                  <Table sx={{ minWidth: 400 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell align="right">大组</TableCell>
                        <TableCell align="right">优先级</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {groups.map((group, index) => (
                          <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">{index + 1}</TableCell>
                            <TableCell align="right">{group.groupName}</TableCell>
                            <TableCell align="right">
                              <Select label={"优先级"} size={"small"} value={group.priority} onChange={(e) => handleUpdatePriority(index, parseInt(e.target.value))}>
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
            </Grid>
          </Grid>

          <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #ccc' }} />

          <Typography variant="h5" gutterBottom>预览：</Typography>
          <br/>
          {groups.map((group, index) => (
              <Paper key = {index} style={{ marginBottom: '20px' }}>
                <Typography variant="h5" gutterBottom>{group.groupName}</Typography>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell align="right">选项名称</TableCell>
                        <TableCell align="right">选项类型</TableCell>
                        <TableCell align="right">选项</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fields.map((field, index) => (
                          field.group === group.groupName && (<TableRow
                              key={index}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {field.label}
                            </TableCell>
                            <TableCell align="right">{field.label}</TableCell>
                            <TableCell align="right">{field.type}</TableCell>
                            <TableCell align="right">{field.options.length ? <Typography> {field.options.map(opt=>opt.label).join(', ')}</Typography> : null}</TableCell>
                          </TableRow>)
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
          ))}
        </Paper>
      </Box>
  );
}
'use client';
import React, { useState } from 'react';
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

export default function Page() {
  const [fields, setFields] = useState([]);
  const [currentField, setCurrentField] = useState({
    label: '',
    group:'分组1',
    type: 'text',
    options: [],
    optionLabel: '' // New state for the label of the new option
  });

  const handleAddField = () => {
    setFields([...fields, currentField]);
    setCurrentField({
      label: '',
      group:'分组1',
      type: 'text',
      options: [],
      optionLabel: ''
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size={"small"}
                label="分组名称"
                variant="outlined"
                // value={currentField.group}
                onChange={(e) => setCurrentField({ ...currentField, group: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Button style={{backgroundColor: '#2196f3', color: '#ffffff', float: 'left'}}>
                新建分组
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                  fullWidth
                  size={"small"}
                  label="选项名称"
                  variant="outlined"
                  value={currentField.label}
                  onChange={(e) => setCurrentField({ ...currentField, label: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                {/*<InputLabel>分组</InputLabel>*/}
                <Select
                    label={"分组"}
                    size={"small"}
                    value={currentField.group}
                    onChange={(e) => setCurrentField({ ...currentField, group: e.target.value })}
                >
                  <MenuItem value="1">分组1</MenuItem>
                  <MenuItem value="2">分组2</MenuItem>
                  <MenuItem value="3">分组3</MenuItem>
                  <MenuItem value="4">分组4</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                {/*<InputLabel>Type</InputLabel>*/}
                <Select
                    label={"类型"}
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
            <Grid item xs={12} md={2}>
              <TextField
                  fullWidth
                  size={"small"}
                  label="显示优先级"
                  variant="outlined"
                  value={currentField.label}
                  onChange={(e) => setCurrentField({ ...currentField, label: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                  fullWidth
                  size={"small"}
                  label="依赖"
                  variant="outlined"
                  value={currentField.label}
                  onChange={(e) => setCurrentField({ ...currentField, label: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                  fullWidth
                  size={"small"}
                  label="拥有者"
                  variant="outlined"
                  value={currentField.label}
                  onChange={(e) => setCurrentField({ ...currentField, label: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                  fullWidth
                  label="选项名称"
                  size={"small"}
                  variant="outlined"
                  value={currentField.label}
                  onChange={(e) => setCurrentField({ ...currentField, label: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                  fullWidth
                  label="选项名称"
                  size={"small"}
                  variant="outlined"
                  value={currentField.label}
                  onChange={(e) => setCurrentField({ ...currentField, label: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                  fullWidth
                  label="选项名称"
                  size={"small"}
                  variant="outlined"
                  value={currentField.label}
                  onChange={(e) => setCurrentField({ ...currentField, label: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              {/*<TextField*/}
              {/*    fullWidth*/}
              {/*    label="选项名称"*/}
              {/*    size={"small"}*/}
              {/*    variant="outlined"*/}
              {/*    value={currentField.label}*/}
              {/*    onChange={(e) => setCurrentField({ ...currentField, label: e.target.value })}*/}
              {/*/>*/}
            </Grid>
            <Grid item xs={12} md={2}>
              {/*<TextField*/}
              {/*    fullWidth*/}
              {/*    label="选项名称"*/}
              {/*    size={"small"}*/}
              {/*    variant="outlined"*/}
              {/*    value={currentField.label}*/}
              {/*    onChange={(e) => setCurrentField({ ...currentField, label: e.target.value })}*/}
              {/*/>*/}
            </Grid>
            <Grid item xs={12} md={2}>
              {/*<TextField*/}
              {/*    fullWidth*/}
              {/*    label="选项名称"*/}
              {/*    size={"small"}*/}
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
                        label="New Option Label"
                        variant="outlined"
                        value={currentField.optionLabel}
                        onChange={(e) => setCurrentField({ ...currentField, optionLabel: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" onClick={handleOptionAdd} sx={{ marginRight: 2 }}>Add Option</Button>
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
              <Button style={{backgroundColor: '#2196f3', color: '#ffffff', float: 'left'}} variant="contained" color="primary" onClick={handleAddField}>Add Field</Button>
            </Grid>
          </Grid>
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>Configured Fields:</Typography>
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
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {field.label}
                      </TableCell>
                      <TableCell align="right">{field.label}</TableCell>
                      <TableCell align="right">{field.type}</TableCell>
                      <TableCell align="right">{field.options.length ? <Typography> {field.options.map(opt=>opt.label).join(', ')}</Typography> : null}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </Box>
  );
}
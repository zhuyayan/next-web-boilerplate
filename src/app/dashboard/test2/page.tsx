'use client';
import React, { useState } from 'react';
import {TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, Container} from '@mui/material';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

export default function Page() {
  const [fields, setFields] = useState([]);
  const [currentField, setCurrentField] = useState({
    label: '',
    type: 'text',
    options: [],
    optionLabel: '' // New state for the label of the new option
  });

  const handleAddField = () => {
    setFields([...fields, currentField]);
    setCurrentField({
      label: '',
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
                    value={currentField.type}
                    onChange={(e) => setCurrentField({ ...currentField, type: e.target.value })}
                >
                  <MenuItem value="text">分组1</MenuItem>
                  <MenuItem value="number">分组2</MenuItem>
                  <MenuItem value="select">分组3</MenuItem>
                  <MenuItem value="radio">分组4</MenuItem>
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
              <Button variant="contained" color="primary" onClick={handleAddField}>Add Field</Button>
            </Grid>
          </Grid>
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>Configured Fields:</Typography>
            {fields.map((field, index) => (
                <Box key={index} mt={2}>
                  <Typography variant="h6" gutterBottom>
                    {field.label} ({field.type})
                  </Typography>
                  {field.options.length ? <Typography>Options: {field.options.map(opt=>opt.label).join(', ')}</Typography> : null}
                </Box>
            ))}
          </Box>
        </Paper>
      </Box>
  );
}
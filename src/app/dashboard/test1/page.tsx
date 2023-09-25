"use client";
import {useForm} from "react-hook-form";
import { FormControl, TextField, Select, MenuItem, InputLabel, RadioGroup, FormControlLabel, Radio, Checkbox, TextareaAutosize, Input } from '@mui/material';
import { Box, Button } from "@mui/material";


export default function Page() {
  const formFields = [
    { id: "name", label: "Name", type: "text" },
    { id: "password", label: "Password", type: "password" },
    { id: "email", label: "Email", type: "email" },
    { id: "selectOption", label: "Choose Option", type: "select", options: [{ label: 'Option 1', value: 'opt1' }, { label: 'Option 2', value: 'opt2' }]},
    { id: "radioOption", label: "Radio Option", type: "radio", options: [{ label: '男', value: 'opt1' }, { label: '女', value: 'opt2' }]},
    { id: "checkboxOption", label: "Check me", type: "checkbox" },
    { id: "description", label: "Description", type: "textarea" },
    { id: "file", label: "Upload File", type: "file" },
    { id: "age", label: "Age", type: "number" },
    { id: "date", label: "Date", type: "date" },
    { id: "time", label: "Time", type: "time" },
  ];

  const { register, handleSubmit, control } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return <>
    <form onSubmit={handleSubmit(onSubmit)}>
      {formFields.map((field) => {
        switch (field.type) {
          case 'text':
          case 'password':
          case 'email':
          case 'number':
          case 'date':
          case 'time':
            return (
                <FormControl key={field.id} margin="normal" fullWidth>
                  <TextField
                      label={field.label}
                      variant="outlined"
                      type={field.type}
                      {...register(field.id)}
                  />
                </FormControl>
            );
          case 'select':
            return (
                <FormControl key={field.id} margin="normal" fullWidth variant="outlined">
                  <InputLabel>{field.label}</InputLabel>
                  <Select label={field.label} {...register(field.id)}>
                    {field.options.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                          {option.label}
                        </MenuItem>
                    ))}
                  </Select>
                </FormControl>
            );
          case 'radio':
            return (
                <FormControl key={field.id} margin="normal" fullWidth>
                  <RadioGroup {...register(field.id)}>
                    {field.options.map((option, index) => (
                        <FormControlLabel key={index} value={option.value} control={<Radio />} label={option.label} />
                    ))}
                  </RadioGroup>
                </FormControl>
            );
          case 'checkbox':
            return (
                <FormControl key={field.id} margin="normal" fullWidth>
                  <FormControlLabel
                      control={<Checkbox {...register(field.id)} />}
                      label={field.label}
                  />
                </FormControl>
            );
          case 'textarea':
            return (
                <FormControl key={field.id} margin="normal" fullWidth>
                  <TextareaAutosize
                      aria-label={field.label}
                      minRows={3}
                      placeholder={field.label}
                      {...register(field.id)}
                  />
                </FormControl>
            );
          case 'file':
            return (
                <FormControl key={field.id} margin="normal" fullWidth>
                  <Input
                      label={field.label}
                      type={field.type}
                      inputProps={{ accept: "image/*" }}
                      {...register(field.id)}
                  />
                </FormControl>
            );
          default:
            return null;
        }
      })}
      <Box mt={3}>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </Box>
    </form>
  </>
}
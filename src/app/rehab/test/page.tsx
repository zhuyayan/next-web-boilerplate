"use client"
import * as React from 'react';
import { Card, CardContent, Typography, TextField, Button } from '@mui/material';

interface EvaluateFormProps {
  onSaveEvaluate: (formData: any) => void; // Replace `any` with your form data type
}

export default function EvaluateForm({ onSaveEvaluate }: EvaluateFormProps) {
  const [evaluateFormData, setEvaluateFormData] = React.useState({
    tolerance: '',
    sportsEvaluation: '',
    spasmEvaluation: '',
    muscularTension: '',
    acutePhase: '',
    neurological: '',
    sportsInjury: '',
  });

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEvaluateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveEvaluate = () => {
    onSaveEvaluate(evaluateFormData);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">医生评价</Typography>
        <form>
          {/* Form inputs */}
          <TextField
            name="tolerance"
            label="耐受程度"
            value={evaluateFormData.tolerance}
            onChange={handleFormChange}
          />
          <TextField
            name="tolerance"
            label="耐受程度"
            value={evaluateFormData.tolerance}
            onChange={handleFormChange}
          />
          <TextField
            name="tolerance"
            label="耐受程度"
            value={evaluateFormData.tolerance}
            onChange={handleFormChange}
          />

          {/* Add more input fields for other evaluation parameters */}
          <Button variant="contained" color="primary" onClick={handleSaveEvaluate}>
            保存评价
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

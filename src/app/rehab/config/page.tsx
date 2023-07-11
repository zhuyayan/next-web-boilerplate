"use client";
import {FormEvent, useState} from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import styled from "styled-components";
import {Container} from "@mui/material";

import { useDispatch } from 'react-redux';
import {setHospitalName} from "@/redux/features/layout-slice";
import {RootState, useAppSelector} from "@/redux/store";

const StyledButton = styled(Button)`
  && {
    background-color: #1976d1;
    color: #ffffff;
  }`;

export default function ConfigManagement() {
  const dispatch = useDispatch()
  const hospitalName = useAppSelector((state: RootState) => state.appBar.hospitalName)
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(setHospitalName(hospitalName))
  }
  return (
    <Container>
      <Card>
        <CardHeader title='配置管理' titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <TextField fullWidth label='Title' value={hospitalName} placeholder='请输入要改的医院名称' />
              </Grid>
              <Grid item xs={12}>
                <Box
                    sx={{
                      gap: 5,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                >
                  <StyledButton type='submit' size='large' color="secondary">
                    提交
                  </StyledButton>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  )
}

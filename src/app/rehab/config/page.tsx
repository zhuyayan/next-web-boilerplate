"use client";
import {ChangeEvent, FormEvent, useEffect, useState} from 'react';
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
import {RootState, useAppSelector} from "@/redux/store";
import {fetchConfig, putConfig} from "@/redux/features/layout-slice";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import * as React from "react";

const StyledButton = styled(Button)`
  && {
    background-color: #1976d1;
    color: #ffffff;
  }`;

export default function ConfigManagement() {
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch()
  const dispatch = useDispatch()
  const [hospitalNameTmp, setHospitalNameTmp] = React.useState<string>('')
  const hospitalName = useAppSelector((state: RootState) => state.appBar.rsConfig.Hospital.Name)
  const handleSubmit = () => {
    thunkDispatch(putConfig({hospital:{name: hospitalNameTmp}}))
  }

  useEffect(() => {
    console.log(111)
    thunkDispatch(fetchConfig())
  },[thunkDispatch])

  useEffect(() => {
    setHospitalNameTmp(hospitalName)
  }, [hospitalName])

  function handleHospitalNameChange(e: ChangeEvent<HTMLInputElement>) {
    setHospitalNameTmp(e.target.value)
  }

  return (
    <Container>
      <Card>
        <CardHeader title='配置管理' titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          {/*<form onSubmit={handleSubmit}>*/}
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <TextField fullWidth label='Title' value={hospitalNameTmp} placeholder='请输入要改的医院名称' onChange={handleHospitalNameChange} />
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
                  <StyledButton type='submit' size='large' color="secondary" onClick={handleSubmit}>
                    提交
                  </StyledButton>
                </Box>
              </Grid>
            </Grid>
          {/*</form>*/}
        </CardContent>
      </Card>
    </Container>
  )
}

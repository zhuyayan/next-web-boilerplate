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
import {fetchConfig, putConfig } from "@/redux/features/layout-slice";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import * as React from "react";
import { Title } from '@/components/rehab/styles';

const StyledButton = styled(Button)`
  && {
    background-color: #1976d1;
    color: #ffffff;
  }`;

export default function ConfigManagement() {
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch()
  const dispatch = useDispatch()
  const [hospitalNameTmp, setHospitalNameTmp] = React.useState<string>('')
  const [phoneNumberTmp, setPhoneNumberTmp] = React.useState<string>('')
  const [emailTmp, setEmailTmp] = React.useState<string>('')

  const hospitalName = useAppSelector((state: RootState) => state.appBar.rsConfig.Hospital.Name)
  const phoneNumber = useAppSelector((state: RootState) => state.appBar.rsConfig.AfterSalesInfo.Phone)
  const email = useAppSelector((state: RootState) => state.appBar.rsConfig.AfterSalesInfo.Email)
  const handleSubmit = () => {
    console.log("handleSubmit",email, phoneNumber, hospitalNameTmp)
    thunkDispatch(putConfig({after_sales_info: {email: emailTmp, phone_number: phoneNumberTmp}, hospital:{name: hospitalNameTmp}}))
  }

  useEffect(() => {
    console.log(111)
    thunkDispatch(fetchConfig())
  },[thunkDispatch])

  useEffect(() => {
    setHospitalNameTmp(hospitalName)
  }, [hospitalName])
  useEffect(() => {
    setPhoneNumberTmp(phoneNumber)
  }, [phoneNumber])
  useEffect(() => {
    setEmailTmp(email)
  }, [email])

  function handleHospitalNameChange(e: ChangeEvent<HTMLInputElement>) {
    console.log('handleHospitalNameChange', e.target.value)
    setHospitalNameTmp(e.target.value)
  }
  function handlePhoneNumberChange(e: ChangeEvent<HTMLInputElement>) {
    console.log('handlePhoneNumberChange', e.target.value)
    setPhoneNumberTmp(e.target.value)
  }
  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    console.log('handleEmailChange', e.target.value)
    setEmailTmp(e.target.value)
  }

  return (
    <Container>
      <Title>配置管理</Title>
      <Card>
        {/*<CardHeader title='配置管理' titleTypographyProps={{ variant: 'h6' }} />*/}
        <CardContent>
          {/*<form onSubmit={handleSubmit}>*/}
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <TextField sx={{ width: '50%' }}
                           label='医院抬头'
                           value={hospitalNameTmp}
                           placeholder='请输入要改的医院名称'
                           onChange={handleHospitalNameChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField sx={{ width: '50%' }}
                           label='联系方式'
                           value={phoneNumberTmp}
                           placeholder='请输入要改的联系方式'
                           onChange={handlePhoneNumberChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField sx={{ width: '50%' }}
                           label='邮箱'
                           value={emailTmp}
                           placeholder='请输入要改的联系邮箱'
                           onChange={handleEmailChange} />
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

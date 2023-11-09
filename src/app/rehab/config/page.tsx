"use client";
import {ChangeEvent, useEffect} from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
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

import { Subject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';


const StyledButton = styled(Button)`
  // text variant
  &:not(:disabled)[variant="text"] {
    background-color: transparent;
    color: #1976d1;
  }
  // contained variant
  &:not(:disabled)[variant="contained"] {
    background-color: #1976d1;
    color: #ffffff;
  }
  // outlined variant
  &:not(:disabled)[variant="outlined"] {
    background-color: transparent;
    color: #1976d1;
    border: 1px solid #1976d1;
  }
`;

const clickSubject = new Subject<number>();
let clickCount = 0;

// 创建一个点击事件处理函数，每次点击时都向clickSubject发送一个信号
const handleClickEvent = () => {
  clickSubject.next(++clickCount);
};

export default function ConfigManagement() {
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch()
  const [hospitalNameTmp, setHospitalNameTmp] = React.useState<string>('')
  const [phoneNumberTmp, setPhoneNumberTmp] = React.useState<string>('')
  const [emailTmp, setEmailTmp] = React.useState<string>('')
  const [submitDisabled, setSubmitDisabled] = React.useState<boolean>(false);

  const hospitalName = useAppSelector((state: RootState) => state.appBar.rsConfig.Hospital.Name)
  const phoneNumber = useAppSelector((state: RootState) => state.appBar.rsConfig.AfterSalesInfo.Phone)
  const email = useAppSelector((state: RootState) => state.appBar.rsConfig.AfterSalesInfo.Email)

  useEffect(() => {
    const subscription = clickSubject
        .pipe(
            debounceTime(300), // 在300毫秒内只处理一次点击
            tap(() => {
              console.log("Button was clicked!");
            })
        )
        .subscribe();

    // 清理订阅
    return () => {
      subscription.unsubscribe();
      console.log("subscription.unsubscribe()");
    };
  }, []);

  const handleSubmit = () => {
    console.log("handleSubmit",email, phoneNumber, hospitalNameTmp)
    setSubmitDisabled(true)
    thunkDispatch(putConfig({after_sales_info: {email: emailTmp, phone_number: phoneNumberTmp}, hospital:{name: hospitalNameTmp}}))
  }

  useEffect(() => {
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
      <Card sx={{ marginBottom:5 }}>
        <CardContent>
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
                  <StyledButton
                      variant='outlined'
                      size='small'
                      color='primary'
                      onClick={()=>{
                        handleSubmit();
                        handleClickEvent();
                      }}>
                    提交
                  </StyledButton>
                </Box>
              </Grid>
            </Grid>
        </CardContent>
      </Card>
    </Container>
  )
}

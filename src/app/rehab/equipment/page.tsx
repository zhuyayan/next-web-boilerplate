"use client";
import {Container, Typography} from '@mui/material';
import styled from 'styled-components';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import React, {useEffect} from "react";
import {RootState, useAppSelector} from "@/redux/store";
import {fetchPatients, useGetOnlineEquipmentsQuery} from "@/redux/features/rehab/rehab-slice";
import Box from "@mui/material/Box";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {useDispatch} from "react-redux";

const EquipmentList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const EquipmentItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const EquipmentStatus = styled.div<{ $online: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ $online }) => ($online ? 'green' : 'grey')};
  margin-right: 8px;
`;

export default function EquipmentManagement() {
    const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
    const onlineEquipment = useAppSelector((state: RootState) => state.rehab.onlineEquipment)
    const {data: onlineData, isLoading: onlineLoading, error: onlineError} = useGetOnlineEquipmentsQuery("redux")
    const patientList = useAppSelector((state: RootState) => state.rehab.patient)

    useEffect(() => {
        thunkDispatch(fetchPatients({page: 1, size: 1000, id: 0}))
    }, [thunkDispatch]);

  return (
    <Container>
        <br/>
        <Typography variant="h2" component="h1" sx={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333'}}>数据汇总</Typography>
        <br/>
        <Grid container spacing={3}>
            <Grid item xs={4} md={4}>
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image="/images/shebei.jpg"
                        title="equipment"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            设备管理
                        </Typography>
                        <Box>
                            <Typography variant="subtitle1" style={{display:'inline-block'}}>
                                设备总数量:&emsp;
                            </Typography>
                            <Typography variant="h5" color="primary" style={{display:'inline-block'}}>
                                {onlineEquipment.length}台
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="subtitle1" style={{display:'inline-block'}}>
                                在线设备数量:&emsp;
                            </Typography>
                            <Typography variant="h5" color="green" style={{display:'inline-block'}}>
                                {onlineEquipment.length}台
                            </Typography>
                        </Box>

                        <EquipmentList>
                            {onlineEquipment.map((item) => (
                                <EquipmentItem key={item.sId} value={item.sId}>
                                    &emsp;&emsp;
                                    <EquipmentStatus  $online/>
                                    <Typography>{item.clientId}</Typography>
                                </EquipmentItem>
                            ))}
                        </EquipmentList>
                    </CardContent>
                    <CardActions>
                        <Button size="small">设备配置</Button>
                        <Button size="small">详细信息</Button>
                    </CardActions>
                </Card>
            </Grid>
            <Grid item xs={4} md={4}>
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image="/images/xunlian.jpg"
                        title="xl"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            训练数据
                        </Typography>
                        <Box>
                            <Typography variant="subtitle1" style={{display:'inline-block'}}>
                                训练总时长:&emsp;
                            </Typography>
                            <Typography variant="h5" color="primary" style={{display:'inline-block'}}>
                                {onlineEquipment.length}小时
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="subtitle1" style={{display:'inline-block'}}>
                                训练总次数:&emsp;
                            </Typography>
                            <Typography variant="h5" color="green" style={{display:'inline-block'}}>
                                {onlineEquipment.length}次
                            </Typography>
                        </Box>
                    </CardContent>
                    <CardActions>
                        <Button size="small">分享</Button>
                        <Button size="small">了解更多</Button>
                    </CardActions>
                </Card>
            </Grid>

            <Grid item xs={4} md={4}>
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image="/images/patient.jpg"
                        title="patient"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            治疗患者数据
                        </Typography>
                        <Box>
                            <Typography variant="subtitle1" style={{display:'inline-block'}}>
                                参与康复训练患者总数:&emsp;
                            </Typography>
                            <Typography variant="h5" color="primary" style={{display:'inline-block'}}>
                                {patientList.length}位
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="subtitle1" style={{display:'inline-block'}}>
                                本月活跃患者数量:&emsp;
                            </Typography>
                            <Typography variant="h5" color="green" style={{display:'inline-block'}}>
                                {patientList.length}位
                            </Typography>
                        </Box>
                    </CardContent>
                    <CardActions>
                        <Button size="small">分享</Button>
                        <Button size="small">了解更多</Button>
                    </CardActions>
                </Card>
            </Grid>



            <Grid item xs={4} md={4}>
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image="/images/equipment.png"
                        title="system"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            系统情况
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            当前系统情况良好
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">分享</Button>
                        <Button size="small">了解更多</Button>
                    </CardActions>
                </Card>
            </Grid>

            <Grid item xs={4} md={4}>
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image="/images/system.jpg"
                        title="bug"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            故障联系
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            请联系技术人员，联系方式：xxxxxxx
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">分享</Button>
                        <Button size="small">了解更多</Button>
                    </CardActions>
                </Card>
            </Grid>

            <Grid item xs={4} md={4}>
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image="/images/help.jpg"
                        title="help"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            意见反馈
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            反馈方式：邮箱xxx
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">分享</Button>
                        <Button size="small">了解更多</Button>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    </Container>
  );
}

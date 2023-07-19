"use client";
import {Container, Typography} from '@mui/material';
import styled from 'styled-components';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import React from "react";
import {RootState, useAppSelector} from "@/redux/store";
import {useGetOnlineEquipmentsQuery} from "@/redux/features/rehab/rehab-slice";


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
  const onlineEquipment = useAppSelector((state: RootState) => state.rehab.onlineEquipment)
  const {data: onlineData, isLoading: onlineLoading, error: onlineError} = useGetOnlineEquipmentsQuery("redux")

  return (
    <Container>
        <Typography variant="h2" component="h1" sx={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333'}}>数据汇总</Typography>
        <br/>
        <Grid container spacing={3}>
            <Grid item xs={4} md={4}>
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image="/static/images/cards/contemplative-reptile.jpg"
                        title="equipment"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            设备管理
                        </Typography>
                        <EquipmentList>
                            {onlineEquipment.map((item) => (
                                <EquipmentItem key={item.sId} value={item.sId}>
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
                        image="/static/images/cards/contemplative-reptile.jpg"
                        title="doctor"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            医生团队
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            集结百余位医生智慧，获得专家水平诊断和针对性
                            处方，及时准确地完成康复训练，全新全意为病人
                            服务
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
                        image="/static/images/cards/contemplative-reptile.jpg"
                        title="patient"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            治疗患者
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            已有数百名患者使用，全心全意为患者的健康服务
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
                        image="/static/images/cards/contemplative-reptile.jpg"
                        title="time"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            训练时长
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            全部病人累计训练时长
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
                        image="/static/images/cards/contemplative-reptile.jpg"
                        title="OS"
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
                        image="/static/images/cards/contemplative-reptile.jpg"
                        title="bug"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            故障联系
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            请联系技术人员
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

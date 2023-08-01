"use client";
import {Container, Typography} from '@mui/material';
import styled from 'styled-components';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';

import React, {useEffect, useState} from "react";
import {RootState, useAppSelector} from "@/redux/store";
import {activePatients, getEquipmentAll, fetchPatients, useGetOnlineEquipmentsQuery, getSystemInformation} from "@/redux/features/rehab/rehab-slice";
import Box from "@mui/material/Box";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {useDispatch, useSelector} from "react-redux";
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts'
import Divider from "@mui/material/Divider";
import {GetCurrentDateTime, GetOneMonthAgoDateTime, GetOneWeekAgoDateTime} from "@/utils/mct-utils";
import { Title } from '@/components/rehab/styles';

//图表
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

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
    const equipmentList = useAppSelector((state: RootState) => state.rehab.equipmentAll)
    const systemInformation = useAppSelector((state: RootState) => state.rehab.systemInformation)
    const {data: onlineData, isLoading: onlineLoading, error: onlineError} = useGetOnlineEquipmentsQuery("redux")
    const patientList = useAppSelector((state: RootState) => state.rehab.patient)

    const activePatientList = useAppSelector((state: RootState) => state.rehab.activePatient)
    const Phone = useSelector((state:RootState) => state.appBar.rsConfig.AfterSalesInfo.Phone);
    const Email = useSelector((state:RootState) => state.appBar.rsConfig.AfterSalesInfo.Email);
    const [activePatientCount, setActivePatientCount] = React.useState(0);
    useEffect(() => {
        thunkDispatch(fetchPatients({page: 1, size: 1000, id: 0}))
        thunkDispatch(activePatients({page: 1, size: 1000, id: 0, start_time: GetOneMonthAgoDateTime(), end_time: GetCurrentDateTime()}))
        thunkDispatch(getEquipmentAll({page: 1, size: 1000}))
        thunkDispatch(getSystemInformation({page: 1, size: 100}))
    }, [thunkDispatch]);

    useEffect(() => {
        console.log("activePatientList", activePatientList.length)
        console.log("equipmentList", equipmentList)
        setActivePatientCount(activePatientList.length)
        setPatientSeries([patientList.length, (activePatientList.length / patientList.length)*100])
        setEquipmentSeries([onlineEquipment.length, equipmentList.length - onlineEquipment.length])
    }, [patientList,activePatientList, equipmentList, onlineEquipment]);

    const [patientSeries, setPatientSeries] = useState([100, 75]);
    const [equipmentSeries, setEquipmentSeries] = useState([100, 75]);
    const onHoverTooltipFormatter = (val: number,opts: { seriesIndex: number, dataPointIndex: number, w: any }) => {
        console.log("onHoverTooltipFormatter")
        return `${val}`;
    };

    const options: ApexOptions= {
        chart: {
            height: 200,
            type: 'donut',
        },
        dataLabels: {
            enabled: true
        },
        legend: {
            formatter: function(val, opts) {
                return val + "  " + opts.w.globals.series[opts.seriesIndex] + "台"
            }
        },
        plotOptions: {
        },
        tooltip: {
            y: {
                formatter: onHoverTooltipFormatter
            }
        },
        labels: ['在线', '离线'],
    }

    const xlOptions: ApexOptions= {
        chart: {
            height: 200,
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                dataLabels: {
                    name: {
                        fontSize: '22px',
                    },
                    value: {
                        fontSize: '16px',
                    },
                    total: {
                        show: true,
                        label: '康复人数',
                        formatter: function (w) {
                            // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                            return patientList.length.toString()
                        }
                    }
                }
            }
        },
        labels: ['康复人数', '活跃人数'],
    }

  return (
    <Container>
        <Title>数据汇总</Title>
        <Grid container spacing={3}>
            <Grid item xs={4} md={4}>
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image="/images/shebei.jpg"
                        title="equipment"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                            设备状况
                        </Typography>
                        <Divider />
                        <ReactApexChart options={options} type="donut" series={equipmentSeries} height={200} />
                        <Divider />
                        <br/>
                        <Box>
                            <Typography variant="subtitle1" style={{display:'inline-block'}}>
                                设备数量:&emsp;
                            </Typography>
                            <Typography variant="h5" color="primary" style={{display:'inline-block'}}>
                                {equipmentList.length}
                            </Typography>
                        </Box>

                        {/*<Box>*/}
                        {/*    <Typography variant="subtitle1" style={{display:'inline-block'}}>*/}
                        {/*        在线设备数量:&emsp;*/}
                        {/*    </Typography>*/}
                        {/*    <Typography variant="h5" color="green" style={{display:'inline-block'}}>*/}
                        {/*        {onlineEquipment.length}台*/}
                        {/*    </Typography>*/}
                        {/*</Box>*/}

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
                    {/*<CardActions>*/}
                    {/*    <Button size="small">设备配置</Button>*/}
                    {/*    <Button size="small">详细信息</Button>*/}
                    {/*</CardActions>*/}
                </Card>
            </Grid>
            {/*<Grid item xs={4} md={4}>*/}
            {/*    <Card sx={{ maxWidth: 345 }}>*/}
            {/*        <CardMedia*/}
            {/*            sx={{ height: 140 }}*/}
            {/*            image="/images/xunlian.jpg"*/}
            {/*            title="xl"*/}
            {/*        />*/}
            {/*        <CardContent>*/}
            {/*            <Typography gutterBottom variant="h6" component="div">*/}
            {/*                训练数据*/}
            {/*            </Typography>*/}
            {/*            <Card sx={{maxWidth: 320, height: 110}}>*/}
            {/*                <AccessTimeFilledIcon style={{display:'inline-block'}} color="secondary" sx={{fontSize: 45 }}/>*/}
            {/*                <Typography style={{display:'inline-block'}} variant="body2" color="text.secondary">*/}
            {/*                    总训练时长*/}
            {/*                </Typography>*/}
            {/*                <CardContent style={{ textAlign: 'center' }}>*/}
            {/*                    <Typography variant="h5" color="primary" style={{display:'inline-block'}}>*/}
            {/*                        0小时 <br />*/}
            {/*                    </Typography>*/}
            {/*                </CardContent>*/}
            {/*            </Card>*/}
            {/*            <br/>*/}

            {/*            <Card sx={{maxWidth: 320, height: 110}}>*/}
            {/*                <AssessmentIcon style={{display:'inline-block'}} color="secondary" sx={{ fontSize: 45 }}/>*/}
            {/*                <Typography style={{display:'inline-block'}} variant="body2" color="text.secondary">*/}
            {/*                    总训练次数*/}
            {/*                </Typography>*/}
            {/*                <CardContent style={{ textAlign: 'center' }}>*/}
            {/*                    <Typography variant="h5" color="primary" style={{display:'inline-block'}}>*/}
            {/*                        0次*/}
            {/*                    </Typography>*/}
            {/*                    <br />*/}
            {/*                </CardContent>*/}
            {/*            </Card>*/}
            {/*        </CardContent>*/}
            {/*        /!*<CardActions>*!/*/}
            {/*        /!*    <Button size="small">分享</Button>*!/*/}
            {/*        /!*    <Button size="small">了解更多</Button>*!/*/}
            {/*        /!*</CardActions>*!/*/}
            {/*    </Card>*/}
            {/*</Grid>*/}

            <Grid item xs={4} md={4}>
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image="/images/patient.jpg"
                        title="patient"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                            患者数据
                        </Typography>
                        <Divider />
                        <ReactApexChart options={xlOptions} type="radialBar" series={patientSeries} height={200}/>
                        <Divider />
                        {/*<Box>*/}
                        {/*    <Typography variant="subtitle1" style={{display:'inline-block'}}>*/}
                        {/*        参与康复训练患者总数:&emsp;*/}
                        {/*    </Typography>*/}
                        {/*    <Typography variant="h5" color="primary" style={{display:'inline-block'}}>*/}
                        {/*        {patientList.length}位*/}
                        {/*    </Typography>*/}
                        {/*</Box>*/}

                        <br/>
                        <Box>
                            <Typography variant="subtitle1" style={{display:'inline-block'}}>
                                活跃人数:&emsp;
                            </Typography>
                            <Typography variant="h5" color="green" style={{display:'inline-block'}}>
                                {activePatientCount}
                            </Typography>
                        </Box>
                    </CardContent>
                    {/*<CardActions>*/}
                    {/*    <Button size="small">分享</Button>*/}
                    {/*    <Button size="small">了解更多</Button>*/}
                    {/*</CardActions>*/}
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
                        <Typography gutterBottom variant="h6" component="div">
                            系统情况
                        </Typography>
                        <br/>
                        <Typography variant="body1" color="text.secondary">CPU使用率:&emsp;{Number(systemInformation.cpu_usage).toFixed(2)}%</Typography>
                        <Divider/>
                        <br/>
                        <Typography variant="body1" color="text.secondary">总内存(GB):&emsp;{Number(systemInformation.total_memory_gb).toFixed(2)}</Typography>
                        <Divider/>
                        <br/>
                        <Typography variant="body1" color="text.secondary">占用内存(GB):&emsp;{Number(systemInformation.used_memory_gb).toFixed(2)}</Typography>
                        <Divider/>
                        <br/>
                        <Typography variant="body1" color="text.secondary">磁盘利用率:&emsp;{Number(systemInformation.disk_usage).toFixed(2)}%</Typography>
                        <Divider/>
                        <br/>
                    </CardContent>
                    {/*<CardActions>*/}
                    {/*    <Button size="small">分享</Button>*/}
                    {/*    <Button size="small">了解更多</Button>*/}
                    {/*</CardActions>*/}
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
                        <Typography gutterBottom variant="h6" component="div">
                            故障联系
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            联系方式：{Phone}
                        </Typography>
                    </CardContent>
                    {/*<CardActions>*/}
                    {/*    <Button size="small">分享</Button>*/}
                    {/*    <Button size="small">了解更多</Button>*/}
                    {/*</CardActions>*/}
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
                        <Typography gutterBottom variant="h6" component="div">
                            意见反馈
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            邮箱：{Email}
                        </Typography>
                    </CardContent>
                    {/*<CardActions>*/}
                    {/*    <Button size="small">分享</Button>*/}
                    {/*    <Button size="small">了解更多</Button>*/}
                    {/*</CardActions>*/}
                </Card>
            </Grid>
        </Grid>
    </Container>
  );
}

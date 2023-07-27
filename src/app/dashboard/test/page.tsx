'use client';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts'

import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';

import { useRef, useEffect } from "react";
import { AutoFixed } from "./auto-fixed";

const actions = [
  { icon: <FileCopyIcon />, name: 'Copy' },
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' },
];
export default function Test() {

  const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
  const series = [1, 2];
  const xlseries = [80, 60];

  const onHoverTooltipFormatter = (val: number,opts: { seriesIndex: number, dataPointIndex: number, w: any }) => {
    console.log("onHoverTooltipFormatter")
    return `${val}`;
  };

  const eqoptions: ApexOptions= {
    title: {
      text: '设备总数3台',
      align: 'center',
    },
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


  const xloptions: ApexOptions= {
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
            label: '总患者数',
            formatter: function (w) {
              // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
              return "100"
            }
          }
        }
      }
    },
    labels: ['参与患者数', '活跃患者数'],
  }
  return (
      <>
        <ReactApexChart options={eqoptions} type="donut" series={series} height={200} />
        <ReactApexChart options={xloptions} type="radialBar" series={xlseries} height={200}/>
        {/*<Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>*/}
        {/*  <SpeedDial*/}
        {/*      ariaLabel="SpeedDial basic example"*/}
        {/*      sx={{ position: 'absolute', bottom: 16, right: 16 }}*/}
        {/*      icon={<SpeedDialIcon />}*/}
        {/*  >*/}
        {/*    <ReactApexChart options={xloptions} type="radialBar" series={xlseries} height={200}/>*/}
        {/*    {actions.map((action) => (*/}
        {/*        <SpeedDialAction*/}
        {/*            key={action.name}*/}
        {/*            icon={action.icon}*/}
        {/*            tooltipTitle={action.name}*/}
        {/*        />*/}
        {/*    ))}*/}
        {/*  </SpeedDial>*/}
        {/*</Box>*/}

        <div>
          {/*<AutoFixed top="0px" height="20px">*/}
          {/*  <div style={{ backgroundColor: "#bababa" }}>*/}
          {/*    我是悬浮内容，距离顶部 0px ，一直吸顶*/}
          {/*  </div>*/}
          {/*</AutoFixed>*/}
          {/*<div style={{ height: "300px" }}>我是占位 1，高度300px</div>*/}
          {/*<AutoFixed*/}
          {/*    top="20px"*/}
          {/*    height="20px"*/}
          {/*    // fixed状态改变时*/}
          {/*    onFixedChange={(isFixed): void => {*/}
          {/*      console.log(`isFixed: ` + isFixed);*/}
          {/*    }}*/}
          {/*    // fixed状态需要添加的className*/}
          {/*    fixedClassName="hello"*/}
          {/*    // fixed状态需要添加的style*/}
          {/*    fixedStyle={{ color: "red" }}*/}
          {/*>*/}
          {/*  <div style={{ backgroundColor: "#bababa" }}>*/}
          {/*    我是悬浮内容，距离顶部为 20px 吸顶*/}
          {/*  </div>*/}
          {/*</AutoFixed>*/}
          {/*<div style={{ height: "500px" }}>我是占位 2，高度500px</div>*/}
          {/*<AutoFixed*/}
          {/*    bottom="20px"*/}
          {/*    height="20px"*/}
          {/*    // fixed状态改变时*/}
          {/*    onFixedChange={(isFixed): void => {*/}
          {/*      console.log(`isFixed: ` + isFixed);*/}
          {/*    }}*/}
          {/*    // fixed状态需要添加的className*/}
          {/*    fixedClassName="hello"*/}
          {/*    // fixed状态需要添加的style*/}
          {/*    fixedStyle={{ color: "red" }}*/}
          {/*>*/}
          {/*  <div style={{ backgroundColor: "#bababa" }}>*/}
          {/*    我是悬浮内容，距离底部 20px吸底*/}
          {/*  </div>*/}
          {/*</AutoFixed>*/}
          {/*<div style={{ height: "300px" }}>我是占位 3，高度300px</div>*/}
          <AutoFixed top="10px" height="20px">
            {/*<div style={{ backgroundColor: "#bababa" }}>*/}
            {/*  我是悬浮内容，距离底部为 0px，一直吸底。*/}
            {/*</div>*/}
            <ReactApexChart options={xloptions} type="radialBar" series={xlseries} height={200}/>
          </AutoFixed>
        </div>
      </>




  )
}
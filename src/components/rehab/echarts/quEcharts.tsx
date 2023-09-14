"use client";
import ReactECharts from 'echarts-for-react';
import {getRandomDate} from "@/utils/mct-utils";
import React from "react";

export const quEcharts = React.memo(function EChartsTest() {
  // 10 天
  const categoryCount = 500;

  const xAxisData: string[] = [];
  const quData: number[] = [];

  for (let i = 0; i < categoryCount; i++) {
    let val = Math.random() * 1000;
    let date = getRandomDate('2023-08-10 09:00:00', '2023-08-10 09:30:00', 'HH:mm:ss')
    xAxisData.push(date as string);
    quData.push(Number(val.toFixed(2)));
  }
  // xAxisData.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  xAxisData.sort((a, b) => a.localeCompare(b));

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      data: xAxisData
    },
    yAxis: {},
    series: [
      {
        type: 'bar',
        name: '屈',
        data: quData,
        itemStyle: {
          opacity: 0.5
        },
      }
    ]
  };

  return (
    <ReactECharts option={option} />
  )
});
"use client";
import ReactECharts from 'echarts-for-react';
import {CustomSeriesRenderItemAPI} from "echarts/types/dist/echarts";
import {getRandomDate} from "@/utils/mct-utils";
import PrescriptionTable from "@/components/rehab/prescription/PrescriptionTable";
import React from "react";


export const EChartsTest = React.memo(function EChartsTest(){
  // 2 类
  const yearCount = 2;
  // 10 天
  const categoryCount = 10;

  const xAxisData: string[] = [];
  const customData: number[][] = [];
  const legendData: string[] = [];
  const dataList: number[][] = [];

  for (let i = 0; i < yearCount; i++) {
    dataList.push([]);
  }

  const encodeY = Array.from({ length: yearCount }, (_, i) => 1 + i);
  // legendData.push('trend');
  // legendData.push(...Array.from({ length: yearCount }, (_, i) => (2010 + i).toString()));
  legendData.push('');
  legendData.push('屈');
  legendData.push('伸');
  for (let i = 0; i < categoryCount; i++) {
    let val = Math.random() * 1000;
    let date = getRandomDate('2023-08-10 09:00:00', '2023-08-10 09:30:00', 'HH:mm:ss')
    xAxisData.push(date as string);
    let customVal = [i];
    customData.push(customVal);

    for (let j = 0; j < dataList.length; j++) {
      let value = j === 0
          ? Number(val.toFixed(2))
          : Number((Math.max(0, dataList[j - 1][i] + (Math.random() - 0.5) * 200)).toFixed(2));
      dataList[j].push(value);
      customVal.push(value);
    }
  }
  // xAxisData.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  xAxisData.sort((a, b) => a.localeCompare(b));

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: legendData
    },
    dataZoom: [
      {
        type: 'slider',
        start: 50,
        end: 70
      },
      {
        type: 'inside',
        start: 50,
        end: 70
      }
    ],
    xAxis: {
      data: xAxisData
    },
    yAxis: {},
    series: [
      {
        type: 'custom',
        name: 'trend',
        renderItem: function (params:any, api: CustomSeriesRenderItemAPI) {
          let xValue = api.value(0);
          let currentSeriesIndices = api.currentSeriesIndices();
          let barLayout = api.barLayout({
            barGap: '30%',
            barCategoryGap: '20%',
            count: currentSeriesIndices.length - 1
          });

          let points = [];
          for (let i = 0; i < currentSeriesIndices.length; i++) {
            let seriesIndex = currentSeriesIndices[i];
            if (seriesIndex !== params.seriesIndex) {
              let point = api.coord([xValue, api.value(seriesIndex)]);
              point[0] += barLayout[i - 1].offsetCenter;
              point[1] -= 20;
              points.push(point);
            }
          }

          let color = api.visual('color');
          let style = {
            stroke: color,
            fill: 'none',
            lineWidth: 0 // 可以根据需要设置线宽
          };

          return {
            type: 'polyline',
            shape: {
              points: points
            },
            style: style
          };
        },
        itemStyle: {
          borderWidth: 2
        },
        encode: {
          x: 0,
          y: encodeY
        },
        data: customData,
        z: 100
      },
      ...dataList.map((data, index) => ({
        type: 'bar',
        animation: false,
        name: legendData[index + 1],
        itemStyle: {
          opacity: 0.5
        },
        data: data
      }))
    ]
  };
  return(
      <>
        <ReactECharts option={option} />
      </>
  )
});

export default EChartsTest;
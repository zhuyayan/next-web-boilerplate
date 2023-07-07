"use client";
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {RealTimeTrainData} from "@/redux/features/rehab/rehab-slice";

interface D {
  name: string;
  uv: number;
  pv: number;
  amt: number;
}

export default function PrescriptionLine(params: {trainData:RealTimeTrainData|undefined}) {
  useEffect(() => {
    console.log("PrescriptionLine TrainData -> ", params.trainData)
  }, [params.trainData, useEffect])

  return (
      <LineChart width={500} height={300} data={params.trainData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 3000]}/>
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="D" stroke="#8884d8" activeDot={{ r: 8 }} />
        {/*<Line type="monotone" dataKey="uv" stroke="#82ca9d" />*/}
      </LineChart>
  );
}

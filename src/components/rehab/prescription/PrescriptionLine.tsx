// import React, {useEffect, useState} from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
//
//
// export default function Prescription_line(){
//     interface D {
//         name: string,
//         uv: number,
//         pv: number,
//         amt: number,
//     }
//     const [data, setData] = useState<D[]>([]);
//     useEffect(() => {
//         const timer = setInterval(() => {
//             const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 10));
//             setData(prevData => {
//                 let newData = [...prevData];
//                 if (newData.length >= 10) {
//                     newData = newData.slice(1); // 修剪数组，保留最后 4 个数据
//                 }
//                 newData.push({
//                     name: 'Page ' + randomLetter,
//                     uv: Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000,
//                     pv: Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000,
//                     amt: Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000,
//                 });
//                 return newData;
//             });
//         }, 1000);
//
//         return () => clearInterval(timer);
//     }, []);
//     return (
//             <LineChart
//                 width={500}
//                 height={300}
//                 data={data}
//                 margin={{
//                     top: 5,
//                     right: 30,
//                     left: 20,
//                     bottom: 5,
//                 }}
//             >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
//                 <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
//             </LineChart>
//     );
// }

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface D {
  name: string;
  uv: number;
  pv: number;
  amt: number;
}

export default function PrescriptionLine() {
  const [data, setData] = useState<D[]>([]);

  useEffect(() => {
    let count = 0;
    const timer = setInterval(() => {
      count++;
      setData(prevData => {
        const newData = [...prevData];
        const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 10));
        const newDataPoint = {
          name: 'Page ' + randomLetter,
          uv: Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000,
          pv: Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000,
          amt: Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000,
        };

        if (count <= 10) {
          newData.push(newDataPoint);
        } else {
          newData.shift();
          newData.push(newDataPoint);
        }

        return newData;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
      <LineChart width={500} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
  );
}

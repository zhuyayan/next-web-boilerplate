"use client";
// ** MUI Imports
import * as React from 'react';
import { styled as muiStyled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import TableRow, {TableRowProps} from '@mui/material/TableRow';

import {
  Card, CardContent, Chip,
  IconButton, Typography,
} from "@mui/material";
import styled from "styled-components";
import {
  EquipmentOnline,
  Prescription,
} from "@/redux/features/rehab/rehab-slice";
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    success: {
      main: '#81c784',
      contrastText: '#ffffff',
    },
  },
});

const MCTFixedWidthChip = styled(Chip)<{color?: string}>`
  width: 70px;  // 你可以调整这里的宽度值
  background-color: ${props => props.color || 'primary'};
  @media (min-width: 600px) {  // 中屏幕，例如：平板
    width: 60px;
  }

  @media (min-width: 960px) {  // 大屏幕，例如：桌面
    width: 70px;
  }
`;

export default function StickyHeadTable(params: { id: string,PId:string,
  prescription:Prescription[],
  onlineEquipment: EquipmentOnline[]}) {
  return (
    <>
      {params.prescription?.map(row => (
      <Card key={row.id}>
        <CardContent>
          <Typography>编号：</Typography>
          <Typography>模式:</Typography>
          <Typography>部位:</Typography>
          <Typography>训练时长或次数: </Typography>
          <Typography>弯曲定时值: </Typography>
          <Typography>伸展定时值: </Typography>
          {/*<ThemeProvider theme={theme}>*/}
          {/*  <Typography align='right'>*/}
          {/*    {*/}
          {/*      (() => {*/}
          {/*        let label = row.prescription_record?.length + ' / ' + row.duration;*/}
          {/*        let color = 'success';*/}
          {/*        if (row.prescription_record?.length == row.duration) {*/}
          {/*          color = 'success';*/}
          {/*        } else if (row.prescription_record?.length && row.duration && row.prescription_record.length < row.duration) {*/}
          {/*          color = 'primary';*/}
          {/*        }*/}
          {/*        return <MCTFixedWidthChip label={label} color={color} />;*/}
          {/*      })()*/}
          {/*    }*/}
          {/*  </Typography>*/}
          {/*</ThemeProvider>*/}
        </CardContent>
      </Card>
      ))}
              {params.prescription?.map(row => (
                <Card key={row.id} sx={{ marginBottom: 2 }}>
                  <CardContent>
                    <Typography variant="h6">编号：{row.created_at}</Typography>
                    <Typography>模式: {row.mode}</Typography>
                    <Typography>部位: {row.part}</Typography>
                    <Typography>训练时长或次数: {row.zz}</Typography>
                    <Typography>弯曲定时值: {row.u}</Typography>
                    <Typography>伸展定时值: {row.v}</Typography>
                    <ThemeProvider theme={theme}>
                      <Typography align='right'>
                        {
                          (() => {
                            let label = row.prescription_record?.length + ' / ' + row.duration;
                            let color = 'success';
                            if (row.prescription_record?.length == row.duration) {
                              color = 'success';
                            } else if (row.prescription_record?.length && row.duration && row.prescription_record.length < row.duration) {
                              color = 'primary';
                            }
                            return <MCTFixedWidthChip label={label} color={color} />;
                          })()
                        }
                      </Typography>
                    </ThemeProvider>
                  </CardContent>
                </Card>
              ))}
    </>
  );
}
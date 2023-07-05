import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import styled from "styled-components";
import {SelectChangeEvent} from "@mui/material/Select";

const StyledDiv = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

interface Column {
  id: 'time' | 'pattern' | 'part' | 'count' | 'bendingtimevalue' | 'stretchtimevalue' | 'action';
  label: string;
  minWidth?: number;
  align: 'right' | 'left' | 'center';
}

const columns: readonly Column[] = [
  { id: 'time',
    label: '处方创建时间',
    minWidth: 100,
    align: 'left',
  },
  { id: 'pattern',
    label: '训练模式',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'part',
    label: '训练部位',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'count',
    label: '训练次数或时间',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'bendingtimevalue',
    label: '弯曲定时值',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'stretchtimevalue',
    label: '伸展定时值',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'action',
    label: '操作',
    minWidth: 100,
    align: 'center',
  },
];

const createData = (time: number, pattern: number, part: number, count: number, bendingtimevalue: number, stretchtimevalue: number) => {
  return { time, pattern, part, count, bendingtimevalue, stretchtimevalue}
}

const rows = [
  createData(20230627, 159, 6, 24, 4, 3),
  createData(20230622, 237, 9, 37, 4.3, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),
  createData(20230621, 262, 16, 24, 6, 3),

];

export default function StickyHeadTable() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const [device, setDevice] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setDevice(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 265 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                    <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                  <TableRow
                      key={row.time}
                      style={{height:'30px'}}
                      sx={{
                        '&:last-of-type td, &:last-of-type th': {
                          border: 0
                        },
                      }}
                  >
                    <TableCell component='th' scope='row'>
                      {row.time}
                    </TableCell>
                    <TableCell align='right'>{row.pattern}</TableCell>
                    <TableCell align='right'>{row.part}</TableCell>
                    <TableCell align='right'>{row.count}</TableCell>
                    <TableCell align='right'>{row.bendingtimevalue}</TableCell>
                    <TableCell align='right'>{row.stretchtimevalue}</TableCell>
                    <TableCell align='right'>
                      <ButtonGroup variant="outlined" aria-label="outlined button group" style={{height:'20px'}}>
                        <Button color="primary"  onClick={handleClickOpen}>下发</Button>
                        <Button color="primary">修改</Button>
                        <Button color="secondary">删除</Button>
                      </ButtonGroup>
                    </TableCell>
                    <div>
                      <Dialog open={open} onClose={handleClose}>
                        <DialogContent>
                          <DialogContentText>
                            请选择要下发至哪台康复仪
                          </DialogContentText>
                          <StyledDiv>
                            <Box>
                              <FormControl sx={{ m: 1, minWidth: 240 }} size="small">
                                <InputLabel id="device">康复仪设备</InputLabel>
                                <Select
                                    labelId="device"
                                    id="device"
                                    value={device}
                                    label="device"
                                    onChange={handleChange}
                                >
                                  <MenuItem value={10}>设备1</MenuItem>
                                  <MenuItem value={20}>设备二</MenuItem>
                                </Select>
                              </FormControl>
                            </Box>
                          </StyledDiv>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>取消</Button>
                          <Button onClick={handleClose}>确定</Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  </TableRow>
              ))}

            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
  );
}

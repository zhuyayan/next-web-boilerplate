// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import {Button} from "@mui/material";

const createData = (time: number, pattern: number, part: number, count: number, bendingtimevalue: number, stretchtimevalue: number) => {
  return { time, pattern, part, count, bendingtimevalue, stretchtimevalue}
}

const rows = [
  createData(20230627, 159, 6.0, 24, 4.0,3),
  createData(20230622, 237, 9.0, 37, 4.3,3),
  createData(20230621, 262, 16.0, 24, 6.0,3),
]


export default function Prescription() {
  return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>处方创建时间</TableCell>
              <TableCell align='right'>训练模式</TableCell>
              <TableCell align='right'>训练部位</TableCell>
              <TableCell align='right'>训练次数或时间</TableCell>
              <TableCell align='right'>弯曲定时值</TableCell>
              <TableCell align='right'>伸展定时值</TableCell>
              <TableCell align='center'>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
                <TableRow
                    key={row.time}
                    sx={{
                      '&:last-of-type td, &:last-of-type th': {
                        border: 0
                      }
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
                    <Button variant="contained" color="primary">
                      下发处方
                    </Button>
                    <Button variant="contained" color="primary">
                      修改
                    </Button>
                    <Button variant="contained" color="secondary">
                      删除
                    </Button>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  )
}



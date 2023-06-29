// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import { styled } from '@mui/material/styles'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableRow, { TableRowProps } from '@mui/material/TableRow'
import TableCell, { TableCellProps, tableCellClasses } from '@mui/material/TableCell'
import {Button} from "@mui/material";

const StyledTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.common.black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const StyledTableRow = styled(TableRow)<TableRowProps>(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },

  // hide last border
  '&:last-of-type td, &:last-of-type th': {
    border: 0
  }
}))

const createData = (name: string, calories: number, fat: number, carbs: number, protein: number) => {
  return { name, calories, fat, carbs, protein }
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9)
]

const PrescriptionTable = () => {
  return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label='customized table'>
          <TableHead>
            <TableRow>
              <StyledTableCell>康复开始时间</StyledTableCell>
              <StyledTableCell align='right'>康复结束时间</StyledTableCell>
              <StyledTableCell align='right'>压力数据</StyledTableCell>
              <StyledTableCell align='right'>康复次数</StyledTableCell>
              <StyledTableCell align='center'>操作</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
                <StyledTableRow key={row.name}>
                  <StyledTableCell component='th' scope='row'>
                    {row.name}
                  </StyledTableCell>
                  <StyledTableCell align='right'>{row.calories}</StyledTableCell>
                  <StyledTableCell align='right'>{row.fat}</StyledTableCell>
                  <StyledTableCell align='right'>{row.carbs}</StyledTableCell>
                  <StyledTableCell align='right'>
                    <Button variant="contained" color="secondary">
                      删除
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  )
}
export default PrescriptionTable
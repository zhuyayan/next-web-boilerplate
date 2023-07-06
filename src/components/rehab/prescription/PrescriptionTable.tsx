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
import {useEffect} from "react";
import {
  fetchPrescriptionById,
  fetchPrescriptionRecordById,
  PrescriptionRecord
} from "@/redux/features/rehab/rehab-slice";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {useDispatch} from "react-redux";
import {RootState, useAppSelector} from "@/redux/store";


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
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
]

const PrescriptionTable = (params: {record: PrescriptionRecord[]}) => {
  // const record = useAppSelector((state: RootState) => state.rehab.prescriptionRecord)
  // const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch()
  // useEffect(() => {
  //   thunkDispatch(fetchPrescriptionRecordById({id: parseInt(params.PId)}))
  // })
  return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 335 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell>康复开始时间</StyledTableCell>
                <StyledTableCell align='right'>康复结束时间</StyledTableCell>
                <StyledTableCell align='right'>状态</StyledTableCell>
                {/*<StyledTableCell align='right'>康复次数</StyledTableCell>*/}
                <StyledTableCell align='center'>操作</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {params.record.map(row => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component='th' scope='row'>
                      {row.created_at}
                    </StyledTableCell>
                    <StyledTableCell align='right'>{row.updated_at}</StyledTableCell>
                    {/*<StyledTableCell align='right'>{row.state}</StyledTableCell>*/}
                    <StyledTableCell align='right'>{row.state}</StyledTableCell>
                    <StyledTableCell align='right'>
                      <Button style={{height:'20px'}} variant="outlined" color="secondary">
                        删除
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
              ))}

            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

  )
}
export default PrescriptionTable
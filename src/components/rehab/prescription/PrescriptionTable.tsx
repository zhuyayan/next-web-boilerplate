// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import { styled } from '@mui/material/styles'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableRow, { TableRowProps } from '@mui/material/TableRow'
import TableCell, { TableCellProps, tableCellClasses } from '@mui/material/TableCell'
import {Button, ButtonGroup, IconButton} from "@mui/material";
import {
  deletePrescription,
  PrescriptionRecord
} from "@/redux/features/rehab/rehab-slice";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import {Delete as DeleteIcon} from "@mui/icons-material";
import React from "react";
import DownloadIcon from "@mui/icons-material/Download";
import {useAppDispatch} from "@/redux/store";
//import ExportJsonExcel from "js-export-excel";


const StyledTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.black,
    backgroundColor: theme.palette.common.white
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

//生成excel
// const handleOneExportExcel = () => {
//   let sheetFilter = ["creat_at", "update_at", "state"];
//   let option: {
//     fileName?: string;
//     datas?: any;
//   } = {};
//   option.fileName = '康复记录';
//   option.datas = [
//     {
//       sheetData: ,
//       sheetName: '康复记录',
//       sheetFilter: sheetFilter,
//       sheetHeader: ['康复开始时间', '康复结束时间', '状态'],
//       columnWidths: [20,20,10]
//     },
//   ];
//
//   let toExcel = new ExportJsonExcel(option); //生成
//   toExcel.saveExcel(); //保存
// }

const PrescriptionTable = (params: {record: PrescriptionRecord[]}) => {
  const appDispatch = useAppDispatch()

  // const handleDeletePrescriptionRecord = (id: number) => {
  //   if (window.confirm('是否确认删除该条处方？')) {
  //     appDispatch(deletePrescriptionRecord({id: id}))
  //   }
  // };

  return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 280 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{minWidth: 165}}>康复开始时间</StyledTableCell>
                <StyledTableCell sx={{minWidth: 165}} align='right'>康复结束时间</StyledTableCell>
                <StyledTableCell align='right' sx={{minWidth: 70}}>状态</StyledTableCell>
                {/*<StyledTableCell align='right'>康复次数</StyledTableCell>*/}
                <StyledTableCell sx={{minWidth: 160}} align='center'>操作</StyledTableCell>
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
                    <StyledTableCell align='center'>
                      {/*<ButtonGroup style={{height: '20px'}} variant="outlined">*/}
                      {/*  <Button color="primary" style={{width: '65px'}}>*/}
                      {/*    导出*/}
                      {/*  </Button>*/}
                      {/*  <Button color="secondary" style={{width: '65px'}}>*/}
                      {/*    删除*/}
                      {/*  </Button>*/}
                      {/*</ButtonGroup>*/}
                      <Tooltip title="导出">
                        <IconButton
                            aria-label="download"
                            color="primary"
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="删除">
                        <IconButton
                            aria-label="delete"
                            color="secondary"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

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
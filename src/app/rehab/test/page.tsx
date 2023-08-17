"use client"
import * as React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
} from '@mui/material';

interface RowData {
  id: number;
  name: string;
  details: string;
}

interface SubRowData {
  id: number;
  description: string;
}

interface Column {
  id: keyof RowData;
  label: string;
}

const columns: Column[] = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Name' },
  { id: 'details', label: 'Details' },
];

const subColumns: Column[] = [
  { id: 'id', label: 'ID' },
  { id: 'description', label: 'Description' },
];

const initialData: RowData[] = [
  { id: 1, name: 'Item 1', details: 'Details for Item 1' },
  { id: 2, name: 'Item 2', details: 'Details for Item 2' },
  // ... add more data as needed
];

const initialSubData: SubRowData[] = [
  { id: 1, description: 'Description 1' },
  { id: 2, description: 'Description 2' },
  // ... add more data as needed
];

export default function ExpandableTable() {
  // const [openRows, setOpenRows] = React.useState<{ [key: number]: boolean }>({});
  const [openRows, setOpenRows] = React.useState<{ [key: number]: boolean }>(() => {
    const OpenState: { [key: number]: boolean } = {};
    OpenState[params.prescription[0].id] = true; // 默认展开第一条记录
    return OpenState;
  });

  const handleRowClick = (rowId: number) => {
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [rowId]: !prevOpenRows[rowId],
    }));
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {initialData.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow onClick={() => handleRowClick(row.id)}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>{row[column.id]}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <Collapse in={openRows[row.id]} timeout="auto" unmountOnExit>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            {subColumns.map((column) => (
                              <TableCell key={column.id}>{column.label}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {initialSubData.map((subRow) => (
                            <TableRow key={subRow.id}>
                              {subColumns.map((column) => (
                                <TableCell key={column.id}>{subRow[column.id]}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

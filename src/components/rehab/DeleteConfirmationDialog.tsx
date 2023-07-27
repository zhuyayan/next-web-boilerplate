import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import styled from "styled-components";

const RedButton = styled(Button)` 
  &.MuiButton-contained {
    background-color: rgb(255, 51, 10);
    color: #fff;
  }
  &.MuiButton-contained:hover {
    background-color: rgb(185, 38, 11);
  }
`;

interface DeleteConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    deleteItemName: string;
}

const DeleteConfirmationDialog:
  React.FC<DeleteConfirmationDialogProps> = (
    {
      open,
      onClose,
      onConfirm,
      deleteItemName,
    }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: { sx: {backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
    }}
      PaperProps={{ elevation: 0 }}>
            <DialogTitle>确认操作</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {`是否确认删除 `}
                    <span style={{ fontWeight: 'bold' }}>
            {`[${deleteItemName}]`}
          </span>
                    {` 的账户信息？`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <RedButton variant="contained" onClick={onConfirm} size="small">
                    删除
                </RedButton>
                <Button variant="outlined" onClick={onClose} size="small">
                    取消
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;

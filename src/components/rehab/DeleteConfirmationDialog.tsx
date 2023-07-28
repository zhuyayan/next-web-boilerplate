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

const MCTStyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
    padding: 16px;
    width: 80vw;
    max-width: 500px;
  }
  & .MuiDialogTitle-root {
    padding: 1px;
  }
  & .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0.7);
  }
  & .MuiDialogContent-root {
    padding: 1px;
  }
  & .MuiDialogContentText-root {
    margin-top: 10px;
    font-size: 14px;
  }
  & .MuiDialogTitle-root {
    
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
    <MCTStyledDialog
      open={open}
      onClose={onClose}
      PaperProps={{ elevation: 0 }}>
            <DialogTitle>确认操作</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {`是否确认删除 `}
                    <span style={{ fontWeight: 'bold' }}>
            {`[${deleteItemName}]`}
          </span>
                    {` 的信息？`}
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
        </MCTStyledDialog>
    );
};

export default DeleteConfirmationDialog;

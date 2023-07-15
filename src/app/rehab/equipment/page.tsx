"use client";
import {Container, Typography} from '@mui/material';
import styled from 'styled-components';
import React from "react";
import {RootState, useAppSelector} from "@/redux/store";

const EquipmentList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const EquipmentItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const EquipmentStatus = styled.div<{ $online: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ $online }) => ($online ? 'green' : 'grey')};
  margin-right: 8px;
`;

export default function EquipmentManagement() {
  const onlineEquipment = useAppSelector((state: RootState) => state.rehab.onlineEquipment)
  return (
    <Container>
        <br/>
      <Typography variant="h4" component="h1" sx={{ fontSize: '2.0rem', fontWeight: 'bold', color: '#333'}}>设备管理</Typography>
      <EquipmentList>
          {onlineEquipment ? (
              onlineEquipment.map((item) => (
              <EquipmentItem key={item.sId} value={item.sId}>
                  <EquipmentStatus  $online/>
                  <Typography>
                      {item.clientId}
                  </Typography>
              </EquipmentItem>
          ))
          ):null}
      </EquipmentList>
    </Container>);
}

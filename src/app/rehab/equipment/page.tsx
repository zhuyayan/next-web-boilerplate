"use client";
import {Container, MenuItem, Typography} from '@mui/material';
import styled from 'styled-components';
import {EquipmentOnline} from "@/redux/features/rehab/rehab-slice";
import React from "react";

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

export default function EquipmentManagement(params:{onlineEquipment: EquipmentOnline[]}) {
  const equipmentList = [
    { id: 1, name: '设备编号', online: true },
    { id: 2, name: '设备编号', online: false },
  ];

  return (
    <Container>
        <br/>
      <Typography variant="h4" component="h1" sx={{ fontSize: '2.0rem', fontWeight: 'bold', color: '#333'}}>设备管理</Typography>
      <EquipmentList>
        {/*{equipmentList.map((equipment) => (*/}
        {/*  <EquipmentItem key={equipment.id}>*/}
        {/*    <EquipmentStatus  $online/>*/}
        {/*    <Typography>*/}
        {/*        {equipment.name}*/}
        {/*    </Typography>*/}
        {/*  </EquipmentItem>*/}
        {/*))}*/}
          {params.onlineEquipment ? (
              params.onlineEquipment.map((item) => (
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

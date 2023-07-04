"use client";
import { Container, Typography } from '@mui/material';
import styled from 'styled-components';

const EquipmentList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const EquipmentItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const EquipmentStatus = styled.div<{ online: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ online }) => (online ? 'green' : 'grey')};
  margin-right: 8px;
`;

export default function EquipmentManagement() {
  const equipmentList = [
    { id: 1, name: '设备编号', online: true },
    { id: 2, name: '设备编号', online: false },
    // Add more devices as needed
  ];

  return (
      <Container>
        <Typography variant="h2" component="h1" sx={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333'}}>设备管理</Typography>
        <EquipmentList>
          {equipmentList.map((equipment) => (
              <EquipmentItem key={equipment.id}>
                <EquipmentStatus online={equipment.online} />
                <Typography>{equipment.name}</Typography>
              </EquipmentItem>
          ))}
        </EquipmentList>
      </Container>
  );
}

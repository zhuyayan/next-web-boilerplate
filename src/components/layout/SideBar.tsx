"use client";
import React from 'react';
import {List, ListItemButton, ListItemIcon, ListItemText, Theme} from '@mui/material';
import { Inbox as InboxIcon, Mail as MailIcon } from '@mui/icons-material';
import {useAppSelector} from "@/redux/store";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Hidden from '@mui/material/Hidden';

const SideBar: React.FC = () => {
  const appBarHeight = useAppSelector((state) => {
    return state.appBar.height
  })
  // 定义侧边栏的项
  const items = [
    { name: 'Inbox', icon: <InboxIcon />, },
    { name: 'Mail', icon: <MailIcon />, },
    { name: 'Mail', icon: <MailIcon />, },
    { name: 'Mail', icon: <MailIcon />, },
    { name: 'Mail', icon: <MailIcon />, },
    { name: 'Mail', icon: <MailIcon />, },
    { name: 'Inbox', icon: <InboxIcon />, },
  ];

  const theme: Theme = useTheme();
  const isXSmallScreen: boolean = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen: boolean = useMediaQuery(theme.breakpoints.down('md'));
  return (
      <div className="bg-gray-100" style={{height: `calc(100vh)`, backgroundColor: "#304156"}}>
        <List>
          {items.map((item, index) => (
              <ListItemButton
                  key={index}
                  // style={{ minWidth: isSmallScreen ? '40px' : '40px' }}
                  onClick={() => { console.log(`Clicked on ${item.name}`); }} >
                <ListItemIcon
                    // style={{ minWidth: isSmallScreen ? '30px' : '30px', width: '30px' }}
                >
                  {item.icon}
                </ListItemIcon>
                <Hidden mdDown>
                  <ListItemText primary={item.name} />
                </Hidden>
              </ListItemButton>
          ))}
        </List>
      </div>
  )
}

export default SideBar;

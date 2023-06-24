"use client";
import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Inbox as InboxIcon, Mail as MailIcon } from '@mui/icons-material';
import {useAppSelector} from "@/redux/store";

const SideBar: React.FC = () => {
  const appBarHeight = useAppSelector((state) => {
    return state.appBar.height
  })
  // const appBarHeight: number = 64
  return (
      <div className="w-64 bg-gray-100" style={{ height: `calc(100vh - ${appBarHeight}px)`}}>
        <List>
          <ListItem>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Inbox" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>
            <ListItemText primary="Mail" />
          </ListItem>
        </List>
      </div>
  )
}

export default SideBar;

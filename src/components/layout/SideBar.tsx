"use client";
import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Inbox as InboxIcon, Mail as MailIcon } from '@mui/icons-material';

const Sidebar: React.FC = () => {
  const appBarHeight = useAppBarHeight();
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
  );
};

export default Sidebar;

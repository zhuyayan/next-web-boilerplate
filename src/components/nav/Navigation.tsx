"use client";
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemText } from '@mui/material';
import React from "react";

function Navigation() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (isOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    setOpen(isOpen);
  };

  const list = () => (
      <div
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
      >
        <List>
          {['Home', 'About', 'Contact'].map((text, index) => (
              <Link href={`/${text.toLowerCase()}`} passHref key={text}>
                <ListItem button component="a">
                  <ListItemText primary={text} />
                </ListItem>
              </Link>
          ))}
        </List>
      </div>
  );

  return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">
              My App
            </Typography>
            <Button onClick={toggleDrawer(true)}>Open Menu</Button>
          </Toolbar>
        </AppBar>
        <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>
      </div>
  );
}

export default Navigation;

"use client";
import Navigation from "@/components/nav/Navigation";
import IconButton from "@mui/material/IconButton";
import * as React from "react";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
function MyApp() {
  return (
      <div>
        <Navigation />
        <IconButton style={{ fontSize: '16px' }}>123</IconButton>
        <IconButton color="primary" aria-label="add to shopping cart">
          <AddShoppingCartIcon />
        </IconButton>
      </div>
  );
}

export default MyApp;

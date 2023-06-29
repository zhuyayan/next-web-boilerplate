"use client";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {useEffect, useRef} from "react";
import {useDispatch} from "react-redux";
import {setHeight} from "@/redux/features/layout-slice";
import {Dialog, Popover, Slide} from "@mui/material";
import {useAppSelector} from "@/redux/store";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {TransitionProps} from "@mui/material/transitions";

const pages: string[] = ['用户', '设备', '康复', '配置'];
const settings: string[] = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props}/>;
});

export default function NavBar() {
  const appBarRef = useRef<HTMLDivElement>(null);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    console.log('handlePopoverOpen')
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);


  const dispatch = useDispatch();
  const appBarHeight = useAppSelector((state) => {
    return state.appBar.height
  })
  useEffect(() => {
    const currentRef = appBarRef.current;
    const resizeObserver : ResizeObserver = new ResizeObserver((entries,observer) => {
      for (let entry of entries) {
        dispatch(setHeight(entry.contentRect.height));
      }
    })

    if (currentRef) {
      resizeObserver.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
    }
  })

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleSideBarToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("handleSideBarToggle");
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  }

  const id = open ? 'simple-popover' : undefined;
  return (
      <AppBar position="static" ref={appBarRef}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ display: { xs: 'none', md: 'flex', lg: 'none' }, mr: 1 }}
                onClick={handleSideBarToggle}
            >
              <MenuIcon />
            </IconButton>

            <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
            >
              LOGO1
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  // onClick={handleOpenNavMenu}
                  onClick={handleClickOpen}
                  color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Dialog
                  fullScreen
                  open={open}
                  onClose={handleClose}
                  TransitionComponent={Transition}
              >
                <AppBar sx={{ position: 'relative' }}>
                  <Toolbar>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <IconButton
                          edge="start"
                          color="inherit"
                          onClick={handleClose}
                          aria-label="close"
                      >
                        <CloseIcon />
                      </IconButton>

                      <Typography
                          variant="h5"
                          noWrap
                          component="a"
                          href=""
                          sx={{
                            margin: 'auto',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                          }}
                      >
                        LOGO2
                      </Typography>
                      <Box sx={{ width: "24px", height: "24px" }} />
                      {/* Placeholder box with the same dimensions as your IconButton */}
                    </Box>
                  </Toolbar>
                </AppBar>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                      display: { xs: 'block', md: 'none' },
                    }}
                >
                  {pages.map((page) => (
                      <MenuItem key={page} onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">{page}</Typography>
                      </MenuItem>
                  ))}
                </Menu>
              </Dialog>
            </Box>

            <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
                onMouseEnter={handlePopoverOpen}
                // onMouseLeave={handlePopoverClose}
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
            >
              LOGO3
            </Typography>
            <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
                onMouseEnter={handlePopoverOpen}
                // onMouseLeave={handlePopoverClose}
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
            >
              LOGO4
            </Typography>
            {/*<Box style={{marginTop: appBarHeight+'px', flexGrow: 1}}>*/}
            <Box>
              <Popover
                  id={id}
                  open={openPopover}
                  anchorEl={anchorEl}
                  onClose={handlePopoverClose}
                  onMouseLeave={handlePopoverClose}
                  anchorReference="anchorPosition"
                  anchorPosition={{ top: appBarHeight, left: 0 }}
                  sx={{
                    '.MuiPaper-root': {
                      width: '100vh',
                      height: '20vh',
                    }
                  }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography>The content of the Popover.</Typography>
                </Box>
              </Popover>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                  <Button
                      key={page}
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page}
                  </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
  );
}

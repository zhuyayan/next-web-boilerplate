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
import {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {fetchConfig, setHeight} from "@/redux/features/layout-slice";
import {Dialog, Popover, Slide} from "@mui/material";
import {RootState, useAppSelector} from "@/redux/store";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {TransitionProps} from "@mui/material/transitions";
import Link from "next/link";
import styled from "styled-components";
import { useSelector } from 'react-redux';
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {asyncSysTime} from "@/redux/features/rehab/rehab-slice";
import {GetCurrentDateTime} from "@/utils/mct-utils";
import screenfull from "screenfull"
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

interface MCTMenu {
  name: string,
  path: string
}

const pages: MCTMenu[] = [
  {
    name: "病人",
    path: "/rehab/patient",
  },
  {
    name: "用户",
    path: "/rehab/staff",
  },
  {
    name: "统计",
    path: "/rehab/equipment",
  },
  {
    name: "配置",
    path: "/rehab/config",
  }];

const settings: string[] = ['Logout'];

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props}/>;
});

const MCTStyledButton = styled(Button)`
  &&:hover {
    background-color: #5ba2e8; // 设置 hover 状态下的背景颜色
  }
  
  font-size: 16px;
  color: white;
  display: block;
`;

export default function NavBar() {
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch()
  const appBarRef = useRef<HTMLDivElement>(null);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const hospitalName = useSelector((state:RootState) => state.appBar.rsConfig.Hospital.Name);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    thunkDispatch(fetchConfig())
    thunkDispatch(asyncSysTime({date_time: GetCurrentDateTime()}))
  },[thunkDispatch])

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    console.log('handlePopoverOpen')
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);


  const dispatch = useDispatch();
  const appBarHeight = useAppSelector((state:RootState) => {
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

  const fullScreen = () => {
      if(screenfull.isFullscreen){
          setIsFullscreen(false);
      }
      else {
          setIsFullscreen(true);
      }
      screenfull.toggle()
  };

    const handleLogout = (): void => {
        // 执行注销逻辑，例如清除用户登录状态等
        // 跳转到登录页面
        window.location.href = '/login';
    };
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
                  fontSize: '28px',
                  fontWeight: 800,
                  letterSpacing: '.3rem',
                  textDecoration: 'none',
                  color: '#ffffff',
                }}
            >
              <Avatar alt="Remy Sharp" src="/images/logo/新起点logo.png" sx={{marginRight:1, width: 40, height: 40, borderRadius: '4px',backgroundColor: 'transparent'}}/>
                {hospitalName}
              {/*<Image*/}
              {/*    src="/images/logo/MCTlogo.png"*/}
              {/*    alt="Vercel Logo"*/}
              {/*    // className="dark:invert"*/}
              {/*    width={100}*/}
              {/*    height={24}*/}
              {/*    priority*/}
              {/*/>*/}
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
                      <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">{page.name}</Typography>
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
              MCT
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
                  <Link
                      key={page.name}
                      href={page.path} passHref>
                    <MCTStyledButton
                        key={page.name}>
                      {page.name}
                    </MCTStyledButton>
                  </Link>
              ))}
            </Box>

              <Box sx={{ flexGrow: 0 }} style={{marginRight:6}}>
                  <Tooltip title="全屏显示">
                      <IconButton
                          aria-label="screenfull"
                          onClick={fullScreen}
                      >
                          {isFullscreen ? <FullscreenExitIcon style={{ color: '#fafafa', fontSize: 48}} /> : <FullscreenIcon style={{ color: '#fafafa', fontSize: 48 }} />}
                      </IconButton>
                  </Tooltip>
              </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="设置">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {/*<Avatar alt="Remy Sharp" src="/images/logo/灼远logo.jpg" sx={{ width: 150, height: 60, borderRadius: '8px' }}/>*/}
                  <Avatar alt="Remy Sharp" src="/images/logo/灼远logo.jpg" sx={{marginRight:2}}/>
                  <Avatar alt="Remy Sharp" src="/images/logo/MCTlogo.png" />
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
                {/*{settings.map((setting) => (*/}
                {/*    <MenuItem key={setting} onClick={handleCloseUserMenu}>*/}
                {/*      <Typography textAlign="center">{setting}</Typography>*/}
                {/*    </MenuItem>*/}
                {/*))}*/}
                  <MenuItem key="Logout" onClick={handleLogout}>
                      <Typography textAlign="center">退出</Typography>
                  </MenuItem>
              </Menu>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>
  );
}

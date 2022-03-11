import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Container from '@mui/material/Container';
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const appTheme = createTheme({
    palette: {
      primary: {
        main: '#4d98cf',
      },
    },
  });

export default function Navbar() {

    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <ThemeProvider theme={appTheme}>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                       
                        <AccessTimeIcon sx={{ mr: 1 }}/>
                        <Link to="/">
                            <Typography variant="h6" noWrap component="div" sx={{mr: 2, display: { xs: 'none', md: 'flex', color: '#fff' }}}>
                                60 Seconds
                            </Typography>
                        </Link>
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton 
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={handleOpenNavMenu}
                            >
                                <MenuIcon/>
                            </IconButton>
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
                                    horizontal:'left'
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: {xs: 'block', md: 'none'}
                                }}
                            >

                                <MenuItem key={"Calendar"} onClick={handleCloseNavMenu}>
                                    <Link to="/calendar" >
                                        <Typography textAlign="center" color='#000'>Calendar</Typography>
                                    </Link>
                                </MenuItem>

                                <MenuItem key={"Record"} onClick={handleCloseNavMenu}>
                                    <Link to="/record">
                                        <Typography textAlign="center" color='#000'>Record</Typography>
                                    </Link>
                                </MenuItem>

                                <MenuItem key={"About"} onClick={handleCloseNavMenu}>
                                    <Link to="/about">
                                        <Typography textAlign="center" color='#000'>About</Typography>
                                    </Link>
                                </MenuItem>

                                <MenuItem key={"Profile"} onClick={handleCloseNavMenu}>
                                    <Link to="/Profile">
                                        <Typography textAlign="center" color='#000'>Profile</Typography>
                                    </Link>
                                </MenuItem>
                            </Menu>
                        </Box>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }}}>
                            <Link to="/calendar">
                                <Button key="Calendar" onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
                                    Calendar
                                </Button>
                            </Link>
                            <Link to="/record">
                                <Button key="Record" onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
                                    Record
                                </Button>
                            </Link>
                            <Link to="/about">
                                <Button key="About" onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
                                    About
                                </Button>
                            </Link>
                            <Link to="/Profile">
                                <Button key="Profile" onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
                                    Profile
                                </Button>
                            </Link>
                        </Box>
                        <Link to="/login" className="menuLink" style={{color: '#fff'}}>
                            <Button color="inherit">Login</Button>
                        </Link>  
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>
    )
}
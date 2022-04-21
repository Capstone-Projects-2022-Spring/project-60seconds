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
import {HashRouter as Router, Routes, Route, Link } from 'react-router-dom';


const appTheme = createTheme({
    palette: {
      primary: {
        main: '#4d98cf',
      },
    },
  });

export default function Navbar(props) {
    
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
                        <Link to="/" style={{ textDecoration: "none" }}>
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
                                    <Link to="/calendar" style={{ textDecoration: "none" }}>
                                        <Typography textAlign="center" color='#000'>Calendar</Typography>
                                    </Link>
                                </MenuItem>

                                <MenuItem key={"Record"} onClick={handleCloseNavMenu}>
                                    <Link to="/record" style={{ textDecoration: "none" }}>
                                        <Typography textAlign="center" color='#000'>Record</Typography>
                                    </Link>
                                </MenuItem>

                                <MenuItem key={"About"} onClick={handleCloseNavMenu}>
                                    <Link to="/about" style={{ textDecoration: "none" }}>
                                        <Typography textAlign="center" color='#000'>About</Typography>
                                    </Link>
                                </MenuItem>

                                <MenuItem key={"Profile"} onClick={handleCloseNavMenu}>
                                    <Link to="/Profile" style={{ textDecoration: "none" }}>
                                        <Typography textAlign="center" color='#000'>Profile</Typography>
                                    </Link>
                                </MenuItem>
                            </Menu>
                        </Box>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }}}>
                            
                                <Button key="Calendar" disabled={localStorage.getItem("username")===null} component={Link} to="/calendar" onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
                                    Calendar
                                </Button>
                            

                                <Button key="Record" disabled={localStorage.getItem("username")===null} component={Link} to="/record" onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
                                    Record
                                </Button>


                                <Button key="Profile" disabled={localStorage.getItem("username")===null} component={Link} to="/profile" onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
                                    Profile
                                </Button>

                                <Button key="About" component={Link} to="/about" onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
                                    About
                                </Button>

                        </Box>
                        {localStorage.getItem("username") ? 
                        <Link to="/Logout" className="menuLink" style={{color: '#fff', textDecoration: "none"}}> <Button color="inherit">{localStorage.getItem("username")} - Logout</Button></Link> :  
                        <Link to="/Login" className="menuLink" style={{color: '#fff', textDecoration: "none"}}><Button color="inherit">Login</Button></Link>} 

                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>
    )
}

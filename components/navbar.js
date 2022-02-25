import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const pages = ['About', 'Record', 'Calendar'];

const appTheme = createTheme({
    palette: {
      primary: {
        main: '#4d98cf',
      },
    },
  });

export default function Navbar() {
    return (
        <ThemeProvider theme={appTheme}>
            <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton 
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <AccessTimeIcon
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="clock-icon"
                        sx={{mr: .5}}
                    />
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        60 Seconds
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
        </Box>
        </ThemeProvider>
        
    )
}
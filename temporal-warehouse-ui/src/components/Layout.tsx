import React from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    Container,
    useTheme,
    Button,
    Menu,
    MenuItem,
    IconButton,
    ListItemIcon,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Logout from '@mui/icons-material/Logout';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const theme = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Toolbar>
                    {/* Spacer to balance the title */}
                    <Box sx={{ flexGrow: 1 }} />

                    <Typography variant="h5" component="div" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 700, color: theme.palette.primary.main, letterSpacing: '-0.5px' }}>
                        Temporal Warehouse
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {user && (
                            <>
                                <Typography variant="body2" sx={{ mr: 1, fontWeight: 500 }}>
                                    {user}
                                </Typography>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleLogout}>
                                        <ListItemIcon>
                                            <Logout fontSize="small" />
                                        </ListItemIcon>
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
                {children}
            </Container>
        </Box>
    );
};

export default Layout;

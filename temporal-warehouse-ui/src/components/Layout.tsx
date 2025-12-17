import React from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    Container,
    useTheme,
} from '@mui/material';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const theme = useTheme();

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
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                        <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: theme.palette.primary.main, letterSpacing: '-0.5px' }}>
                            Temporal Warehouse
                        </Typography>
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

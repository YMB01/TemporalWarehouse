import { createTheme, alpha } from '@mui/material/styles';
import type { } from '@mui/x-data-grid/themeAugmentation';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#3f51b5', // Deep Indigo
            light: '#757de8',
            dark: '#002984',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#009688', // Teal
            light: '#52c7b8',
            dark: '#00675b',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f4f6f8',
            paper: '#ffffff',
        },
        text: {
            primary: '#1c2025',
            secondary: '#606770',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
        button: {
            textTransform: 'none', // Remove uppercase default
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12, // More rounded corners
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
                    border: '1px solid rgba(0,0,0,0.05)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 16px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                },
            },
        },
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    border: 'none',
                    backgroundColor: '#ffffff',
                    borderRadius: 12,
                    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
                    '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid #f0f0f0',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f9fafb',
                        borderBottom: '1px solid #f0f0f0',
                    },
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: 'none',
                    boxShadow: '4px 0 20px rgba(0,0,0,0.05)',
                },
            },
        },
    },
});

export default theme;

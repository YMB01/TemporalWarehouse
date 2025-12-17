// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { TextField, Button, Box, Alert, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/apiClient'; // Your Axios instance (without auth needed here)

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        try {
            // Call your backend register endpoint
            await api.post('/auth/register', { email, password });

            // On success, go to login page (or auto-login if you prefer)
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data || 'Registration failed. Try a different email.');
        }
    };

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}>
            <Paper elevation={3} sx={{
                p: 4,
                width: '100%',
                maxWidth: 400,
                borderRadius: 4,
                textAlign: 'center'
            }}>
                <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
                    Create Account
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Join Temporal Warehouse today
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email Address"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        helperText="At least 6 characters"
                        sx={{ mb: 3 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: '1rem'
                        }}
                    >
                        Sign Up
                    </Button>
                    <Box sx={{ mt: 2 }}>
                        <Button
                            onClick={() => navigate('/login')}
                            sx={{ textTransform: 'none' }}
                        >
                            Already have an account? Sign In
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}
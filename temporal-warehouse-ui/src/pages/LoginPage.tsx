
import { useState } from 'react';
import { TextField, Button, Box, Alert, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/apiClient'; // your authenticated client

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token, email);
            navigate('/products');
        } catch (err: any) {
            setError(err.response?.data || 'Login failed');
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
                    Welcome Back
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Sign in to continue to Temporal Warehouse
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
                        Sign In
                    </Button>
                    <Box sx={{ mt: 2 }}>
                        <Button
                            onClick={() => navigate('/register')}
                            sx={{ textTransform: 'none' }}
                        >
                            Don't have an account? Register
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}
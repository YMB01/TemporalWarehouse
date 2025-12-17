// src/components/StockAdjustmentForm.tsx
import React, { useState } from 'react';
import {
    Button,
    TextField,
    Box,
    Alert,
    AlertTitle,
    Paper,
    Typography,
    Tabs,
    Tab,
    Fade
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { addStock, removeStock } from '../api/productApi';

interface Props {
    productId: number;
    onStockChange: () => void;
}

const StockAdjustmentForm: React.FC<Props> = ({ productId, onStockChange }) => {
    const [tabValue, setTabValue] = useState(0);
    const [quantity, setQuantity] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setQuantity('');
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async () => {
        const qty = parseInt(quantity, 10);
        if (isNaN(qty) || qty <= 0) {
            setError('Please enter a valid positive quantity.');
            return;
        }

        try {
            if (tabValue === 0) {
                await addStock(productId, qty);
                setSuccess(`Successfully added ${qty} items.`);
            } else {
                await removeStock(productId, qty);
                setSuccess(`Successfully removed ${qty} items.`);
            }
            onStockChange();
            setQuantity('');
            setError(null);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.response?.status === 409
                ? 'Concurrent modification detected. Please refresh and try again.'
                : tabValue === 0 ? 'Failed to add stock.' : 'Insufficient stock or failed operation.');
            setSuccess(null);
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
                Manage Stock
            </Typography>

            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="stock adjustment tabs"
                variant="fullWidth"
                sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
            >
                <Tab icon={<AddCircleOutlineIcon />} iconPosition="start" label="Add Stock"
                    sx={{ minHeight: 60, textTransform: 'none', fontWeight: 600 }} />
                <Tab icon={<RemoveCircleOutlineIcon />} iconPosition="start" label="Remove Stock"
                    sx={{ minHeight: 60, textTransform: 'none', fontWeight: 600 }} />
            </Tabs>

            <Fade in={!!error || !!success}>
                <Box sx={{ mb: 2 }}>
                    {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
                    {success && <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>}
                </Box>
            </Fade>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label={tabValue === 0 ? "Quantity to Add" : "Quantity to Remove"}
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    fullWidth
                    InputProps={{ inputProps: { min: 1 } }}
                    placeholder="Enter amount..."
                />

                <Button
                    variant="contained"
                    color={tabValue === 0 ? "primary" : "error"}
                    size="large"
                    onClick={handleSubmit}
                    sx={{ py: 1.5, fontWeight: 600 }}
                    disableElevation
                >
                    {tabValue === 0 ? "Add to Inventory" : "Remove from Inventory"}
                </Button>
            </Box>
        </Paper>
    );
};

export default StockAdjustmentForm;
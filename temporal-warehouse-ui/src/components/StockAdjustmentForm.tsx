// src/components/StockAdjustmentForm.tsx
import React, { useState } from 'react';
import { Button, TextField, Box, Alert, AlertTitle } from '@mui/material';
import { addStock, removeStock } from '../api/productApi';

interface Props {
    productId: number;
    onStockChange: () => void; // To refresh product data
}

const StockAdjustmentForm: React.FC<Props> = ({ productId, onStockChange }) => {
    const [addQty, setAddQty] = useState<string>('');
    const [removeQty, setRemoveQty] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleAdd = async () => {
        const qty = parseInt(addQty, 10);
        if (isNaN(qty) || qty <= 0) return;
        try {
            await addStock(productId, qty);
            onStockChange();
            setAddQty('');
            setError(null);
        } catch (err: any) {
            setError(err.response?.status === 409
                ? 'Concurrent modification. Refresh and retry.'
                : 'Failed to add stock.');
        }
    };

    const handleRemove = async () => {
        const qty = parseInt(removeQty, 10);
        if (isNaN(qty) || qty <= 0) return;
        try {
            await removeStock(productId, qty);
            onStockChange();
            setRemoveQty('');
            setError(null);
        } catch (err: any) {
            setError(err.response?.status === 409
                ? 'Concurrent modification. Refresh and retry.'
                : 'Insufficient stock or failed operation.');
        }
    };

    return (
        <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    <AlertTitle>Operation Failed</AlertTitle>
                    {error}
                </Alert>
            )}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    label="Add Quantity"
                    type="number"
                    value={addQty}
                    onChange={(e) => setAddQty(e.target.value)}
                    size="small"
                    inputProps={{ min: 1 }}
                />
                <Button variant="contained" color="success" onClick={handleAdd}>
                    Add Stock
                </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                    label="Remove Quantity"
                    type="number"
                    value={removeQty}
                    onChange={(e) => setRemoveQty(e.target.value)}
                    size="small"
                    inputProps={{ min: 1 }}
                />
                <Button variant="contained" color="error" onClick={handleRemove}>
                    Remove Stock
                </Button>
            </Box>
        </Box>
    );
};

export default StockAdjustmentForm;
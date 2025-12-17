import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Alert, Paper, Typography, Grid } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Product } from '../types';
import { createProduct, updateProduct } from '../api/productApi';

interface Props {
    initialData?: Product;
    onSave: () => void;
    onCancel: () => void;
}

const ProductForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
    const isEditing = !!initialData;

    // Initialize with empty/default values
    const [formData, setFormData] = useState<Omit<Product, 'id' | 'currentQuantity'> & { currentQuantity?: number }>({
        name: '',
        sku: '',
        price: 0,
        currentQuantity: undefined,
    });

    // Sync formData when initialData loads or changes
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                sku: initialData.sku,
                price: initialData.price,
                currentQuantity: initialData.currentQuantity,
            });
        }
    }, [initialData]);

    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'price' ? parseFloat(value) || 0 : value,
        });
    };

    const handleSubmit = async () => {
        setError(null);
        try {
            if (isEditing && initialData) {
                await updateProduct(initialData.id, formData);
            } else {
                await createProduct(formData);
            }
            onSave();
        } catch (err: any) {
            setError('Failed to save product. Check SKU uniqueness or network.');
        }
    };

    // Prevent editing currentQuantity on edit
    const isQuantityEditable = !isEditing;

    return (
        <Paper elevation={0} sx={{ maxWidth: 700, mx: 'auto', p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h5" component="h2" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                {isEditing ? 'Edit Product' : 'Create New Product'}
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        label="Product Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="SKU"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        InputProps={{ startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box> }}
                    />
                </Grid>

                {isQuantityEditable && (
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Initial Quantity"
                            name="currentQuantity"
                            type="number"
                            value={formData.currentQuantity || ''}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    currentQuantity: e.target.value ? parseInt(e.target.value, 10) : undefined,
                                })
                            }
                            fullWidth
                            variant="outlined"
                            InputProps={{ inputProps: { min: 0 } }}
                            helperText="Set the starting stock level for this new product"
                        />
                    </Grid>
                )}
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                    variant="outlined"
                    onClick={onCancel}
                    startIcon={<CancelIcon />}
                    size="large"
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    startIcon={<SaveIcon />}
                    size="large"
                >
                    {isEditing ? 'Update Product' : 'Create Product'}
                </Button>
            </Box>
        </Paper>
    );
};

export default ProductForm;
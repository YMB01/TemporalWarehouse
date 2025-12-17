import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
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

    // ✅ Sync formData when initialData loads or changes
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                sku: initialData.sku,
                price: initialData.price,
                currentQuantity: initialData.currentQuantity, // or omit if not editable
            });
        }
    }, [initialData]); // Re-run when initialData changes

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

    // Optional: prevent editing currentQuantity on edit (per your spec)
    const isQuantityEditable = !isEditing;

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
            <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="dense"
            />
            <TextField
                label="SKU"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                fullWidth
                margin="dense"
            />
            <TextField
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                margin="dense"
                inputProps={{ min: 0, step: 0.01 }}
            />

            {isQuantityEditable && (
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
                    margin="dense"
                    inputProps={{ min: 0 }}
                />
            )}

            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    {isEditing ? 'Update' : 'Create'}
                </Button>
                <Button variant="outlined" onClick={onCancel}>
                    Cancel
                </Button>
            </Box>
        </Box>
    );
};

export default ProductForm;
// src/pages/ProductListPage.tsx
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Button, Container, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useNavigate } from 'react-router-dom';
import { Product, fetchProducts, deleteProduct } from '../api/productApi';

const ProductListPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts().then(res => {
            setProducts(res.data);
            setLoading(false);
        });
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('Delete this product? This cannot be undone.')) {
            await deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'sku', headerName: 'SKU', width: 150 },
        { field: 'price', headerName: 'Price', type: 'number', width: 120 },
        { field: 'currentQuantity', headerName: 'Stock', type: 'number', width: 120 },
        {
            field: 'actions',
            type: 'actions',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => navigate(`/products/${params.row.id}/edit`)}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => handleDelete(params.row.id)}
                />,
            ],
        },
    ];

    return (
        <Container sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">Products</Typography>
                <Button
                    variant="contained"
                    component={Link}
                    to="/products/new"
                    sx={{ backgroundColor: '#1976d2' }}
                >
                    Add Product
                </Button>
            </Box>
            <div style={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={products}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row.id}
                    disableRowSelectionOnClick
                />
            </div>
        </Container>
    );
};

export default ProductListPage;
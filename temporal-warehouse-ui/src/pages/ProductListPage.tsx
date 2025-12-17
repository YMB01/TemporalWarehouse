// src/pages/ProductListPage.tsx
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridActionsCellItem, GridRenderCellParams } from '@mui/x-data-grid';
import {
    Button,
    Container,
    Typography,
    Box,
    Paper,
    Chip,
    IconButton,
    useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';
import { Product, fetchProducts, deleteProduct } from '../api/productApi';

const ProductListPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const theme = useTheme();

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
        {
            field: 'name',
            headerName: 'Product Name',
            flex: 1,
            minWidth: 200,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2" fontWeight={600} color="text.primary">
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'sku',
            headerName: 'SKU',
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={params.value}
                    size="small"
                    variant="outlined"
                    sx={{
                        borderRadius: 1,
                        borderColor: theme.palette.divider,
                        color: theme.palette.text.secondary,
                        fontWeight: 500
                    }}
                />
            )
        },
        {
            field: 'price',
            headerName: 'Price',
            type: 'number',
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2" fontWeight={500}>
                    ${Number(params.value).toFixed(2)}
                </Typography>
            )
        },
        {
            field: 'currentQuantity',
            headerName: 'Stock Level',
            type: 'number',
            width: 140,
            renderCell: (params: GridRenderCellParams) => {
                const stock = Number(params.value);
                let color: 'success' | 'warning' | 'error' | 'default' = 'success';
                if (stock === 0) color = 'error';
                else if (stock < 10) color = 'warning';

                return (
                    <Chip
                        label={stock}
                        color={color}
                        size="small"
                        sx={{ fontWeight: 600, minWidth: 60 }}
                    />
                );
            }
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<VisibilityIcon sx={{ fontSize: 28 }} color="action" />}
                    label="View"
                    onClick={() => navigate(`/products/${params.row.id}`)}
                    showInMenu={false}
                />,
                <GridActionsCellItem
                    icon={<EditIcon sx={{ fontSize: 28 }} color="primary" />}
                    label="Edit"
                    onClick={() => navigate(`/products/${params.row.id}/edit`)}
                    showInMenu={false}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon sx={{ fontSize: 28 }} color="error" />}
                    label="Delete"
                    onClick={() => handleDelete(params.row.id)}
                    showInMenu={false}
                />,
            ],
            width: 140,
        },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4
            }}>
                <Box>
                    <Typography variant="h4" sx={{ mb: 1, background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Inventory Managment
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your products and stock levels
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    component={Link}
                    to="/products/new"
                    startIcon={<AddIcon />}
                    size="large"
                    sx={{ px: 3 }}
                >
                    Add Product
                </Button>
            </Box>

            <Paper sx={{
                height: 600,
                width: '100%',
                overflow: 'hidden',
                borderRadius: 3
            }}>
                <DataGrid
                    rows={products}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row.id}
                    disableRowSelectionOnClick
                    rowHeight={60}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    sx={{
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f8f9fa',
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            letterSpacing: '0.05em',
                        }
                    }}
                />
            </Paper>
        </Container>
    );
};

export default ProductListPage;
// src/pages/ProductDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Box,
    Grid,
    Alert,
    Paper,
    Chip,
    IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HistoryIcon from '@mui/icons-material/History';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';

import StockAdjustmentForm from '../components/StockAdjustmentForm';
import { fetchProducts, getHistoricalStock } from '../api/productApi';
import { Product } from '../types';

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const productId = parseInt(id!, 10);
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());
    const [historicalStock, setHistoricalStock] = useState<number | null>(null);
    const [historicalError, setHistoricalError] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts().then(res => {
            const found = res.data.find(p => p.id === productId);
            if (found) {
                setProduct(found);
            } else {
                navigate('/products');
            }
        });
    }, [productId, navigate]);

    const refreshProduct = () => {
        fetchProducts().then(res => {
            const found = res.data.find(p => p.id === productId);
            if (found) setProduct(found);
        });
    };

    const handleFetchHistorical = async () => {
        if (!selectedTime) {
            setHistoricalError('Please select a date/time');
            return;
        }
        try {
            const response = await getHistoricalStock(productId, selectedTime.toISOString());
            setHistoricalStock(response.data);
            setHistoricalError(null);
        } catch (err) {
            setHistoricalError('Failed to fetch historical stock or no record found.');
            setHistoricalStock(null);
        }
    };

    if (!product) return <Container sx={{ py: 4 }}><Typography>Loading...</Typography></Container>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={() => navigate('/products')} sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        {product.name}
                    </Typography>
                    <Chip label={`SKU: ${product.sku}`} size="small" sx={{ mt: 0.5 }} />
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Left Column: Stats & Info */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                                <InventoryIcon color="primary" sx={{ fontSize: 40, mb: 1, opacity: 0.8 }} />
                                <Typography variant="h3" fontWeight={700} color={product.currentQuantity < 10 ? 'warning.main' : 'primary.main'}>
                                    {product.currentQuantity}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">Current Stock</Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                                <AttachMoneyIcon color="success" sx={{ fontSize: 40, mb: 1, opacity: 0.8 }} />
                                <Typography variant="h3" fontWeight={700} color="success.main">
                                    Br. {product.price.toFixed(2)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">Unit Price</Typography>
                            </Paper>
                        </Grid>
                        <br />
                        <br />

                        <Grid size={{ xs: 12 }}>
                            <Paper sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <HistoryIcon color="action" />
                                    <Typography variant="h6" fontWeight={600}>
                                        Historical Time Travel
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Check exactly what the stock level was at any point in the past.
                                </Typography>

                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                                        <DateTimePicker
                                            label="Select Snapshot Time"
                                            value={selectedTime}
                                            onChange={setSelectedTime}
                                            slotProps={{ textField: { fullWidth: true, sx: { maxWidth: 300 } } }}
                                        />
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            onClick={handleFetchHistorical}
                                            disabled={!selectedTime}
                                            sx={{ height: 56 }}
                                        >
                                            Check Stock
                                        </Button>
                                    </Box>
                                </LocalizationProvider>

                                {historicalError && (
                                    <Alert severity="error" sx={{ mt: 3 }}>{historicalError}</Alert>
                                )}
                                {historicalStock !== null && !historicalError && (
                                    <Alert severity="info" icon={<HistoryIcon />} sx={{ mt: 3 }}>
                                        Stock level on <strong>{selectedTime?.toLocaleString()}</strong> was
                                        <Typography component="span" variant="h5" sx={{ ml: 2, fontWeight: 'bold' }}>
                                            {historicalStock}
                                        </Typography>
                                    </Alert>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Right Column: Actions */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <StockAdjustmentForm productId={productId} onStockChange={refreshProduct} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductDetailPage;
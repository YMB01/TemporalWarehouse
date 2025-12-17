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
    TextField,
    Alert,
} from '@mui/material';
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
            setHistoricalError('Failed to fetch historical stock');
        }
    };

    if (!product) return <div>Loading...</div>;

    return (
        <Container sx={{ py: 4 }}>
            <Button component={Link} to="/products" sx={{ mb: 2 }}>
                ← Back to Products
            </Button>

            <Card>
                <CardContent>
                    <Typography variant="h5">{product.name}</Typography>
                    <Typography variant="body1">SKU: {product.sku}</Typography>
                    <Typography variant="body1">Price: ${product.price.toFixed(2)}</Typography>
                    <Typography variant="h6" color="primary">
                        Current Stock: {product.currentQuantity}
                    </Typography>
                </CardContent>
            </Card>

            <StockAdjustmentForm productId={productId} onStockChange={refreshProduct} />

            {/* Historical Audit */}
            <Card sx={{ mt: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Audit Stock at Specific Time
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                            <DateTimePicker
                                label="Select Date & Time"
                                value={selectedTime}
                                onChange={setSelectedTime}
                                slotProps={{ textField: { sx: { width: 250 } } }}
                            />
                            <Button variant="outlined" onClick={handleFetchHistorical}>
                                Check Stock
                            </Button>
                        </Box>
                    </LocalizationProvider>

                    {historicalError && (
                        <Alert severity="error" sx={{ mt: 2 }}>{historicalError}</Alert>
                    )}
                    {historicalStock !== null && !historicalError && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            Stock level at {selectedTime?.toLocaleString()} was: <strong>{historicalStock}</strong>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default ProductDetailPage;
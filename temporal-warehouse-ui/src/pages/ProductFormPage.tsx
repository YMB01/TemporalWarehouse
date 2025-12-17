// src/pages/ProductFormPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import ProductForm from '../components/ProductForm';
import { fetchProducts } from '../api/productApi';

const ProductFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditing = !!id;
    const [initialData, setInitialData] = React.useState<any>(null);

    React.useEffect(() => {
        if (isEditing) {
            fetchProducts().then(res => {
                const product = res.data.find(p => p.id === parseInt(id!, 10));
                if (product) {
                    setInitialData(product);
                } else {
                    navigate('/products');
                }
            });
        }
    }, [id, isEditing, navigate]);

    const handleSave = () => {
        navigate('/products');
    };

    const handleCancel = () => {
        navigate('/products');
    };

    return (
        <Container sx={{ py: 4 }}>
            <ProductForm
                initialData={initialData}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        </Container>
    );
};

export default ProductFormPage;
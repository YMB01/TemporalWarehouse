// src/api/productApi.ts
import axios from 'axios';
import { Product } from '../types';

// Create an Axios instance with base configuration
const api = axios.create({
    baseURL: 'http://localhost:5075/api',
});

// Request interceptor to attach JWT token if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Products
export const fetchProducts = () => api.get<Product[]>('/products');
export const createProduct = (data: Omit<Product, 'id' | 'currentQuantity'> & { currentQuantity?: number }) =>
    api.post<Product>('/products', data);
export const updateProduct = (id: number, data: Partial<Product>) =>
    api.put<Product>(`/products/${id}`, data);
export const deleteProduct = (id: number) => api.delete(`/products/${id}`);

// Stock
export const addStock = (productId: number, quantity: number) =>
    api.post('/stock/add', { productId, quantity });
export const removeStock = (productId: number, quantity: number) =>
    api.post('/stock/remove', { productId, quantity });

// Historical
export const getHistoricalStock = (productId: number, at: string) =>
    api.get<number>('/Historical/stock', { params: { productId, at } });

export type { Product };
// src/types/index.ts
export interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    currentQuantity: number;
    isDeleted?: boolean;
}

export interface StockHistoryEntry {
    id: number;
    productId: number;
    changeDate: string; // ISO string
    changeType: 'Add' | 'Remove';
    quantityChanged: number;
    newTotal: number;
}
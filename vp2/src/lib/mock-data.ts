export const mockInventory = [
    { id: '1', name: 'Organic HoneyCrisp Apples', sku: 'APPL-HC-001', category: 'Fruits', currentStock: 45, minimumStock: 20, reorderPoint: 50, unit: 'kg', status: 'In Stock' },
    { id: '2', name: 'Fresh Whole Milk', sku: 'DAIRY-MK-002', category: 'Dairy', currentStock: 8, minimumStock: 10, reorderPoint: 20, unit: 'L', status: 'Low Stock' },
    { id: '3', name: 'Free Range Eggs', sku: 'EGG-FR-003', category: 'Dairy', currentStock: 0, minimumStock: 15, reorderPoint: 30, unit: 'doz', status: 'Out of Stock' },
    { id: '4', name: 'Sourdough Bread', sku: 'BREAD-SD-004', category: 'Bakery', currentStock: 12, minimumStock: 5, reorderPoint: 15, unit: 'loaves', status: 'In Stock' },
    { id: '5', name: 'Cheddar Cheese', sku: 'CHEESE-CH-005', category: 'Dairy', currentStock: 5, minimumStock: 8, reorderPoint: 12, unit: 'blocks', status: 'Low Stock' },
];

export const mockInventoryStats = {
    totalSKUs: 124,
    inStock: 98,
    lowStock: 12,
    outOfStock: 14,
    valuableItems: 8
};

export const mockStockAdjustments = [
    { id: '1', timestamp: '2024-03-20 14:30', sku: 'APPL-HC-001', productName: 'Organic HoneyCrisp Apples', previousStock: 30, newStock: 45, adjustment: 15, reason: 'Received', user: 'John Doe' },
    { id: '2', timestamp: '2024-03-19 09:15', sku: 'DAIRY-MK-002', productName: 'Fresh Whole Milk', previousStock: 10, newStock: 8, adjustment: -2, reason: 'Damaged', user: 'Jane Smith' },
    { id: '3', timestamp: '2024-03-18 16:45', sku: 'EGG-FR-003', productName: 'Free Range Eggs', previousStock: 5, newStock: 0, adjustment: -5, reason: 'Sale', user: 'System' },
];

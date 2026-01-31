import { useState } from 'react'
import { Plus, AlertTriangle } from 'lucide-react'
import { mockInventory, mockStockAdjustments, mockInventoryStats } from '@/lib/mock-data'
import { Link } from 'react-router-dom'

export default function Inventory() {
    const [selectedTab, setSelectedTab] = useState<'overview' | 'history'>('overview')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredInventory = mockInventory.filter(
        (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const lowStockItems = mockInventory.filter((item) => item.status === 'Low Stock')
    const outOfStockItems = mockInventory.filter((item) => item.status === 'Out of Stock')

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
                <p className="text-muted-foreground mt-2">Track stock levels, adjust inventory, and view history.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white border border-border rounded-lg p-6">
                    <div className="text-sm text-muted-foreground mb-2">TOTAL SKUS</div>
                    <div className="text-3xl font-bold text-foreground">{mockInventoryStats.totalSKUs}</div>
                </div>
                <div className="bg-white border border-border rounded-lg p-6">
                    <div className="text-sm text-muted-foreground mb-2">IN STOCK</div>
                    <div className="text-3xl font-bold text-green-600">{mockInventoryStats.inStock}</div>
                </div>
                <div className="bg-white border border-border rounded-lg p-6">
                    <div className="text-sm text-muted-foreground mb-2">LOW STOCK</div>
                    <div className="text-3xl font-bold text-orange-600">{mockInventoryStats.lowStock}</div>
                </div>
                <div className="bg-white border border-border rounded-lg p-6">
                    <div className="text-sm text-muted-foreground mb-2">OUT OF STOCK</div>
                    <div className="text-3xl font-bold text-red-600">{mockInventoryStats.outOfStock}</div>
                </div>
                <div className="bg-white border border-border rounded-lg p-6">
                    <div className="text-sm text-muted-foreground mb-2">REORDER NEEDED</div>
                    <div className="text-3xl font-bold text-blue-600">{mockInventoryStats.valuableItems}</div>
                </div>
            </div>

            {/* Alert Boxes */}
            {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lowStockItems.length > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-orange-900">Low Stock Alert</h3>
                                    <p className="text-sm text-orange-800 mt-1">
                                        {lowStockItems.length} product(s) running low on stock. Consider reordering.
                                    </p>
                                    <div className="mt-2 space-y-1">
                                        {lowStockItems.slice(0, 3).map((item) => (
                                            <div key={item.id} className="text-sm text-orange-900">
                                                • {item.name} - {item.currentStock} {item.unit}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {outOfStockItems.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-red-900">Out of Stock</h3>
                                    <p className="text-sm text-red-800 mt-1">
                                        {outOfStockItems.length} product(s) are out of stock. Immediate action required.
                                    </p>
                                    <div className="mt-2 space-y-1">
                                        {outOfStockItems.slice(0, 3).map((item) => (
                                            <div key={item.id} className="text-sm text-red-900">
                                                • {item.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-4 border-b border-border">
                <button
                    onClick={() => setSelectedTab('overview')}
                    className={`px-4 py-3 font-medium border-b-2 transition-colors ${selectedTab === 'overview'
                            ? 'border-green-600 text-green-600'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Stock Overview
                </button>
                <button
                    onClick={() => setSelectedTab('history')}
                    className={`px-4 py-3 font-medium border-b-2 transition-colors ${selectedTab === 'history'
                            ? 'border-green-600 text-green-600'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Stock History
                </button>
            </div>

            {/* Overview Tab */}
            {selectedTab === 'overview' && (
                <div className="bg-white border border-border rounded-lg">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Current Stock Levels</h2>
                            <p className="text-sm text-muted-foreground mt-1">Real-time inventory status for all products</p>
                        </div>
                        <Link
                            to="/inventory/adjust"
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Adjust Stock
                        </Link>
                    </div>

                    <div className="p-6">
                        <input
                            type="text"
                            placeholder="Search by product name or SKU..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border border-border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">SKU</th>
                                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">PRODUCT</th>
                                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">CATEGORY</th>
                                        <th className="text-center py-3 px-4 font-semibold text-muted-foreground text-sm">CURRENT</th>
                                        <th className="text-center py-3 px-4 font-semibold text-muted-foreground text-sm">MINIMUM</th>
                                        <th className="text-center py-3 px-4 font-semibold text-muted-foreground text-sm">REORDER</th>
                                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredInventory.map((item) => (
                                        <tr key={item.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4 text-sm text-foreground font-mono">{item.sku}</td>
                                            <td className="py-4 px-4 text-sm text-foreground font-medium">{item.name}</td>
                                            <td className="py-4 px-4 text-sm text-muted-foreground">{item.category}</td>
                                            <td className="py-4 px-4 text-center text-sm font-semibold text-foreground">
                                                {item.currentStock} {item.unit}
                                            </td>
                                            <td className="py-4 px-4 text-center text-sm text-muted-foreground">
                                                {item.minimumStock} {item.unit}
                                            </td>
                                            <td className="py-4 px-4 text-center text-sm text-muted-foreground">
                                                {item.reorderPoint} {item.unit}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${item.status === 'In Stock'
                                                            ? 'bg-green-100 text-green-700'
                                                            : item.status === 'Low Stock'
                                                                ? 'bg-orange-100 text-orange-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}
                                                >
                                                    {item.status === 'In Stock' && <div className="w-2 h-2 bg-green-600 rounded-full mr-2" />}
                                                    {item.status === 'Low Stock' && <div className="w-2 h-2 bg-orange-600 rounded-full mr-2" />}
                                                    {item.status === 'Out of Stock' && <div className="w-2 h-2 bg-red-600 rounded-full mr-2" />}
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredInventory.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No inventory items found matching your search.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* History Tab */}
            {selectedTab === 'history' && (
                <div className="bg-white border border-border rounded-lg">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-lg font-semibold text-foreground">Stock Adjustment History</h2>
                        <p className="text-sm text-muted-foreground mt-1">Complete audit trail of all inventory changes</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-gray-50">
                                    <th className="text-left py-3 px-6 font-semibold text-muted-foreground text-sm">DATE & TIME</th>
                                    <th className="text-left py-3 px-6 font-semibold text-muted-foreground text-sm">SKU</th>
                                    <th className="text-left py-3 px-6 font-semibold text-muted-foreground text-sm">PRODUCT</th>
                                    <th className="text-center py-3 px-6 font-semibold text-muted-foreground text-sm">PREVIOUS</th>
                                    <th className="text-center py-3 px-6 font-semibold text-muted-foreground text-sm">NEW</th>
                                    <th className="text-center py-3 px-6 font-semibold text-muted-foreground text-sm">CHANGE</th>
                                    <th className="text-left py-3 px-6 font-semibold text-muted-foreground text-sm">REASON</th>
                                    <th className="text-left py-3 px-6 font-semibold text-muted-foreground text-sm">USER</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockStockAdjustments.map((adjustment) => (
                                    <tr key={adjustment.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 text-sm text-muted-foreground">{adjustment.timestamp}</td>
                                        <td className="py-4 px-6 text-sm text-foreground font-mono">{adjustment.sku}</td>
                                        <td className="py-4 px-6 text-sm text-foreground font-medium">{adjustment.productName}</td>
                                        <td className="py-4 px-6 text-center text-sm text-foreground">{adjustment.previousStock}</td>
                                        <td className="py-4 px-6 text-center text-sm text-foreground font-semibold">
                                            {adjustment.newStock}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span
                                                className={`text-sm font-semibold ${adjustment.adjustment > 0 ? 'text-green-600' : 'text-red-600'
                                                    }`}
                                            >
                                                {adjustment.adjustment > 0 ? '+' : ''}
                                                {adjustment.adjustment}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm">
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${adjustment.reason === 'Received'
                                                        ? 'bg-green-100 text-green-700'
                                                        : adjustment.reason === 'Damaged'
                                                            ? 'bg-red-100 text-red-700'
                                                            : adjustment.reason === 'Sale'
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : 'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {adjustment.reason}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-muted-foreground">{adjustment.user}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

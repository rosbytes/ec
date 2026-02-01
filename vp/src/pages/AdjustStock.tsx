import React, { useState } from "react"
import { ArrowLeft, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { mockInventory } from '@/lib/mock-data'

export default function AdjustStock() {
    const [selectedProduct, setSelectedProduct] = useState('')
    const [currentStock, setCurrentStock] = useState(0)
    const [newStock, setNewStock] = useState(0)
    const [reason, setReason] = useState<'Received' | 'Damaged' | 'Lost' | 'Adjustment' | 'Sale' | 'Return'>('Received')
    const [notes, setNotes] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const selectedProductData = mockInventory.find((p) => p.id === selectedProduct)

    const handleProductSelect = (productId: string) => {
        setSelectedProduct(productId)
        const product = mockInventory.find((p) => p.id === productId)
        if (product) {
            setCurrentStock(product.currentStock)
            setNewStock(product.currentStock)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitted(true)
        setTimeout(() => {
            setSubmitted(false)
            setSelectedProduct('')
            setCurrentStock(0)
            setNewStock(0)
            setReason('Received')
            setNotes('')
        }, 2000)
    }

    const adjustment = newStock - currentStock
    const adjustmentType = adjustment > 0 ? 'increase' : adjustment < 0 ? 'decrease' : 'no-change'

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <Link to="/inventory" className="text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Adjust Stock</h1>
                    <p className="text-muted-foreground mt-2">Update inventory levels and track adjustments.</p>
                </div>
            </div>

            {submitted && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-green-900">Stock adjustment saved successfully!</h3>
                        <p className="text-sm text-green-800">The inventory has been updated and recorded in the audit trail.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2 bg-white border border-border rounded-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Product Selection */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Select Product <span className="text-red-600">*</span>
                            </label>
                            <select
                                value={selectedProduct}
                                onChange={(e) => handleProductSelect(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                            >
                                <option value="">Choose a product...</option>
                                {mockInventory.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} (SKU: {product.sku})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedProductData && (
                            <>
                                {/* Current Stock Display */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-blue-800">Current Stock</p>
                                            <p className="text-2xl font-bold text-blue-600 mt-1">
                                                {currentStock} {selectedProductData.unit}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-blue-800">Minimum Level</p>
                                            <p className="text-xl font-semibold text-blue-600 mt-1">
                                                {selectedProductData.minimumStock} {selectedProductData.unit}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Stock Adjustment */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        New Stock Level <span className="text-red-600">*</span>
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="number"
                                            value={newStock}
                                            onChange={(e) => setNewStock(Number(e.target.value))}
                                            required
                                            min="0"
                                            className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                        <span className="text-muted-foreground font-medium">{selectedProductData.unit}</span>
                                    </div>
                                </div>

                                {/* Adjustment Summary */}
                                <div className="bg-gray-50 border border-border rounded-lg p-4">
                                    <div className="text-sm text-muted-foreground mb-2">Adjustment Summary</div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="text-left">
                                                <p className="text-xs text-muted-foreground">Change</p>
                                                <p
                                                    className={`text-2xl font-bold mt-1 ${adjustmentType === 'increase'
                                                            ? 'text-green-600'
                                                            : adjustmentType === 'decrease'
                                                                ? 'text-red-600'
                                                                : 'text-gray-600'
                                                        }`}
                                                >
                                                    {adjustment > 0 ? '+' : ''}
                                                    {adjustment} {selectedProductData.unit}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground mb-2">Will be {adjustmentType === 'no-change' ? 'unchanged' : adjustmentType === 'increase' ? 'increased' : 'decreased'}</p>
                                            <div
                                                className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white ${adjustmentType === 'increase'
                                                        ? 'bg-green-100 text-green-600'
                                                        : adjustmentType === 'decrease'
                                                            ? 'bg-red-100 text-red-600'
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}
                                            >
                                                {adjustmentType === 'increase' ? '↑' : adjustmentType === 'decrease' ? '↓' : '→'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Reason */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Reason for Adjustment <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value as typeof reason)}
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                                    >
                                        <option value="Received">Received from Supplier</option>
                                        <option value="Damaged">Damaged/Expired</option>
                                        <option value="Lost">Lost/Missing</option>
                                        <option value="Sale">Sale/Customer Return</option>
                                        <option value="Return">Return from Customer</option>
                                        <option value="Adjustment">Manual Adjustment</option>
                                    </select>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Additional Notes</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Enter any additional details about this adjustment..."
                                        rows={4}
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <Link
                                        to="/inventory"
                                        className="flex-1 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                    >
                                        Save Adjustment
                                    </button>
                                </div>
                            </>
                        )}

                        {!selectedProduct && (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">Select a product to begin adjusting stock.</p>
                            </div>
                        )}
                    </form>
                </div>

                {/* Info Panel */}
                <div className="space-y-6">
                    {/* Quick Tips */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="font-semibold text-blue-900 mb-4">Quick Tips</h3>
                        <ul className="space-y-3 text-sm text-blue-900">
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 text-blue-600 font-bold">•</span>
                                <span>All adjustments are recorded in the audit trail for compliance.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 text-blue-600 font-bold">•</span>
                                <span>Double-check quantities before confirming to avoid errors.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 text-blue-600 font-bold">•</span>
                                <span>Use descriptive notes for unusual adjustments.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 text-blue-600 font-bold">•</span>
                                <span>Low stock alerts will trigger automatically when below minimum level.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Common Adjustments */}
                    <div className="bg-white border border-border rounded-lg p-6">
                        <h3 className="font-semibold text-foreground mb-4">Common Adjustment Reasons</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                                <span className="text-green-900">Received</span>
                                <span className="text-green-600 font-semibold">+</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                                <span className="text-red-900">Damaged</span>
                                <span className="text-red-600 font-semibold">-</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                                <span className="text-blue-900">Sale</span>
                                <span className="text-blue-600 font-semibold">-</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

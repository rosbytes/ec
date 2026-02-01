import { Filter, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductStats from "./ProductStats";
import ProductTable from "./ProductTable";

interface ProductManagementProps {
  onAddProduct: () => void;
}

const ProductManagement = ({ onAddProduct }: ProductManagementProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Product Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your inventory, prices and product details.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2" onClick={onAddProduct}>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats */}
      <ProductStats />

      {/* Table */}
      <ProductTable />
    </div>
  );
};

export default ProductManagement;

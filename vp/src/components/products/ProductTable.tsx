import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Product {
  id: string;
  name: string;
  nameHindi: string;
  image: string;
  category: string;
  categoryColor: string;
  status: "Active" | "Low Stock" | "Out of Stock";
  priceRange: string;
}

const products: Product[] = [
  {
    id: "PROD-2491",
    name: "Fresh Potato",
    nameHindi: "आलू",
    image: "🥔",
    category: "Root Vegetables",
    categoryColor: "bg-primary/10 text-primary",
    status: "Active",
    priceRange: "₹20 - ₹40",
  },
  {
    id: "PROD-2492",
    name: "Alphonso Mango",
    nameHindi: "आम",
    image: "🥭",
    category: "Fruits",
    categoryColor: "bg-primary/10 text-primary",
    status: "Active",
    priceRange: "₹180 - ₹350",
  },
  {
    id: "PROD-2495",
    name: "Red Onion",
    nameHindi: "प्याज़",
    image: "🧅",
    category: "Vegetables",
    categoryColor: "bg-primary/10 text-primary",
    status: "Low Stock",
    priceRange: "₹30 - ₹50",
  },
];

const ProductTable = () => {
  const getStatusBadge = (status: Product["status"]) => {
    const styles = {
      Active: "bg-primary/10 text-primary",
      "Low Stock": "bg-status-warning/10 text-status-warning",
      "Out of Stock": "bg-status-danger/10 text-status-danger",
    };

    return (
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            status === "Active"
              ? "bg-primary"
              : status === "Low Stock"
              ? "bg-status-warning"
              : "bg-status-danger"
          }`}
        />
        <span className="text-sm">{status}</span>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12">
              <Checkbox />
            </TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price Range</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-xl">
                    {product.image}
                  </div>
                  <div>
                    <p className="font-medium">
                      {product.name} / {product.nameHindi}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: #{product.id}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={product.categoryColor}>
                  {product.category}
                </Badge>
              </TableCell>
              <TableCell>{getStatusBadge(product.status)}</TableCell>
              <TableCell className="font-medium">{product.priceRange}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="px-4 py-3 border-t border-border flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">1</span> to{" "}
          <span className="font-medium text-foreground">10</span> of{" "}
          <span className="font-medium text-foreground">1,248</span> results
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8">
            ‹
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            ›
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;

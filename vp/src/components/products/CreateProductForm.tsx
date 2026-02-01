import { ArrowLeft, Save, Upload, Plus, Trash2, Pencil, Image, Package, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CreateProductFormProps {
  onBack: () => void;
}

const CreateProductForm = ({ onBack }: CreateProductFormProps) => {
  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button onClick={onBack} className="hover:text-foreground">
          Dashboard
        </button>
        <span>/</span>
        <button onClick={onBack} className="hover:text-foreground">
          Products
        </button>
        <span>/</span>
        <span className="text-foreground">Create Product</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Create Product</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline">Save Draft</Button>
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Product Details */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Organic HoneyCrisp Apples"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <div className="mt-1.5">
                  <div className="flex items-center gap-1 mb-2 pb-2 border-b border-border">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 font-bold">
                      B
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 italic">
                      I
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 underline">
                      U
                    </Button>
                    <span className="w-px h-4 bg-border mx-1" />
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      ≡
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      🔗
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      🖼️
                    </Button>
                  </div>
                  <Textarea
                    id="description"
                    placeholder="Describe the product features, origin, and nutritional benefits..."
                    className="min-h-[120px] border-0 p-0 focus-visible:ring-0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Image className="h-4 w-4 text-primary" />
                Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground mt-1">
                  SVG, PNG, JPG or GIF (max. 3MB)
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center text-2xl">
                    🍎
                  </div>
                </div>
                <div className="w-20 h-20 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50">
                  <Plus className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Inventory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                  <Input id="sku" placeholder="e.g. APPL-HC-001" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="barcode">Barcode (ISBN, UPC, GTIN, etc.)</Label>
                  <Input id="barcode" placeholder="e.g. 1234567890123" className="mt-1.5" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Variants */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    Product Variants
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage different sizes, weights, or colors.
                  </p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Variant
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-muted/50 text-xs font-medium text-primary uppercase">
                  <span>Variant Name</span>
                  <span>SKU</span>
                  <span>Price Modifier</span>
                  <span>In Stock</span>
                  <span>Actions</span>
                </div>
                {[
                  { size: "S", name: "Small Pack (500g)", sku: "APPL-HC-001-S", price: "$0.00", inStock: true },
                  { size: "M", name: "Medium Pack (1kg)", sku: "APPL-HC-001-M", price: "+$2.50", inStock: true },
                  { size: "L", name: "Family Pack (2kg)", sku: "APPL-HC-001-L", price: "+$5.00", inStock: false },
                ].map((variant, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-5 gap-4 px-4 py-3 border-t border-border items-center"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-muted rounded text-xs font-medium flex items-center justify-center">
                        {variant.size}
                      </span>
                      <span className="text-sm">{variant.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{variant.sku}</span>
                    <span className="text-sm">{variant.price}</span>
                    <Switch checked={variant.inStock} />
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Organization */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Category</Label>
                <Select>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Fresh Produce" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fresh">Fresh Produce</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="fruits">Fruits</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sub-category</Label>
                <Select>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Fruits" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fruits">Fruits</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="leafy">Leafy Greens</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Brand</Label>
                <Select>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Nature's Best" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="natures">Nature's Best</SelectItem>
                    <SelectItem value="organic">Organic Farms</SelectItem>
                    <SelectItem value="local">Local Harvest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="basePrice">Base Price</Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                  <Input id="basePrice" placeholder="0.00" className="pl-7" />
                </div>
              </div>
              <div>
                <Label htmlFor="discountPrice">Discount Price</Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                  <Input id="discountPrice" placeholder="0.00" className="pl-7" />
                </div>
                <p className="text-xs text-primary mt-1">Leave empty if no discount.</p>
              </div>
            </CardContent>
          </Card>

          {/* Visibility */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Featured Product</p>
                  <p className="text-xs text-primary">Highlight on homepage</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div>
                <Label>Status</Label>
                <Select defaultValue="active">
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateProductForm;

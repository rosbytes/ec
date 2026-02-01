import { ArrowLeft, Save, Upload, Image, Tag, Eye, EyeOff } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";

interface CreateCategoryFormProps {
    onBack: () => void;
}

const CreateCategoryForm = ({ onBack }: CreateCategoryFormProps) => {
    return (
        <div className="space-y-6">
            {/* Breadcrumb & Header */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <button onClick={onBack} className="hover:text-foreground">
                    Dashboard
                </button>
                <span>/</span>
                <button onClick={onBack} className="hover:text-foreground">
                    Categories
                </button>
                <span>/</span>
                <span className="text-foreground">Create Category</span>
            </div>

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Create Category</h1>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={onBack}>Cancel</Button>
                    <Button className="gap-2">
                        <Save className="h-4 w-4" />
                        Create Category
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="col-span-2 space-y-6">
                    {/* Category Details */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Tag className="h-4 w-4 text-primary" />
                                Category Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="name">Category Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Men's Clothing"
                                    className="mt-1.5"
                                />
                            </div>
                            <div>
                                <Label htmlFor="slug">Slug</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="slug"
                                        placeholder="mens-clothing"
                                        className="mt-1.5 bg-muted/50"
                                    />
                                    <Button variant="outline" size="sm" className="mt-1.5 shrink-0">
                                        Auto-generate
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Enter category description..."
                                    className="mt-1.5 min-h-[100px]"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Media */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Image className="h-4 w-4 text-primary" />
                                Category Image
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/10">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Upload className="h-6 w-6 text-primary" />
                                </div>
                                <p className="font-medium">Click to upload or drag and drop</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    SVG, PNG, JPG or GIF (max. 2MB)
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Organization */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold">Hierarchy</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Parent Category</Label>
                                <Select>
                                    <SelectTrigger className="mt-1.5">
                                        <SelectValue placeholder="Select parent (Optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None (Top Level)</SelectItem>
                                        <SelectItem value="fashion">Fashion</SelectItem>
                                        <SelectItem value="electronics">Electronics</SelectItem>
                                        <SelectItem value="home">Home & Garden</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1.5">
                                    Leave empty if this is a top-level category.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Visibility & Status */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold">Visibility</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Visibility</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Set category status
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                    <Switch defaultChecked />
                                </div>
                            </div>

                            <div className="flex items-start space-x-2">
                                <Checkbox id="featured" />
                                <div className="grid gap-1.5 leading-none">
                                    <Label
                                        htmlFor="featured"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Featured Category
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Promote this category on the homepage.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CreateCategoryForm;

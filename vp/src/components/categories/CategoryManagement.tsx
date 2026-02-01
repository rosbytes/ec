import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import CategoryStats from "./CategoryStats";
import CategoryGrid from "./CategoryGrid";

const CategoryManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Category Management</h1>
          <p className="text-muted-foreground mt-1">
            Organize and manage your product categories efficiently.
          </p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/categories/new')}>
          <Plus className="h-4 w-4" />
          Create Category
        </Button>
      </div>

      {/* Stats */}
      <CategoryStats />

      {/* Grid */}
      <CategoryGrid onAddCategory={() => { }} />
    </div>
  );
};

export default CategoryManagement;

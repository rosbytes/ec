import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
  status: "Active" | "Draft";
  bgColor: string;
}

const categories: Category[] = [
  {
    id: "1",
    name: "Vegetables",
    icon: "🥦",
    itemCount: 42,
    status: "Active",
    bgColor: "bg-green-50",
  },
  {
    id: "2",
    name: "Fruits",
    icon: "🍎",
    itemCount: 28,
    status: "Active",
    bgColor: "bg-red-50",
  },
  {
    id: "3",
    name: "Root Veggies",
    icon: "🥔",
    itemCount: 15,
    status: "Active",
    bgColor: "bg-amber-50",
  },
  {
    id: "4",
    name: "Dairy",
    icon: "🥛",
    itemCount: 12,
    status: "Draft",
    bgColor: "bg-blue-50",
  },
  {
    id: "5",
    name: "Exotics",
    icon: "🍇",
    itemCount: 8,
    status: "Active",
    bgColor: "bg-purple-50",
  },
  {
    id: "6",
    name: "Spices",
    icon: "🌶️",
    itemCount: 24,
    status: "Active",
    bgColor: "bg-orange-50",
  },
];

interface CategoryGridProps {
  onAddCategory?: () => void;
}

const CategoryGrid = ({ onAddCategory }: CategoryGridProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-4 gap-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-16 h-16 ${category.bgColor} rounded-full flex items-center justify-center text-3xl mb-3`}
            >
              {category.icon}
            </div>
            <h3 className="font-semibold text-foreground">{category.name}</h3>
            <p className="text-sm text-muted-foreground">
              {category.itemCount} Items
            </p>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">Status</span>
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${
                category.status === "Active"
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {category.status}
            </span>
          </div>
        </div>
      ))}

      {/* Add New Category Card */}
      <button
        onClick={() => navigate("/categories/new")}
        className="w-full bg-card border-2 border-dashed border-border rounded-xl p-6 hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[180px]"
      >
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
          <Plus className="h-6 w-6 text-muted-foreground" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          Add New Category
        </span>
      </button>
    </div>
  );
};

export default CategoryGrid;

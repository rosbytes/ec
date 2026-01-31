import { Folder, Package, Star, ListOrdered } from "lucide-react";

const stats = [
  { label: "Total Categories", value: "12", icon: Folder, color: "bg-primary/10 text-primary" },
  { label: "Active Items", value: "148", icon: Package, color: "bg-primary/10 text-primary" },
  { label: "Top Category", value: "Vegetables", icon: Star, color: "bg-status-warning/10 text-status-warning" },
  { label: "Display Order", value: "Reorder Grid", icon: ListOrdered, color: "bg-muted text-muted-foreground" },
];

const CategoryStats = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold mt-1 text-foreground">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryStats;

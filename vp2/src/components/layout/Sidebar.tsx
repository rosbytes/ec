import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, TrendingUp, User, Tag, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { path: "/orders", label: "Order Dashboard", icon: LayoutDashboard },
  { path: "/products", label: "Products", icon: Tag },
  { path: "/categories", label: "Categories", icon: Layers },
  { path: "/inventory", label: "Inventory", icon: Package },
  { path: "/finance", label: "Finance & Growth", icon: TrendingUp },
  { path: "/profile", label: "Profile", icon: User },
];

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <aside className="w-56 flex-shrink-0 border-r border-border bg-card h-full">
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

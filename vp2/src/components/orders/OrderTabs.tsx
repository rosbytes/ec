import { cn } from "@/lib/utils";

interface OrderTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "current", label: "Current", count: 2 },
  { id: "picked-up", label: "Picked up", count: 4 },
  { id: "scheduled", label: "Scheduled", count: 5 },
];

const OrderTabs = ({ activeTab, onTabChange }: OrderTabsProps) => {
  return (
    <div className="flex items-center gap-6 border-b border-border pb-3 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center gap-2 text-sm font-medium transition-colors pb-3 -mb-3 border-b-2",
            activeTab === tab.id
              ? "text-foreground border-foreground"
              : "text-muted-foreground border-transparent hover:text-foreground"
          )}
        >
          {tab.label}
          <span
            className={cn(
              "px-1.5 py-0.5 rounded text-xs",
              activeTab === tab.id
                ? "bg-muted text-foreground"
                : "bg-muted/50 text-muted-foreground"
            )}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default OrderTabs;

interface StatCardProps {
  label: string;
  value: string | number;
  variant?: "default" | "success" | "warning" | "danger";
}

const StatCard = ({ label, value, variant = "default" }: StatCardProps) => {
  const valueColors = {
    default: "text-foreground",
    success: "text-primary",
    warning: "text-status-warning",
    danger: "text-status-danger",
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className={`text-2xl font-bold mt-1 ${valueColors[variant]}`}>
        {value}
      </p>
    </div>
  );
};

const ProductStats = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard label="Total Products" value="1,248" />
      <StatCard label="Active" value="1,180" variant="success" />
      <StatCard label="Low Stock" value="24" variant="warning" />
      <StatCard label="Out of Stock" value="44" variant="danger" />
    </div>
  );
};

export default ProductStats;

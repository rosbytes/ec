import { Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface OrderItem {
  name: string;
  nameHindi: string;
  quantity: string;
  price: number;
}

export interface Order {
  id: string;
  type: "takeaway" | "delivery";
  customerName: string;
  time: string;
  items: OrderItem[];
  totalBill: number;
  pickupTime: string;
}

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <Card className="bg-card border border-border shadow-sm">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <Badge
              variant="outline"
              className={
                order.type === "takeaway"
                  ? "border-orange-400 text-orange-500 bg-orange-50"
                  : "border-foreground text-foreground bg-muted"
              }
            >
              {order.type === "takeaway" ? "Takeaway" : "Delivery"}
            </Badge>
            <h3 className="text-base font-semibold mt-2">Order ID: {order.id}</h3>
            <p className="text-sm text-muted-foreground">By {order.customerName}</p>
          </div>
          <span className="text-sm text-muted-foreground">{order.time}</span>
        </div>

        {/* Items */}
        <div className="space-y-2 mb-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-foreground">
                {item.name}/ <span className="text-muted-foreground">{item.nameHindi}</span>
              </span>
              <div className="flex items-center gap-8">
                <span className="text-muted-foreground w-12 text-right">{item.quantity}</span>
                <span className="text-foreground w-16 text-right">₹{item.price}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Total & Print */}
        <div className="flex items-center justify-between py-3 border-t border-border">
          <span className="font-medium">Total Bill: ₹{order.totalBill}</span>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
            <Printer className="h-4 w-4" />
            Print Bill
          </Button>
        </div>

        {/* Pickup Button */}
        <Button className="w-full bg-foreground text-background hover:bg-foreground/90 mt-3">
          Pickup In ({order.pickupTime})
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderCard;

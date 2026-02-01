import { useState } from "react";
import OrderTabs from "./OrderTabs";
import OrderCard, { Order } from "./OrderCard";

// Sample data matching the design
const sampleOrders: Order[] = [
  {
    id: "1308",
    type: "takeaway",
    customerName: "Shubham",
    time: "08:00 AM",
    items: [
      { name: "Potato", nameHindi: "आलू", quantity: "2 Kg", price: 40 },
      { name: "Mango", nameHindi: "आम", quantity: "1 Kg", price: 180 },
      { name: "Onion", nameHindi: "प्याज़", quantity: "4 Kg", price: 50 },
    ],
    totalBill: 270,
    pickupTime: "05:54",
  },
  {
    id: "1308",
    type: "delivery",
    customerName: "Shubham",
    time: "08:00 AM",
    items: [
      { name: "Potato", nameHindi: "आलू", quantity: "2 Kg", price: 40 },
      { name: "Mango", nameHindi: "आम", quantity: "1 Kg", price: 180 },
      { name: "Onion", nameHindi: "प्याज़", quantity: "4 Kg", price: 50 },
    ],
    totalBill: 270,
    pickupTime: "05:54",
  },
];

const OrderDashboard = () => {
  const [activeTab, setActiveTab] = useState("current");

  return (
    <div>
      <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sampleOrders.map((order, index) => (
          <OrderCard key={index} order={order} />
        ))}
      </div>
    </div>
  );
};

export default OrderDashboard;

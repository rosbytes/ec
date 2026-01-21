import React from "react";
import PageHeader from "../components/navigation/PageHeader";
import { Download, IndianRupee, ReceiptText, ShoppingBag, Truck, BadgePercent } from 'lucide-react';
import OrderItemRow from "../components/order/OrderItemRow";

const OrderDetailsPage = () => {
  return (
    <div className="flex flex-col px-4 gap-2 bg-green-50">
      <PageHeader label={"ORD13082003"} />
      <div className="h-12 w-full flex gap-2 items-center">
        <Truck className="bg-accent-01 h-10 w-10 p-2 text-white rounded-md " />
        <div className=" w-full">
          <h1 className="font-semibold">Delivered</h1>
          <div className="w-full flex text-text-1 justify-between">
            <p className="text-[#444444] ">Feb 6 2025, 08:20 AM</p>
            <button className="flex items-center text-accent-01 gap-1 font-medium">
              Download Invoice
              <Download size={14} />
            </button>
          </div>
        </div>
      </div>
      <div className="w-full h-px bg-border rounded-full">
      </div>
      <div className="flex gap-3">
        <ShoppingBag /> Items in this order
      </div>
      <OrderItemRow />
      <OrderItemRow />
      <OrderItemRow />
      <div className="h-35 w-full flex flex-col mt-4">
        <div className="flex gap-2 items-center font-semibold mb-2">  <ReceiptText size={16}/><h1>Bill Details</h1></div>
        <div className="w-full h-px rounded-full bg-accent-01"></div>
        <div className="text-text-2  flex justify-between h-8 items-center text-[#444444]"><h1>
          Items Total</h1>
          <h1 className="flex items-center">
            <IndianRupee size={15}/>92</h1></div>
        <div className="text-text-2  flex justify-between h-8 items-center text-[#444444]"><h1>
          Delivery Charge</h1>
          <h1 className="flex items-center">
            <IndianRupee size={15}/>92</h1></div>
        <div className="text-text-2  flex justify-between h-8 items-center text-[#444444] font-bold"><h1>
          Grand Total</h1>
          <h1 className="flex items-center">
            <IndianRupee size={15}/>92</h1></div>
      </div>
      <div className="w-full h-px bg-border rounded-full"></div>
      <div className="flex flex-col gap-2  h-60">
        <h1 className="font-semibold text-lg text-[#444444]">Order Details</h1>
        <div>
          <p className="text-[#999999] text-text-1">Order ID</p>
          <p className="text-[#444444] text-text-1">ORD13082003</p>
        </div>
        <div>
          <p className="text-[#999999] text-text-1">Delivery Address</p>
          <p className="text-[#444444] text-text-1">Sharmaji’s Place, Okay Plus, Jagatpura, Jaipur</p>
        </div>
        <div>
          <p className="text-[#999999] text-text-1">Payment Mode</p>
          <p className="text-[#444444] text-text-1">Paid Online</p>
        </div>
        <div>
          <p className="text-[#999999] text-text-1">Order Placed at</p>
          <p className="text-[#444444] text-text-1">Feb 5 2025, 11:20 AM</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;

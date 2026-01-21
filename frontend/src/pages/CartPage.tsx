import React from "react";
import { ArrowLeft, ChevronDown, IndianRupee, MapPin, Truck } from "lucide-react";
import QuantitySelector from "../components/product/QuantitySelector";
import CartItem from "../components/cart/CartItem";
import OfferCouponsAndPromo from "../components/cart/OfferCouponsAndPromo";
import { ReceiptText } from "lucide-react";
import Button from "../components/ui/Button";
const cartPage = () => {
  return (
    <div>
      <div className="px-4">
      <div className="h-16 w-full flex justify-start gap-3 items-center">
        <div>
          <ArrowLeft />
        </div>
        <div className="text-lg font-bold text-[#444444]">
          <h1>Cart</h1>
        </div>
      </div>
      <div className="flex gap-2 font-bold">
        <Truck />
        <h1>Delivering Tomorrow by 10 AM</h1>
      </div>
      <CartItem />
      <CartItem />
      <CartItem />
      <OfferCouponsAndPromo/>
      <div className="h-35 w-full flex flex-col mt-4">
        <div className="flex gap-2 items-center font-semibold mb-2">  <ReceiptText size={16}/><h1>Bill Details</h1></div>
        <div className="w-full h-0.5 rounded-full bg-accent-01"></div>
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
      <div className="">
        <Button label={"Add Address"} bgcolor={"accent-01"} textColor={"secondary"}/>
      </div>
      
    </div>
    <div className="h-50 bg-[#E1E8E2] w-full rounded-t-2xl fixed bottom-0 px-5 flex flex-col gap-5">
      <div className="text-accent-01 mt-5 text-text-2">Delivering Your Order To</div>
      <div className="flex items-center gap-3">
        <div>
          <MapPin className="text-accent-01" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-semibold text-text-2">Sharmaji's Place</h1>
          <p className="overflow-hidden text-text-1 text-[#444444]">B511, Royal Platinum, Jagatpura, Jaipur</p>
        </div>
      </div>
      <div className="">
        <Button label={"Proceed To Pay"} bgcolor={"accent-01"} textColor={"secondary"} />
      </div>

      </div>
    </div>
  );
};

export default cartPage;

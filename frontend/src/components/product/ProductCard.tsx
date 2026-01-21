import React from "react";
import { ChevronDown, IndianRupee } from "lucide-react";
import QuantitySelector from "./QuantitySelector";

interface ProductCardProps {
  image: string;
  name: string;
  nameHindi: string;
  weight: string;
  price: number;
  bgColor?: string;
  itemCategory?: string;
  onAdd?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = (props) => {
  return (
    <div className="h-full w-25 flex flex-col">
      <div className="">
        <img className="rounded-md aspect-square" src={props.image} alt="" />
      </div>
      <div className="ProductName mt-1.5 font-normal text-[0.8rem]">
        <p>
          {props.name}/ {props.nameHindi}
        </p>
      </div>
  
      <div className="ProductWeight font-normal text-[#999999] text-[14px] w-20 h-4 flex">
        <p>{props.weight}</p>
        <ChevronDown className=" w-3" />
      </div>
      <div className="h-4 w-8 flex font-semibold text-[14px] mt-1.5">
        <IndianRupee className="w-3" /> <p>{props.price} </p>
      </div>
      <div className="mt-3 h-7">
        <QuantitySelector itemCategory={props.itemCategory} />
      </div>
    </div>
  );
};

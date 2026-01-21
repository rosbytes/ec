import { Minus, Plus } from "lucide-react";
import React from "react";
import { useState } from "react";

interface QuantitySelectorProps {
  itemCategory?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = (props) => {
  const [quantity, setQuantity] = useState(1);
  return (
    <div>
      {quantity === 0 ? (
        <div className="h-full w-25">
          <button
            onClick={() => setQuantity(quantity + 1)}
            className={`border-border text-accent-01 rounded-md border-[0.2px] bg-white w-full h-full font-semibold text-sm ${
              props.itemCategory === "Vegetable"
                ? "text-accent-01 "
                : "text-accent-03 "
            }`}
          >
            Add
          </button>
        </div>
      ) : (
        <div
          className={`h-full w-25 rounded-md  flex justify-around items-center text-secondary ${
            props.itemCategory === "Vegetable" ? "bg-accent-01" : "bg-accent-03"
          }`}
        >
          <button
            onClick={() => setQuantity(quantity - 1)}
            className="flex items-center"
          >
            <Minus />
          </button>

          <h1 className="font-semibold ">{quantity}</h1>

          <button
            onClick={() => setQuantity(quantity + 1)}
            className="flex items-center"
          >
            <Plus />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuantitySelector;

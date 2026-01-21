import React, { useState } from "react";

interface CategoryBarProps {
  ProductCategory: string;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ ProductCategory }) => {
  const [activeCategory, setActiveCategory] = useState("vegetables");
  const handleClick = (category: string) => {
    setActiveCategory(category);
  };
  return (
    <div className="w-full h-8 flex ">
      <div
        className="w-1/2 flex items-center text-border flex-col"
        onClick={() => handleClick("vegetables")}
      >
        <h1 className="font-semibold">Vegetables</h1>
        <div
          className={`h-0.5 w-12 ${
            activeCategory === "vegetables"
              ? "block bg-accent-01"
              : "hidden bg-accent-01"
          } rounded-t-md mt-1.5`}
        ></div>
      </div>

      <div
        className={`w-1/2 flex items-center text-border flex-col`}
        onClick={() => handleClick("fruits")}
      >
        <h1 className="font-semibold">Fruits</h1>
        <div
          className={`h-0.5 w-12 ${
            activeCategory === "fruits"
              ? "block bg-accent-03"
              : "hidden bg-accent-03"
          } rounded-t-md mt-1.5`}
        ></div>
      </div>
    </div>
  );
};

export default CategoryBar;

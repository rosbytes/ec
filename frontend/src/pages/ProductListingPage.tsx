import { useState } from "react";
import { ProductCard } from "../components/product/ProductCard";
import CategoryBar from "../components/ui/CategoryBar";

const ProductListingPage = () => {
  const [activeTab, setActiveTab] = useState<"vegetables" | "fruits">(
    "vegetables"
  );
  const addItem = (product: any) => {
    console.log("Adding item:", product);
  };

  const products = [
    {
      id: 1,
      name: "Potato",
      nameHindi: "आलू",
      weight: "500 gm",
      price: 12,
      image:
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 2,
      name: "Onion",
      nameHindi: "प्याज़",
      weight: "500 gm",
      price: 40,
      image:
        "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 3,
      name: "Tomato",
      nameHindi: "टमाटर",
      weight: "500 gm",
      price: 30,
      image:
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 4,
      name: "Chilli",
      nameHindi: "मिर्च",
      weight: "500 gm",
      price: 12,
      image:
        "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 3,
      name: "Tomato",
      nameHindi: "टमाटर",
      weight: "500 gm",
      price: 30,
      image:
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 4,
      name: "Chilli",
      nameHindi: "मिर्च",
      weight: "500 gm",
      price: 12,
      image:
        "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 3,
      name: "Tomato",
      nameHindi: "टमाटर",
      weight: "500 gm",
      price: 30,
      image:
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 4,
      name: "Chilli",
      nameHindi: "मिर्च",
      weight: "500 gm",
      price: 12,
      image:
        "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 5,
      name: "Carrot",
      nameHindi: "गाजर",
      weight: "500 gm",
      price: 25,
      image:
        "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=300&q=80",
    },
  ];

  const handleAddToCart = (product: any) => {
    addItem(product);
    // Optional: Show toast or feedback
    console.log("Added to cart:", product.name);
  };
  return (
    <div>
      <CategoryBar />
      <div className="h-full w-full bg-[#E1E8E2] grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 md:gap-2 lg:grid-cols-9 justify-items-center rounded-t-xl gap-4 p-4 pb-18">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onAdd={() => handleAddToCart(product)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductListingPage;

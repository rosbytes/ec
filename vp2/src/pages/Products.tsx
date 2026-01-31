import { useNavigate } from "react-router-dom";
import ProductManagement from "@/components/products/ProductManagement";

const Products = () => {
    const navigate = useNavigate();
    return (
        <ProductManagement
            onAddProduct={() => navigate('/products/new')}
        />
    );
};

export default Products;

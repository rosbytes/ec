import { useNavigate } from "react-router-dom";
import CreateProductForm from "@/components/products/CreateProductForm";

const AddProduct = () => {
    const navigate = useNavigate();

    return (
        <CreateProductForm
            onBack={() => navigate('/products')}
        />
    );
};

export default AddProduct;

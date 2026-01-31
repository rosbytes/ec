import { useNavigate } from "react-router-dom";
import CreateCategoryForm from "@/components/categories/CreateCategoryForm";

const AddCategory = () => {
    const navigate = useNavigate();

    return (
        <CreateCategoryForm
            onBack={() => navigate('/categories')}
        />
    );
};

export default AddCategory;

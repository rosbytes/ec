import React from "react";
import QuantitySelector from "../components/product/QuantitySelector";
import { IndianRupee } from "lucide-react";
import CartIconWithCount from "../components/ui/CartIconWithCount";

const ProductDetailPage =() =>{
    return(
        <div className="bg-[#E1E8E2]">
            <div className="p-4">
                <img src="https://images.unsplash.com/photo-1767818375257-2d1f80c28c82?q=80&w=680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
                " alt="" className="w-full object-cover aspect-square rounded-lg" />
                <div className="p-2 bg-secondary mt-3 rounded-lg w-full h-18.5 flex flex-col justify-center">
                    <div className="flex justify-between items-center">
                        <h1>
                            Potato/ आलू
                        </h1>
                        <QuantitySelector/>   {/* need to change this to weightselector*/}
                    </div>
                    <div className=" flex text-text-2 items-center ">
                        <IndianRupee size={15} /> 40 
                    </div>
                </div>
                <div className="h-full w-full bg-secondary p-2 mt-3 rounded-lg">
                    <h1 className="text-text-2 text-[#444444]">About the Product</h1>
                    <p className="text-text-1 text-[#999999] mt-1">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat sit libero voluptates unde doloribus ut nobis totam. Voluptatum quaerat necessitatibus in, nemo modi, aliquid, error cumque dolores accusantium obcaecati excepturi!
                    </p>
                </div>
                <div className="h-40 bg-gradient-to-t from-secondary to-transparent p-4 flex items-end">
                
                    <div className="h-13 w-full flex gap-2">
                        <div className="w-1/4 h-full">
                            <CartIconWithCount/>
                        </div>
                        <div className="h-full w-3/4 ">
                            <button className="border-accent-01 w-full h-full border-1 rounded-[25px] text-accent-01 font-semibold">Add to Cart</button> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailPage
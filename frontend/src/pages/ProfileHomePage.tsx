import React from "react";
import { ArrowLeft, MapPin, ShoppingBag, MessageCircleMore, ChevronRight, Info, SquarePen } from 'lucide-react';
import aam from '../assets/profileAvatar/Aam.svg';
import logoBlack from '../assets/logoBlack.svg'
import PageHeader from "../components/navigation/PageHeader";

const ProfileHomePage = () => {
    return(
        <div className="px-4 flex flex-col ">
            <PageHeader label={"Profile"} />
            <div className="bg-[#E1E8E2] h-22 rounded-lg flex gap-3 items-center px-4">
                <div>
                    <img src={aam} alt="" />
                </div>
                <div>
                    <h1 className="text-text-2 font-semibold">Add Your Name</h1>
                    <h1 className="text-text-1 font-normal">+91 6375120050</h1>
                </div>
            </div>
            <div className="h-20 my-4 rounded-lg flex gap-4">
                <div className="bg-[#E1E8E2] h-full w-1/2 rounded-lg flex flex-col justify-center items-center ">
                    <ShoppingBag/>
                    <h1 className="text-text-1 font-semibold">Your Orders</h1>

                </div>
                <div className="bg-[#E1E8E2] h-full w-1/2 rounded-lg flex flex-col justify-center items-center">
                    <MapPin />
                    <h1 className="text-text-1 font-semibold">Addresses</h1>
                </div>
            </div>
            <div className="h-40 bg-[#E1E8E2] rounded-lg flex flex-col px-4 py-2 justify-evenly">
                <div className="flex justify-between items-center py-2">
                    <div className="flex gap-2">
                        <MessageCircleMore />
                        <h1 className="text-text-2 font-normal">Custom Support & FAQs</h1>
                    </div>
                    <div>
                        <ChevronRight />
                    </div>
                </div>
                <div className="h-px w-full bg-black"></div>
                <div className="flex justify-between items-center py-2">
                    <div className="flex gap-2">
                        <SquarePen />
                        <h1 className="text-text-2 font-normal">Suggest Improvements</h1>
                    </div>
                    <div>
                        <ChevronRight />
                    </div>
                </div>
                <div className="h-px w-full bg-black"></div>
                <div className="flex justify-between items-center py-2">
                    <div className="flex gap-2">
                        <Info />
                        <h1 className="text-text-2 font-normal">About Sabjiwala</h1>
                    </div>
                    <div>
                        <ChevronRight />
                    </div>
                </div>
            </div>
            <div className="mt-40 flex flex-col items-center gap-2 mb-5">
                <img src={logoBlack} alt="" className=""/>
                <p className="text-xs text-gray-500">v1.38.2003</p>
            </div>
        </div>
        
    )
}

export default ProfileHomePage
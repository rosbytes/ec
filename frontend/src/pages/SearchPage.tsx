import React from "react";
import SearchBar from "../components/ui/SearchBar";
import BottomNav from "../layouts/BottomNav";

const SearchPage =() => {
    return(
        <div className="py-4 h-dvh">
            <SearchBar/>
            <BottomNav />
        </div>
    )
}

export default SearchPage
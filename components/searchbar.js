import React, {component} from 'react';
import {Search} from "@mui/icons-material";
import '../styles/searchbar.css';



export default function SearchBar() {
    return (
        <>
            <input className="search-bar-input" type="text" placeholder="Search Tagging"/>
            <Search className="search-bar-button"/>
        </>
    );
}
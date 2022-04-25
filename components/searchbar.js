import React, { useState } from "react";
import {Search as SearchIcon} from '@mui/icons-material';
import axios from "axios";

function SearchBar({placeholder, data}) {
    axios.defaults.withCredentials = true;
    const [filteredData, setFilteredData] = useState([]);
    let recordings = []


    console.log(recordings);

    const handleFilter = (event) => {
        const searchWord = event.target.value
        const newFilter = data.filter((value) => {
            axios.get('https://api.60seconds.io/api/search_by_tag', {
                params: {
                    tag: searchWord,
                }
            }).then(function (response) {
                if (response !== null)
                    console.log(response);
                else
                    console.log("nothing");
            })
        });
        setFilteredData(newFilter);
    }

    return (
        <>
            <div className="search">
                <div className="searchInputs">
                    <input type="text" placeholder={placeholder} onChange={handleFilter}/>
                    <SearchIcon/>
                </div>
                { filteredData.length !== 0 && (
                    <div className="dataResult">
                        {filteredData.map((value, key) => {
                            return (
                                <a className="dataItem" href={value.link} target="_blank">
                                    <p> {" "} {value.title} {" "} </p>
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
            <p></p>
        </>
    )
}

export default SearchBar;
import React, {useState} from "react";

export default function Day({parentToChild}){
    return(
        <h1>date returned to child component: {parentToChild.toString()}</h1>
    )
}
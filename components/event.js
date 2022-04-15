import React, {useState} from "react";

export default function description({descriptionToChild, time}){

    //console.log(descriptionToChild);
    if(!descriptionToChild.toString().includes("No")){
        return (
            <p>{descriptionToChild + " at " + time}</p>
        )
    } else {
        return (
            <p>{descriptionToChild}</p>
        )
    }
}
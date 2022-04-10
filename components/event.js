import React, {useState} from "react";

export default function description({descriptionToChild, time}){
    if(descriptionToChild.includes("no")){
        return (
            <br></br>
        )
    } else {
        return (
            <p>{descriptionToChild + " at " + time}</p>
        )
    }
}
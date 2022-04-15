import React, {useState} from "react";

export default function description({descriptionToChild, time}){
    if(descriptionToChild.toString().includes("no")){
        return (
            <p>{descriptionToChild + " at " + time}</p>
        )
    } else {
        return (
            <p>{descriptionToChild}</p>
        )
    }
}
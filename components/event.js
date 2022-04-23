import React, {useState} from "react";
import {isSameDay} from 'date-fns';

export default function description({events, date}){

    let localevents = [];
    let newarray = [];

    Object.entries(events).forEach(entry => {
        const [key, value] = entry;

        if(isSameDay(value.eventDate, date)){
          localevents.push(entry);
        } 
    })

    localevents.map((item, index) => {
        item.map((c, i) => {
            if(c.length !== 1){
                newarray.push(c);
            }
        })
    })

    if(newarray.length >=1 ){
        const listItems = newarray.map((element) => {
            return (
                <div key={element.eventDate.toLocaleTimeString()}>
                    <h4>{element.eventDescription} at {element.eventDate.toLocaleTimeString()}</h4>
                </div>
            )
        })

        return (
            <div>{listItems}</div>
        )
    } else {
        return(
            <h4>No events.</h4>
        )
    }
}
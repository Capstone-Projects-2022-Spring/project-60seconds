import React from "react";
import Box from '@mui/material/Box'
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

    console.log(newarray)
    if(newarray.length >=1 ){
        const listItems = newarray.map((element) => {
            if(typeof(element) === "object"){ 
                return (
                    <div key={element.eventDate.toLocaleTimeString() + Math.random()}>
                        <Box><h4>{element.eventDescription} at {element.eventDate.toLocaleTimeString()}</h4></Box>
                    </div>
                )
            }
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
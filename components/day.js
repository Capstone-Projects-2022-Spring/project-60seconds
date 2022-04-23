import React, {useState, useEffect} from "react";
import { View } from 'react-native';
import styles from '../App.style';
import axios from "axios";
import PlayButton from './playbutton';
import DownloadButton from './downloadButton';
import {isSameDay} from 'date-fns';
import EventComponent from './event';

axios.defaults.withCredentials = true;

export default function Day({parentToChild, usernameReceived, eventsReceived}) {
  
    let selectedDateString = parentToChild.getFullYear() + '-' + (parentToChild.getMonth()+1) + '-' + parentToChild.getDate();
    let selectedDateStringAsDate = new Date(selectedDateString);
    let eventsOnDay = [];

    //console.log(selectedDateString);
    const [data, setData] = useState('');

    const parentToChild2 = (linkToSet) => {
      setData(linkToSet.toString());
    }
    
    useEffect(() => {
    axios.get('https://api.60seconds.io/api/get_links', {
        params: {
          username: usernameReceived,
          date: selectedDateString
        }
      }).then(function (response) {
        if(response.data.length == 0){
          parentToChild2('No recordings made this day.');
        } else {
          //for milestone demo 2, it plays the most recent recording returned from the query
          parentToChild2(response.data[response.data.length - 1].link);
        }
      }).catch(function (error) {
        console.log(error);
    });

    //default values of event data, reset upon each new date selected on calendar
    let stringDescriptionToPass = "No events.";
    let timeStringToPass = "";

    Object.entries(eventsReceived).forEach(entry => {
        const [key, value] = entry;

        //event data values are only updated if a day with an associated event is selected
        if(isSameDay(value.eventDate, selectedDateStringAsDate)){
          eventsOnDay.push(entry);
        } 
    })
    
    //event data values are passed with either default values or with associated event data 
    //descriptionToChild(stringDescriptionToPass);
    //timeToChild(timeStringToPass);
  })
  

  return(
    <div className="dayBox">
      <View style={styles.dayBox}>
        <h2>{parentToChild.toDateString()}</h2>
            <PlayButton parentToChild2={data}/>
            <DownloadButton parentToChild2={data} date={parentToChild}/>
            <EventComponent events={eventsReceived} date={selectedDateStringAsDate}/>
      </View>
    </div>
  )
}

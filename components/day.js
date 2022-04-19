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
    let selectedDateEventDescription = "";
    let selectedDateEventTime = "";
    //console.log(selectedDateString);
    const [data, setData] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventTime, setEventTime] = useState('');

    const parentToChild2 = (linkToSet) => {
      setData(linkToSet.toString());
    }

    const descriptionToChild = (descToSet) => {
      setEventDescription(descToSet);
    }

    const timeToChild = (timeToSet) => {
      setEventTime(timeToSet);
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

    Object.entries(eventsReceived).forEach(entry => {
        const [key, value] = entry;
        if(isSameDay(value.eventDate, selectedDateStringAsDate)){
          //console.log(value.eventDate);
          //console.log(value.eventDescription)
          descriptionToChild(value.eventDescription);
          timeToChild(value.eventDate.toLocaleTimeString());
        } 
    })
  })
  

  return(
    <div className="dayBox">
      <View style={styles.dayBox}>
        <h3>{parentToChild.toDateString()}</h3>
            <PlayButton parentToChild2={data}/>
            <DownloadButton parentToChild2={data} date={parentToChild}/>
            <EventComponent descriptionToChild={eventDescription} time={eventTime}/>
      </View>
    </div>
  )
}

import React, {useState, useEffect} from "react";
import { View } from 'react-native';
import styles from '../App.style';
import axios from "axios";
import PlayButton from './playbutton';
import DownloadButton from './downloadButton';
import {isSameDay} from 'date-fns';
import EventComponent from './event';

axios.defaults.withCredentials = true;

export default function Day({parentToChild}) {
    let username;
    let dayDescription;

    let selectedDateString = parentToChild.getFullYear() + '-' + (parentToChild.getMonth()+1) + '-' + parentToChild.getDate();
    let selectedDateStringAsDate = new Date(selectedDateString);
    //console.log(selectedDateString);
    const [data, setData] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventTime, setEventTime] = useState('');

    class Event{
      constructor(date, description){
        this.eventDate = date;
        this.eventDescription = description;
      }
    }

    const parentToChild2 = (linkToSet) => {
      setData(linkToSet.toString());
    }

    const descriptionToChild = (descToSet) => {
      setEventDescription(descToSet);
    }

    const timeToChild = (timeToSet) => {
      setEventTime(timeToSet);
    }

    
    axios.get('https://api.60seconds.io/api/user').then(function(response) {
      username = response.data.username;

      axios.get('https://api.60seconds.io/api/get_events', {
        params: {
          username: username,
        }
      }).then(function (response) {  
        if(response.data.length == 0){
          console.log("no events returned")
        } else {
          Object.entries(response.data).forEach(entry => {
            const [key, value] = entry;

            let eventDate = new Date(value.time);
            eventDate.setHours(eventDate.getHours() + 4)

            const event = new Event(eventDate, value.description);

            if(isSameDay(event.eventDate, selectedDateStringAsDate)){
              descriptionToChild(value.description);
              timeToChild(event.eventDate.toLocaleTimeString());
            } else if(!isSameDay(event.eventDate, selectedDateStringAsDate)){
              descriptionToChild("no events");
            }
          })
          //console.log(events);
        }
      }).catch(function (error) {
        console.log(error);
      });

      axios.get('https://api.60seconds.io/api/get_links', {
          params: {
            username: username,
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

    });



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

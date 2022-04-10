import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from "react";
import { View } from 'react-native';
import axios from "axios";
import styles from '../styles/calendar.css';
import CalendarComponent from '../components/CalendarComponent';

export default function Calendar() {

    //created event class to specify specific object
    class Event{
      constructor(date, description){
        this.eventDate = date;
        this.eventDescription = description;
      }
    }

    let events = [];
    let datesReturned = [];
    const [dates, setDates] = useState([]);

    //enclosing the get requests in the useEffect() statement ensures the API calls only run 
    //once and only update the corresponding components when the result of the calls changes.
    useEffect(() => {
      let username;

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
            events.push(event);
          })
          console.log(events);
        }
      }).catch(function (error) {
        console.log(error);
      });

      //api call to get dates of recordings made by a user
      axios.get('https://api.60seconds.io/api/get_recording_dates', {
          params: {
            username: username,
          }
        })
        .then(function (response) {
          if(response.data.length == 0){
            console.log('no recordings made by a user');
          } else {
            //parse through api response and add values to dates array
            Object.entries(response.data).forEach(entry => {
              const [key, value] = entry;
              datesReturned.push(value.upload_date);
            })

            datesToChild(datesReturned);
          }
        }) 
        .catch(function (error) {
          console.log(error);
        });
      });

      const datesToChild = (datestopass) => {
        //console.log(1);
        setDates(datestopass);
      }
    }, []);

    
  return (
    <View style={styles.pages}>
      <div className="App">
        <CalendarComponent datesReturned={dates}/>
        <StatusBar style="auto" />
      </div>
    </View>
  );
}
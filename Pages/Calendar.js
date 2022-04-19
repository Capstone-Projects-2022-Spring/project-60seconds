import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from "react";
import { View } from 'react-native';
import axios from "axios";
import styles from '../styles/calendar.css';
import CalendarComponent from '../components/CalendarComponent';

export default function Calendar() {
    let localusername = '';
    let datesReturned = [];
    let eventsReturned = [];

    class Event{
      constructor(date, description){
        this.eventDate = date;
        this.eventDescription = description;
      }
    }
    
    const [username, setUsername] = useState('');
    const [events, setEvents] = useState([]);
    const [dates, setDates] = useState([]);

    //enclosing the get requests in the useEffect() statement ensures the API calls only run 
    //once and only update the corresponding components when the result of the calls changes.
    useEffect(() => {
      axios.get('https://api.60seconds.io/api/user').then(function(response) {
          localusername = response.data.username;
          usernameToChild(localusername)

          axios.get('https://api.60seconds.io/api/get_events', {
            params: {
              username: localusername,
            }
          }).then(function (response) {  
            if(response.data.length == 0){
              //console.log("no events returned")
            } else {
              Object.entries(response.data).forEach(entry => {
                const [key, value] = entry;
    
                let eventDate = new Date(value.time);
                eventDate.setHours(eventDate.getHours() + 4)
    
                const event = new Event(eventDate, value.description);
                eventsReturned.push(event);
    
                /*if(isSameDay(event.eventDate, selectedDateStringAsDate)){
                  descriptionToChild(value.description);
                  timeToChild(event.eventDate.toLocaleTimeString());
                } else if(!isSameDay(event.eventDate, selectedDateStringAsDate)){
                  descriptionToChild("No events.");
                }*/
                
                eventsToChild(eventsReturned);
              })
              //console.log(events);
            }
          }).catch(function (error) {
            console.log(error);
          });

      //api call to get dates of recordings made by a user
      axios.get('https://api.60seconds.io/api/get_recording_dates', {
          params: {
            username: localusername,
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

      const eventsToChild = (eventstopass) => {
        eventstopass = eventstopass.slice(0);
        //console.log(eventstopass);
        setEvents(eventstopass);
      }

      const datesToChild = (datestopass) => {
        //console.log(datestopass);
        setDates(datestopass);
      }

      const usernameToChild = (usernametopass) => {
        //console.log(usernametopass);
        setUsername(usernametopass);
      }
    }, []);

    
  return (
    <View style={styles.pages}>
      <div className="App">
        <CalendarComponent datesReturned={dates} usernameReturned={username} eventsReturned={events}/>
        <StatusBar style="auto" />
      </div>
    </View>
  );
}
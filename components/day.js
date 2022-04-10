import React, {useState, useEffect} from "react";
import { View } from 'react-native';
import styles from '../App.style';
import axios from "axios";
import PlayButton from './playbutton';
import DownloadButton from './downloadButton';

axios.defaults.withCredentials = true;

export default function Day({parentToChild}) {
    let username;

    let selectedDateString = parentToChild.getFullYear() + '-' + (parentToChild.getMonth()+1) + '-' + parentToChild.getDate();
    //console.log(selectedDateString);
    const [data, setData] = useState('');

    const parentToChild2 = (linkToSet) => {
      setData(linkToSet.toString());
    }

    useEffect(() => {
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
            console.log(response.data);
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
    }, []);



    return(
        <div className="dayBox">
            <View style={styles.dayBox}>
                <h3>{parentToChild.toDateString()}</h3>
                <PlayButton parentToChild2={data}/>
                <DownloadButton parentToChild2={data} date={parentToChild}/>
            </View>
        </div>
    )
}

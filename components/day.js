import React, {useState} from "react";
import { View } from 'react-native';
import styles from '../App.style';
import axios from "axios";
import PlayButton from './playbutton';


export default function Day({parentToChild}){
    
    let selectedDateString = parentToChild.getFullYear() + '-' + (parentToChild.getMonth()+1) + '-' + parentToChild.getDate();
    //console.log(selectedDateString);
    const [data, setData] = useState('');

    const parentToChild2 = (dateToSet) => {
      setData(dateToSet.toString());
  }

    //querying backend for links based on day.
    axios.get('http://54.226.36.70/api/get_links', {
        params: {
          username: "testUsername",
          date: selectedDateString
        }
      })
      .then(function (response) {
        //let link = response.data[0].link;
        console.log(response.data);
        if(response.data.length == 0){
          parentToChild2('No recordings made this day.');
        } else {
          parentToChild2(response.data[0].link);
          //setLinks(response.data[0].link);
        }
      }) 
      .catch(function (error) {
        console.log(error);
      });

    return(
        <div className="dayBox">
            <View style={styles.dayBox}>
                <h3>{parentToChild.toDateString()}</h3> 
                <PlayButton parentToChild2={data.toString()}/>
            </View>
        </div>
    )
}
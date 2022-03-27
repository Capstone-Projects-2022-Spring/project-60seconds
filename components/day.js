import React, {useState} from "react";
import { View } from 'react-native';
import styles from '../App.style';
import axios from "axios";


export default function Day({parentToChild}){
    
    let selectedDateString = parentToChild.getFullYear() + '-' + (parentToChild.getMonth()+1) + '-' + parentToChild.getDate();
    //console.log(selectedDateString);
    const [links, setLinks] = useState();

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
        setLinks(response.data[0].link);
      }) 
      .catch(function (error) {
        console.log(error);
      });

    return(
        <div className="dayBox">
            <View style={styles.dayBox}>
                <h3>{parentToChild.toDateString()}</h3> 
                <p>{links}</p>
            </View>
        </div>
    )
}
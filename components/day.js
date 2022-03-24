import React, {useState} from "react";
import { View } from 'react-native';
import styles from '../App.style';
import axios from "axios";

export default function Day({parentToChild}){
    
    //querying backend for links based on day. to be implemented in new branch. 

    /*axios.get('http://54.226.36.70/api/get_links', {
        params: {
          username: "testUsername",
          date: '2022-03-24'
        }
      })
      .then(function (response) {
        let link = response.data[0].link
        console.log(response.data[0].link);
      }) 
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });
      */

    return(
        <div className="dayBox">
            <View style={styles.dayBox}>
                <p>{parentToChild.toString()}</p>
            </View>
        </div>
    )
}
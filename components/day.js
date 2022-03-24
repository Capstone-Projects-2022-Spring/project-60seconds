import React, {useState} from "react";
import { View } from 'react-native';
import Container from "@mui/material/Container";
import styles from '../App.style';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";

export default function Day({parentToChild}){
    
    axios.get('http://54.226.36.70/api/get_links', {
        params: {
          username: "tester"
        }
      })
      .then(function (response) {
        console.log(response.data[0].link);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });

    return(
        <div className="dayBox">
            <View style={styles.dayBox}>
                <p>{parentToChild.toString()}</p>
            </View>
        </div>
    )
}
import React, {useState} from "react";
import { View } from 'react-native';
import Container from "@mui/material/Container";
import styles from '../App.style';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Day({parentToChild}){
    return(
        <div className="dayBox">
            <View style={styles.dayBox}>
                <p>date returned to child component: {parentToChild.toString()}</p>
            </View>
        </div>
    )
}
import { View, Button } from 'react-native';
import styles from '../App.style';
import axios from "axios";

export default function playButton({parentToChild2, date}){
    function download(){
        //construct filename based on date of recording passed from day component
        let fileName = date.toDateString().replace(/\s/g, '');
        fileName += ".mp3";
        //console.log(fileName);

        axios({
            url: parentToChild2, //your url
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    // if the data sent from the day component is a link, display button. else, display text.
    if(parentToChild2.includes("http")){
        //console.log("true link")
        return (
            <Button title="Download" onPress={download} />
        );
    } else {
        return(
            <br></br>
        )
    }
}
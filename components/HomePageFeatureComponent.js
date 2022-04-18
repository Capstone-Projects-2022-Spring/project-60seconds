import "../styles/homePage.css";
import React from 'react';
import logo from '../assets/icons8-ok.gif'
export default function HomePageFeatureComponent(props) {

    return (
      <div>
        <div class="flex-container">
          <h2><strong>FEATURES</strong></h2>
        </div>
        <div class="flex-container">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.title}-${i}`} style={{textAlign: 'center'}}>
                  {' '}
                  <img className="feature-icon" src={logo}></img>
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                </div>
              ))
            : 'Loading...'}
        </div>
      </div>
    )
}
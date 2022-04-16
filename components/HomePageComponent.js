import "../styles/homePage.css";
import React from 'react';

export default function HomePageComponent() {

    return (
        <div>
        <header id='header'>
            <div className='intro'>
                <div className='overlay'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-md-8 col-md-offset-2 intro-text'>
                                <h1>
                                    60 Seconds
                                    <span></span>
                                </h1>
                                <p>60 Seconds is a web-based application designed to record short, daily, audio recording segments. It will be compatible with both mobile devices, and desktop/laptop computers via a web browser</p>
                                <a
                                    className='btn btn-custom btn-lg page-scroll'
                                >
                                    Learn More
                                </a>{' '}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        </div>
    )
}
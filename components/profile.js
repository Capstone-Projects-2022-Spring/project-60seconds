import * as React from "react";
import StockProfilePic from '../assets/stockProfilePicture.jpg'
import "../styles/profile.css";
import AdPic1 from '../assets/monster-energy-ad.png';
import AdPic2 from '../assets/mcdonalds-ad.jpg';
import {Link} from 'react-router-dom';
import axios from 'axios';

export default function Profile() {

    const [userName, setUserName] = React.useState('');
	const [firstName, setFirstName] = React.useState('');
	const [lastName, setLastName] = React.useState('');
	const [school, setSchool] = React.useState('');
	const [occupation, setOccupation] = React.useState('');
	const [aboutMe, setAboutMe] = React.useState('');

	React.useEffect(() => {
		if(localStorage.getItem('username')) {
			setUserName(localStorage.getItem('username'))
			setFirstName(localStorage.getItem('first-name'))
			setLastName(localStorage.getItem('last-name'))
			setSchool(localStorage.getItem('school'))
			setOccupation(localStorage.getItem('occupation'))
			setAboutMe(localStorage.getItem('about-me'))
		}
	}, []);

    return (
        <>
			<div className="page-layout">
				<div className="profile-column">
					<img src={StockProfilePic} className="profile-picture"/>
					<h1 className="username">{userName}</h1>
					<div className="profile-column-info">
						<p className="first-name">First Name: {firstName}</p>
						<p className="last-name">Last Name: {lastName}</p>
						<p className="school">School: {school}</p>
						<p className="occupation">Occupation: {occupation}</p>
						<p className="basic-info-label">Basic Information</p>
						<p className="about-me">{aboutMe}</p>
						<button className="edit-profile-button">
							<Link to="/Pages/EditProfile">
								Edit Profile
							</Link>
						</button>
					</div>
				</div>
				<div className="event-column">
					<div className="event">
						{/*<p className="event-time">10:30pm</p>*/}
						{/*<p className="event-description">Doctor's Appointment</p>*/}
						{/*<p className="event-user">zack123</p>*/}
					</div>
				</div>
				<div className="ads-section">
					<h1 className="shameless-ads-label">Shameless Ads Section</h1>
					<img src={AdPic1} className="ad-pic-1"/>
					<img src={AdPic2} className="ad-pic-2"/>
				</div>
			</div>
       </>
    )
}
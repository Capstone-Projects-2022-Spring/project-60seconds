import * as React from "react";
import StockProfilePic from '../assets/stockProfilePicture.jpg'
import "../styles/profile.css";
import AdPic1 from '../assets/monster-energy-ad.png';
import AdPic2 from '../assets/mcdonalds-ad.jpg';
import {Link} from 'react-router-dom';
import axios from 'axios';

export default function Profile() {
	axios.defaults.withCredentials = true;
	const [userInfo, setUserInfo] = React.useState('');

	React.useEffect(() => {
		axios
		.get("https://api.60seconds.io/api/get_user_info")
		.then(function (response) {
			console.log(response.data);
			setUserInfo(response.data);
			
		})
		.catch(function (error){
			console.log(error);
		})
	}, []);

    return (
        <>
			<div className="page-layout">
				<div className="profile-column">
					<img src={StockProfilePic} className="profile-picture"/>
					<h1 className="username">{userInfo.username}</h1>
					<div className="profile-column-info">
						<p className="first-name">First Name: {userInfo.first_name}</p>
						<p className="last-name">Last Name: {userInfo.last_name}</p>
						<p className="school">School: {userInfo.school}</p>
						<p className="occupation">Occupation: {userInfo.occupation}</p>
						<p className="basic-info-label">Basic Information</p>
						<p className="about-me">{userInfo.description}</p>
						<button className="edit-profile-button">
							<Link to="/EditProfile" style={{ textDecoration: "none" , color:"white"}}>
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
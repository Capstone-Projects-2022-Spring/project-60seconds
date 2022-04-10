import * as React from "react";
import ProfilePic from '../assets/stockProfilePicture.jpg'
import "../styles/profile.css";

export default function Profile() {

    const [userName, setUserName] = React.useState('');
	

	React.useEffect(() => {
		if(localStorage.getItem('username')) {
			setUserName(localStorage.getItem('username'))
		}
	}, []);

    return (
        <>
			<div className="page-layout">
				<div className="profile-column">
					<img src={ProfilePic} className="profile-picture"/>
					<h1 className="username">Username:</h1>
					<div className="profile-column-info">
						<p className="first-name">First Name:</p>
						<p className="last-name">Last Name:</p>
						<p className="school">School:</p>
						<p className="occupation">Occupation:</p>
						<p className="basic-info-label">Basic Information</p>
						<button className="edit-profile-button">Edit Page</button>
					</div>
				</div>
				<div className="event-column">
					<div className="event">
						<p className="event-name">Event Name</p>
					</div>
				</div>
			</div>
       </>
    )
}
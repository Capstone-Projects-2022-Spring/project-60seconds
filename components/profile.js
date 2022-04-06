import * as React from "react";
import ProfilePic from '../assets/zach.jpg'
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
			<div className="profile-card">
				<img src={ProfilePic} className="profile-picture"/>
				<h1 className="username">{userName}</h1>
				<div className="about-me-card">
					<p className="about-me-input">This is a test of the Profile Page,
							making sure that everything looks nice and pretty</p>
				</div>
				<p><button>View Recordings</button></p>
			</div>
        </>
    )
}
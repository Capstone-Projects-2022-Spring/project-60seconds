import * as React from "react";
import ProfilePic from '../assets/zach.jpg'
import { useLocation } from "react-router-dom";
import "../styles/profile.css";

export default function Profile() {

    const location = useLocation();
	const [username, setUsername] = React.useState("not login");
	const [name, setName] = React.useState("not login")
	React.useEffect(() => {
		if (location.state) {
			setUsername(location.state.username);
		}
	}, []);

	React.useEffect(() => {
		if (location.state) {
			setName(location.state.name);
		}
	}, []);



    return (
        <>
			<div className="profile-card">
				<img src={ProfilePic} className="profile-picture"/>
				<h1 className="username">{username}</h1>
				<div className="about-me-card">
					<p className="about-me-input">This is a test of the Profile Page,
							making sure that everything looks nice and pretty</p>
				</div>
				<p><button>View Recordings</button></p>
			</div>
        </>
    )
}
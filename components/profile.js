import * as React from "react";
import ProfilePic from '../assets/icon.png'
import { useLocation } from "react-router-dom";

export default function Profile() {

    const location = useLocation();
	const [username, setUsername] = React.useState("not login");
	React.useEffect(() => {
		if (location.state) {
			setUsername(location.state.username);
		}
	}, []);

    return (
        <div className="user-profile">
            <div className="container">
                <div className="row">
                    <div className="side-info-column">
                        <div className="card-shadow">
                            <div className="card-header">
                                <img className="ProfilePic" src={ProfilePic} alt="user-profile-pic"
                                    height={300} width={300}/>
                            </div>
                            <div className="card-body">
                                <h2>Basic Information</h2>
                                <p className="mb-0">{username}</p>
                                <p className="mb-0">Description</p>
                                <p className="mb-0">Section:</p>
                            </div>
                        </div>
                    </div>
                    <div className="side-info-column2">
                        <div className="card-shadow">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
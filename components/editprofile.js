import * as React from 'react';
import StockProfilePic from '../assets/stockProfilePicture.jpg';
import '../styles/editprofile.css';

export default function Edit() {

    let profilePicture = localStorage.getItem('profile-picture');
    let firstName = localStorage.getItem('first-name');
    let lastName = localStorage.getItem('last-name');
    let school = localStorage.getItem('school');
    let occupation = localStorage.getItem('occupation');
    let aboutMe = localStorage.getItem('about-me');

    function saveInfo() {
        if (document.getElementById('first-name').value)
            localStorage.setItem('first-name', document.getElementById('first-name').value);
        if (document.getElementById('last-name').value)
            localStorage.setItem('last-name', document.getElementById('last-name').value);
        if (document.getElementById('school').value)
            localStorage.setItem('school', document.getElementById('school').value);
        if (document.getElementById('occupation').value)
            localStorage.setItem('occupation', document.getElementById('occupation').value);
        if (document.getElementById('about-me').value)
            localStorage.setItem('about-me', document.getElementById('about-me').value);
    }

    return (
      <>
          <div className="edit-profile-page">
              <div className="edit-profile-card">
                  <div className="profile-picture-card">
                      <img src={profilePicture} className="profile-picture" id="profile-picture"/>
                  </div>
                  <div className="profile-picture-upload">
                      <p className="label">Upload Profile Picture</p>
                      <input type="file" name="files"/>
                      <input type="submit" value="Upload File" name="submit"/>
                  </div>
                  <div className="name-section">
                      <p className="label">First Name</p>
                      <input id="first-name" className="name-input" type="text" placeholder={firstName}/>
                  </div>
                  <div className="name-section">
                      <p className="label">Last Name</p>
                      <input id="last-name" className="name-input" type="text" placeholder={lastName}/>
                  </div>
                  <div className="other-section">
                        <p className="label">School</p>
                        <input id="school" className="other-input" type="text" placeholder={school}/>
                  </div>
                  <div className="other-section">
                      <p className="label">Occupation</p>
                      <input id="occupation" className="other-input" type="text" placeholder={occupation}/>
                  </div>
                  <div className="other-section">
                      <p className="label">Basic Information</p>
                      <input id="about-me" className="other-input" type="text" placeholder={aboutMe}/>
                  </div>
                  <div className="submit-button-section">
                      <button className="submit-button" onClick={saveInfo}>Submit</button>
                  </div>
              </div>
          </div>
      </>
    );
}
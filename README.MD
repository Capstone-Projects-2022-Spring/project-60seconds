# 60 Seconds
## Project Overview
60 Seconds is a web-based application designed to record short, daily, audio recording segments. It will be compatible with both mobile devices, and desktop/laptop computers via a web browser. Daily, a user will record audio segments up to 60 Seconds in length. Their daily recording time is ‘pooled’ similar to ‘swipes’ on Tinder. Once the user exceeds their daily limit of 60 Seconds, they will be unable to record more content. A user WILL be able to record multiple segments daily, so long total recording time does not exceed 60 Seconds.

Once audio segments are recorded, they’ll be available for the user to review prior to uploading (similar to Snapchat’s review of photo/video before sending). Once a recording is made, the application will automatically include default tags that will be stored with the recording. These tags will be produced based on the recording’s metadata (location, date, time, length.) While the user reviews their audio segment, a description of the recording can be included. Additionally, the application will produce a speech-to-text transcription of the recording’s contents, which can be edited. When the user uploads the audio recording, this data will be stored alongside it in the database.

## Team members
Aaron Scofield, Ryan Hardison, Xu Lyu, Zachary Preston, Zack Waxler

# Final Feature List
1. Currently running on a live server, rather than the localhost, visit 60seconds.io
2. A fully functional register page, as well as a page to edit user profile information (name, school, occupation, etc.)
3. A speech-to-text transcription service
4. A fully functional calendar interface, congruent with a live Calendar
5. A back end API producing Calendar events based on user input via the transcription
6. Tagging functionality, users can add custom tags to audio recordings

# Known Bugs
1. Taggings sometimes do not show up with the recording
2. The tags must be added BEFORE recordings audio
3. The user must hit STOP recording for it to be sent to the backend
4. Transcriptions sometimes are not accurate with the user input (likely due to the microphone)
5. The user's profile picture does not save to the backend

# Instructions to Build/Run

## Accessing the Project

The project is currently live on [https://60seconds.io](https://60seconds.io). You can register an account and use all functionalities from there. Currently only Chrome is supported as it has not been tested on other browsers.

## Building the Frontend (Development)

1. Install npm
2. Run the command `git clone https://github.com/Capstone-Projects-2022-Spring/project-60seconds.git`
3. Navigate to the `project-60seconds/` directory, then run the command `npm install`

## Running the Frontend (Development)

1. Run the command `expo start:web --https`

2. You can then visit [https://localhost:19002](https://localhost:19002) to view the project in a web browser (although functionality will be fairly limited unless the backend API server is running, see below).

## Building the Frontend (Production)

1. Following these two tutorials (assuming you're on Ubuntu 20.04), install and configure Apache and Let's Encrypt. 60 Seconds uses an authentication mechanism that requires HTTPS to be configured on both the API server and the frontend server.

https://www.digitalocean.com/community/tutorials/how-to-install-the-apache-web-server-on-ubuntu-20-04#step-5-%E2%80%94-setting-up-virtual-hosts-recommended
https://www.digitalocean.com/community/tutorials/how-to-secure-apache-with-let-s-encrypt-on-ubuntu-20-04

2. Install npm
3. Run the command `git clone https://github.com/Capstone-Projects-2022-Spring/project-60seconds.git`
4. Navigate to the `project-60seconds/` directory, then run the command `npm install`
5. Recursively search through the project and replace all instances of 'https://api.60seconds.io' with the API server of your choice (again, must be over HTTPS).  
6. Run the command `./build.sh`

## Running the Frontend (Production)

1. Run the command `sudo service apache2 start`. This should bring the HTTPS server up if everything is configured correctly.

## Building the Backend API Server

1. Install npm
2. Run the command `git clone https://github.com/Capstone-Projects-2022-Spring/project-60seconds.git -b backend`
3. Navigate to the `server/` directory, then run the command `npm install`
4. Using Let's Encrypt, install an SSL certificate
5. Modify the paths in `auth.js` to point to your SSL certificate
6. Create a MySQL server and note the username, password, and host
7. Create a `creds.json` file in the server directory with the following format:

```
{
  dbUser: "xxx",
  dbPass: "xxx",
  sessionSecret: "xxx"
}
```

8. Modify `conf.json` to correctly set your host, database host, and primary database name

## Running the Backend API Server (Development)

1. Install `forever` using `npm install forever` if it is not already installed
2. Modify `conf.json` and set the mode to "development" instead of "production".
3. Start the server as a daemon with `./start.sh`

## Running the Backend API Server (Production)

1. 1. Install `forever` using `npm install forever` if it is not already installed
2. Modify `conf.json` and set the mode to "production" instead of "development".
3. You may need to tweak the `origin` value in `server.js` if you are using a production frontend server. Make sure it's set to the hostname of the frontend server, otherwise you will not be able to authenticate.
4. Start the server as a daemon with `./start.sh`

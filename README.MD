# 60 Seconds 
## Project Overview
60 Seconds is a web-based application designed to record short, daily, audio recording segments. It will be compatible with both mobile devices, and desktop/laptop computers via a web browser. Daily, a user will record audio segments up to 60 seconds in length. Their daily recording time is ‘pooled’ similar to ‘swipes’ on Tinder. Once the user exceeds their daily limit of 60 seconds, they will be unable to record more content. A user WILL be able to record multiple segments daily, so long total recording time does not exceed 60 seconds. 

Once audio segments are recorded, they’ll be available for the user to review prior to uploading (similar to Snapchat’s review of photo/video before sending). Once a recording is made, the application will automatically include default tags that will be stored with the recording. These tags will be produced based on the recording’s metadata (location, date, time, length.) While the user reviews their audio segment, a description of the recording can be included. Additionally, the application will produce a speech-to-text transcription of the recording’s contents, which can be edited. When the user uploads the audio recording, this data will be stored alongside it in the database.

## Team members
Aaron Scofield, Ryan Hardison, Xu Lyu, Zachary Preston, Zack Waxler

## Starting the Development Environment
```
npm install
expo start
```

After starting Expo, you can visit the IP address [http://localhost:19002](http://localhost:19002) in given in the console to view the project in realtime
via a web browser or a mobile device/simulator. Useful commands include:
- expo register
- expo login
- expo start:web


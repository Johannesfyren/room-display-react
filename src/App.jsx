import { useState, useEffect } from "react";
import "./index.css";
import Button from "./components/Button.jsx";
import Countdown from "./components/Countdown.jsx";
import Time from "./components/Time.jsx";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
import { getEvents, endMeeting} from "../gapi.js";
import BookingModal from "./components/BookingModal.jsx";
import UpcomingMeetingContainer from "./components/UpcomingMeetingContainer.jsx";
import PendingMeeting from "./components/PendingMeeting.jsx";





function App() {
  const [tokensAquired, setTokensAquired] = useState(false);
  const [events, setEvents] = useState([]);
  const [triggerTimeout, setTriggerTimeout] = useState(false); // timeout used to start
  const [triggerRender, setTriggerRender] = useState(false); // timeout used to start
  const time = new Date();
  const [activeEvent, setActiveEvent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  

  // When starting the app, we check for tokens and updates bearer if needed
  useEffect(() => {
    setTokensAquired(checkIfRefreshTokenExist()); // Checks for a refresh token, if it exists, we change the apps interface to not need to log in.

    if (checkIfRefreshTokenExist()) {
      !checkIfBearerTokenIsValid() && refreshBearerToken(); //If the bearer_token is not available anymore, we will refresh it
    }
  }, []);

  //Refreshing the bearer token every hour - 30 secs, so it never fails to fetch
  useEffect(() => {
    const tokenTimeLeft = bearerTokenTimeLeft();
    const timeout = tokenTimeLeft - 30000;

    let timeoutID;

    if (tokenTimeLeft > 0) {
      timeoutID = setTimeout(() => {
        console.log("calling refreshBearerToken()");
        refreshBearerToken();
      }, timeout);
    }

    setTriggerTimeout(false);
    return () => clearTimeout(timeoutID);
  }, [triggerTimeout]);

  //Checking for new events every minute
  useEffect(() => {
    async function fetchEventsAndUpdate() {
      const newestEvents = await getEvents(); // get newest events
      if (newestEvents == "401") {
        console.log("401 error");
        refreshBearerToken();
      } else {
        setEvents(newestEvents);
  
        // Check if there are events, and if so, check if the first event is active.
        if (newestEvents.length !== 0) {
          const isActive = checkIfActiveMeeting(
            newestEvents.items[0]?.start?.dateTime,
            newestEvents.items[0]?.end?.dateTime
          );
          setActiveEvent(isActive);
        } else {
          setActiveEvent(false);
        }
      }
    }
    function checkIfActiveMeeting(startTime, endTime) {
          const today = new Date();
          const start = new Date(startTime);
          const end = new Date(endTime);

          if (start <= today && end >= today) {
            return true;
          }
        }
    // Set interval to poll events every 60 seconds
    const intervalID = setInterval(fetchEventsAndUpdate, 60000);
  
    // Initial fetch on mount
    fetchEventsAndUpdate();
    setTriggerRender(false);
    setIsLoading(false);
    return () => clearInterval(intervalID); // Cleanup interval on unmount
  }, [triggerRender]); 

const endEvent = async () => {
    setIsLoading(true);
    const check = endMeeting(await events.items[0].id);
    if (await check == 200) {
      setTriggerRender(true); 
    }else{console.log('error code: ', check)}
    
}
  

  async function refreshBearerToken() {
    try {
      const data = await fetch("https://room-display-backend.vercel.app/refreshAccessToken", { //"http://localhost:3000/refreshAccessToken"
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refresh_token: localStorage.getItem("refresh_token"),
        }),
      });
      const response = await data.json();
      localStorage.setItem("bearer_token", response.access_token);

      const currentTime = Date.now();
      localStorage.setItem(
        "expiry_date",
        currentTime + response.expires_in * 1000
      );
      setTriggerTimeout(true);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      {tokensAquired ? ( //Vi kigger på om vi er logget ind og kan lave API-kald 
        <div className={activeEvent ? "main-container main-container-occupied" : "main-container"}>
          <div className="nav-container">
            <h1 className="clock">
              {(time.getHours() < 10
                ? "0" + time.getHours()
                : time.getHours()) +
                ":" +
                (time.getMinutes() < 10
                  ? "0" + time.getMinutes()
                  : time.getMinutes())}
            </h1>
            {!activeEvent 
            ? 
              <Button text={'Reservér'} clickHandler={() => setShowModal(true)} btnType={'primary'} isLoading={isLoading}/> 
            : 
              <Button text={'Afslut'} clickHandler={endEvent} btnType={'secondary'} isLoading={isLoading}/>}
          </div>

          {activeEvent ? (
            <div className="meeting-info-container">
              <div className="meeting-details">
                <h1>{events.items[0].summary}</h1>
                <h2>
                  <Time
                    time={[
                      new Date(events.items[0].start.dateTime),
                      new Date(events.items[0].end.dateTime),
                    ]}
                  ></Time>
                </h2>
                <h2>{events.items[0].creator.email.replace('@gmail.com','')}</h2>
              </div>
              <Countdown events={events} />
            </div>
            
          ) : (
            events?.items?.length > 0 &&  <PendingMeeting events={events} />
          )}
          {events?.items?.length > 0 && <UpcomingMeetingContainer events={events} activeEvent={activeEvent}/>}
        </div>
      ) : (
        <Button
          text={"Connect Google Calendar"}
          clickHandler={acquireTokensOnLogin}
        />

      )}
      {code && !localStorage.getItem("refresh_token") && OAuthRedirectHandler()}{/* Redirects to the OAuth2callback if we dont have a refresh_token*/}
      {showModal && <BookingModal setShowModal = {setShowModal} events = {events} setEvents = {setEvents} setTriggerRender={setTriggerRender} setIsLoading={setIsLoading}/>}
    </>
  );
}

const acquireTokensOnLogin = async () => {
  try {
    const data = await fetch("https://room-display-backend.vercel.app/auth-url"); //http://localhost:3000/auth-url
    const response = await data.json();
    console.log('response from auth-url', await response);
    window.location.href = response.url;
  } catch (err) {
    console.error("there was and error", err);
  } finally {
    console.log("done");
  }
};
//Checks whether we have gotten a refreshToken
function checkIfRefreshTokenExist() {
  return localStorage.getItem("refresh_token") ? true : false;
}

function checkIfBearerTokenIsValid() {
  const currentDate = Date.now();
  return currentDate < localStorage.getItem("expiry_date");
}

function bearerTokenTimeLeft() {
  const currentTime = Date.now();
  return localStorage.getItem("expiry_date") - currentTime;
}

function OAuthRedirectHandler() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code"); // Extract 'code' from the URL

    if (code) {
      // Send the code from the URL to the backend
      fetch(`https://room-display-backend.vercel.app/oauth2callback?code=${code}`, {// `http://localhost:3000/oauth2callback?code=${code}`
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("bearer_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          localStorage.setItem("expiry_date", data.expiry_date);
          window.location.href = "https://room-display-react.vercel.app/"; //TODO: Change to the correct URLhttp://localhost:5173/
        })
        .catch((error) => console.error("Error sending code:", error));
    } else {
      console.error("Authorization code not found in URL");
    }
  }, []); //
}




export default App;

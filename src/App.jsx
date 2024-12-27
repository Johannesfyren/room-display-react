import { useState, useEffect } from "react";
import "./index.css";
import Button from "./components/Button.jsx";
import Countdown from "./components/Countdown.jsx";
const activeMeeting = true;
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
import { getEvents } from "../gapi.js";



const acquireTokensOnLogin = async () => {
  try {
    const data = await fetch("http://localhost:3000/auth-url");
    const response = await data.json();
    console.log(response);
    window.location.href = response.url;
  } catch (err) {
    console.error("there was and error", err);
  } finally {
    console.log("done");
  }
};
const clickHandler2 = async () => {
  getEvents();
};

function App() {
  const [tokensAquired, setTokensAquired] = useState(false);
  const [events, setEvents] = useState([]);
  const [triggerTimeout, setTriggerTimeout] = useState(false); // timeout used to start
  const time = new Date();
  const [activeEvent, setActiveEvent] = useState(false);

  // Loding the app, we check for tokens and updates bearer if needed
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
    console.log(`refresing in ${tokenTimeLeft / 1000 / 60}`);

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
    async function compareEvents() {
      let newestEvents;
      try {
        newestEvents = await getEvents(); //get newest events
        //set events to newest events if there is no 401 error
        if (getEvents() === 401) {
          console.log("401 error");
          refreshBearerToken();
        } else {
          setEvents(newestEvents);
        } 

        //If there are changes in events since last polling, we update the state
        if (JSON.stringify(newestEvents) !== JSON.stringify(events)) {
          setEvents(newestEvents);
          console.log("eventsChanged");
        }
      } catch (err) {
        console.log(err);
      }
    }
    function checkIfActiveMeeting(startTime, endTime){
      const today = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);
      console.log('checking if active meeting');
      if (start <= today && end >= today){
        console.log('active meeting');
          return true;
      }
  }

    let intervalID;
    intervalID = setInterval(() => {
      compareEvents();

      if(events.items.length != 0) {
        checkIfActiveMeeting(events.items[0].start.dateTime, events.items[0].end.dateTime) ? setActiveEvent(true) : setActiveEvent(false);
      }
    }, 60000);

    return () => clearInterval(intervalID);
  }, [events]);

  const clickHandler3 = async () => {
    setTriggerTimeout(true);
    console.log('event is active?', activeEvent)
  };

  async function refreshBearerToken() {
    try {
      const data = await fetch("http://localhost:3000/refreshAccessToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refresh_token: localStorage.getItem("refresh_token"),
        }),
      });
      console.log("I REFRESHED!!!!");
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
      {tokensAquired ? (
        console.log(activeEvent)

      ) : (
        <Button
          text={"Connect Google Calendar"}
          clickHandler={acquireTokensOnLogin}
        />
      )}

      <div className="main-container">
        {code &&
          !localStorage.getItem("refresh_token") &&
          OAuthRedirectHandler()}{" "}
        {/* CAUTIOS: If we have an invalid refresh_token i localStorage, the app will never get a new refresh_token. If we got a refresh_token, no need to get another */}
        <div className="nav-container">
          <h1>{(time.getHours() < 10 ? '+' + time.getHours() : time.getHours()) + ':' + (time.getMinutes()< 10 ? '0' + time.getMinutes() : time.getMinutes())}</h1>

          <Button text={"fecth stuff"} clickHandler={clickHandler2} />
          <Button text={"test refetcher"} clickHandler={clickHandler3} />
        </div>
        {activeMeeting ? (
          <div className="meeting-info-container">
            <div>
              <h1>Title placeholder</h1>
              <h2>Time placeholder</h2>
              <h2>Coordinator placeholder</h2>
            </div>

            <Countdown />
          </div>
        ) : (
          <h1>Ingen begivenheder</h1>
        )}
      </div>
    </>
  );
}

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
      fetch(`http://localhost:3000/oauth2callback?code=${code}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("bearer_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          localStorage.setItem("expiry_date", data.expiry_date);
          window.location.href = "http://localhost:5173/"; //TODO: Change to the correct URL
        })
        .catch((error) => console.error("Error sending code:", error));
    } else {
      console.error("Authorization code not found in URL");
    }
  }, []); //
}

export default App;

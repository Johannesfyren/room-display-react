import { useState, useEffect } from "react";
import "./index.css";
import Button from "./components/Button.jsx";
import Countdown from "./components/Countdown.jsx";
import Time from "./components/Time.jsx";
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
    async function fetchEvents() {
      const newestEvents = await getEvents(); //get newest events
      if (newestEvents == "401") {
        console.log("401 error");
        refreshBearerToken();
      }
      //setEvents(newestEvents);
      return newestEvents;
    }
    function checkIfActiveMeeting(startTime, endTime) {
      const today = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);
      console.log("checking if active meeting");
      if (start <= today && end >= today) {
        console.log("active meeting");
        return true;
      }
    }

    let intervalID;
    intervalID = setInterval(async () => {
      //compareEvents();

      const newestEvents = await fetchEvents(); //get newest events
      setEvents(newestEvents);

      //Check if there are events, an if so, check if the first event is active. Else, set activeEvent to false
      if (newestEvents.length != 0) {
        checkIfActiveMeeting(
          newestEvents.items[0].start.dateTime,
          newestEvents.items[0].end.dateTime
        )
          ? setActiveEvent(true)
          : setActiveEvent(false);
      } else {
        setActiveEvent(false);
      }
    }, 6000);

    return () => clearInterval(intervalID);
  }, [events]);

  

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
        <div className="main-container">
          {code &&
            !localStorage.getItem("refresh_token") &&
            OAuthRedirectHandler()}
          
          <div className="nav-container">
            <h1>
              {(time.getHours() < 10
                ? "+" + time.getHours()
                : time.getHours()) +
                ":" +
                (time.getMinutes() < 10
                  ? "0" + time.getMinutes()
                  : time.getMinutes())}
            </h1>

          
          </div>
          {activeEvent ? (
            <div className="meeting-info-container">
              <div>
                <h1>{events.items[0].summary}</h1>

                <Time
                  time={[
                    new Date(events.items[0].start.dateTime),
                    new Date(events.items[0].end.dateTime),
                  ]}
                ></Time>
                <h2>Coordinator placeholder</h2>
              </div>

              {<Countdown events={events} />}
            </div>
          ) : (
            <h1>Ingen begivenheder</h1>
          )}
        </div>
      ) : (
        <Button
          text={"Connect Google Calendar"}
          clickHandler={acquireTokensOnLogin}
        />
      )}
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

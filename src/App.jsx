import { useState, useEffect } from "react";
import "./index.css";
import Button from "./components/Button.jsx";
import Countdown from "./components/Countdown.jsx";
const activeMeeting = true;
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
import { getEvents } from "../gapi.js";

const clickHandler = async () => {
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
  const [eventsHasChanged, setEventsHasChanged] = useState(false);

  // Loding the app, we check for tokens and updates bearer if needed
  useEffect(() => {
    setTokensAquired(checkIfRefreshTokenExist()); // Checks for a refresh token, if it exists, we change the apps interface to not need to log in.

    if (checkIfRefreshTokenExist()) {
      //If the bearer_token is not available anymore, we will refresh it
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

  useEffect(() => {
    
    async function compareEvents(){
      const newestEvents = await getEvents(); //get newest events
      setEvents(await getEvents()); //Not sure this is the best way, TODO: Fetch somewhere else
      if (JSON.stringify(newestEvents) !== JSON.stringify(events)){
        setEvents(newestEvents);
        console.log('eventsChanged')
      } 
    }

    let intervalID;
    intervalID = setInterval(() => {
      compareEvents();
      console.log('checking events')
    }, 5000);

    return () => clearInterval(intervalID);
  },[events])

  const clickHandler3 = async () => {
    setTriggerTimeout(true);
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
        console.log("aquired")
      ) : (
        <Button text={"Log in"} clickHandler={clickHandler} />
      )}

      <div className="main-container">
        {code &&
          !localStorage.getItem("refresh_token") &&
          OAuthRedirectHandler()}{" "}
        {/* CAUTIOS: If we have an invalid refresh_token i localStorage, the app will never get a new refresh_token. If we got a refresh_token, no need to get another */}
        <div className="nav-container">
          <h1>10:30</h1>

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
  console.log(currentDate < localStorage.getItem("expiry_date"));
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
      console.log("Authorization code:", code);

      // Send the code to the backend
      fetch(`http://localhost:3000/oauth2callback?code=${code}`, {
        method: "GET",

        // headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Tokens received from backend:", data);
          localStorage.setItem("bearer_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          localStorage.setItem("expiry_date", data.expiry_date);
          console.log(localStorage);
          window.location.href = "http://localhost:5173/";
          // Optionally redirect to another page or save tokens
        })
        .catch((error) => console.error("Error sending code:", error));
    } else {
      console.error("Authorization code not found in URL");
    }
  }, []); //
}


export default App;
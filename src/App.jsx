import { useState } from "react";
import "./index.css";
import Button from "./components/Button.jsx";
import Countdown from "./components/Countdown.jsx";
const activeMeeting = true;

const clickHandler = async() =>{
  fetch('http://localhost:3000/auth-url', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },

})
  .then((res) => res.json())
  .then((data) => {
    console.log('Authorization success:', data);
    window.location.href = data.url;
  })
  .catch((err) => {
    console.error('Error:', err);
  });
}



function App() {
  return (
    <div className="main-container">
      <div className="nav-container">
        <h1>10:30</h1>
        <Button text={"Reservér"} clickHandler={clickHandler} />
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
  );
}

export default App;

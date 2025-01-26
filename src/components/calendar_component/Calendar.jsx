import { useState, useEffect } from "react";
import MeetingCard from "./MeetingCard";
import CalendarController from "./CalendarController";
import styles from './calendar.module.css'

export default function Calendar({events, expanded=false}) {
  const [renderMovableEvent, setRenderMovableEvent] = useState(false)
  const currentDate = new Date();
  let currentDatePlusOneHour = new Date();
  currentDatePlusOneHour.setHours(currentDate.getHours()+1)

  const [editableEvent, setEditableEvent] = useState(
    { "start": {
          "dateTime": `${currentDate.toISOString()}`,
          "timeZone": "Europe/Copenhagen"
    },
      "end": {
          "dateTime": `${currentDatePlusOneHour.toISOString()}`,
          "timeZone": "Europe/Copenhagen"
    }
  }
)

useEffect(()=>{//Scroll to relevant posotion on the calendar when mounting
  const currentTime = new Date();
  if (currentTime.getHours()<= 9){
    window.scrollTo({top:800,left:0,behavior:'smooth'})
  }else if (currentTime.getHours() > 9 && currentTime.getHours() < 12){
    window.scrollTo({top:1000,left:0,behavior:'smooth'})
  }else if (currentTime.getHours() >= 12 && currentTime.getHours()< 14){
    window.scrollTo({top:1200,left:0,behavior:'smooth'})
  } else if (currentTime.getHours() >= 14){
    window.scrollTo({top:1500,left:0,behavior:'smooth'})
  }
  
},[])
  
    

    

  return (
    <>
    <p style={{marginLeft:"100%"}}>X</p>
        <div className={styles["expanded-calendar-wrapper"]}>
            <CalendarController editableEvent={editableEvent} setEditableEvent={setEditableEvent} setRenderMovableEvent={setRenderMovableEvent}/>
            <div className={styles["calendar-background"]}>
            {fillGrid()}
                <div className={styles["calendar-container"]}>
                  {console.log(events)}
                    {events.items.map((event) => {
                        return <MeetingCard key={event.id} event={event} canEdit={false} editableEvent = {editableEvent} setEditableEvent={setEditableEvent} renderMovableEvent={renderMovableEvent} setRenderMovableEvent={setRenderMovableEvent}/>
                    })
                }
               { <MeetingCard key={events.items[0].id} event={editableEvent} editableEvent = {editableEvent} setEditableEvent={setEditableEvent} canEdit={true} renderMovableEvent={renderMovableEvent} setRenderMovableEvent={setRenderMovableEvent}/>} 
                </div>
            </div>
        </div>

    </>
  );
}






function fillGrid() {
  let gridIntervals = [];
  for (let i = 0; i < 40; i++) {
    gridIntervals.push(<div key={i} className={styles["grid"]}>{i % 4 == 0 ?<h3 className={styles['time']}>0{i/4}:00</h3> :""}</div>);
  }
  for (let i = 40; i < 96; i++) {
    gridIntervals.push(<div key={i} className={styles["grid"]}>{i % 4 == 0 ?<h3 className={styles['time']}>{i/4}:00</h3> :""}</div>);
  }
  return gridIntervals;
}

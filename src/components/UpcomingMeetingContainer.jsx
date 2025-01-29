import styles from "./upcomingMeeting.module.css";

import MeetingCard from "./MeetingCard";


export default function UpcomingMeetingContainer({events}){

    return (
        <>
        <h1 style={{margin:'auto 0 10px 10px', color:"white"}}>Kommende møder</h1>
        <div className={events.items.length < 1 ? styles["container-transparent"] : styles["container"] }>
            
            {events.items.map((event, index) => {
               return (<MeetingCard key = {index} title ={event.summary} time={[new Date(event.start.dateTime), new Date(event.end.dateTime)]} />)
                
            })}
        </div>
      </>  
    )
}
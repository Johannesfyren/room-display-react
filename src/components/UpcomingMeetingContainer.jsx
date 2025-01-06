import styles from "./upcomingMeeting.module.css";

import MeetingCard from "./MeetingCard";


export default function UpcomingMeetingContainer({events}){

    return (
        
        <div className={events.items.length < 2 ? styles["container-transparent"] : styles["container"] }>
            {events.items.slice(1).map((event, index) => {
               return (<MeetingCard key = {index} title ={event.summary} time={[new Date(event.start.dateTime), new Date(event.end.dateTime)]} />)
                
            })}
        </div>
        
    )
}
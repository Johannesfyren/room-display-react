import styles from "./upcomingMeeting.module.css";

import MeetingCard from "./MeetingCard";


export default function UpcomingMeetingContainer({events}){

    return (
        
        <div className={events.items.length < 2 ? styles["container-transparent"] : styles["container"] }>
            {console.log(events.items.length < 1 )}
            {events.items.slice(1).map((event, index) => {
            {console.log('event:', event)}
               return (<MeetingCard key = {index} title ={event.summary} time={[new Date(event.start.dateTime), new Date(event.end.dateTime)]} />)
                
            })}
        </div>
        
    )
}


// {'event', console.log(event.summary)}
//                 <h1>{event.summary}</h1>
//                 {<Time time={[
//                     new Date(event.start.dateTime),
//                     new Date(event.end.dateTime),
//                   ]} />}
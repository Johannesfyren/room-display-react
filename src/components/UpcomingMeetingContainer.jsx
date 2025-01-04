import styles from "./upcomingMeeting.module.css";
import Time from "./Time";

export default function UpcomingMeetingContainer({events}){

    return (
        
        <div className={styles["container"]}>
            {/* {console.log('should be rendering upoming meetings :', events)} */}
            {events.items.slice(1).map((event) => {
                {'event', console.log(event)}
                <h1>{event.summary}</h1>
                {<Time time={[
                    new Date(event.start.dateTime),
                    new Date(event.end.dateTime),
                  ]} />}
            })}
        </div>
        
    )
}

import Time from "./Time"
import styles from './pendingMeeting.module.css'
export default function PendingMeeting({event}){
    return (
        <div className={styles["pending-meeting-details"]}>
            <h1>{event.summary}</h1>
                <h2>
                  <Time
                    time={[
                      new Date(event.start.dateTime),
                      new Date(event.end.dateTime),
                    ]}
                  ></Time>
                </h2>
                <h2>{event.creator.email.replace('@gmail.com','')}</h2>
            {console.log(event)}
        </div>
    )
}
import styles from "./upcomingMeeting.module.css";
import Time from "./Time";
export default function MeetingCard({title, time}){

    return (
        <div className={styles["card-container"]}>
            <h1>{title}</h1>
            {<Time time={[
                    new Date(time[0]),
                    new Date(time[1]),
                  ]} />}
        </div>
    )
}
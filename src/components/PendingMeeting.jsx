import Time from "./Time.jsx";
import styles from "./pendingMeeting.module.css";
import getMinutesToMeetingStart from "../../utilities.js";
import MeetingCard from "./MeetingCard.jsx";


export default function PendingMeeting({ events }) {
  const currentTime = new Date();
  return getMinutesToMeetingStart(events.items[0]) > 10 ? (
    <div className={styles["content-before-upcoming-state"]}>
      <h1>{events.items[0].summary}</h1>
      {console.log(events)}
      <h2>

        <Time
          time={[
            new Date(events.items[0].start.dateTime),
            new Date(events.items[0].end.dateTime),
          ]}
        ></Time>
      </h2>
      <h2>{events.items[0].creator.email.replace("@gmail.com", "")}</h2>
    </div>
  ) : (
    <div className={styles["pending-meeting-container"]}>
      <div className={styles["top-bar"]}>
        <h1>
          Starter om{" "}
          <span className={styles["bold"]}>
            {" "}
            {` ${getMinutesToMeetingStart(events.items[0])}`} min.
          </span>
        </h1>
        <h2>
          <Time time={[currentTime]}></Time>
        </h2>
      </div>
      <div className={styles["main-content-wrapper"]}>
        <div className={styles["main-content"]}>
          <h1>{events.items[0].summary}</h1>
          <h2>
            <Time
              time={[
                new Date(events.items[0].start.dateTime),
                new Date(events.items[0].end.dateTime),
              ]}
            ></Time>
          </h2>
          <h2>{events.items[0].creator.email.replace("@gmail.com", "")}</h2>
        </div>
        <aside>
          {events?.items?.length > 1 && (
            <>
              <h2>Næste møde</h2>

              <MeetingCard
                time={[
                  new Date(events.items[1].start.dateTime),
                  new Date(events.items[1].end.dateTime),
                ]}
                title={events.items[1].summary}
              />
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

// <div className={styles["pending-meeting-details"]}>
/* <h1>{event.summary}</h1>
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
</div> */

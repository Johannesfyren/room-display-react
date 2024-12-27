import styles from "./Countdown.module.css";

export default function Countdown({events}) {
    const date = Date.now();
    const dateInMs = new Date(events.items[0].end.dateTime).getTime()

//events
  return (
    <div className={styles["countdown-container"]}>
        
      <div className={styles.number}>{Math.trunc((dateInMs-date)/1000/60)} min</div>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" >
        <circle
          className={styles["outer-circle"]}
          strokeLinecap="round"
          cx="50%"
          cy="50%"
          r="180"
        />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <circle
          className={styles["inner-circle"]}
          style={{strokeDashoffset: `${calculateCircleCircumference(new Date(events.items[0].start.dateTime),new Date(events.items[0].end.dateTime))}`}}//calculateCircleCircumference(new Date(events.items[0].start.dateTime),new Date(events.items[0].end.dateTime)) + "%"}}
          strokeLinecap="round"
          cx="50%"
          cy="50%"
          r="180"
        />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <circle
          className={styles["indicator-anim"]}
          strokeLinecap="round"
          cx="50%"
          cy="50%"
          r="205"
        />
      </svg>
    </div>
  );
}

function calculateCircleCircumference(startTime,endTime){
  const today = new Date().getTime();
  const startTimeInMillis = startTime.getTime();
  const endTimeInMillis = endTime.getTime();

  const totalMeetingTime = endTimeInMillis - startTimeInMillis;
  const elabsedMeetingTime = today - startTimeInMillis;
  const percentMeetingElabsed = elabsedMeetingTime/totalMeetingTime*100;
  return (percentMeetingElabsed * 11.3); //11.3 is 1% of the circumference value used to draw the circle. Total circ is = 2*PI*radius
}

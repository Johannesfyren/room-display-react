import styles from "./Countdown.module.css";

export default function Countdown() {
  return (
    <div className={styles["countdown-container"]}>
        
      <div className={styles.number}>122 min</div>
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

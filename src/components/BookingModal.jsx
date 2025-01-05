import Button from "./Button";
import styles from "./modal.module.css";
import { createEvent } from "../../gapi";

export default function BookingModal({
  setTriggerRender,
  setShowModal,
  events,
  setIsLoading,
}) {
  const handleClickEvent = async (extendedTime) => {
    setIsLoading(true); //this is for button loading spinner
    setShowModal(false);
    await createEvent(extendedTime);
    setTriggerRender(true);
  };

  return (
    <div className={styles["model-backdrop"]}>
      <div className={styles["container"]}>
        <div className={styles["modal"]}>
          <h1>Reservér Møde</h1>
          <div className={styles["btn-group"]}>
            <Button
              text={"10 min"}
              clickHandler={() => handleClickEvent(10)}
              btnType={
                checkTimeToNextEvent(events) < 10 ? "disabled" : "secondary"
              }
            />
            <Button
              text={"15 min"}
              clickHandler={() => handleClickEvent(15)}
              btnType={
                checkTimeToNextEvent(events) < 15 ? "disabled" : "secondary"
              }
            />
            <Button
              text={"30 min"}
              clickHandler={() => handleClickEvent(30)}
              btnType={
                checkTimeToNextEvent(events) < 30 ? "disabled" : "secondary"
              }
            />
            <Button
              text={"60 min"}
              clickHandler={() => handleClickEvent(60)}
              btnType={
                checkTimeToNextEvent(events) < 60 ? "disabled" : "secondary"
              }
            />
          </div>
          <p
            className={styles["close-icon"]}
            onClick={() => setShowModal(false)}
          >
            ✕
          </p>
        </div>
      </div>
    </div>
  );
}

function checkTimeToNextEvent(events) {
  if (events.length == 0) {
    return 60;
  } else {
    const nextEvent = new Date(events.items[0].start.dateTime);
    const currentTime = Date.now();
    return (nextEvent.getTime() - currentTime) / 1000 / 60;
  }
}

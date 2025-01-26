import TimePicker from "./timePicker"
import styles from './calendar.module.css'

export default function CalendarController({editableEvent, setEditableEvent, setRenderMovableEvent}){
    

    function bookMeeting(formData){
        console.log("hello")
        alert(`You searched for '${formData.get("Fra")}'`);
    }

    return(
        <div className={styles["calendar-controller"]}>
            <form action={bookMeeting}>
                <TimePicker editableEvent={editableEvent} setEditableEvent={setEditableEvent} setRenderMovableEvent={setRenderMovableEvent}/>
                <button type="submit">Reserver</button>
            </form>
        </div>
    )
}
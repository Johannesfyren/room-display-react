import TimePicker from "./timePicker"
import styles from './calendar.module.css'
import {createEventSpecificStartEnd} from "../../../gapi.js"
import Button from "../Button.jsx";

export default function CalendarController({editableEvent, setEditableEvent, setRenderMovableEvent}){
    

    async function bookMeeting(){
        const start = new Date(editableEvent.start.dateTime);
        const end = new Date(editableEvent.end.dateTime);
        await createEventSpecificStartEnd(start, end);
        window.location.href ="https://room-display-react.vercel.app/"
    }

    return(
        <div className={styles["calendar-controller"]}>
            <form action={bookMeeting}>
                <TimePicker editableEvent={editableEvent} setEditableEvent={setEditableEvent} setRenderMovableEvent={setRenderMovableEvent}/>
                <Button text={'Reservér'} btnType={'primary'} clickHandler={()=>console.log("lol")} />
                {/* <button type="submit">Reserver</button> */}
            </form>
        </div>
    )
}
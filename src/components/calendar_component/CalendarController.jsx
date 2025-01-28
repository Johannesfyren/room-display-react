import TimePicker from "./timePicker"
import styles from './calendar.module.css'

import Button from "../Button.jsx";

export default function CalendarController({editableEvent, setEditableEvent, setRenderMovableEvent}){
    

    function bookMeeting(formData){
        
        window.location.href ="http://localhost:5173/"
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
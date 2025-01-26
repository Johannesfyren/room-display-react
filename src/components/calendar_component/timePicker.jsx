import styles from './calendar.module.css'
export default function TimePicker({editableEvent, setEditableEvent, setRenderMovableEvent}){

    const currentDate = new Date();

    const startTime = (e) =>{
        setEditableEvent({
            ...editableEvent, 
            start: {
                ...editableEvent.start, 
                dateTime:`2025-01-11T${e.target.value}:52+01:00`
              }}
          )
        setRenderMovableEvent(true) //Used to render new posiiton in the calendar
    }
          
    const endTime = (e) =>{
        console.log(e.target.value)
        setEditableEvent({
            ...editableEvent, 
            end: {
                ...editableEvent.end, 
                dateTime:`2025-01-11T${e.target.value}:52+01:00`
                }}
            )
        setRenderMovableEvent(true) //Used to render new posiiton in the calendar
    }

    return(
        <div className={styles["time-picker"]}>
            <div>
                <h1>Fra</h1>
                <input type="time" name="Fra" onChange={startTime} value={editableEvent ? formatTime(new Date(editableEvent.start.dateTime).getHours()) + ':' + formatTime(new Date(editableEvent.start.dateTime).getMinutes()) : formatTime(currentDate.getHours()) + ':' + formatTime(currentDate.getMinutes())}/>
            </div>
            <div>
                <h1>Til</h1>
                <input type="time" name="Til" onChange ={endTime} value={editableEvent ? formatTime(new Date(editableEvent.end.dateTime).getHours()) + ':' + formatTime(new Date(editableEvent.end.dateTime).getMinutes()) : formatTime(currentDate.getHours()) + ':' + formatTime(currentDate.getMinutes())}/>
            </div>
        </div>
    )
}


function formatTime(time){
    return time < 10 ? '0' + time : time;
}
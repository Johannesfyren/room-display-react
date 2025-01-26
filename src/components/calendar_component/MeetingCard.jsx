
import { useEffect, useState} from "react";
import styles from './calendar.module.css'
export default function MeetingCard({ event , canEdit=false, setEditableEvent, editableEvent, renderMovableEvent, setRenderMovableEvent}) {
    const [startPos, setStartPos] = useState(calculatePosGridValue(event.start.dateTime))
    const [endPos, setEndPos] = useState(calculatePosGridValue(event.end.dateTime))
    let initialStartPos = calculatePosGridValue(event.start.dateTime);
    let initialEndPos = calculatePosGridValue(event.end.dateTime);
    const [position, setPosition] = useState({gridRow: initialStartPos +'/'+ initialEndPos})
    const [movingPosition, setMovingPosition] = useState({gridRow: initialStartPos +'/'+ initialEndPos})
    
    // const initialPosition = calculatePlacement(event.start.dateTime, event.end.dateTime);
    const [touchGridStart, setTouchGridStart] = useState(startPos);
    const [traveledValue, setTraveledValue] = useState(0);
    const [cardTouched, setCardTouched] = useState(false) //Used to change styling of the card while it is interated with
    const [touchY, setTouchY] = useState();
    const [targetHeight, setTargetHeight] = useState(0)
    const [touchDistanceFromTopOfCard, setTouchDistanceFromTopOfCard] = useState(0)
    const [cardMoved, setCardMoved] = useState(false);
    const [initialScrollPosition, setInitialScrollPosition] = useState(window.scrollY);
    const [scrollLength, setScrollLength] = useState(window.scrollY);
    
    
    
   
useEffect(()=>{
  setStartPos( calculatePosGridValue(event.start.dateTime))
  setEndPos(calculatePosGridValue(event.end.dateTime))
  
  setRenderMovableEvent(false)// just used to detect if changes to the timepicker has happened
},[renderMovableEvent, setRenderMovableEvent])
   


    const touchStart = (e) => {
      
        if (canEdit){
          setTouchGridStart((Math.floor(e.changedTouches[0].clientY/ 2 / 15) * 15) / 15)
          setCardTouched(true)
          setInitialScrollPosition((Math.floor(window.scrollY/ 2 / 15) * 15) / 15) 
          setTargetHeight(e.target.clientHeight)

          //Calculate distance from top of card, to make sure that the dragged card represents the invisible card on the grid
          const touch = e.touches[0]; // Get the first touch point
          const divTop = e.target.getBoundingClientRect().top; // Get the top of the div
          const positionFromTop = touch.clientY - divTop;
          setTouchDistanceFromTopOfCard(positionFromTop)
        }
    };
    const touchMove = (e) =>{
      if (canEdit){
        let current = (Math.floor(e.changedTouches[0].clientY/ 2 / 15) * 15) / 15
        setCardMoved(true) //We are detecting the card has in fact moved, and therefore its relevant to update its position on touchEnd
        
        setTraveledValue(current-touchGridStart)
        setScrollLength((Math.floor(window.scrollY/ 2 / 15) * 15) / 15) 

        setTouchY(e.touches[0].pageY) //position on the grid


        if (e.changedTouches[0].clientY < window.screen.height * 0.1){
            window.scrollBy(0, -10) 
        }
        if (e.changedTouches[0].clientY > window.screen.height * 0.8){
            window.scrollBy(0, 10) 
        }
      }
    }

    const touchEnd = () =>{
      if (canEdit){
        if (cardMoved){
            setStartPos(startPos + traveledValue + (scrollLength-initialScrollPosition))
            setEndPos(endPos + traveledValue + (scrollLength-initialScrollPosition))

        }
        setCardMoved(false)
        setCardTouched(false)
        setInitialScrollPosition(scrollLength) //now the new starting point
      }
    }

    useEffect(()=>{
        const currentDate = new Date();
        setPosition({gridRow: `${startPos}` + "/" + `${endPos}`});
        setMovingPosition({ transform: `translateY(${touchY-touchDistanceFromTopOfCard}px)`, height: targetHeight , width:'100%'});
        setEditableEvent ({ "start": {
            "dateTime": `${currentDate.getFullYear()}-${formatMonthOrDay(currentDate.getMonth()+1)}-${formatMonthOrDay(currentDate.getDate())}T${convertGridToTime(startPos)}+01:00`,
            "timeZone": "Europe/Copenhagen"
          },
            "end": {
                "dateTime": `${currentDate.getFullYear()}-${formatMonthOrDay(currentDate.getMonth()+1)}-${formatMonthOrDay(currentDate.getDate())}T${convertGridToTime(endPos)}+01:00`,
                "timeZone": "Europe/Copenhagen"
            }
          })
    },[startPos, endPos, touchY, targetHeight, touchDistanceFromTopOfCard, setEditableEvent, setPosition])





  return (
    <>
      <div
        className={canEdit ?  styles["meeting-card-editable"]:styles["meeting-card"]}
        style={cardMoved ? {position:'absolute',backgroundColor:'transparent', height:(targetHeight)+'px'} : position} //PROBLEM: Kender ikke højden når pos ikke renderes
        onTouchStart={touchStart}
        onTouchMove={touchMove}
        onTouchEnd={touchEnd}
      >
        {canEdit ? <h1>Dit møde</h1> : <h1>{event.summary}</h1>}

      </div>
      
      {cardTouched && (
          <div
        className={styles["meeting-card-moving"]}
        style={movingPosition}
        onTouchStart={touchStart}
        onTouchMove={touchMove}
        onTouchEnd={touchEnd}
      >
        <h1>Dit møde</h1>

      </div>
      )}
    </>

  );
}




function calculatePosGridValue(dateTime){
    const tmp_time = new Date(dateTime);
    const tmp_hours_to_grid_value = tmp_time.getHours() * 4; //we got 96 grid elements, 24 hours * 4 = 96. There the actualt hour put in here represenet the hour value in the grid
  const tmp_minutes_to_grid_value =
    (Math.floor(tmp_time.getMinutes() / 15) * 15) / 15; // Each hour in the grid is divided into 4 parts, so we need to round the minutes to the nearest 15 minutes
    
    const final_gridValue =
    tmp_hours_to_grid_value + tmp_minutes_to_grid_value;
    
    return(Number(final_gridValue + 2))
}

function convertGridToTime(gridValue){
  let tmp_grid_to_minutes;
  const tmp_grid_to_plain_hour = ((gridValue - 2)/4);



  switch (tmp_grid_to_plain_hour%1){
    case (0.25):
      tmp_grid_to_minutes = "15"
      break;
    case(0.5):
      tmp_grid_to_minutes = "30"
      break;
    case(0.75):
      tmp_grid_to_minutes = "45"
      break;
    default:
      tmp_grid_to_minutes = "00"
  } 

 return (`${formatMonthOrDay(tmp_grid_to_plain_hour-(tmp_grid_to_plain_hour % 1))}:${tmp_grid_to_minutes}`) //TODO: Sæt formater tiden så der kommer nul foran

  
}





function calculatePlacement(startTime, endTime) {
  const tmp_startTime = new Date(startTime);
  const tmp_endTime = new Date(endTime);
  const tmp_startTime_hours_grid_value = tmp_startTime.getHours() * 4; //we got 96 grid elements, 24 hours * 4 = 96. There the actualt hour put in here represenet the hour value in the grid
  const tmp_startTime_minutes_grid_value =
    (Math.floor(tmp_startTime.getMinutes() / 15) * 15) / 15; // Each hour in the grid is divided into 4 parts, so we need to round the minutes to the nearest 15 minutes
  const tmp_endTime_hours_grid_value = tmp_endTime.getHours() * 4;
  const tmp_endTime_minutes_grid_value =
    (Math.floor(tmp_endTime.getMinutes() / 15) * 15) / 15;

  const final_startTime =
    tmp_startTime_hours_grid_value + tmp_startTime_minutes_grid_value;
  const final_endTime =
    tmp_endTime_hours_grid_value + tmp_endTime_minutes_grid_value;

  return {
    gridRow: Number(final_startTime + 2) + "/" + Number(final_endTime + 2),
  };
}

function formatMonthOrDay(month){
  return month < 10 ? '0' + month : month;
}

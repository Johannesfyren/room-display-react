export default function Time({time}){
    return (
        <>
            {time.length > 1 ? (
                `${getWeekDayName(time[0])}, ${time[0].getHours() < 10 ? '0' + time[0].getHours() : time[0].getHours()}:${time[0].getMinutes() < 10 ? '0' + time[0].getMinutes() : time[0].getMinutes()}-${time[1].getHours() < 10 ? '0' + time[1].getHours() : time[1].getHours()}:${time[1].getMinutes() < 10 ? '0' + time[1].getMinutes() : time[1].getMinutes()}`
            )
            
        :
        (
            `${time[0].getHours() < 10 ? '0' + time[0].getHours() : time[0].getHours()}:${time[0].getMinutes() < 10 ? '0' + time[0].getMinutes() : time[0].getMinutes()}`

        )
        }
        </>
    )
}
//Calculates which day of the week it is. Wiil display "I dag / I morgen", if the meeting is within that timeframe
function getWeekDayName(meetingDate){
    const today = new Date();
    const ugedage = ["Søndag","Mandag","Tirsdag","Onsdag","Torsdag","Fredag","Lørdag"];

    if (today.getUTCDay() == meetingDate.getUTCDay()){ //Samme ugedag
        return "I dag";
    }
    
    if (today.getUTCDay() !== meetingDate.getUTCDay()){//Forskellige ugedage
        
        if(today.getUTCDay() == 6){//Hvis det er lørdag, tjekker vi lige manuelt om næste dag er søndag (0), og angiver derved "I morgen"
            if (meetingDate == 0){
                return "I morgen";
            } else { return ugedage[meetingDate.getUTCDay()]}; //Retuner dato, hvis det er længere tid til mødet end dagen efter

        } else if (meetingDate.getUTCDay()-today.getUTCDay() == 1){ //Hvis mødet er i morgen
            return "I morgen";
        } else { return ugedage[meetingDate.getUTCDay()]}; //Retuner dato, hvis det er længere tid til mødet end dagen efter
    }
}
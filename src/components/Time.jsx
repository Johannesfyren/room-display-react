export default function Time({time}){
    return (
        <>
            {time.length > 1 ? (
                `${time[0].getHours() < 10 ? '0' + time[0].getHours() : time[0].getHours()}:${time[0].getMinutes() < 10 ? '0' + time[0].getMinutes() : time[0].getMinutes()}-${time[1].getHours() < 10 ? '0' + time[1].getHours() : time[1].getHours()}:${time[1].getMinutes() < 10 ? '0' + time[1].getMinutes() : time[1].getMinutes()}`
            )
            
        :
        (
            `${time[0].getHours() < 10 ? '0' + time[0].getHours() : time[0].getHours()}:${time[0].getMinutes() < 10 ? '0' + time[0].getMinutes() : time[0].getMinutes()}`

        )
        }
        </>
    )
}

//
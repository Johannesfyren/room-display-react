export default function getMinutesToMeetingStart(event){
    const now = new Date()
    const meetingStart = new Date(event.start.dateTime)
    return Math.floor((meetingStart - now) / 60000)
}


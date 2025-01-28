async function getEvents() {
    const ACCESS_TOKEN = localStorage.getItem("bearer_token");
    const CALENDAR_ID = "primary"; // Or a specific calendar ID
    const now = new Date().toISOString(); // Current date and time in ISO format
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?singleEvents=true&orderBy=startTime&timeMin=${now}&maxResults=6`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          }, 
        }
      );
  
      if (!response.ok) {
        console.log(`HTTP error! status: ${response.status}`);
        return response.status;
        //throw new Error(`HTTP error! status: ${response.status}`);

      }
      
      const events = await response.json();
      events.items.filter((event) => event.eventType =! "birthday" );
      
      console.log(events)
      if (events.items.length == 0) {
        return []; 
      }else{
        return events;
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }
  
  async function createEvent(extendedTime) {
    const ACCESS_TOKEN = localStorage.getItem("bearer_token");
    const CALENDAR_ID = "primary"; // Or a specific calendar ID
    const now = new Date(); // Current date and time
    const toMinutes = new Date();
    toMinutes.setMinutes(now.getMinutes()+extendedTime)
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            "summary": "Ad-hoc meeting",
            "description": "This meeting was booked from the display",
            "start": {
              "dateTime": now.toISOString(),
              "timeZone": "Europe/Copenhagen"
            },
            "end": {
              "dateTime": toMinutes.toISOString(),
              "timeZone": "Europe/Copenhagen"
            },
            
        })
        
      });
  
      if (!response.ok) {
        console.log(`HTTP error! status: ${response.status}`);
        return response.status;
        //throw new Error(`HTTP error! status: ${response.status}`);
      }else {
        console.log("Event created");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }
 

  async function endMeeting(eventID) {
    const ACCESS_TOKEN = localStorage.getItem("bearer_token");
    const CALENDAR_ID = "primary"; // Or a specific calendar ID
    const today = new Date();
    
    
      try {
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events/${eventID}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              end: {
                dateTime: today.toISOString(),
                timeZone: "Europe/Copenhagen",
              },
            }),
          }
        );
    
        const result = await response.json();
        if (!response.ok) {
          console.error("Error updating event:", result.error);
          return;
        }
        console.log("Event updated successfully:", result);
        return response.status;
      } catch (error) {
        console.error("Error:", error);
      }
    }

    
    // try {
    //   const response = await fetch(
    //     `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events/${eventID}`,
    //     {
    //       method: "PATCH",
    //       headers: {
    //         Authorization: `Bearer ${ACCESS_TOKEN}`,

    //       }, 
    //       body: JSON.stringify({
    //         'start': {
    //           'dateTime': today.toISOString(),
    //           'timeZone': 'Europe/Copenhagen'
    //         },
    //         'end': {
    //           'dateTime': today.toISOString(),
    //           'timeZone': 'Europe/Copenhagen'
    //         },
    //       })
    //     }
    //   );
  
    //   if (!response.ok) {
    //     console.log(`HTTP error! status: ${response.status}`);
    //     return response.status;
    //     //throw new Error(`HTTP error! status: ${response.status}`);

    //   }
      

      
      
    // } catch (error) {
    //   console.error("Error deleting event: ", error);
    // }
  //}

export {getEvents, createEvent, endMeeting}
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
      
      if (events.items.length == 0) {
        return []; 
      }else{
        return events;
      }


    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }
  

 



export {getEvents}
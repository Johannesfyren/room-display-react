async function getEvents() {
    const ACCESS_TOKEN = localStorage.getItem("bearer_token");
    const CALENDAR_ID = "primary"; // Or a specific calendar ID
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?singleEvents=true&maxResults=10&orderBy=startTime`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
          
        }
        
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const events = await response.json();
      console.log("Events:", events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }
  

 



export {getEvents}
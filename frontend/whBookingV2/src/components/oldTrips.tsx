import { useEffect, useState } from "react";
import TripCard from "./tripCard"
import { oldTrips } from "../services/expeditions";
import { tripCardData } from "../types/propTypes";
import "../styles/homePage.css"
import BoatLoader from "./boatLoader";


function OldTrips() {
    const [tripData, setTripData] = useState<tripCardData[]>([])
    const [count, setCount] = useState<number>(0)

    const [offset, setOffset] = useState<number>(0)

    useEffect(() => {
      getTrips()
    }, [offset])
    

    const getTrips = async () => {
        try {
          const response: any = await oldTrips(5, offset);
          setCount(response[1])
          const parsedTrips = response[0].map((trip : tripCardData) => ({
            ...trip,
            startDate: new Date(trip.startDate),
            endDate: new Date(trip.endDate)
        }));
          setTripData([...tripData, ...parsedTrips])
        } catch (error) {
          console.error('Error fetching trip data:', error);
        }
      };
    
    return (
        <>
      
        {tripData.length > 0 ? tripData.map((trip) => {
           return  <TripCard 
            key={trip.id} trip={trip} old={true}/>
     
        }) : 
            <BoatLoader h={40}/>
        }
        <div id="buttonDiv">
          {tripData.length == count ?
            
            <button id="paginationButtonDisabled">More trips</button>

           :
           <button onClick={() => setOffset(offset + 5)} id="paginationButton">More trips</button>

           }        
        </div>
        
        </>
    )

}

export default OldTrips
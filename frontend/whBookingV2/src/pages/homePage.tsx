import { useState } from "react";
import "../styles/homePage.css"
import greenBoat from "../assets/BoatGreen.svg"
import yellowBoat from "../assets/BoatOrange.svg"
import redBoat from "../assets/BoatRed.svg"
import OldTrips from "../components/oldTrips";
import Trips from "../components/trips";


function HomePage() {


    const [isOldTrip, setIsOldTrip] = useState<boolean>(false)

   
 
    return (
        <>
        <div className="imageTitle">
        <div className="overlay"></div>
            <div id="imageText">
                
                {isOldTrip ? 
                <>
                  <h2>EXPEDITION ARCHIVE</h2>
                  <p className="expedClass" onClick={() => setIsOldTrip(!isOldTrip)}>See expedition calendar</p> 
                </>
                : 
                <>
                  <h2>EXPEDITION CALENDAR</h2>
                  <p className="expedClass" onClick={() => setIsOldTrip(!isOldTrip)}>See expedition archive</p>
                </>
                }
              
                <div id="statusDisplay">
                    <p><img src={greenBoat}/>Open |</p>
                    <p><img src={yellowBoat}/>Few spaces |</p>
                    <p><img src={redBoat}/>Waiting list</p>
                </div>
            </div>
          
        </div>
        
        {isOldTrip 
        ? <OldTrips />
        : <Trips />
        }

        </>
    )

}

export default HomePage
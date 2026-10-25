import { useState, useEffect } from "react"
import { remaindingTripData } from "../types/tripType"
import { tripCardData } from "../types/propTypes"
import { useLocation } from "react-router-dom"
import { getImage, trip } from "../services/expeditions"
import "../styles/trip.css"
import { getDateAsString } from "../helpers/date"
import BoatLoader from "../components/boatLoader"
import ExtraInfo from "../components/ExtraInfo"
import AboutTrip from "../components/aboutTrip"
import BookButton from "../components/bookButton"
import TripCost from "../components/tripCost"
import noraa from "../assets/noraa.jpg"


interface propType {
  trip: tripCardData
  old: boolean
}

function Trip() {

  const [tripdataRest, setTripDataRest] = useState<remaindingTripData>()
  const [imgUrl, setImgUrl] = useState<string>("")
  const location = useLocation();
  const tripData: propType = location.state?.props
  const days = Math.ceil(Math.abs(tripData.trip.startDate.getTime()- tripData.trip.endDate.getTime())/ (1000 * 60 * 60 * 24))
  const startDate = getDateAsString(tripData.trip.startDate)
  const endDate = getDateAsString(tripData.trip.endDate)
    
  useEffect(() => {
    getTrip()
    getTripImage()
  }, [])
  
  
  const getTrip = async () => {
      try {
        const response: any = await trip(tripData.trip.id);
        setTripDataRest(response[0])
      } catch (error) {
        console.error('Error fetching trip data:', error);
      }
      
    };

    const getTripImage = async () => {
      try {
      
        const img : string = await getImage(tripData.trip.image)
        if (img === undefined || img === null || img === "") {
          setImgUrl(noraa)
        } else {
          setImgUrl(img)
        }
        
      } catch (error) {
        console.error("Error fetching image: ", error)
        
      }
    }
  return tripdataRest ? (
    <>
      <div className="tripImage" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)) ,url(${imgUrl})`,
        }}>
          <h4 id="title">{tripData.trip.title}</h4>
          <div id="imageTextInfo">
            <p>{days} days</p>
            <p>{startDate} - {endDate}</p>
            <p>{tripData.trip.startloc} - {tripData.trip.endLoc}</p>
          </div>
      </div>

      <div id="tripInfoBody">
        <AboutTrip tripText={tripdataRest.info}/>
        <div id="tripInfoBodyRight">
          <TripCost dayCost={tripdataRest.dayCost}/>
          <BookButton status={tripData.trip.status} old={tripData.old} skipperMail={tripdataRest.skipperMail}/>
          <ExtraInfo extraText={tripdataRest.sailText} title="Sailing with us" top={true}/>
          <ExtraInfo extraText={tripdataRest.includeText} title="What is included" top={false}/>   
        </div>
      </div>

    </>
  ) : (<BoatLoader h={100}/>)
}

export default Trip
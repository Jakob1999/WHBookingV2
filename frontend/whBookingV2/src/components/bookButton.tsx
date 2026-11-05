import "../styles/bookButton.css"
import { tripCardData } from "../types/propTypes"
import { useNavigate } from "react-router-dom"


export default function BookButton({status, old, skipperMail, trip} : {status : string, old: boolean, skipperMail: string, trip: tripCardData}) {
  const navigate = useNavigate()
  const handleNavigation = () => {

        navigate(`/trip/${trip.id}/apply`, { state: { trip }})
    }

  return (
    <>
    {old 
    ? 
      <a id="bookButtonOld">
        Not Bookable
      </a>
    
    :
    <a id="bookButton" onClick={handleNavigation}>
        {status == "Full" ? 
          "Waiting list" : 
          "Apply"
        }
      </a>
  }
    </>

  )
}
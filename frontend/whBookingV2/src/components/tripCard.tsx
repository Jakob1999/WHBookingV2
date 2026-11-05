import { useState } from "react";
import "../styles/tripCard.css"
import { tripCardData } from "../types/propTypes";
import { useEffect } from "react";
import anchorGreen from "../assets/AnchorGreen.svg"
import anchorYellow from "../assets/AnchorOrange.svg"
import anchorRed from "../assets/AnchorRed.svg"
import boatRed from "../assets/BoatRed.svg"
import boatGreen from "../assets/BoatGreen.svg"
import boatYellow from "../assets/BoatOrange.svg"
import { getDateAsString } from "../helpers/date";
import "../styles/tripCard.css"
import { useNavigate } from "react-router-dom";

interface propType {
    trip: tripCardData
    old: boolean
}


function TripCard(props : propType) {
    const days = Math.ceil(Math.abs(props.trip.startDate.getTime()- props.trip.endDate.getTime())/ (1000 * 60 * 60 * 24))
    const [anchorLogo, setAnchorLogo] = useState<string>("")
    const [boatLogo, setBoatLogo] = useState<string>("")
    const startDate = getDateAsString(props.trip.startDate)
    const endDate = getDateAsString(props.trip.endDate)
    const navigate = useNavigate()

    useEffect(() => {
        switch (props.trip.status) {
            case "Limited spaces":
                setAnchorLogo(anchorYellow)
                setBoatLogo(boatYellow)
                break;
            case "Open":
                setAnchorLogo(anchorGreen)
                setBoatLogo(boatGreen)
                break;
            case "Full":
                setAnchorLogo(anchorRed)
                setBoatLogo(boatRed)
                break;
        }
    }, [])

    const handleNavigation = () => {

        navigate(`/trip/${props.trip.id}`, { state: { props }})
    }

    
    return (
        <div id="tripCard" onClick={() => handleNavigation()}>
            <div id="leftCard">
                <h3>{props.trip.title}</h3>
                <p><img src={boatLogo} width={22}/> {startDate}, {props.trip.startloc}</p>
                <p><img src={anchorLogo} width={22}/> {endDate}, {props.trip.endLoc}</p>
            </div>
            <p id="days">{days} days</p>
        </div>
        
    )   
}

export default TripCard
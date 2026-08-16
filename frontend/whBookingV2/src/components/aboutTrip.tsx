import "../styles/aboutTrip.css"

export default function AboutTrip({tripText} : {tripText: string}) {

    return (
    <div id="aboutTrip">
        <h4>About the trip</h4>
        <p id="tripInfoText">{tripText}</p>
    </div>
    )
    
}
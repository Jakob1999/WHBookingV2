import "../styles/tripCost.css"

export default function TripCost({dayCost} : {dayCost: number}) {
    return (
      <div id="cost">
        <p>{dayCost} EURO/DAY</p>
      </div>
    )
}
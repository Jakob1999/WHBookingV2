import "../styles/tripCost.css"

export default function TripCost({cost, student_cost} : {cost: number, student_cost: number, }) {
    return (
      <div id="cost">
        {cost ? 
          <p>{cost} EURO</p> : 
          <p>Strudent - {student_cost} EURO</p>
        }
      </div>
    )
}
import boat from "../assets/BoatGrey.svg"
import "../styles/boatLoader.css"

function BoatLoader(h: {h : number}) {
    let height = `${h.h}vh`
    return (
        <div id="boatBox" style={{height: height}}>
            <img src={boat} id="boat"/>
           
        </div>
    )
}

export default BoatLoader
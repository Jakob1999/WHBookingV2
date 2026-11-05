import { Collapse } from "@mantine/core"
import classes from "../styles/navStyles.module.css"
import "../styles/navStyles.css"


function NavDropMenu({open} : {open: boolean}) {
    return (
        <>
        <Collapse animateOpacity={false} in={open} transitionTimingFunction="linear" transitionDuration={400} className={classes.navCollapse}>
            <div className={classes.content}>
                <a href="https://wicked-horizon.com/" className="dropLinks">HOME</a>
                <a href="https://wicked-horizon.com/sy-nora-simrad/" className="dropLinks">OUR BOAT</a>
                <a href="https://wicked-horizon.com/blue-water-workshop/" className="dropLinks">BLUE WATER WORKSHOP</a>
                <a href="https://wicked-horizon.com/about-us/" className="dropLinks" >ABOUT US</a>
                <a href="https://www.booking-wicked-horizon.com/" className="dropLinks" style={{color: "#2ea3f2"}} >EXPEDITIONS</a>
                <a href="https://wicked-horizon.org/" className="dropLinks">ACADEMY</a>
                </div>
        </Collapse>
        </>
    )
}

export default NavDropMenu
import "../styles/navStyles.css"

function NavList() {

    return (
    <div className="linkBox">
        <a href="https://wicked-horizon.com/" className="links">HOME</a>
        <a href="https://wicked-horizon.com/services/" className="links" >SERVICES</a>
        <a href="https://www.booking-wicked-horizon.com/" className="activelink" style={{color: "#2ea3f2"}} >EXPEDITIONS</a>
        <a href="https://wicked-horizon.com/our-boat/" className="links">OUR BOAT</a>
        <a href="https://wicked-horizon.com/about-us/" className="links" >ABOUT US</a>
        <a href="https://wicked-horizon.com/contact/" className="lastlink">CONTACT</a>
     </div>
    );

}


export default NavList
import NavDrop from "./NavDrop";
import NavList from "./NavList"
import { useMediaQuery } from '@mantine/hooks';
import logoLarge from "../assets/largeLogo.png"
import  "../styles/navStyles.css"
import { useEffect, useState } from "react";

function NavBar() {

    const breakPoint = useMediaQuery('(min-width: 1080px)')

    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
        setIsSticky(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
        window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={isSticky ? "stickyHeader" : "header"}>
            <a href="/" ><img src={logoLarge}  className={isSticky ? "stickyLogo" : "logo"} alt="Wicked Horizon Logo" /></a>
            {breakPoint? <NavList /> : <NavDrop />}
        </div>
    )
}


export default NavBar
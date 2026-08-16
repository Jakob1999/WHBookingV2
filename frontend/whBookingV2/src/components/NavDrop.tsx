import { useState } from 'react';
import NavDropMenu from './NavDropMenu';
import burger from "../assets/hamburger-menu.svg"


function NavDrop() {

    const [open, setOpen] = useState<boolean>(false);


    return (
        <>
        <div className='burger' onClick={() => setOpen(!open)} aria-label='Toggle navigation'><img src={burger} /></div>

        <NavDropMenu {...{open}} />
        </>

    )
    
        
}

export default NavDrop
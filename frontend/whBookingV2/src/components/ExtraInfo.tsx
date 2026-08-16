import { Collapse } from "@mantine/core";
import { useState } from "react";
import "../styles/extraInfo.css"

export default function ExtraInfo ({extraText, title, top} : {extraText:string, title: string, top: boolean}) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

    return top ? (
        <div id="extraInfo">
            <p id="infoTitle" onClick={() => setIsOpen(!isOpen)}>{title}</p>
            <Collapse in={isOpen} transitionDuration={600}>
           
                <div id="infoText" dangerouslySetInnerHTML={{ __html: extraText || "" }} />
            </Collapse>
        </div>
    ) : 
    (
    <div id="extraInfo" style={{borderBottom: "1.5px solid #F57E20", marginBottom: "2vh"}}>
      <p id="infoTitle" onClick={() => setIsOpen(!isOpen)}>{title}</p>
      <Collapse in={isOpen} transitionDuration={600}>
    
          <div id="infoText" dangerouslySetInnerHTML={{ __html: extraText || "" }} />
      </Collapse>
    </div>
)
}
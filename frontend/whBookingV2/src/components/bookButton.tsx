import "../styles/bookButton.css"

export default function BookButton({status, old, skipperMail} : {status : string, old: boolean, skipperMail: string}) {

  return (
    <>
    {old 
    ? 
      <a id="bookButtonOld">
        Not Bookable
      </a>
    
    :
    <a id="bookButton" href={`mailto:${skipperMail}`}>
        {status == "Full" ? 
          "Waiting list" : 
          "Apply"
        }
      </a>
  }
    </>

  )
}
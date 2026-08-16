import { useEffect, useState } from 'react'
import './App.css'
import { getImage, trip } from '../services/expeditions'

function App() {
  const [count, setCount] = useState(0);
  const [testData, setTestData] = useState<any[]>([]);
  const [imgUrl, setImgUrl] = useState<string>("")

  const test = async (id: string) => {
    setCount((count) => count + 1);

    try {
      const response: any = await trip(id);
      setTestData(response)
    } catch (error) {
      console.error('Error fetching trip data:', error);
    }

    
  };

  const getTripImage = async (key: string) => {
    try {
   
      const img : string = await getImage(key)
      setImgUrl(img)
     
    } catch (error) {
      console.error("Error fetching image: ", error)
      
    }
  }

  useEffect(() => {
    if (testData.length > 0) {

      getTripImage(String(testData[0].image))
    }
  }, [testData])


  return (
    <>
      <button onClick={() => test("19")}>
        count is {count}
      </button> 
      <div>
        {testData.map((item, index) => (
          <div key={index}>
            <p>{index}</p>
            <p>ID: {item.id}</p>
            <p>Title: {item.title}</p>
            <p>Start date: {item.startDate}</p>
            <p>End date: {item.endDate}</p>
            <p>Status: {item.status}</p>
            <img src={imgUrl} alt={`Trip ${item.id} Image`} style={{height: "100px", width: "200px"}}/>
          </div>
        ))}
      </div>
    </>
  );
}


export default App

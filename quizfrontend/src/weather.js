import React,{useEffect, useState} from 'react';

const Weather = () => {

    const [weather, setweather] = useState(null)

    useEffect(()=> {

    //   async function fetchData() {
    //     const response = await fetch('http://127.0.0.1:8000/api/get-weatherInfo/')
    //     const maindata = await response.json();
    //     setweather(maindata)
    // }

        fetch("http://127.0.0.1:8000/api/get-weatherInfo/")
        .then(response => {
          return response.json()
        })
        .then(wdata => {
          setweather(wdata)
        })
        
    },[])

  // async function fetchData() {
  //   const response = await fetch('http://127.0.0.1:8000/api/get-quiz/')
  //   const maindata = await response.json();
  //   setdata(maindata);
  //   setStatus(maindata.status);
  //   setQuestionData(maindata.data);
  // }

    
    
    return(
        <>
        <h2>{weather && weather.City}</h2>
        <h4>{weather && Math.round(weather.temprature)} °C</h4>
        <h4>{weather && Math.round(weather.wind)} km/h</h4>

        </>
    )
}
export default Weather
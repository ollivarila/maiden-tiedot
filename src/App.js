/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';
import axios from 'axios'
import { useState, useEffect } from 'react'

const Filter = ({name, filterCh}) => {
  return(
    <>
     filter countries: <input onChange={filterCh} value={name}/> 
    </>
  )
}

const getWeather = async (country) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${process.env.WEATHER_TOKEN}&units=metric`
  console.log(url)
  return axios.get(url).then(res => res.data)
}

const OneCountry = ({ country }) => {

  const [weather, setWeather] = useState({})

  useEffect(() => {
    getWeather(country)
      .then((data) => setWeather(data))
  }, [])

  console.log(weather)

  const languages = country.languages
  const lArr = Object.values(languages)

  return (
    <>
    <h1>{country.name.common}</h1>
    <p>Capital: {country.capital[0]}</p>
    <p>area: {country.area.toFixed(0)}</p>
    <div>
      <h2><b>languages:</b></h2>
      <ul>
        {lArr.map(l => <li key={l} >{l}</li>)}
      </ul>
      <img src={country.flags.png} alt="flag" height='150px' width='150px'/>
      <div>
        <h2>Weather in {country.capital[0]}</h2>
        <p>Temperature {weather.main.temp} Celcius</p>
        <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather" />
        <p>Wind {weather.wind.speed} m/s</p>
      </div>
    </div>
  </> 
  )
}

const CountryInfo = ({ country }) => {
  const [ showDetails, setShowDetails ] = useState(false)

  if(showDetails){
    return (
      <>
        <OneCountry country={country}/>
      </> 
    )
  }

  return (
    <p>{country.name.common} <button onClick={() => setShowDetails(!showDetails)}>show</button> </p>
  )
  
}

const CountryList = ({ countries }) => {

  if(countries.length > 10) return <p>Too many matches specify another filter</p>

  if(countries.length === 1) {
    const c = countries[0]
    return (
      <>
        <OneCountry country={c}/>
      </> 
    )
  }

  return (
    <ul>
      {countries.map((c, i) => <li key={i} className='none'><CountryInfo country={c}/></li> )}
    </ul>
  )
}


function App() {

  const [filter, setFilter] = useState('')
  const [ countries, setCountries ] = useState([])

  useEffect(() => {
    const url = 'https://restcountries.com/v3.1/all'
    axios.get(url)
      .then(res => setCountries(res.data))
  }, [])

  return (
    <div className="App">
      <Filter name={filter} filterCh={({target}) => setFilter(target.value)}/>
      <CountryList countries={countries.filter(c => c.name.common.toLowerCase().includes(filter.toLowerCase()))}/>
    </div>
  );
}

export default App;

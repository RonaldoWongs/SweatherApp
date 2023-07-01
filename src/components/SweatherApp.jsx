import React, { useEffect, useState } from 'react';
import axios from 'axios';
import mundo from '../../img/mundo.png';
import mapa from '../../img/mapa.png';
import temperatura from '../../img/temperatura.png';
import humedad from '../../img/humedad.png';
import viento from '../../img/viento.png';

const SweatherApp = () => {
  const [climate, setClimate] = useState({});
  const [transform, setTransform] = useState(true);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCurrentCity = async () => {
      try {
        const response = await axios.get('https://ipapi.co/json');
        const currentCity = response.data.city;
        setCity(currentCity);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrentCity();
  }, []);

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const fetchWeatherData = (city) => {
    if (city.trim() === '') {
      return;
    }
    setLoading(true);
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3cbb5705eaf1be0736fcd4103d0590e5`
      )
      .then((res) => {
        setClimate(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const isDaytimeNow = (data) => {
    const currentTime = new Date().getTime() / 1000;
    return currentTime > data.sys.sunrise && currentTime < data.sys.sunset;
  };

  const getBackgroundImage = (weatherCode) => {
    if (typeof weatherCode === 'number') {
      const isDaytime = climate?.sys?.sunrise && climate?.sys?.sunset ? isDaytimeNow(climate) : true;
      const isRaining = weatherCode >= 500 && weatherCode <= 599;
      const isSnowing = weatherCode >= 600 && weatherCode <= 699;
      const isStormy = weatherCode >= 200 && weatherCode <= 299;

      if (isStormy) {
        if (isDaytime) {
          return 'URL_DE_LA_IMAGEN_DE_TORMENTA_DE_DÍA';
        } else {
          return 'URL_DE_LA_IMAGEN_DE_TORMENTA_DE_NOCHE';
        }
      } else if (isSnowing) {
        if (isDaytime) {
          return 'URL_DE_LA_IMAGEN_DE_NIEVE_DE_DÍA' || 'LINK_ACTUAL_DE_IMAGEN_DE_NIEVE_DE_DÍA';
        } else {
          return 'URL_DE_LA_IMAGEN_DE_NIEVE_DE_NOCHE' || 'LINK_ACTUAL_DE_IMAGEN_DE_NIEVE_DE_NOCHE';
        }
      } else if (isRaining) {
        if (isDaytime) {
          return 'https://usagif.com/wp-content/uploads/rainy-10.gif';
        } else {
          return 'https://fondosmil.com/fondo/27668.jpg';
        }
      } else if (weatherCode >= 700 && weatherCode < 800) {
        if (isDaytime) {
          return 'https://i.gifer.com/DgUQ.gif';
        } else {
          return 'https://i.pinimg.com/originals/82/67/fd/8267fd1f2f023f6e682bb919c5a0d1d8.gif';
        }
      } else if (weatherCode === 800) {
        if (isDaytime) {
          return 'https://z101digital.com/wp-content/uploads/2019/03/sol-cielo-nubes-17032019-onamet.gif';
        } else {
          return 'https://media.tenor.com/0pwmXoNB7EkAAAAC/estrellas-cielo.gif';
        }
      } else if (weatherCode > 800 && weatherCode < 900) {
        if (isDaytime) {
          return 'https://thumbs.gfycat.com/PinkTautChrysomelid-size_restricted.gif';
        } else {
          return 'https://thumbs.gfycat.com/GlaringPassionateIndianpangolin-size_restricted.gif';
        }
      } else {
        return '';
      }
    }
    return '';
  };

  const backgroundImage = getBackgroundImage(climate.weather?.[0]?.id);
  const bodyStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={bodyStyle}>
      <div className='climate-container'>
        <h1>Weather App</h1>
        <div className='search-container'>
          <input
            type='text'
            placeholder='Enter city'
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={() => fetchWeatherData(city)}>Search</button>
        </div>
        {loading ? (
          <h2>Loading...</h2>
        ) : (
          <>
            <h2>
              <img src={mundo} alt='' /> {climate.sys?.country}
            </h2>
            <h2>
              <img src={mapa} alt='' />
              {climate.name}
            </h2>
            <img
              className='imgContainer'
              src={`http://openweathermap.org/img/wn/${climate.weather?.[0]?.icon}.png`}
              alt=''
            />
            <h2>{climate.weather?.[0]?.description}</h2>
            <h2>
              <img src={temperatura} alt='' />{' '}
              {transform
                ? (climate.main?.temp - 273).toFixed(2)
                : ((climate.main?.temp - 273).toFixed(2) * 9) / 5 + 32}
              {transform ? ' °C' : ' °F'}
            </h2>
            <h2>
              <img src={humedad} alt='' /> {climate.main?.humidity}
            </h2>
            <h2>Pressure: {climate.main?.pressure}</h2>
            <h2>
              <img src={viento} alt='' /> {climate.wind?.speed}
            </h2>
            <button className='btn-5' onClick={() => setTransform(!transform)}>
              °C & °F / Units
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SweatherApp;

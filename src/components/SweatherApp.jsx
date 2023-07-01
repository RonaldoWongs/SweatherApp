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

  const getBackgroundImage = (weatherCode) => {
    if (typeof weatherCode === 'number') {
      if (weatherCode >= 200 && weatherCode < 300) {
        return 'https://fondosmil.com/fondo/57234.jpg';
      } else if (weatherCode >= 300 && weatherCode < 600) {
        return 'https://i.gifer.com/GYlk.gif';
      } else if (weatherCode >= 600 && weatherCode < 700) {
        return 'https://www.todofondos.net/wp-content/uploads/3840x2160-Invierno-Sunset-con-nieve-4K-Ultra-HD-Wallpaper-scaled.jpg';
      } else if (weatherCode >= 700 && weatherCode < 800) {
        return 'https://images5.alphacoders.com/103/1035809.jpg';
      } else if (weatherCode === 800) {
        return 'https://www.wallpaperflare.com/static/1005/114/442/fife-sunset-photography-green-wallpaper.jpg';
      } else if (weatherCode > 800 && weatherCode < 900) {
        return 'https://z101digital.com/wp-content/uploads/2019/03/sol-cielo-nubes-17032019-onamet.gif';
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
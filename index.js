const config = require('./config')
const Twit = require('twit')
const axios = require('axios')

const T = new Twit(config.twitConfig);
const cityID = config.apiConfig.cityID
const APIKey = config.apiConfig.APIKey
const urlActual = `https://api.openweathermap.org/data/2.5/weather?id=${cityID}&appid=${APIKey}&units=metric&lang=es`
const url = `https://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${APIKey}&units=metric&lang=es`

const getDataFrom = async (url) => {
  try{
    const response = await axios.get(url)
    return response
  }
  catch(error){
    console.log(error)
  }
}

const getCurrentWeather = function (data){
  const datos = data.data
  const obj = {
    temperatura(){
      return Math.round(datos.main.temp)
    },
    temperaturaMaxima(){
      return Math.round(datos.main.temp_max)
    },
    temperaturaMinima(){
      return Math.round(datos.main.temp_min)
    },
    descripcion(){
      return datos.weather[0].description
    }
  }
  return obj
}

const getForecast = function (data){
  const datos = data.data
  const obj = {
    fecha(){
      return new Date(datos.dt*1000)
    },
    hora(){
      return this.fecha().getHours()  
    },
    horaFormateada (){
      return `${this.hora()}:00`
    },
    temperatura(){
      return Math.round(datos.main.temp)
    },
    descripcion(){
      return datos.weather[0].description
    }
  }
  return obj
}

const climaActual = async() => {
  const datos = await getDataFrom(urlActual)
  const tiempo = getCurrentWeather(datos)
  
  const temperatura = tiempo.temperatura()
  const maxima = tiempo.temperaturaMaxima()
  const minima = tiempo.temperaturaMinima()
  const descripcion = tiempo.descripcion()

  const cuerpoTwit = `
  En este momento estamos a una temperatura de ${temperatura}°C con ${descripcion}. La máxima será de ${maxima}°C y la mínima de ${minima}°C`

  const twit = {status:cuerpoTwit}

  //T.post('statuses/update',twit)
}

climaActual()

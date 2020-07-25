/* Test 3*/
const config = require("./config");
const Twit = require("twit");
const axios = require("axios");

const T = new Twit(config.twitConfig);
const coords = config.coords;
const APIKey = config.apiConfig.APIKey;
const APIURI = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${APIKey}&units=metric&lang=es`;

const getDataFrom = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getWeather = function (datos) {
  const obj = {
    prediccionHoy() {
      return datos.daily[0];
    },
    temperaturaActual() {
      return Math.round(datos.current.temp);
    },
    temperaturaMaxima() {
      return Math.round(this.prediccionHoy().temp.max);
    },
    temperaturaMinima() {
      return Math.round(this.prediccionHoy().temp.min);
    },
    descripcionActual() {
      return datos.current.weather[0].description;
    },
    prediccionManana() {
      return datos.daily[1];
    },
    temperaturaMaximaManana() {
      return Math.round(this.prediccionManana().temp.max);
    },
    temperaturaMinimaManana() {
      return Math.round(this.prediccionManana().temp.min);
    },
    descripcionManana() {
      return this.prediccionManana().weather[0].description;
    },
    lluviaManana() {
      return this.prediccionManana().rain;
    },
  };
  return obj;
};

const climaActual = async () => {
  const datos = await getDataFrom(APIURI);
  const tiempo = getWeather(datos);
  const temperatura = tiempo.temperaturaActual();
  const descripcion = tiempo.descripcionActual();

  const cuerpoTwit = `
  En este momento estamos a ${temperatura}°C con ${descripcion}.`;

  const twit = { status: cuerpoTwit };
  T.post("statuses/update", twit);
};

const climaDelDia = async () => {
  const datos = await getDataFrom(APIURI);
  const tiempo = getWeather(datos);
  const temperatura = tiempo.temperaturaActual();
  const descripcion = tiempo.descripcionActual();
  const maxima = tiempo.temperaturaMaxima();
  const minima = tiempo.temperaturaMinima();

  const cuerpoTwit = `
  Estamos a ${temperatura}°C con ${descripcion}. La máxima de hoy será de ${maxima}°C y la mínima de ${minima}°C. #cdmx #clima`;

  const twit = { status: cuerpoTwit };
  T.post("statuses/update", twit);
};

const climaManana = async () => {
  const datos = await getDataFrom(APIURI);
  const tiempo = getWeather(datos);
  const maxima = tiempo.temperaturaMaximaManana();
  const minima = tiempo.temperaturaMinimaManana();
  const descripcion = tiempo.descripcionManana();

  const cuerpoTwit = `
  Mañana se espera ${descripcion}, una temperatura máxima de ${maxima}°C y una mínima de ${minima}°C. #cdmx #clima`;

  const twit = { status: cuerpoTwit };
  T.post("statuses/update", twit);
};

const fecha = new Date();
const hora = fecha.getHours() - 5;

if (hora === 8) {
  climaDelDia();
} else if (hora === 18) {
  climaManana();
} else {
  climaActual();
}

<template>
<v-app>
  <v-app-bar v-if="weatherData" :style="{ background: getAppBarGradient(weatherData.temperature) }" dark>
  <v-toolbar-title class="text-center dynamic-title" style="color: white;">
    <i class="fa-solid fa-tower-broadcast" style="color: #ffffff;"></i>
    AeroAlly: La météo pour les pilotes de drone
  </v-toolbar-title>
</v-app-bar>
    <v-toolbar dark v-else :style="{ background: 'linear-gradient(to right, white, #DDDDDD)' }">
      <v-toolbar-title class="text-center dynamic-title" style="color: black;">
        <i class="fa-solid fa-tower-broadcast" style="color: #000000;"></i>
        AeroAlly: La météo pour les pilotes de drone
      </v-toolbar-title>
    </v-toolbar>
  <v-main>
    <v-fade-transition>
      <v-card flat class="pa-4 search-card">
        <search-component @search="fetchWeatherData" @request-location="getUserLocation">
        </search-component>
      </v-card>
    </v-fade-transition>
    <v-container>
      <v-row>
        <weather-display-component class="flex-grow-1"
          :weatherData="weatherData"
          :kpData="kpData">
        </weather-display-component>
      </v-row>
    </v-container>
      <v-row>
        <drone-safety-summary v-if = "weatherData" class="flex-grow-1"
        :weatherData="weatherData">
        </drone-safety-summary>
      </v-row>
  </v-main>
</v-app>
</template>

<style>

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.text-center {
  justify-content: center;
}
.flex-grow-1 {
  flex-grow: 1;
}

.dynamic-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 24px;
  animation: fadeIn 2s forwards;
  animation-delay: 1s;
  opacity: 0;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>

<script>
export default {
  data() {
    return {
      weatherData: null,

    };
  },

  methods: {
  getAppBarGradient(temperature) {
    if (temperature < 10) {
      return 'linear-gradient(to right, #73C8A9, #373B44)';
    } else if (temperature >= 10 && temperature < 20) {
      return 'linear-gradient(to right, #FFD194, #D1913C)';
    } else if (temperature >= 20 && temperature < 30) {
      return 'linear-gradient(to right, #FF4E50, #F9D423)';
    } else if (temperature == null) {
      return 'linear-gradient(to right, #000000, #000000)';
    } else {
      return 'linear-gradient(to right, #FF0000, #FF8C00)';
    }
  }
}

}
</script>

<script setup>
import { ref } from 'vue'
import SearchComponent from './components/SearchComponent.vue'
import WeatherDisplayComponent from './components/WeatherDisplayComponent.vue'
import DroneSafetySummary from './components/DroneSafetySummary.vue'
import axios from 'axios'

const apiKey = "2dab16200e6860243dfd00affb85851d"
const weatherData = ref(null)
const kpData = ref(null)
const errorMessage = ref('')


const fetchCoordinates = async (city) => {
  const geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
  try {
    const response = await axios.get(geocodingUrl)
    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0]
      return { lat, lon }
    } else {
      throw new Error("No results found for this city.")
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error)
    errorMessage.value = "Error fetching coordinates."
    throw error
  }
}

const fetchWeatherData = async (city) => {
  try {
    const { lat, lon } = await fetchCoordinates(city)
    await fetchWeather(lat, lon)
  } catch (error) {
    console.error("Error fetching weather data:", error)
    errorMessage.value = "Error fetching weather data."
  }
}

const fetchWeather = async (lat, lon) => {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`
  try {
    const response = await axios.get(weatherUrl)
    weatherData.value = {
      city: response.data.name,
      globalWeather: response.data.weather[0].description || "Météo inconnue",
      temperature: response.data.main.temp,
      windSpeed: response.data.wind.speed * 3.6,
      visibility: response.data.visibility / 1000,
      pressure: response.data.main.pressure,
      humidity: response.data.main.humidity,
      groundLevel: response.data.main.grnd_level || "Inconnu",
      clouds: response.data.clouds.all,
      rain: response.data.rain || "Inconnu",
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)
    errorMessage.value = "Error fetching weather data."
  }
  console.log("Weather data:", weatherData.value)
}

const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      fetchWeather(latitude, longitude)
      fetchKpDataForDate()
    }, error => {
      console.error("Erreur de géolocalisation:", error)
      errorMessage.value = "Erreur de géolocalisation."
    })
  } else {
    console.error("La géolocalisation n'est pas prise en charge par ce navigateur.")
    errorMessage.value = "La géolocalisation n'est pas prise en charge par ce navigateur."
  }
}

const fetchKpDataForDate = () => {
  const today = new Date()
  const startDate = today.toISOString().substring(0, 10) + 'T02:00:00Z'
  const endDate = today.toISOString().substring(0, 10) + 'T03:59:59Z'

  const url = `/api/?start=${startDate}&end=${endDate}&index=Kp`
  console.log("URL pour la récupération des données Kp:", url)

  axios.get(url)
    .then(response => {
      console.log("Réponse de la récupération des données Kp:", response.data.Kp)
      kpData.value = {
        value: response.data.Kp || "Inconnu",
      }
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des données Kp:', error)
    })
}
</script>

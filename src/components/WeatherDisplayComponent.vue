<template>
  <v-container fluid class="weather-display" v-if="weatherData" :style="backgroundStyle(weatherData.temperature)">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="elevation-10" dark>
          <v-card-text class="pa-5">
            <v-row>
              <v-col cols="12" class="text-center mb-5">
                <v-icon large :class="weatherIcon(weatherData.globalWeather)" class="mb-2"></v-icon>
                <div class="display-2">{{ weatherData.temperature }}°C</div>
                <span class="subtitle-1">Météo à {{ weatherData.city }}</span>
              </v-col>

              <v-col cols="6" md="3" class="text-center">
                <v-icon medium>mdi-wind-turbine</v-icon>
                <div>Vent</div>
                <div :class="textColor(weatherData.windSpeed)">{{ weatherData.windSpeed }} km/h</div>
              </v-col>

              <v-col cols="6" md="3" class="text-center">
                <v-icon medium>mdi-eye-outline</v-icon>
                <div>Visibilité</div>
                <div :class="textColor(weatherData.visibility)">{{ weatherData.visibility }} km</div>
              </v-col>

              <v-col cols="6" md="3" class="text-center">
                <v-icon medium>mdi-water-percent</v-icon>
                <div>Humidité</div>
                <div>{{ weatherData.humidity }}%</div>
              </v-col>

              <v-col cols="6" md="3" class="text-center">
                <v-icon medium>mdi-cloud-outline</v-icon>
                <div>Nuages</div>
                <div>{{ weatherData.clouds }}%</div>
              </v-col>

              <v-col cols="12" class="text-center mt-5">
                <div>Pression atmosphérique : {{ weatherData.pressure }} hPa</div>
                <div>Niveau du sol : {{ weatherData.groundLevel }}</div>
                <div>Pluie : {{ weatherData.rain }} </div>
                <div v-if="kpData">Indice Kp : {{ kpData.value }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    weatherData: Object,
    kpData: Object,
  },
  methods: {
    backgroundStyle(temperature) {
      if (temperature < 10) {
        return 'background: linear-gradient(to right, #73C8A9, #373B44);';
      } else if (temperature >= 10 && temperature <= 20) {
        return 'background: linear-gradient(to right, #FFD194, #D1913C);';
      } else {
        return 'background: linear-gradient(to right, #FF4E50, #F9D423);';
      }
    },
    weatherIcon(condition) {
      if (condition.includes('dégagé')) {
        return 'fa-solid fa-sun';
      }
      if (condition.includes('pluie')) {
        return 'fa-solid fa-cloud-rain';
      }
      if (condition.includes('nuageux' || 'couvert')) {
        return 'fa-solid fa-cloud';
      }
      return 'fa-solid fa-cloud-sun';
    },
    textColor(value) {
      if (value < 20) {
        return 'green--text';
      } else if (value >= 20 && value <= 40) {
        return 'orange--text';
      } else {
        return 'red--text';
      }
    },
  }
}
</script>

<style scoped>
.elevation-10 {
  box-shadow: 0px 10px 30px -5px rgba(0,0,0,0.3);
}
</style>

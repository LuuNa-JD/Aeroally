<template>
  <v-card>
    <v-card-title class="headline">
      Résultat de l'analyse de sécurité
    </v-card-title>
    <v-card-text>
      <p v-if="canFlyDrone">Vous pouvez voler en toute sécurité ! Bon Vol</p>
      <p v-else>Vous ne pouvez pas voler aujourd'hui...</p>
      <p v-if="weatherData && weatherData.wind_speed > 30">Les vents forts agissent sur la stabilité du drone.</p>
      <p v-if="weatherData && weatherData.visibility < 1">une visibilité basse entraine des difficultés au pilotage.</p>
      <p v-if="weatherData && weatherData.temperature < 5">Les températures basses peuvent affecter la vie des batteries.</p>
      <p v-if="weatherData && weatherData.temperature > 35">Les températures hautes peuvent affecter la vie des batteries.</p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    weatherData: {
      type: Object,
      required: true
    }
  },
  computed: {
    canFlyDrone() {
      return this.weatherData.temperature >= 5 && this.weatherData.temperature <= 35 && this.weatherData.wind_speed <= 30 && this.weatherData.visibility >= 1;
    }
  }
};
</script>

<style scoped>
  .headline {
    font-size: 24px;
    justify-content: center;
  }
  p {
    margin: 0;
  }
  .v-card {
    margin-top: 20px;
  }
</style>

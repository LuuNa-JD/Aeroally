<template>
  <v-card
    class="pa-4"
    height="100px"
    img="https://cdn.vuetifyjs.com/images/toolbar/map.jpg"
    flat
  >
    <v-toolbar dense floating>
      <v-text-field
        v-model="city"
        prepend-icon="mdi-magnify"
        hide-details
        single-line
        placeholder="Entrez le nom d'une ville"
        @keyup.enter="submitCity"
      ></v-text-field>

      <v-btn icon @click="$emit('request-location')" >
        <v-icon>mdi-crosshairs-gps</v-icon>
      </v-btn>
    </v-toolbar>
  </v-card>
</template>

<script>
export default {
  name: 'SearchComponent',
  data() {
    return {
      city: '',
    };
  },
  methods: {
    submitCity() {
      this.$emit('search', this.city);
    }

  }
}
</script>

<style>

</style>

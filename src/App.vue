<template>
  <div id="app">
    <google-maps></google-maps>
  </div>
</template>

<script>
import AirportMap from '@/AirportMap.vue'
import { EventBus } from '@/eventbus'

export default {
  name: 'app',
  components: {
    'google-maps': AirportMap
  },
  data () {
    return {
    }
  },
  methods: {
    getRandomAirport: function() {
      EventBus.$emit('random-airport', 0);
    }
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>

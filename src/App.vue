<template>
  <div id="app">
    <google-maps></google-maps>
    <div class="get-random-airport" @click="getRandomAirport">
      <div class="get-random-aiport__text">
        Get Random Airport!
      </div>
    </div>
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
  },
  created () {
    this.getRandomAirport()
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

.get-random-airport {
  cursor: pointer;
  position: absolute;
  top: 50px;
  right: 20px;
  background: #FFF;
  z-index: 9999;
  display: block;
  height: 50px;
  width: 150px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid blue;
  transition: background 0.3s ease;
}

.get-random-airport:hover {
  color: #FFF;
  background: blue;
  transition: background 0.3s ease;
}

.get-random-airport:active {
  color: #000;
  background: #FFF;
}

.get-random-airport__text {
  font-weight: bold;
}

</style>

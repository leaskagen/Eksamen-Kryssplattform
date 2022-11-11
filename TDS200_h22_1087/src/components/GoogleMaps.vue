<template>
    <div class="map" ref="mapDivRef">Kunne ikke laste inn kart</div>
    
</template>
<script lang="js">

/*
    Code from https://dev.to/aaronksaunders/create-your-own-vue3-google-maps-component-with-ionic-framework-capacitor-735
*/

import { ref, onBeforeMount, onMounted } from "vue";
import { directus } from '@/services/directus.service';
import { IGameResponse, IGame, IGameImage } from '@/models/IGame';
import { defineProps } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
  name: "GoogleMaps",
  setup() {

    const mapSuccess = ref(false);

    const route = useRoute();
    const { id } = route.params;

    let latitude = 0;
    let longitude = 0;

    const game = ref([]);
    // the google map object
    const map = ref(null);

    // the map element in the templste
    const mapDivRef = ref(null);

    let query;
  const accessKey = process.env.VUE_APP_POSITIONSTACK_API_KEY;

    onMounted(() => {
      
      // Get address for this game
      fetchAddress();
    });

    const fetchAddress = async () => {
      const response = await directus.graphql.items(`
        query {
          games_by_id(id: ${id}) {
            address,
            place,
            zip,
          }
        }
      `);

  if (response.status === 200 && response.data) {
    game.value = response.data.games_by_id; 
    console.log(game.value);
    getCoordinates();
    }
  }

  const getCoordinates = async () => {
  query = `${game.value.address} ${game.value.zip}`;
  console.log(query);

  const response = await axios.get(`http://api.positionstack.com/v1/forward?access_key=${accessKey}&query=${query}`);

  latitude = response.data.data[0].latitude;
  longitude = response.data.data[0].longitude;

  console.log(latitude);
  console.log(longitude);
  
  const key = process.env.VUE_APP_GOOGLE_MAPS_API_KEY;

  // create the script element to load
  const googleMapScript = document.createElement("SCRIPT");
      googleMapScript.setAttribute(
        "src",
        `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`
      );
      googleMapScript.setAttribute("defer", "");
      googleMapScript.setAttribute("async", "");
      document.head.appendChild(googleMapScript);

      console.log("Google Maps script loaded");
  

}
    /**
     * this function is called as soon as the map is initialized
     */

    window.initMap = () => {
      
        console.log('initMap');
      map.value = new window.google.maps.Map(mapDivRef.value, {
        mapTypeId: "roadmap",
        zoom: 15,
        disableDefaultUI: false,
        center: { lat: latitude, lng: longitude }
      });
      mapDivRef.value.style.border = "none";
}
    return {
      mapDivRef
    };
  }
};

</script>
<style scoped>
.map {
  width: 100%;
  height: 250px;
  background-color: #f4f5f8;
  display: flex;
  justify-content: center;
  align-items: center;
  border: dashed 2px grey;
}
</style>
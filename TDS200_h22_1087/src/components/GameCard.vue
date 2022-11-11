<script setup lang="ts">
import { IonImg, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle } from '@ionic/vue';
import { pricetag, location } from 'ionicons/icons';
import Banknote from '@/icons/banknote.png';
import MapMarker from '@/icons/map-marker.png';
import Coin from '@/icons/coin.png';
import { defineProps } from 'vue';

interface Props {
  game: {
    id: number;
    images: [{
      id: number;
      games_id: number;
      directus_files_id: {
        id: string;
      }
    }];
    title: string;
    description: string;
    platform: string;
    price: number;
    condition: string;
    address: string;
    place: string;
    zip: string;
  }
}

defineProps<Props>();

const filePath = 'https://bi5voh2i.directus.app/assets/';

</script>

<template>
    <ion-card :router-link="'/details/' + game.id">
        <ion-img :src="filePath + game.images[0].directus_files_id.id"/>
        <ion-card-header>
          <ion-card-title class="pixel card-title"  size="small">{{ game.title }}</ion-card-title>
          <div class="card-content">
            <ion-card-subtitle class="pixel"><ion-img :src="MapMarker" class="icons"/> {{ game.place }}</ion-card-subtitle>
            <ion-card-subtitle class="pixel"><ion-img :src="Coin" class="icons"/> {{ game.price }}</ion-card-subtitle>
          </div>
        </ion-card-header>
    </ion-card>
</template>

<style scoped>

ion-card {
  display: flex;
  flex-direction: column;
}

ion-img {
  height: 150px;
  width: 100%;
  object-fit: cover;
}

ion-card-header {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

ion-card-title {
  font-size: 20px;
  margin-bottom: 1em;
}

ion-card-subtitle {
  font-size: 16px;
  display: flex;
}
.icons {
  height: 20px;
  width: 20px;
  margin-right: 5px;
  position: relative;
  top: -1.5px;
}

</style>
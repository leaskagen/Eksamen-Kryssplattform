<template>
  <ion-page id="main-page">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <!-- Custom back button -->
          <ion-button class="back-button">
            <ion-img :src="Back" @click="$router.go(-1)"></ion-img>
          </ion-button>
        </ion-buttons>
        <ion-title class="pixel header-title">Mine annonser</ion-title>
      </ion-toolbar>
    </ion-header>
    <!-- Loading screen -->
    <ion-content :fullscreen="true" class="loading" v-if="gamesHasLoaded.valueOf() == false">
      <ion-spinner></ion-spinner>
    </ion-content>
    <!-- If user has posted any games -->
    <ion-content v-if="gamesHasLoaded.valueOf() == true && games.length > 0" :fullscreen="true">
      <MyGameCard v-for="game in games" :key="game.id" :game="game" />
    </ion-content>
    <!-- If user has not posted any games -->
    <ion-content v-if="gamesHasLoaded.valueOf() == true && games.length == 0" class="no-games" :fullscreen="true">
      <ion-text>Ingen annonser å vise.<br/>Trykk <a href="/new">her</a> for å legge ut en annonse</ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonImg, IonText, IonHeader, IonButton, IonToolbar, IonButtons, IonTitle, onIonViewWillEnter, IonContent, IonSpinner } from "@ionic/vue";
import { authService, directus } from "@/services/directus.service";
import { IGameByUser, IGamesByUser } from "@/models/IGame";
import MyGameCard from '@/components/MyGameCard.vue';
import { IUser } from "@/models/IUser";
import Back from '@/icons/back.png';
import { ref } from "vue";

const gamesHasLoaded = ref(false);

const games = ref<IGameByUser[]>([]);

const user = ref<IUser>();

onIonViewWillEnter(async () => {
  // Get user details
  user.value = await authService.currentUser();

  // Get games published by user
  fetchGames();
});

// Get game by user id from Directus
const fetchGames = async () => {
  const response = await directus.graphql.items<IGamesByUser>(`
    query {
      games(filter: { user_created: { id: { _eq: "${user.value?.id}"} } }) {
        id,
        images {
          id,
          directus_files_id {
            id,
          },
        },
        title,
      }
    }
  `);
  if (response.status === 200 && response.data) {
    games.value = [...response.data.games]; 
  }

  // Set gamesHasLoaded to true to show content
  gamesHasLoaded.value = true;
}
</script>

<style scoped>
.no-games {
  text-align: center;
  position: fixed !important;
  top: 25%;
}

.back-button {
  width: 35px;
  height: 35px;
  object-fit: cover;
  margin: 0;
}

ion-spinner {
  position: fixed !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

</style>
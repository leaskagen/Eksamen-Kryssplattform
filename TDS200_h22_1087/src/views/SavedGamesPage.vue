<script setup lang="ts">
import { IonButtons, IonText, IonImg, IonButton, onIonViewWillEnter, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSpinner } from '@ionic/vue';
import { directus, authService } from '@/services/directus.service';
import { IGameResponse, IGame } from '@/models/IGame';
import GameCard from '@/components/GameCard.vue';
import { IUser } from '@/models/IUser';
import Back from '@/icons/back.png';
import { ref } from 'vue';

const gamesHasLoaded = ref(false);
const toggleGamesHasLoaded = () => gamesHasLoaded.value = !gamesHasLoaded.value;

const games = ref<IGame[]>([]);

const favorites = ref<any[]>([]);

const user = ref<IUser>();

onIonViewWillEnter(async () => {
  user.value = await authService.currentUser();
  await fetchFavorites();
  toggleGamesHasLoaded();
});

// Get favorites by user id from Directus
const fetchFavorites = async () => {
  const response = await directus.graphql.items<any>(`
    query {
        favorite_games(filter: { user_created: { id: { _eq: "${user.value?.id}"} } }) {
        id,
        games_id,
      }
    }
  `);

  if (response.status === 200 && response.data) {
    favorites.value = [...response.data.favorite_games]; 
  }
  fetchGames();
}

// Get games by id from Directus
const fetchGames = async () => {
  favorites.value.forEach( async (favorite) => {
    const response = await directus.graphql.items<IGameResponse>(`
      query {
        games_by_id(id: ${favorite.games_id}) {
          id,
          images {
            id,
            directus_files_id {
              id,
            },
          },
          title,
          description,
          platform,
          price,
          condition,
          address,
          place,
          zip,
        }
      }
    `);
    if (response.status === 200 && response.data) {
      games.value.push(response.data.games_by_id);
    }
    //gamesHasLoaded.value = true;
  });

  
}

</script>
<template>
  <ion-page id="main-page">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button class="back-button">
            <ion-img :src="Back" @click="$router.go(-1)"></ion-img>
          </ion-button>
        </ion-buttons>
        <ion-title class="pixel header-title">Lagrede annonser</ion-title>
      </ion-toolbar>
    </ion-header>
    <!-- Loading screen -->
    <ion-content :fullscreen="true" class="loading" v-if="gamesHasLoaded.valueOf() == false">
      <ion-spinner></ion-spinner>
    </ion-content>
    <!-- If there are saved games -->
    <ion-content v-if="gamesHasLoaded.valueOf() == true && games.length > 0" :fullscreen="true">
      <GameCard v-for="game in games" :key="game.id" :game="game"/>
    </ion-content>
    <!-- If there are no saved games -->
    <ion-content v-if="gamesHasLoaded.valueOf() == true && games.length == 0" :fullscreen="true" class="no-games">
      <ion-text>Ingen annonser er lagret</ion-text>
    </ion-content>
  </ion-page>
</template>

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

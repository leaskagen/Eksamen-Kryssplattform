<template>
  <ion-page id="main-page">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button class="back-button">
            <ion-img :src="Back" @click="$router.go(-1)"></ion-img>
          </ion-button>
        </ion-buttons>
        <ion-title class="pixel header-title">Mine annonser</ion-title>
      </ion-toolbar>
    </ion-header>
    <!-- If user has posted any games -->
    <ion-content v-if="games.length > 0">
      <MyGameCard v-for="game in games" :key="game.id" :game="game" />
    </ion-content>
    <!-- If user has not posted any games -->
    <ion-content v-else class="no-games">
      <ion-text>Ingen annonser å vise.<br/>Trykk <a href="/new">her</a> for å legge ut en annonse</ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonImg, IonText, IonHeader, IonButton, IonToolbar, IonButtons, IonBackButton, IonTitle, onIonViewWillEnter, IonContent } from "@ionic/vue";
import { authService, directus } from "@/services/directus.service";
import { IGameByUser, IGameByUserResponse } from "@/models/IGame";
import MyGameCard from '@/components/MyGameCard.vue';
import { IUser } from "@/models/IUser";
import Back from '@/icons/back.png';
import { ref } from "vue";

const games = ref<IGameByUser[]>([]);

const user = ref<IUser>();

onIonViewWillEnter(async () => {
  // Get user details
  user.value = await authService.currentUser();
  console.log(user.value);

  fetchGames();
});

// Get game by user id from Directus
const fetchGames = async () => {
  const response = await directus.graphql.items<IGameByUserResponse>(`
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
        description,
        user_created{
            id,
        }
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
    games.value = [...response.data.games]; 
  }
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

</style>
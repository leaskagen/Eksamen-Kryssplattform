<script setup lang="ts">
import { IonButtons, IonSearchbar, IonMenuToggle, IonIcon, onIonViewWillEnter, IonMenuButton, IonRefresher, IonRefresherContent, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, RefresherCustomEvent } from '@ionic/vue';
import { directus } from '@/services/directus.service';
import { IGameResponse, IGame } from '@/models/IGame';
import GameCard from '@/components/GameCard.vue';
import { ref } from 'vue';
import { menuSharp } from 'ionicons/icons';
import SearchPixel from '@/icons/search-colored.svg';

// Store game objects
const gamesBackup = ref<IGame[]>([]);
const games = ref<IGame[]>([]);

onIonViewWillEnter(() => {
  fetchGames();
});

const refreshGameView = async (event: RefresherCustomEvent) => {
  await fetchGames();
  event.target.complete();
}

// Get games from Directus
const fetchGames = async () => {
  const response = await directus.graphql.items<IGameResponse>(`
    query {
      games {
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
    gamesBackup.value = [...response.data.games]; 
    console.log(gamesBackup.value);
    games.value = gamesBackup.value;
  }
}

function handleSearch(event: Event) {
  const query = event.target.value.toLowerCase();
  const filteredGames = gamesBackup.value.filter(game => {
    return game.title.toLowerCase().includes(query);
  });
  games.value = filteredGames;
  console.log(games.value);
}

</script>
<template>
  <ion-page id="main-page">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <!-- Menu button -->
          <ion-menu-button>
            <ion-icon :icon="menuSharp"></ion-icon>
          </ion-menu-button>
        </ion-buttons>
        <ion-title class="pixel header-title">Annonser</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <!-- Search bar -->
        <ion-searchbar @ionChange="handleSearch($event)" :search-icon="SearchPixel" placeholder="Søk" class="pixel search-style"></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="refreshGameView($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <!-- Games are listed here-->
      <GameCard v-for="game in games" :key="game.id" :game="game"/>
    </ion-content>
  </ion-page>
</template>

<style scoped>
/*
#container {
  text-align: center;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}*/

ion-searchbar ion-icon {
  width: 1.5em;
  height: 1.5em;
}

</style>

<script setup lang="ts">
import { IonButtons, IonSearchbar, IonIcon, IonRadioGroup, IonText, IonLabel, IonItem, IonList, IonRadio, onIonViewWillEnter, IonSelect, IonSelectOption, IonButton, IonMenuButton, IonRefresher, IonRefresherContent, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, RefresherCustomEvent, IonModal } from '@ionic/vue';
import { directus } from '@/services/directus.service';
import { IGameResponse, IGame } from '@/models/IGame';
import SearchPixel from '@/icons/search-colored.svg';
import GameCard from '@/components/GameCard.vue';
import { menuSharp } from 'ionicons/icons';
import { ref } from 'vue';

// Store game objects
const gamesBackup = ref<IGame[]>([]);
const games = ref<IGame[]>([]);

// Store search query
var platforms: string[] = [];
var places: string[] = [];
var conditions: string[] = [];

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
    games.value = gamesBackup.value;

    // Get all platforms, places and conditions
    games.value.forEach(game => {
      if (!platforms.includes(game.platform)) {
        platforms.push(game.platform);
      }
    });
    games.value.forEach(game => {
      if (!places.includes(game.place)) {
        places.push(game.place);
      }
    });
    games.value.forEach(game => {
      if (!conditions.includes(game.condition)) {
        conditions.push(game.condition);
      }
    });

    // Sort platforms, places and conditions alphabetically
    platforms.sort();
    places.sort();
    conditions.sort();
  }
}

// Search games by title
function handleSearch(event: Event) {
  const query = event.target.value.toLowerCase();
  const filteredGames = gamesBackup.value.filter(game => {
    return game.title.toLowerCase().includes(query);
  });
  games.value = filteredGames;
}

// Sort games
function handleSort(event: Event) {
  const sort = event.target.value;
  if (sort === 'price') {
    games.value = games.value.sort((a, b) => a.price - b.price);
  } else if (sort === 'alphabetical') {
    games.value = games.value.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === 'newest') {
    games.value = games.value.sort((a, b) => b.id - a.id);
  }
}

// Filter games by platform
function handlePlatform(event: Event) {
  const platform = event.target.value;
  if (platform === undefined) {
    games.value = gamesBackup.value;
  } else {
    const filteredGames = gamesBackup.value.filter(game => {
      return game.platform === platform;
    });
    games.value = filteredGames;
  }
}

// Filter games by place
function handlePlace(event: Event) {
  const place = event.target.value;
  if (place === undefined) {
    games.value = gamesBackup.value;
  } else {
    const filteredGames = gamesBackup.value.filter(game => {
      return game.place === place;
    });
    games.value = filteredGames;
  }
}

// Filter games by condition
function handleCondition(event: Event) {
  const condition = event.target.value;
  if (condition === undefined) {
    games.value = gamesBackup.value;
  } else {
    const filteredGames = gamesBackup.value.filter(game => {
      return game.condition === condition;
    });
    games.value = filteredGames;
  }
}

// Clear search filters
function clearFilter() {
  games.value = gamesBackup.value;
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
      <ion-toolbar >
        <div class="search-filter">
          <!-- Search bar -->
          <ion-searchbar @ionChange="handleSearch($event)" :search-icon="SearchPixel" placeholder="Søk" class="pixel search-style"></ion-searchbar>
          <!-- Filter button -->
          <ion-button id="open-modal" class="pixel" color="dark">Filter</ion-button>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="refreshGameView($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <!-- Games are listed here-->
      <GameCard v-for="game in games" :key="game.id" :game="game"/>
    </ion-content>
    <!-- Modal for filter -->
    <ion-modal ref="modal" trigger="open-modal" :initial-breakpoint="0.25" :breakpoints="[0, 0.25, 0.5, 0.75, 1]">
      <ion-content class="ion-padding">

        <!-- Sort -->
        <ion-text class="pixel modal-title">Sorter</ion-text>
        <div class="modal-section">
          <ion-list>
            <ion-item>
              <ion-select interface="popover" placeholder="Sorter søk" @ionChange="handleSort($event)">
                <ion-select-option value="alphabetical">Alfabetisk</ion-select-option>
                <ion-select-option value="price">Pris lav til høy</ion-select-option>
                <ion-select-option value="newest">Nyeste</ion-select-option>
              </ion-select>
            </ion-item>
          </ion-list>
        </div>

        <!-- Filter -->
        <ion-text class="pixel modal-title">Filter</ion-text>
        <ion-button class="empty-filter pixel button-color" @click="clearFilter()">Tøm filter</ion-button>

        <!-- Filter by Platform -->
        <div class="modal-section filter-section">
          <ion-text class="pixel modal-subtitle ">Plattform</ion-text>
          <ion-list>
            <ion-radio-group :allowEmptySelection="true" @ionChange="handlePlatform($event)">
              <ion-item v-for="platform in platforms" :key="platform">
                <ion-label>{{platform}}</ion-label>
                <ion-radio slot="end" :value="platform"></ion-radio>
              </ion-item>
            </ion-radio-group>
          </ion-list>
        </div>

        <!-- Filter by Place -->
        <div class="modal-section">
          <ion-text class="pixel modal-subtitle">Sted</ion-text>
          <ion-list>
            <ion-radio-group :allowEmptySelection="true" @ionChange="handlePlace($event)">
              <ion-item v-for="place in places" :key="place">
                <ion-label>{{place}}</ion-label>
                <ion-radio slot="end" :value="place"></ion-radio>
              </ion-item>
            </ion-radio-group>
          </ion-list>
        </div>

        <!-- Filter by Condition -->
        <div class="modal-section">
          <ion-text class="pixel modal-subtitle">Tilstand</ion-text>
          <ion-list>
            <ion-radio-group :allowEmptySelection="true" @ionChange="handleCondition($event)">
              <ion-item v-for="condition in conditions" :key="condition">
                <ion-label>{{condition}}</ion-label>
                <ion-radio slot="end" :value="condition"></ion-radio>
              </ion-item>
            </ion-radio-group>
          </ion-list>
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<style scoped>

ion-searchbar ion-icon {
  width: 1.5em;
  height: 1.5em;
}

.search-filter {
  display: flex;
  flex-direction: row;
}

ion-searchbar {
  width: 1fr;
  margin-right: 0 !important;
}

.search-filter ion-button {
  display: inline;
  width: 20%;
  height: 36px;
  margin-top: 0;
  letter-spacing: 1px;
  padding-right: 12px;
  font-size: 14px;
  text-align: center;
}

.modal-title {
  font-size: 22px;
  font-weight: 550;
  margin-bottom: 1em !important;
}

.modal-subtitle {
  font-size: 18px;
  font-weight: 550;
  margin-bottom: 10px;
}

.modal-section {
  margin-bottom: 2.5em;
}

.filter-section {
  margin-top: 1em;
}

.empty-filter {
  font-size: 16px;
  font-weight: 550;
  margin-bottom: 1em;
  letter-spacing: 0.75px;
  position: absolute;
  right: 1em;
}

</style>

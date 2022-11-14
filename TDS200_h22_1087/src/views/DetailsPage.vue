<script setup lang="ts">
import { IonButton, IonContent, IonText, IonButtons, IonHeader, IonModal, IonTextarea, IonPage, IonImg, IonTitle, IonToolbar, onIonViewWillEnter } from '@ionic/vue';
import { directus } from '@/services/directus.service';
import { IGameDetailsResponse, IGameDetails } from '@/models/IGame';
import GoogleMaps from '@/components/GoogleMaps.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { useRoute } from 'vue-router';
import { Pagination } from "swiper";
import "swiper/css/pagination";
import { ref } from 'vue';
import 'swiper/css';
import Star from '@/icons/star.png';
import StarYellow from '@/icons/star-yellow.png';
import Chat from '@/icons/chat.png';
import Back from '@/icons/back.png';
import { IFavorite, IFavoriteId, IFavoriteResponse, IFavorites } from '@/models/IFavorite';
import { authService } from '@/services/directus.service';
import { IUser } from '@/models/IUser';


const favoriteStatus = ref<boolean>(false);
const favoriteId = ref<any>();
const filePath = 'https://bi5voh2i.directus.app/assets/';

const isLoggedIn = ref(false);
const route = useRoute();

const { id } = route.params;

const game = ref<IGameDetails[]>([]);

const user = ref<IUser>();

const seller = ref<IUser>();

var chatId = ref<any>();

onIonViewWillEnter(async () => {
  checkIfLoggedIn();
  fetchGames();
  if (isLoggedIn.value) {
    user.value = await authService.currentUser();
    checkIfFavorited();
  } else {
    console.log('not logged in');
  }
});

// Check if user is logged in
const checkIfLoggedIn = async () => {
  var auth_token = localStorage.getItem('auth_token');
  if (auth_token) {
    isLoggedIn.value = true;
    console.log(`isLoggedIn: ${isLoggedIn.value}`);
  }
  else {
    isLoggedIn.value = false;
    console.log(`isLoggedIn: ${isLoggedIn.value}`);
  }
}

// Checks if the game is already favorited
const checkIfFavorited = async () => {
  const response = await directus.graphql.items<IFavorites[]>(`
    query {
      favorite_games(filter: { user_created: { id: { _eq: "${user.value?.id}" } }, games_id: { _eq: "${id}" } }) {
        id,
        user_created {
          id,
        },
        games_id,
      }
    }
  `);

  if (response.status === 200 && response.data) {
    favoriteId.value = response.data.favorite_games[0].id;
    favoriteStatus.value = true;
  }
}

// Get game by id from Directus
const fetchGames = async () => {
  const response = await directus.graphql.items<IGameDetailsResponse>(`
    query {
      games_by_id(id: ${id}) {
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
        user_created {
          id,
          first_name,
          avatar {
            id,
          },
        },
      }
    }
  `);

  if (response.status === 200 && response.data) {
    game.value = response.data.games_by_id; 
    console.log(game.value);
    
    seller.value = game.value.user_created;
    console.log(seller.value);
    chatId.value = `/chat/${seller.value.id}`;
  }
}

// Structure for new game
const favorite = ref<IFavorite>({
    games_id: '',
});

const toggleFavorite = () => {
  favoriteStatus.value = !favoriteStatus.value;
  if(favoriteStatus.value == true) {
    saveFavorite();
  } else {
    removeFavorite();
  }
}

// Add favorite to Directus
const saveFavorite = async () => {
  const response = await directus.items('favorite_games').createOne({games_id: id});
  favoriteId.value = response;
}

// Remove favorite from Directus
const removeFavorite = async () => {
  await directus.graphql.items<IFavoriteId>(`
    mutation {
      delete_favorite_games_item(id: ${favoriteId.value}) {
        id
      }
    }
  `);
}

const modules = [Pagination];

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
        <ion-title class="pixel header-title">{{ game.title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <!-- Swiper to swipe through multiple images -->
      <div class="swiper-container">
        <swiper
        :slides-per-view="1"
        :pagination="true"
        :modules="modules"
        >
          <swiper-slide v-for="(image, i) in game.images" :key="i">
            <ion-img :src="filePath + image.directus_files_id.id" class="swiper-images"/>
          </swiper-slide>
        </swiper>
      </div>
      
      <div class="game-content">
        <p class="game-title pixel">{{ game.title }}<br/></p>
        <div class="game-subtitle">
          <p class="game-price pixel">{{ game.price }} kr<br/></p>
          <div v-if="user">
            <ion-img class="favorite-img chat" :src="Chat" :router-link="chatId"></ion-img>
            <ion-img class="favorite-img" :src="favoriteStatus ? StarYellow : Star" @click="toggleFavorite()"></ion-img>
          </div>
        </div>
        
        
        <ion-text class="pixel">{{ game.description }}<br/><br/></ion-text>  
        <div class="game-info">
          
          <ion-text class="pixel">Plattform:<br/> {{ game.platform }}<br/><br/></ion-text>
          <ion-text class="pixel">Tilstand:<br/> {{ game.condition }}<br/><br/></ion-text>
          <ion-text class="pixel">Addresse:<br/> {{ game.address }}<br/> {{ game.zip }} {{ game.place }}</ion-text>

          <div class="map-container">
            <GoogleMaps></GoogleMaps> 
          </div> 
        </div>  
      </div>
      <ion-modal ref="modal" trigger="open-message" :initial-breakpoint="0.25" :breakpoints="[0, 0.25, 0.5, 0.75]">
      <ion-content class="ion-padding">
        <ion-text class="pixel">Send besked til sælger</ion-text>
        <ion-textarea class="message-textarea" placeholder="Skriv din besked her"></ion-textarea>
        <ion-button class="send-message-button">Send besked</ion-button>
      </ion-content>
    </ion-modal>
    </ion-content>
    
  </ion-page>
</template>

<style scoped>

.game-title {
  font-size: 24px;
  margin-top: 0;
  margin-bottom: 0.5em !important;

}

.game-info {
  background-color: #9bfc96;
  border-radius: 5px;
  padding: 1em;
  display: flex;
  flex-direction: column;
}
/*
.game-info ion-text:last-of-type {
  padding-left: 1em !important;
}
*/
.game-price {
  font-weight: bold;
  font-size: 20px;
  width: 100%;
}

ion-text {
  font-size: 16px;
}

.game-content {
  padding: 1em;
}

.map-container {
  margin-top: 1em;
  display: flex;
  justify-content: center;
  width: 100%;
}

/*
ion-title {
  display: block;
  position: relative;
  text-align: left;
  width: 100vw;
  padding-bottom: 1em !important;
  --ion-padding-bottom: 1em !important;
  --padding-bottom: 1em   !important;
}
*/
.swiper-images {
  height: 300px;
  width: auto;
  object-fit: contain;
  position: relative;
}

swiper-slide {
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 300px;
}

.back-button {
  width: 35px;
  height: 35px;
  object-fit: cover;
  margin: 0;
}
.swiper-container {
  width: 100%;
  height: 300px;
  margin: 0;
  padding: 0;
  background-image: url("@/images/menu-background.svg");
  background-repeat: repeat;
  background-size: 100%;
  border-bottom: solid 1px #f4f5f8;
}

.game-subtitle {
  display: flex;
  justify-content: space-between;
  height: 35px;
  width: 100%;
  align-items: center;
  margin-bottom: 1em;
}

.game-subtitle div {
  display: flex;
  flex-direction: row;
}

.favorite-img {
  width: 35px;
  height: 35px;
  margin-right: 1.5em;
}

.chat {
  position: relative;
  top: 2px;
}

</style>
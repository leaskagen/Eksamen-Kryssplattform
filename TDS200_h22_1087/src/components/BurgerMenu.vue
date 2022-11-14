<template>
  <ion-menu content-id="main-page" @ion-will-open="checkIfLoggedIn()">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-menu-toggle>
          <ion-title class="pixel" router-link="/home">Retro Trader</ion-title>
        </ion-menu-toggle>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <!-- Menu items if user is not logged in -->
      <ion-list v-if="!isLoggedIn">
        <ion-item>
          <ion-menu-toggle router-link="/login">
            <ion-text>Logg inn</ion-text>
          </ion-menu-toggle>
        </ion-item>
      </ion-list>
      <!-- Menu items if user is logged in -->
      <div class="menu-logged-in" v-else>
        <ion-list>
          <ion-item>
            <ion-menu-toggle router-link="/new">
              <ion-text class="pixel"><ion-img class="menu-icons" id="first-icon" :src="Note"></ion-img> Legg ut annonse</ion-text>
            </ion-menu-toggle>
          </ion-item>
          <ion-item>
            <ion-menu-toggle @click="$router.push('/myGames')">
              <ion-text class="pixel"><ion-img class="menu-icons" :src="Folder"></ion-img> Mine annonser</ion-text>
            </ion-menu-toggle>
          </ion-item>
          <ion-item>
            <ion-menu-toggle router-link="/saved">
              <ion-text class="pixel"><ion-img class="menu-icons chat-icon" :src="Star"></ion-img> Lagrede annonser</ion-text>
            </ion-menu-toggle>
          </ion-item>
          <ion-item>
            <ion-menu-toggle router-link="/messages">
              <ion-text class="pixel"><ion-img class="menu-icons chat-icon" :src="Chat"></ion-img> Meldinger</ion-text>
            </ion-menu-toggle>
          </ion-item>
        </ion-list>
        <ion-list>
          <ion-item >
            <ion-menu-toggle router-link="/profile">
              <ion-text class="pixel"><ion-img class="menu-icons" :src="User"></ion-img> Min profil</ion-text>
            </ion-menu-toggle>
          </ion-item>
          <ion-item>
            <ion-menu-toggle router-link="/login" @click="logout()">
              <ion-text class="pixel"> Logg ut</ion-text>
            </ion-menu-toggle>
          </ion-item>
        </ion-list>
      </div> 
    </ion-content>
  </ion-menu>
</template>

<script setup lang="ts">
import { IonContent, IonImg, IonMenuToggle, IonText, IonList, IonItem, IonHeader,  IonTitle, IonToolbar, onIonViewDidEnter, IonMenu, onIonViewWillEnter } from '@ionic/vue';
import { authService } from '@/services/directus.service';
import User from '@/icons/profile-avatar.png';
import Folder from '@/icons/folder.png';
import Star from '@/icons/star.png';
import Note from '@/icons/note.png';
import Chat from '@/icons/chat.png';
import { ref } from 'vue';

const isLoggedIn = ref(false);

// Check if user is logged in
const checkIfLoggedIn = async () => {
  var auth_token = localStorage.getItem('auth_token');
  if (auth_token) {
    isLoggedIn.value = true;
  }
  else {
    isLoggedIn.value = false;
  }
}

// Logout user and clears all tokens
const logout = async () => {
  await authService.logout();
}

</script>

<style scoped>

.test {
  background-color: aqua;
  height: 30px;
  width: 30px;
}

ion-content, .inner-scroll {
  --background: url('@/images/menu-background.svg') no-repeat center/cover fixed !important;
}

ion-item, ion-list {
--ion-background-color: rgb(255, 255, 255, 0.49)!important;
}

ion-text {
  font-size: 18px !important;
}

ion-list {
box-shadow: 1px -1px 21px 22px rgba(255, 255, 255,0.75);
-webkit-box-shadow: 1px -1px 21px 22px rgba(255, 255, 255,0.75);
-moz-box-shadow: 1px -1px 21px 22px rgba(255, 255, 255,0.75);
}

.menu-icons {
  display: inline-block;
  position: relative;
  top: 5px;
  width: 30px;
  height: 30px;
}

#first-icon {
  width: 25px;
  height: 25px;
  margin-left: 5px;
}

.menu-logged-in {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 5em;
}

.chat-icon {
  width: 25px;
  height: 25px;
  margin-left: 2.5px;
  margin-right: 2.5px;
}

</style>
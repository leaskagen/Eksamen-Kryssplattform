<template>
    <ion-page id="main-page">
        <ion-header :translucent="true">
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-button class="back-button">
                    <ion-img :src="Back" @click="$router.go(-1)"></ion-img>
                </ion-button>
            </ion-buttons>
            <ion-title class="pixel header-title">Meldinger</ion-title>
        </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-text>Ingen meldinger</ion-text>
        </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonText, IonImg, IonButton, onIonViewWillEnter, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, RefresherCustomEvent, onIonViewDidLeave } from '@ionic/vue';
import Back from '@/icons/back.png';

</script>

<style scoped>

.back-button {
    width: 35px;
    height: 35px;
    object-fit: cover;
    margin: 0;
  }
</style>

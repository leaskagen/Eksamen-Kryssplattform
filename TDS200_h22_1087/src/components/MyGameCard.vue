<script setup lang="ts">
import { IonImg, toastController, IonButton, IonButtons, alertController, IonCard, IonCardHeader, IonCardTitle } from '@ionic/vue';
import { directus } from '@/services/directus.service';
import Edit from '@/icons/edit-button.png';
import Trash from '@/icons/trash-bin.png';
import { defineProps } from 'vue';

const cardId = "card-";

interface Props {
  game: {
    id: string;
    images: [{
      id: string;
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

var gameCard: any;

const filePath = 'https://bi5voh2i.directus.app/assets/';

const presentAlert = async (game: string) => {
  gameCard = document.getElementById(cardId+game);

  // Ask user if they want to delete game
  const alert = await alertController.create({
    header: 'Er du sikker på at du vil slette denne annonsen?',
    buttons: [
      {
        // If user clicks cancel, do nothing
        text: 'Avbryt',
        handler: () => {
          return;
        },
      },
      {
        // If user clicks delete, delete game
        text: 'Slett',
        handler: () => {
          deleteGame(game);
        },
      },
    ],
  });
  // Show alert
  await alert.present();
};

// Delete game from Directus
const deleteGame = async (game: string) => {
  await directus.graphql.items<any>(`
    mutation {
      delete_games_item(id: ${game}) {
        id
      }
    }
  `);

  const toast = await toastController.create({
    message: 'Annonsen er slettet',
    duration: 2000,
    color: 'danger'
  });

  toast.present();

  // Hide game card
  gameCard.style.display = "none";
}

</script>

<template>
  <ion-card :id="cardId+game.id" ref="gameCard">
    <ion-img :src="filePath + game.images[0].directus_files_id.id" :router-link="'/details/' + game.id"/>
    <ion-card-header :router-link="'/details/' + game.id">
      <ion-card-title class="pixel card-title"  size="small">{{ game.title }}</ion-card-title>
    </ion-card-header>
    <div class="card-content">
      <ion-buttons>
        <!-- Delete button -->
        <ion-button fill="clear" class="pixel" @click="presentAlert(game.id)"><ion-img :src="Trash" class="icons"/>Slett</ion-button>
      </ion-buttons>
    </div>
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
  justify-content: flex-end;
  padding: 0 1em 1em 0;
}

ion-card-title {
  font-size: 20px;
  margin-bottom: 0;
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

ion-button {
  color: black;
}

</style>
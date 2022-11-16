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
        <!-- Loading screen -->
        <ion-content :fullscreen="true" class="loading" v-if="chatsHasLoaded.valueOf() == false">
            <ion-spinner></ion-spinner>
        </ion-content>
        <!-- If there are no chats -->
        <ion-content :fullscreen="true" v-if="!chats && chatsHasLoaded.valueOf() == true">
            <ion-text>Ingen meldinger</ion-text>
        </ion-content>
        <ion-content :fullscreen="true" v-if="chats && chatsHasLoaded.valueOf() == true">
            <ion-list>
                <!-- List all people you have chatted with -->
                <ion-item v-for="chat in chats" :key="chat" :router-link="`/chat/${chat.id}`" class="messages-item">
                    <ion-img v-if="chat.avatar.id !== null" :src="filePath+chat.avatar.id"></ion-img>
                    <ion-text class="pixel">
                        {{ chat.first_name }}
                    </ion-text>
                </ion-item>
            </ion-list>
        </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonText, IonImg, IonButton, IonItem, IonSpinner, IonList, onIonViewWillEnter, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, onIonViewDidLeave } from '@ionic/vue';
import { IMessage, IMessageResponse, IChat } from '@/models/IMessage';
import { directus, authService } from '@/services/directus.service';
import { IUser } from '@/models/IUser';
import Back from '@/icons/back.png';
import { ref } from 'vue';

var chats = ref<IChat[]>([]);
const messages = ref<IMessage[]>([]);

const user = ref<IUser>();

const filePath = 'https://bi5voh2i.directus.app/assets/';

const chatsHasLoaded = ref(false);

onIonViewWillEnter( async () => {
    // Get current users' details
    user.value = await authService.currentUser();
    await fetchMessages();
});

onIonViewDidLeave( async () => {
    chats.value = [];
});

const fetchSeller = async (id: string) => {
    // Get all users that is not current user
    if (!chats.value.includes(id) && id != user.value.id) {
        const response = await directus.graphql.system(`
            query {
                users_by_id(id: "${id}") {
                    id
                    first_name
                    avatar {
                        id
                    }
                }
            }
        `);
        if (response.status === 200 && response.data) {
            chats.value.push(response.data.users_by_id);
        }
    }
}

const fetchMessages = async () => {
    // Get all messages that current user has sent or received
    const response = await directus.graphql.items<IMessageResponse>(`
        query {
            messages (filter: {
                _or:
                    [
                        { user_created: { id: { _eq: "${user.value.id}" } } }, 
                        { sent_to: { _eq: "${user.value.id}" } }    
                    ]
                }
            ){
                message_text
                id
                sent_to
                user_created {
                id
            }
	    }
    }`);
    if (response.status === 200 && response.data) {
        messages.value = [...response.data.messages];

        // Get all users that current user has chatted with
        messages.value.forEach( async (message: IMessageResponse) => {
            if(!chats.value.includes(message.sent_to)) {
                await fetchSeller(message.sent_to);
            } else if ( !chats.value.includes(message.user_created.id)) {
                await fetchSeller(message.user_created.id);
            }
        });
    }
    chatsHasLoaded.value = true;
}

</script>

<style scoped>

.back-button {
    width: 35px;
    height: 35px;
    object-fit: cover;
    margin: 0;
}

ion-item {
    margin-top: 1em;
    --padding-bottom: 1em !important;
}

ion-item ion-img {
    width: 65px;
    height: 65px;
    object-fit: cover;
    margin: 0;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 1em;
}

ion-item ion-text {
    margin-left: 1em;
    font-size: 24px;
}

ion-spinner {
  position: fixed !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

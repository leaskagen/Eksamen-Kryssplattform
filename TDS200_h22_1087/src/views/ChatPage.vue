<template>
    <ion-page id="main-page">
        <ion-header :translucent="true">
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-button class="back-button">
                    <ion-img :src="Back" @click="$router.go(-1)"></ion-img>
                </ion-button>
            </ion-buttons>
            <ion-title class="pixel header-title">{{seller.first_name}}</ion-title>
        </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <div class="messages-container">
                <div class="messages" v-for="message in messages" :key="message">
                    <div class="message" v-if="message.sent_to == seller.id">
                        <ion-text>{{message.message_text}}</ion-text>
                    </div>
                    <div class="message recieved" v-else>
                        <ion-text>{{message.message_text}}</ion-text>
                        </div>
                </div>
            </div>
            <ion-list class="message-textarea" lines="none">
                <ion-item>
                    <ion-textarea :placeholder="`Send melding til ${seller.first_name}!`" :autoGrow="true" v-model="newMessage.messageText"></ion-textarea>
                    <ion-button class="send-button pixel" @click="sendMessage()" color="dark">Send</ion-button>
                </ion-item>
            </ion-list>
        </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonText, IonTextarea, IonList, IonItem, IonImg, IonButton, onIonViewWillEnter, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { IMessage } from '@/models/IMessage';
import { defineProps } from 'vue';
import Back from '@/icons/back.png';
import { useRoute } from 'vue-router';
import { directus, authService } from '@/services/directus.service';
import { IUser } from '@/models/IUser';
import { ref } from 'vue';

const route = useRoute();

const { id } = route.params;

const seller = ref<any>({});

    const user = ref<IUser>();
//const messageText = ref<string>('');

const messages = ref<IMessage[]>([]);

    const newMessage = ref<any>({
    messageText: '',
    sentTo: '',
});

onIonViewWillEnter( async () => {
    user.value = await authService.currentUser();
    console.log(id);
    await fetchSeller();
    fetchMessages();
  
});

const fetchSeller = async () => {
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
    seller.value = response.data.users_by_id; 
    console.log(seller.value);
  }
}

const sendMessage = async () => {
    //newMessage.value.messageText = 
    if (newMessage.value.messageText == '') {
        console.log('empty');
    }
    const response = await directus.items('messages').createOne({
        message_text: newMessage.value.messageText,
        sent_to: seller.value.id,
    });

    console.log(response);
    messages.value.push(response);
}

const fetchMessages = async () => {
    const response = await directus.graphql.items<IMessage>(`
        query {
            messages (filter: {
                _or:
                    [
                        
                            
                                { sent_to: { _eq: "${seller.value.id}" } }, { user_created: { id: { _eq: "${user.value.id}" } } }, 

                            
                        
                        
                                { sent_to: { _eq: "${user.value.id}" } }, { user_created: { id: { _eq: "${seller.value.id}" } } }

                            
                    ]
                }) {
                message_text
                id
                sent_to
	    }
    }`);
    if (response.status === 200 && response.data) {
        messages.value = [...response.data.messages];
       
        console.log(messages.value);
    }
}



</script>

<style scoped>

.back-button {
    width: 35px;
    height: 35px;
    object-fit: cover;
    margin: 0;
  }

.messages-container {
    width: 100%;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-bottom: 100px;
}

.messages {
    width: 100%;
    display: flex;
    justify-content: flex-end;
}

.message {
    padding: 10px;
    width: 60%;
    border-bottom: solid 1px #f4f5f8;
    border-radius: 10px;
    background-color: #f4f5f8;
    margin: 1em;
}

.recieved {
    
    background-color: #9bfc96;
    margin-right: 40%;
}

.message-textarea {
    --background-color: #9bfc96;
    --ion-list-background-color: #9bfc96;
    --ion-item-background-color: #9bfc96;
    --ion-background-color: #9bfc96;
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 1em 0.5em;
    box-shadow: 0px -1px 16px -4px rgba(0,0,0,0.39);
-webkit-box-shadow: 0px -1px 16px -4px rgba(0,0,0,0.39);
-moz-box-shadow: 0px -1px 16px -4px rgba(0,0,0,0.39);
}
ion-textarea {
    height: auto;
    min-height: 38px;
    border: solid 1px rgba(124, 124, 124, 0.349);
    border-radius: 10px;
    padding: 0 0.5em;
    background-color: rgba(255, 255, 255, 0.356);

}

.send-button {
    letter-spacing: 1px;
    font-size: 0.9em;
    height: 2.5em;
    margin-left: 1em;
}
</style>

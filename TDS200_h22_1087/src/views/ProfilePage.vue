<template>
    <ion-page id="main-page">
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button class="back-button">
                        <ion-img :src="Back" @click="$router.go(-1)"></ion-img>
                    </ion-button>
                </ion-buttons>
                <ion-title class="pixel header-title">Min profil</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <!-- Profile image -->
            <div class="image-container" v-if="!editMode">
                <ion-img v-if="user?.avatar" :src="filePath + user?.avatar" class="avatar"></ion-img>
                <div v-else class="avatar">Ingen Profilbilde</div>
            </div>

            <!-- Edit profile image -->
            <div class="image-container" v-else>
                <p id="image-text">Last opp<br/>profilbilde</p>
                <ion-img v-if="user?.avatar" :src="imagePreview" class="avatar-edit-mode avatar" @click="triggerCamera()"></ion-img>
                <div v-else class="avatar-edit-mode avatar" @click="triggerCamera()"></div>
            </div>
            
            <!-- Profile information -->
            <div v-if="!editMode">
                <ion-item lines="none">
                    <ion-text><ion-img :src="User" class="icon"/>{{ user?.first_name }}<br/></ion-text>
                </ion-item>
                <ion-item lines="none">
                    <ion-text><ion-img :src="Mail" class="icon"/> {{ user?.email}}<br/></ion-text>
                </ion-item>
            </div>

            <!-- Edit profile information-->
            <div v-else>
                <ion-item>
                    <!-- First name input -->
                    <ion-label>Fornavn:</ion-label>
                    <ion-input v-model="newUser.first_name" :placeholder="user?.first_name"></ion-input>
                </ion-item>
                <ion-item>
                    <!-- Email input -->
                    <ion-label>Email:</ion-label>
                    <ion-input v-model="newUser.email" :placeholder="user?.email"></ion-input>
                </ion-item>
            </div>
            
            <!-- Buttons -->
            <ion-item lines="none">
                    <ion-button v-if="!editMode" @click="toggleEditMode()" class="button-color pixel">Rediger</ion-button>
                <div v-else>
                    <ion-button @click="toggleEditMode(), resetPreview()" color="light" class="pixel">Avbryt</ion-button>
                    <ion-button @click="updateUser()" class="button-color pixel">Lagre</ion-button>
                </div>
            </ion-item>
        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import { IonPage, toastController, onIonViewWillEnter, IonTitle, IonButton, IonItem, IonLabel, IonInput, IonHeader, IonToolbar, IonButtons, IonContent, IonText, IonImg } from '@ionic/vue';
import { authService, directus } from '@/services/directus.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { IUser } from '@/models/IUser';
import User from '@/icons/users.png';
import Mail from '@/icons/mail.png';
import Back from '@/icons/back.png';
import { ref } from 'vue';

// Toggle between edit mode and normal mode
const editMode = ref(false);
const toggleEditMode = () => {
    editMode.value = !editMode.value;
}

const filePath = 'https://bi5voh2i.directus.app/assets/'

const imagePreview = ref<string>('');

const user = ref<IUser>();

// New user information
const newUser = ref<IUser>({
    id: '',
    first_name: '',
    email: '',
    avatar: '',
});


onIonViewWillEnter(async () => {
    getUserDetails();
});

// Get user information
const getUserDetails = async () => {
    user.value = await authService.currentUser();
    imagePreview.value = filePath + user.value?.avatar;
}

// Update user information
const updateUser = async () => {

    // If user has uploaded a new image
    if (newUser.value.avatar){
        const formData = new FormData();
        const response = await fetch(newUser.value.avatar);
        const imageBlob = await response.blob();
        formData.append('file', imageBlob);
        const fileUpload = await directus.files.createOne(formData);

        // Image upload was successful
        if(fileUpload){
            newUser.value.avatar = fileUpload.id;
        }

    } else {
        // If user has not uploaded a new image
        newUser.value.avatar = user.value?.avatar;
    }
        
    // If user has not changed any information
    if(newUser.value.first_name == ''){
        newUser.value.first_name = user.value.first_name;
    }
    if(newUser.value.email == ''){
        newUser.value.email= user.value.email;
    }

    // Update user information in directus
    await directus.users.me.update<IUser>({
        first_name: newUser.value.first_name,
        email: newUser.value.email, 
        avatar: newUser.value.avatar,
    });

    const toast = await toastController.create({
        message: 'Profilen din er oppdatert',
        duration: 2000,
        color: 'success',
    });
    toast.present();

    // Update user information and turn off edit mode
    getUserDetails();
    toggleEditMode();
}

// Trigger camera
const triggerCamera = async () => {
    console.log('triggerCamera');
    const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri
    });

    // If photo was taken
    if (photo.webPath){

        // Add photo to new user and preview
        newUser.value.avatar = photo.webPath;
        imagePreview.value = newUser.value.avatar;
    }
};

// Reset image preview in edit mode
const resetPreview = () => {
    imagePreview.value = filePath + user.value?.avatar;
}
</script>
<style scoped>

.image-container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
}

.image-container > div {
    height: 200px;
    width: 200px;
    object-fit: cover;
    background-color: #f4f5f8;
    border: dashed 2px grey;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar {
    height: 200px;
    width: 200px;
    object-fit: cover;
    border-radius: 10px !important;
    overflow: hidden;
    margin: 0;
}

.avatar-edit-mode {
    filter: opacity(25%);
    position: relative;
    border: dashed 2px grey;
}

#image-text {
    position: fixed !important;
    text-align: center;
}
.icon {
    display: inline-block;
    position: relative;
    top: 2.5px;
    width: 20px;
    height: 20px;
    margin-right: 5px;
}

ion-button {
    margin-top: 2.5em;
    height: 40px;
    width: 125px;
    font-size: 18px;
    letter-spacing: 0.5px;
}

.back-button {
  width: 35px;
  height: 35px;
  object-fit: cover;
  margin: 0;
}

</style>
<script setup lang="ts">
import { IonPage, IonHeader, IonText, toastController, IonToolbar, IonImg, IonButtons, IonButton, IonItem, IonLabel, IonInput, IonTextarea, IonContent, IonTitle } from '@ionic/vue';
import { Camera, CameraResultType } from '@capacitor/camera';
import { directus } from '@/services/directus.service';
import Photo from '@/icons/photo-camera-grey.png';
import { INewGame } from '@/models/IGame';
import { useRouter } from 'vue-router';
import Delete from '@/icons/close.png';
import Back from '@/icons/back.png';
import { ref } from 'vue';

const router = useRouter();

// Structure for new game
const newGame = ref<INewGame>({
    title: '',
    description: '',
    platform: '',
    price: 0,
    condition: '',
    address: '',
    place: '',
    zip: '',
    images: [{ directus_files_id: { id: '' } }],
});

// When a game is successfully created
const onSuccess = () => {
    router.push('/home');

    // Reset newGame
    newGame.value = {
        title: '',
        description: '',
        platform: '',
        price: 0,
        condition: '',
        address: '',
        place: '',
        zip: '',
        images: [{ directus_files_id: { id: '' } }],
    };
};

const triggerCamera = async () => {
    // Opens camera
    const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri
    });

    // If image is taken or uploaded
    if (photo.webPath){
        // Add new image to newGame
        newGame.value.images.push({directus_files_id: {id: photo.webPath}});
    }
};

// Remove image from newGame
const removeImage = (index: number) => {
    newGame.value.images.splice(index, 1);
};

// Saves Images ID for directus
var newGameImages = ref<any>([]);

const postNewGame = async () => {

    // Checks if images are added
    if(newGame.value.images.length == 1){
        toastController.create({
            message: 'Annonsen må ha minst ett bilde',
            duration: 2000,
            color: 'warning'
        }).then(toast => toast.present());
        return;

    // Checks if all fields are filled
    } else if (!newGame.value.title || !newGame.value.description || !newGame.value.platform || !newGame.value.price || !newGame.value.condition || !newGame.value.address || !newGame.value.place || !newGame.value.zip) {
        
        toastController.create({
            message: 'Alle felt må være utfylt!',
            duration: 2000,
            color: 'warning'
        }).then(toast => toast.present());
        return;
    
    // Checks if zip code is valid
    } else if (newGame.value.zip.length > 4 || newGame.value.zip.length < 4 || isNaN(Number(newGame.value.zip))) {
        toastController.create({
            message: 'Postnummer er ugyldig',
            duration: 2000,
            color: 'warning'
        }).then(toast => toast.present());
        return;

    // Checks if price is valid
    } else if (newGame.value.price == 0 || newGame.value.price < 0 || newGame.value.price.toString.length > 6 || isNaN(Number(newGame.value.price))) {
        toastController.create({
            message: 'Pris må være mellom 1 og 999.999 kr',
            duration: 2000,
            color: 'warning'
        }).then(toast => toast.present());
        return;

    // If image(s) are uploaded and all fields are filled, post new game
    } else {

        try {
            var imageIDs = [];

            // Convert images to blobs
            const formData = new FormData();
            for (let i = 0; i < newGame.value.images.length; i++) {
                if(newGame.value.images[i].directus_files_id.id){
                    const response = await fetch(newGame.value.images[i].directus_files_id.id);
                    const imageBlob = await response.blob();
                    formData.append('file', imageBlob, 'image' + i + '.jpg');
                } else {
                    // Removes empty image objects
                    console.log('removed empty image object');
                }
            }
            // Upload images to Directus
            const fileUpload = await directus.files.createOne(formData);

            if(fileUpload) {
                if(fileUpload.length > 0) {
                    for (let i = 0; i < fileUpload.length; i++) {
                        imageIDs.push(fileUpload[i].id);
                    }   
                } else {
                    imageIDs.push(fileUpload.id);
                }

                // Counts the number of images
                imageIDs.forEach(image => {
                    newGameImages.value.push({directus_files_id: {id: image}});
                });

                // Upload game to Directus
                await directus.items('games').createOne({
                    title: newGame.value.title,
                    description: newGame.value.description,
                    platform: newGame.value.platform,
                    price: newGame.value.price,
                    condition: newGame.value.condition,
                    address: newGame.value.address,
                    place: newGame.value.place,
                    zip: newGame.value.zip,
                    images: newGameImages.value,
                });
            }

            const toast = await toastController.create({
                message: 'Annonsen er publisert',
                duration: 2000,
                color: 'success'
            });

            toast.present();
            onSuccess();

        } catch (error) {
            const toast = await toastController.create({
                message: 'Kunne ikke publisere annonsen',
                duration: 2000,
                color: 'danger'
            });

            toast.present();
            console.log(error);
        }
    }
}

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
                <ion-title class="pixel header-title">Ny annonse</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <div class="camera-section">
                <!-- Upload image button -->
                <ion-button @click="triggerCamera()" class="camera-button" color="light"> 
                    <div class="camera-button-content">
                        <ion-img :src="Photo"/><br/>
                        <ion-text class="pixel">Last opp bilder</ion-text>
                    </div>
                </ion-button>
                <!-- Preview images -->
                <div class="images-container" v-if="newGame.images.length > 1">
                    <div v-for = "image in newGame.images" :key="image.directus_files_id.id" class="image-wrapper" @click="removeImage(newGame.images.indexOf(image))">
                        <img v-if="image.directus_files_id.id" :src="Delete" class="delete-image"/>
                       <img v-if="image.directus_files_id.id" :src="image.directus_files_id.id"  class="image-preview" /> 
                    </div>
                </div>
            </div>
            <ion-item>
                <!-- Title input -->
                <ion-label position="floating" class="pixel">Tittel</ion-label>
                <ion-input v-model="newGame.title" class="pixel"></ion-input>
            </ion-item>
            <ion-item>
                <!-- Description input -->
                <ion-label position="floating" class="pixel">Beskrivelse</ion-label>
                <ion-textarea v-model="newGame.description" class="pixel"></ion-textarea>
            </ion-item>
            <ion-item>
                <!-- Platform input -->
                <ion-label position="floating" class="pixel">Plattform</ion-label>
                <ion-input v-model="newGame.platform" class="pixel"></ion-input>
            </ion-item>
            <div class="price-condition-input">
                <ion-item class="price-input">
                    <!-- Price input -->
                    <ion-label position="floating" class="pixel">Pris</ion-label>
                    <ion-input v-model="newGame.price" class="pixel" :maxlength="6"></ion-input>
                </ion-item>
                <ion-item>
                    <!-- Condition input -->
                    <ion-label position="floating" class="pixel">Tilstand</ion-label>
                    <ion-input v-model="newGame.condition" class="pixel"></ion-input>
                </ion-item>
            </div>
            <ion-item>
                <!-- Address input -->
                <ion-label position="floating" class="pixel">Adresse</ion-label>
                <ion-input v-model="newGame.address" class="pixel"></ion-input>
            </ion-item>
            <div class="zip-input">
                <ion-item class="zip-input-field">
                    <!-- Zip input -->
                    <ion-label position="floating" class="pixel">Post nr.</ion-label>
                    <ion-input v-model="newGame.zip" class="pixel" :minlength="4" :maxlength="4" ></ion-input>
                </ion-item>
                <ion-item>
                    <!-- Place input -->
                    <ion-label position="floating" class="pixel">Sted</ion-label>
                    <ion-input v-model="newGame.place" class="pixel"></ion-input>
                </ion-item>
            </div>
            <!-- Publish button -->
            <ion-button @click="postNewGame()" class="button-color pixel">Publiser annonse</ion-button>
        </ion-content>
    </ion-page>
</template>

<style scoped>
.camera-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.camera-button {
    width: 90%;
    height: 6em;
    border-radius: 10px;
    border: dashed 2px rgb(124, 124, 124);
    display: flex;
    flex-direction: column;
}

.empty-images {
    height: 0;
}
.camera-button button::after {
    --border-color: #000;
}

.camera-button-content {
    color: rgb(124, 124, 124);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0;
}

.images-container {
    padding: 1em;
    display: flex;
    flex-direction: row;
    gap: 1em;
    overflow-x: scroll;
}

.image-preview {
    height: 75px;
    opacity: 0.5;
}

.zip-input{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.zip-input-field, .price-input {
    width: 125px;
}

ion-button {
    width: max-content;
    margin: 2em 1em;
}

.back-button {
  width: 35px;
  height: 35px;
  object-fit: cover;
  margin: 0;
}

.delete-image {
    position: absolute;
    opacity: 0.5;
    width: 30px;
    height: 30px;
    object-fit: cover;
    margin: 0;
    z-index: 1;
}

.image-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}

.price-condition-input {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

</style>
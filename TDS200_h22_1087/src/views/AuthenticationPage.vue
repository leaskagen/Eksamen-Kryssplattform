<script setup lang="ts">
import { IonButton, IonText, IonContent, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonToggle, IonCard, toastController, IonTitle } from '@ionic/vue';
import { authService } from '@/services/directus.service';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

// The user can toggle between login and register mode in the form to show/hide additional fields
const inRegisterMode = ref(false);
const inGameMode = ref(false);

// Provides two-way data binding between Vue and the input fields in the form
const userDetails = ref({
    firstName: '',
    email: '',
    password: ''
});

const login = async () => {
    try {
        await authService.login(userDetails.value.email, userDetails.value.password);
        router.push('/home');
    } catch (error) {
        toastController.create({
            message: 'Feil email eller passord',
            duration: 2000
        }).then(toast => toast.present());
    }
}

const register = async () => {
    try {
        await authService.register(userDetails.value.firstName, userDetails.value.email, userDetails.value.password);
        await login();
    } catch (error) {
        toastController.create({
            message: 'Det er allerede registrert en bruker med denne emailen',
            duration: 2000
        }).then(toast => toast.present());
    }
} 

// Secret Dino game!
var dino: any;
var cactus: any;
let gameOverTitle: any;
let interval: any;
let score: any;

var scoreCount= 0;

// Makes the dino jump
function jump(){

    cactus = document.getElementById('cactus');
    dino = document.getElementById('dino');
    // Check location of dino and cactus
    let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue('top'));
    let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue('left'));
    // Check if dino is dead
    if(cactusLeft < 35 && cactusLeft > 0 && dinoTop >= 145){
        // Game over
        return;
    } else {
        // Add to score count
        score = document.getElementById("score");
        scoreCount += 1;
        score.innerHTML = scoreCount;
        dino = document.getElementById('dino');
        // If dino is not already jumping, jump
        if(dino?.classList != 'jump'){
            dino.classList.add('jump');
        }
        setTimeout(function(){
            dino?.classList.remove('jump');
        }, 500);
    }
}

// Checks if the dino is touching the cactus
function isAlive(){
    if(inGameMode.value == false){
        interval = setInterval(function(){
            cactus = document.getElementById('cactus');
            dino = document.getElementById('dino');
            gameOverTitle = document.getElementById("game-title");
            // Check location of dino and cactus
            let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue('top'));
            let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue('left'));
            // If dino and cactus are touching, game over
            if(cactusLeft < 35 && cactusLeft > 0 && dinoTop >= 145){
                dino.style.animationPlayState = 'paused';
                cactus.style.animationPlayState = 'paused';
                gameOverTitle.style.display = 'block';
            }
        }, 10);
    } else {
        // Clear the interval when game is not played
        clearInterval(interval);
        scoreCount = 0;
    }
}

</script>
    
<template>
    <ion-page id="main-page">
        <ion-content>
            <ion-list lines="none">
                <ion-list-header>
                    <ion-label class="pixel">Retro Trader</ion-label>
                </ion-list-header>
                <!-- Game screen -->
                <ion-card class="input-screen" id="dino-screen" v-if="inGameMode">
                    <div class="game-screen">
                        <ion-text class="pixel score-board">Score: <span id="score" ref="score">0</span></ion-text>
                        <ion-title class="pixel game-title" id="game-title" ref="game-title">Game Over</ion-title>
                        <div class="dino" id="dino" ref="dino"></div>
                        <div class="cactus" id="cactus" ref="cactus"></div>
                    </div>
                </ion-card>
                <!-- Login screen -->
                <ion-card class="input-screen" id="login-screen" v-else>
                    <ion-item v-if="inRegisterMode" lines="none">
                        <ion-label class="label-mild pixel" position="floating">Fornavn</ion-label>
                        <ion-input v-model="userDetails.firstName" class="pixel"></ion-input>
                    </ion-item>

                    <ion-item lines="none">
                        <ion-label class="label-mild pixel" position="floating">Email</ion-label>
                        <ion-input type="email" v-model="userDetails.email" class="pixel"></ion-input>
                    </ion-item>

                    <ion-item lines="none">
                        <ion-label class="label-mild pixel" position="floating">Passord</ion-label>
                        <ion-input type="password" v-model="userDetails.password" class="pixel"></ion-input>
                    </ion-item>
                </ion-card>
                <!-- Toggle buttons -->
                <ion-item lines="none" class="toggle-container">
                    <div class="toggles">
                        <ion-label class="label-mild pixel">Ny bruker</ion-label>
                        <ion-toggle color="dark" @ion-change="inRegisterMode = !inRegisterMode"></ion-toggle>
                    </div>
                    <div class="toggles">
                        <ion-label class="label-mild pixel">Game mode</ion-label>
                        <ion-toggle color="dark" @ion-change="inGameMode = !inGameMode" @click="isAlive()"></ion-toggle>
                    </div>
                </ion-item>
            </ion-list>
            <!-- Register button -->
            <ion-button v-if="inRegisterMode" @click="register()" class="button-auth pixel" fill="solid" color="light" size="default">
                Registrer
            </ion-button>
            <!-- Login button -->
            <ion-button v-else @click="login()" class="button-auth pixel" fill="solid" color="light" size="default">
                Logg inn
            </ion-button>
            <!-- Jump button -->
            <ion-button @click="jump()" class="button-jump pixel" color="warning" >
                Jump
            </ion-button>
        </ion-content>
    </ion-page>
</template>
    
<style scoped>

.score-board {
    position: absolute;
    top: 0;
    right: 0;
    margin: 10px;
}

ion-page {
    margin: auto;
}

ion-list-header {
    text-align: center;
    font-size: 2em;
}

ion-content {
    --ion-background-color: #85FF83;
    display: flex;
}

.input-screen {
    --ion-item-background: #dbd2bd;
    border-radius: 5px;
    width: 85%;
    height: 250px;
    margin: auto;
    box-shadow: rgb(134, 133, 133) 3px 3px 6px 0px inset, rgba(185, 185, 185, 0.795) -3px -3px 6px 1px inset;
    padding: 1em;
    margin-top: 1em;
    margin-bottom: 1em;
}

ion-button {
    height: 100px;
    width: 100px;
    --border-radius: 50%;
}

.toggle-button {
    display: flex;
    flex-direction: column;
}

ion-input {
    --ion-background-color: none !important;
    --ion-text-color: #000000;
    --ion-input-color: #000000;
}
.game-title {
    font-size: 1.5em;
    display: none;
    position: absolute;
    color: black;
    top: 100px;
}

.game-screen {
    height: 100%;
    width: 100%;
    border-bottom: 1px solid black;
}

.button-jump {
    position: absolute;
    top: 570px;
    right: 7.5em;
    filter: drop-shadow(1px 2px 0px #AF8906);
}

.button-auth:active, .button-jump:active {
    filter: none;
}
.button-auth {
    position: absolute;
    right: 3em;
    top: 405px;
    filter: drop-shadow(1px 2px 0px #A7A5A5);
    /*filter: drop-shadow(2px 5px 0px #18749E);*/
}

.dino {
    background-image: url("@/images/dino.png");
    background-size: cover;
    width: 50px;
    height: 50px;
    position: relative;
    top: 175px;
}

.toggles {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.toggles:last-of-type {
    margin-left: 1.5em;
}

.cactus {
    background-image: url("@/images/cactus.png");
    background-size: 32px 35px;
    width: 32px;
    height: 35px;
    position: relative;
    top: 137px;
    left: 300px;
    animation: cactusSlide 1s infinite linear;
    
}

@keyframes cactusSlide {
    0% {
        left: 300px;
    }
    100% {
        left: -10px;
    }
}

.jump {
    animation: jump .5s linear;
}

@keyframes jump {
    0% {
        top: 175px;
    }
    50% {
        top: 100px;
    }
    100% {
        top: 175px;
    }
}

ion-list {
    display: flex;
    flex-direction: column;
    --ion-background-color: #85FF83 !important;
}

ion-item {
    --ion-background-color: #85FF83 !important;
}

.list-ios {
    --ion-item-background: #85FF83 !important;
}

.label-mild {
   --color: black !important;
   color: #000000 !important;
}

.button-auth {
    margin-top: 50px;
    margin-left: 10px;
    margin-right: 10px;
}
</style>
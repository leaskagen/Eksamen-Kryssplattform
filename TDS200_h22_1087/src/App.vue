<template>
  <ion-app>
    <BurgerMenu />
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';
import BurgerMenu from '@/components/BurgerMenu.vue';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
    BurgerMenu
  }
});
</script>

<style>

/* Custom Font */
@font-face {
  font-family: pixel;
  src: url("@/fonts/PixeloidSans-nR3g1.ttf");
}

.pixel {
  font-family: pixel, sans-serif !important;
  font-weight: 500;
}

ion-toolbar {
  --background: #85FF83;
  --color: #000;
}

ion-menu-button {
  --color: #000;
}

ion-back-button {
  --color: #000;
}

.header-title {
  font-size: 20px !important;
}

.button-color {
  --background: #85FF83;
  color: black;
}

.swiper-pagination-bullet-active {
  --swiper-pagination-color: #85FF83 !important;
}

.messages-item .input-wrapper {
  --padding-bottom: 1em !important;
  padding-bottom: 1em !important;
}
</style>
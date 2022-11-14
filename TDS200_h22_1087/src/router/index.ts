import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import AuthenticationPage from '../views/AuthenticationPage.vue';
import DetailsPage from '../views/DetailsPage.vue';
import NewGame from '../views/NewGame.vue';
import ProfilePage from '../views/ProfilePage.vue';
import MyGamesPage from '../views/MyGamesPage.vue';
import SavedGamesPage from '../views/SavedGamesPage.vue';
import EditGamePage from '../views/EditGamePage.vue';
import MessagesPage from '../views/MessagesPage.vue';

const authenticationRequiredRouteGuard = async () => {
  const userAccessToken = localStorage.getItem("auth_token");
  if (!userAccessToken) {
    return { name: "Login" }
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: AuthenticationPage,
  },
  {
    path: '/details/:id',
    name: 'Details',
    component: DetailsPage,
  },
  {
    path: '/new',
    name: 'New',
    component: NewGame,
    beforeEnter: authenticationRequiredRouteGuard
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    beforeEnter: authenticationRequiredRouteGuard
  },
  {
    path: '/myGames',
    name: 'MyGames',
    component: MyGamesPage,
    beforeEnter: authenticationRequiredRouteGuard
  },
  {
    path: '/saved',
    name: 'SavedGames',
    component: SavedGamesPage,
    beforeEnter: authenticationRequiredRouteGuard
  },
  {
    path: '/edit/:id',
    name: 'EditGame',
    component: EditGamePage,
    beforeEnter: authenticationRequiredRouteGuard
  },
  {
    path: '/messages',
    name: 'Messages',
    component: MessagesPage,
    beforeEnter: authenticationRequiredRouteGuard
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

import { createRouter, createWebHistory } from 'vue-router';
import SignIn from '../components/SignIn.vue';
import HomePage from '../components/HomePage.vue';

// import { auth } from '../firebase';

const routes = [
  { path: '/', name: 'signin', component: SignIn },
  { path: '/home', name: 'home', component: HomePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  //const user = auth.currentUser;

  //ToDo: Improve this logic
  const token = localStorage.getItem('firebaseToken');

  if (to.name === 'home' && !token) {
    next({ name: 'signin' });
  } else {
    next();
  }
});

export default router;

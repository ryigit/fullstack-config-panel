import './assets/tailwind.css';
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const app = createApp(App)

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is logged in:', user);

    // Optionally, store the user data in the localStorage
    const token = user.accessToken || '';
    localStorage.setItem('firebaseUser', JSON.stringify(user));
    localStorage.setItem('firebaseToken', token);
  } else {
    console.log('No user is logged in, redirecting to login...');
    localStorage.removeItem('firebaseUser');
    localStorage.removeItem('firebaseToken');
    router.push('/'); // Redirect to signin if not authenticated
  }
});

app.use(router)

app.mount('#app')

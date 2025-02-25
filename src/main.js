import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { db } from './firebase';  // Firebaseのインスタンスをインポート

const app = createApp(App);
app.use(router);

// Firestoreインスタンスをグローバルに利用できるように設定
app.config.globalProperties.$db = db;

app.mount('#app');
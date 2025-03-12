<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import homeButton from '@/assets/homebutton.png'; 

const menuOpen = ref(false);
const isAuthenticated = ref(false);
const router = useRouter();
const auth = getAuth();

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const monitorAuthState = () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push('/signup');
    } else {
      isAuthenticated.value = true;
    }
  });
};

const guardRoute = (to) => {
  if (!isAuthenticated.value && to.path !== '/signup' && to.path !== '/login') {
    router.push('/signup');
    return false;
  }
  return true;
};

onMounted(monitorAuthState);

router.beforeEach((to, from, next) => {
  if (!guardRoute(to)) {
    next(false); // ルート遷移をキャンセル
  } else {
    next(); // 通常の遷移
  }
});
</script>

<template>
  <header>
    <router-link to="/" class="header-title" v-if="isAuthenticated">イベントカレンダー</router-link>
    <button v-if="isAuthenticated" class="burger-menu" @click="toggleMenu">☰</button>
    <nav v-if="menuOpen && isAuthenticated">
      <router-link to="/" @click="menuOpen = false">ホーム</router-link>
      <router-link to="/admin" @click="menuOpen = false">管理</router-link>
      <router-link to="/mypage" @click="menuOpen = false">マイページ</router-link>
    </nav>
  </header>

  <main>
    <div v-if="!isAuthenticated">
      <p>認証が完了していません。サインアップしてください。</p>
    </div>
    <router-view />
  </main>

  <footer v-if="isAuthenticated">
    <nav class="footer-nav">
      <router-link to="/">
        <img :src="homeButton" alt="ホーム" class="home-button" />
      </router-link>
      <router-link to="/admin">管理</router-link>
      <router-link to="/mypage">マイページ</router-link>
    </nav>
  </footer>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #42b883;
  color: white;
  margin-bottom: 100px;
}
.header-title {
  font-size: 24px;
  color: white;
  text-decoration: none;
}
.header-title:hover {
  text-decoration: underline;
}
.burger-menu {
  font-size: 24px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}
nav {
  position: absolute;
  top: 50px;
  right: 10px;
  background: white;
  padding: 10px;
  border: 1px solid #ddd;
}
nav a {
  display: block;
  padding: 5px;
  color: #42b883;
  text-decoration: none;
}
main {
  padding: 20px;
  text-align: center;
}
footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #42b883;
  padding: 10px 0;
  text-align: center;
  height: 30px;
}
.footer-nav a {
  margin: 0 15px;
  color: white;
  text-decoration: none;
  font-size: 18px;
}
.footer-nav a:hover {
  text-decoration: underline;
}
.home-button {
  width: 24px;
  height: 24px;
  vertical-align: middle;
}
</style>

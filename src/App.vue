<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const isAuthenticated = ref(false);
const router = useRouter();
const auth = getAuth();

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
  </header>

  <main>
    <div v-if="!isAuthenticated">
      <p>認証が完了していません。サインアップしてください。</p>
    </div>
    <router-view />
  </main>

  <footer v-if="isAuthenticated">
    <nav class="footer-nav">
      <router-link to="/" class="footer-link">ホーム</router-link>
      <router-link to="/admin" class="footer-link">管理</router-link>
      <router-link to="/mypage" class="footer-link">マイページ</router-link>
    </nav>
  </footer>
</template>

<style scoped>
header {
  display: flex;
  justify-content: center;
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
main {
  padding: 20px;
  text-align: center;
}
footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #42b883;
  padding: 20px 0;
  text-align: center;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.footer-nav {
  display: flex;
  justify-content: center;
  gap: 40px;
  align-items: center;
}
.footer-link {
  color: white;
  font-size: 18px;
  text-decoration: none;
}
.footer-link:hover {
  text-decoration: underline;
}
</style>

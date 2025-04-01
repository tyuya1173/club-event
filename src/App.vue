<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const isAuthenticated = ref(false);
const authChecked = ref(false);
const router = useRouter();

const logout = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    isAuthenticated.value = false;
    router.push('/login');
  } catch (error) {
    alert('ログアウトに失敗しました: ' + error.message);
  }
};

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isAuthenticated.value = true;
      if (router.currentRoute.value.path === '/login' || router.currentRoute.value.path === '/signup') {
        router.push('/');
      }
    } else {
      isAuthenticated.value = false;
      if (router.currentRoute.value.meta.requiresAuth) {
        router.push('/login');
      }
    }
    authChecked.value = true;
  });
});
</script>

<template>
  <div v-if="authChecked">
    <header>
      <router-link to="/" class="header-title">イベントカレンダー</router-link>
      <div class="header-actions">
        <router-link v-if="!isAuthenticated" to="/login" class="auth-btn">ログイン</router-link>
        <button v-else @click="logout" class="auth-btn">ログアウト</button>
      </div>
    </header>

    <main>
      <router-view />
    </main>

    <footer v-if="isAuthenticated">
      <nav class="footer-nav">
        <router-link to="/" class="footer-link">ホーム</router-link>
        <router-link to="/admin" class="footer-link">管理</router-link>
        <router-link to="/mypage" class="footer-link">マイページ</router-link>
      </nav>
    </footer>
  </div>
  <div v-else>
    <p>認証確認中...</p>
  </div>
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

.header-actions {
  display: flex;
  align-items: center;
}

.auth-btn {
  background-color: transparent;
  border: 1px solid white;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
}

.auth-btn:hover {
  background-color: white;
  color: #42b883;
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
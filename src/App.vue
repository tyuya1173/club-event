<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// メニューの開閉状態を管理するためのrefを定義
const menuOpen = ref(false);
const isAuthenticated = ref(false); // 認証状態を管理するref
const router = useRouter();
const auth = getAuth(); // Firebaseの認証インスタンス

// メニューの開閉をトグルする関数
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

// アプリ起動時に認証状態を監視
const monitorAuthState = () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // 認証されていなければサインアップページにリダイレクト
      router.push('/signup');
    } else {
      // 認証されていれば正常にアプリを使用可能
      isAuthenticated.value = true;
    }
  });
};

// 認証されていない場合、遷移を防ぐ
const guardRoute = (to) => {
  if (!isAuthenticated.value && to.path !== '/signup' && to.path !== '/login') {
    // 認証されていない場合、サインアップページにリダイレクト
    router.push('/signup');
    return false;
  }
  return true;
};

// 初期化
onMounted(monitorAuthState);

// ルーターガード
router.beforeEach((to, from, next) => {
  if (guardRoute(to)) {
    next();
  }
});
</script>

<template>
  <header>
    <!-- イベントカレンダーのタイトルをクリックするとホームに遷移 -->
    <router-link to="/" class="header-title" v-if="isAuthenticated">イベントカレンダー</router-link>
    
    <!-- サインアップまたはログインが完了していない場合、リンクは表示しない -->
    <button v-if="isAuthenticated" class="burger-menu" @click="toggleMenu">☰</button>
    <nav v-if="menuOpen && isAuthenticated">
      <!-- メニュー内のリンクをクリックすると画面遷移 -->
      <router-link to="/" @click="menuOpen = false">ホーム</router-link>
      <router-link to="/admin" @click="menuOpen = false">管理</router-link>
      <router-link to="/mypage" @click="menuOpen = false">マイページ</router-link>
    </nav>
  </header>

  <main>
    <!-- 認証されていない場合はクリックできないように遮断 -->
    <div v-if="!isAuthenticated">
      <p>認証が完了していません。サインアップしてください。</p>
    </div>

    <router-view /> <!-- ここで現在のコンポーネントが表示されます -->
  </main>
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
</style>
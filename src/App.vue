<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
</script>

<template>
  <header>
    <!-- イベントカレンダーのタイトルをクリックするとホームに遷移 -->
    <router-link to="/" class="header-title">イベントカレンダー</router-link>

    <button class="burger-menu" @click="toggleMenu">☰</button>
    <nav v-if="menuOpen">
      <!-- メニュー内のリンクをクリックすると画面遷移 -->
      <router-link to="/" @click="menuOpen = false">ホーム</router-link>
      <router-link to="/admin" @click="menuOpen = false">管理</router-link>
    </nav>
  </header>

  <main>
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
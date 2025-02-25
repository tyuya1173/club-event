<template>
    <div>
      <h2>ログイン</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit" :disabled="loading">ログイン</button>
      </form>
      <p v-if="error">{{ error }}</p>
      
      <!-- サインアップ画面へのリンク -->
      <p>アカウントをお持ちでないですか？ <router-link to="/signup">サインアップはこちら</router-link></p>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { signIn } from '../components/authService';  // ログインロジック
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const email = ref('');
      const password = ref('');
      const error = ref('');
      const loading = ref(false);  // ローディング状態を管理
      
      const router = useRouter();
  
      const handleLogin = async () => {
        loading.value = true; // ログイン中にローディングを表示
        try {
          await signIn(email.value, password.value);
          email.value = '';  // ログイン後にフォームをリセット
          password.value = ''; 
          error.value = '';  // エラーメッセージをクリア
  
          // ログイン成功後、ホームページに遷移
          setTimeout(() => {
            router.push('/');
          }, 500);
        } catch (err) {
          error.value = err.message;
        } finally {
          loading.value = false; // ログインが終わったらローディング状態を解除
        }
      };
  
      return { email, password, error, loading, handleLogin };
    },
  };
  </script>
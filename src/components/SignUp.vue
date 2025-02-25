<template>
    <div>
      <h2>サインアップ</h2>
      <form @submit.prevent="handleSignUp">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit" :disabled="loading">サインアップ</button>
      </form>
      <p v-if="error">{{ error }}</p>
      <router-link to="/login">ログインはこちら</router-link>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { signUp } from '../components/authService';  // サインアップロジック
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const email = ref('');
      const password = ref('');
      const error = ref('');
      const loading = ref(false);  // ローディング状態を管理
      
      // routerをsetup内で定義
      const router = useRouter(); 
  
      const handleSignUp = async () => {
        loading.value = true; // サインアップ中にローディングを表示
        try {
          await signUp(email.value, password.value);
          email.value = '';  // サインアップ後にフォームをリセット
          password.value = ''; 
          error.value = '';  // エラーメッセージをクリア
  
          // サインアップ成功後、ホームページに遷移
          setTimeout(() => {
            router.push('/');
          }, 500); // DOMの再レンダリングを待ってから遷移
        } catch (err) {
          error.value = err.message;
        } finally {
          loading.value = false; // サインアップが終わったらローディング状態を解除
        }
      };
  
      return { email, password, error, loading, handleSignUp };
    },
  };
  </script>
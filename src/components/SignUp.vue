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
import { useAuth } from '../components/authService'; // 修正: useAuthをインポート
import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const loading = ref(false);  // ローディング状態

    const router = useRouter();
    const { signUp } = useAuth();  // useAuthからsignUpを取得

    const handleSignUp = async () => {
      loading.value = true;  // サインアップ中はローディング状態
      try {
        await signUp(email.value, password.value);
        resetForm();  // サインアップ成功後フォームをリセット
        navigateToHome();  // ホームページに遷移
      } catch (err) {
        error.value = err.message;  // エラーメッセージを表示
      } finally {
        loading.value = false;  // ローディング状態解除
      }
    };

    const resetForm = () => {
      email.value = '';
      password.value = '';
    };

    const navigateToHome = () => {
      router.push('/');  // 非同期で遷移
    };

    return { email, password, error, loading, handleSignUp };
  },
};
</script>
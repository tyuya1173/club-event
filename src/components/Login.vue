<template>
  <div>
    <h2>ログイン</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit" :disabled="loading">ログイン</button>
    </form>
    
    <!-- エラーメッセージの表示 -->
    <p v-if="error" class="error">{{ error }}</p>

    <!-- サインアップ画面へのリンク -->
    <p>アカウントをお持ちでないですか？ 
      <router-link to="/signup">サインアップはこちら</router-link>
    </p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../components/authService'; // ログインロジック

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const loading = ref(false); // ローディング状態を管理
    const router = useRouter();
    const { signIn } = useAuth();  // useAuthからsignInを取得

    // ログイン処理を関数化
    const handleLogin = async () => {
      loading.value = true;
      try {
        await signIn(email.value, password.value);
        resetForm();
        setTimeout(() => {
          router.push('/');
        }, 500); // 少し遅延させてから遷移
      } catch (err) {
        handleError(err);  // エラーハンドリング
      } finally {
        loading.value = false;
      }
    };

    // エラーハンドリング関数
    const handleError = (error) => {
      switch (error.code) {
        case 'auth/invalid-email':
          error.value = '無効なメールアドレスです。';
          break;
        case 'auth/user-not-found':
          error.value = 'ユーザーが見つかりません。';
          break;
        case 'auth/wrong-password':
          error.value = 'パスワードが間違っています。';
          break;
        default:
          error.value = 'ログイン中にエラーが発生しました。';
      }
    };

    // フォームをリセットする関数
    const resetForm = () => {
      email.value = '';
      password.value = '';
      error.value = '';
    };

    return { email, password, error, loading, handleLogin };
  },
};
</script>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
}
</style>
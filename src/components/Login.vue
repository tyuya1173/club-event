<template>
  <div class="login-container">
    <h2>ログイン</h2>
    <form @submit.prevent="handleLogin" class="login-form">
      <input v-model="email" type="email" placeholder="Email" required class="input" />
      <input v-model="password" type="password" placeholder="Password" required class="input" />
      <button type="submit" :disabled="loading" class="submit-btn">ログイン</button>
    </form>
    
    <!-- エラーメッセージの表示 -->
    <p v-if="error" class="error">{{ error }}</p>

    <!-- サインアップ画面へのリンク -->
    <p class="signup-link">アカウントをお持ちでないですか？ 
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
/* コンテナのスタイル */
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 20px;
}

/* フォームのスタイル */
.login-form {
  display: flex;
  flex-direction: column;
}

.input {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-btn {
  padding: 10px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}

/* サインアップリンク */
.signup-link {
  text-align: center;
  margin-top: 20px;
}

/* メディアクエリでスマホ対応 */
@media (max-width: 600px) {
  .login-container {
    padding: 15px;
    max-width: 90%;
  }

  .input {
    padding: 8px;
    font-size: 14px;
  }

  .submit-btn {
    padding: 12px;
    font-size: 16px;
  }

  h2 {
    font-size: 1.2rem;
  }
}
</style>
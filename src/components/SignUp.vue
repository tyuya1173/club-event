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
<style scoped>
div {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.2rem;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
}

p {
  color: red;
  text-align: center;
  font-size: 0.9rem;
}

router-link {
  display: block;
  text-align: center;
  margin-top: 20px;
  font-size: 1rem;
}

/* レスポンシブ対応 */
@media (max-width: 600px) {
  div {
    padding: 15px;
  }

  h2 {
    font-size: 1.3rem;
  }

  input, button {
    font-size: 1rem;
  }

  button {
    padding: 12px;
  }

  p {
    font-size: 0.9rem;
  }
}
</style>
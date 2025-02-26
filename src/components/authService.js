import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref } from 'vue';

const auth = getAuth();

export const useAuth = () => {
  const user = ref(null);
  const errorMessage = ref('');

  // 共通のエラーハンドリング関数
  const handleError = (error) => {
    errorMessage.value = error.message || '認証エラーが発生しました';
  };

  // サインアップ処理
  const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
      errorMessage.value = '';  // 成功時にエラーメッセージをリセット
    } catch (error) {
      handleError(error);
    }
  };

  // サインイン処理
  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
      errorMessage.value = '';  // 成功時にエラーメッセージをリセット
    } catch (error) {
      handleError(error);
    }
  };

  // ログアウト処理
  const logout = () => {
    auth.signOut();
    user.value = null;
  };

  return {
    user,
    errorMessage,
    signUp,
    signIn,
    logout,
  };
};
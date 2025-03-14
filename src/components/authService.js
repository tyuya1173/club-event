import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { ref, onMounted } from 'vue';

const auth = getAuth();

export const useAuth = () => {
  const user = ref(null);
  const errorMessage = ref('');

  // Firebaseの認証状態を監視
  onMounted(() => {
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser;
    });
  });

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
  const logout = async () => {
    await auth.signOut();
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

import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Firebaseの認証インスタンスを取得
const auth = getAuth();

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;  // サインアップしたユーザー情報を返す
  } catch (error) {
    throw new Error(error.message);  // エラーメッセージをスロー
  }
};

// ログイン処理
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;  // ログインしたユーザー情報を返す
  } catch (error) {
    throw new Error(error.message);  // エラーメッセージをスロー
  }
};
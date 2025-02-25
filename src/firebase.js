// Firebase SDK をインポート
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase の設定（Firebase コンソールで取得した情報を入力）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Firebase アプリを初期化
const app = initializeApp(firebaseConfig);

// Firestore のインスタンスを取得
const db = getFirestore(app);

export { db };
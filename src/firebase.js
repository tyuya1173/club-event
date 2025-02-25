// src/firebase.js
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";  // 追加: 認証機能をインポート

// Firebaseの設定（あなたのプロジェクトの情報を入力）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Firebaseアプリがすでに初期化されていないか確認
let app;
if (getApps().length === 0) {
  // 初期化されていなければ、新たにアプリを初期化
  app = initializeApp(firebaseConfig);
} else {
  // 初期化済みのアプリを取得
  app = getApp();
}

// Firestoreのインスタンスをエクスポート
export const db = getFirestore(app);

// 認証のインスタンスをエクスポート
export const auth = getAuth(app);  // 追加: 認証のインスタンス
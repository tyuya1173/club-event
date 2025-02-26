<template>
    <div class="mypage">
      <h2>マイページ</h2>
  
      <div class="section">
        <h3>登録情報</h3>
        <p><strong>メールアドレス:</strong> {{ user?.email }}</p>
      </div>
  
      <div class="section">
        <h3>予約したイベント</h3>
        <ul v-if="reservations.length">
          <li v-for="event in reservations" :key="event.id">
            <strong @click="openEventDetail(event)" class="event-link">{{ event.eventName }}</strong>
            - {{ formatDate(event.eventDate) }}
          </li>
        </ul>
        <p v-else>予約したイベントはありません。</p>
      </div>
  
      <button @click="logout" :disabled="loading">ログアウト</button>
  
      <!-- モーダル（イベント詳細） -->
      <div v-if="selectedEvent" class="modal">
        <div class="modal-content">
          <h3>{{ selectedEvent.title }}</h3>
          <p><strong>日時:</strong> {{ formatDate(selectedEvent.date) }}</p>
          <p><strong>場所:</strong> {{ selectedEvent.location }}</p>
          <p><strong>説明:</strong> {{ selectedEvent.description }}</p>
          <button @click="closeModal">閉じる</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
  import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
  
  export default {
    setup() {
      const auth = getAuth();
      const db = getFirestore();
      const user = ref(null);
      const reservations = ref([]);
      const loading = ref(false);
      const selectedEvent = ref(null);
  
      // 認証情報の取得
      onMounted(() => {
        onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
            user.value = currentUser;
            fetchReservations();
          } else {
            user.value = null;
            reservations.value = [];
          }
        });
      });
  
      // 予約したイベントを取得し、イベント情報も紐付ける
      const fetchReservations = async () => {
        if (!user.value?.email) return;
        try {
          const reservationsQuery = query(collection(db, 'reservations'), where('email', '==', user.value.email));
          const querySnapshot = await getDocs(reservationsQuery);
          
          reservations.value = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
            const reservation = { id: docSnap.id, ...docSnap.data() };
            
            // イベント詳細を取得
            if (reservation.eventId) {
              const eventRef = doc(db, 'events', reservation.eventId);
              const eventSnap = await getDoc(eventRef);
              if (eventSnap.exists()) {
                reservation.eventName = eventSnap.data().title;
                reservation.eventDate = eventSnap.data().date;
              } else {
                reservation.eventName = '不明なイベント';
                reservation.eventDate = null;
              }
            }
            
            return reservation;
          }));
        } catch (error) {
          console.error('予約情報の取得エラー:', error);
        }
      };
  
      // イベントの詳細情報を取得してモーダルを開く
      const openEventDetail = async (event) => {
        if (!event.eventId) return;
        try {
          const eventRef = doc(db, 'events', event.eventId);
          const eventSnap = await getDoc(eventRef);
          if (eventSnap.exists()) {
            selectedEvent.value = eventSnap.data();
          } else {
            alert('イベント情報が見つかりません');
          }
        } catch (error) {
          console.error('イベント情報の取得エラー:', error);
        }
      };
  
      // モーダルを閉じる
      const closeModal = () => {
        selectedEvent.value = null;
      };
  
      // 日付を見やすくフォーマット
      const formatDate = (dateStr) => {
        return dateStr ? new Date(dateStr).toLocaleString() : '日付不明';
      };
  
      // ログアウト
      const logout = async () => {
        loading.value = true;
        try {
          await signOut(auth);
          alert('ログアウトしました');
          window.location.reload();
        } catch (error) {
          alert(error.message);
        } finally {
          loading.value = false;
        }
      };
  
      return {
        user,
        reservations,
        loading,
        selectedEvent,
        formatDate,
        openEventDetail,
        closeModal,
        logout,
      };
    },
  };
  </script>
  
  <style scoped>
  .mypage {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    text-align: center;
    font-family: Arial, sans-serif;
  }
  
  .section {
    margin-bottom: 20px;
  }
  
  .event-link {
    color: #42b883;
    cursor: pointer;
    text-decoration: underline;
  }
  
  .event-link:hover {
    color: #2c7a7b;
  }
  
  button {
    margin-top: 10px;
    padding: 8px 12px;
    border: none;
    background-color: #42b883;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  button:disabled {
    background-color: #ccc;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    width: 80%;
    max-width: 400px;
    overflow: hidden;
  }
  
  /* レスポンシブ対応 */
  @media (max-width: 600px) {
    .mypage {
      padding: 15px;
      font-size: 0.9rem;
    }
  
    .section h3 {
      font-size: 1.2rem;
    }
  
    .event-link {
      font-size: 0.9rem;
    }
  
    button {
      padding: 10px 16px;
      font-size: 1.1rem;
      width: 100%;
    }
  
    .modal-content {
      width: 90%;
      padding: 15px;
    }
  
    .modal p {
      font-size: 0.9rem;
    }
  }
  </style>
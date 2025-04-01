<template>
  <div class="mypage-container">
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
            <button @click="deleteReservation(event.id)" class="delete-button">予約をキャンセルする</button>
          </li>
        </ul>
        <p v-else>予約したイベントはありません。</p>
      </div>

      <button @click="logout" :disabled="loading">ログアウト</button>
    </div>

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
import { getFirestore, collection, query, where, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';


export default {
  setup() {
    const auth = getAuth();
    const db = getFirestore();
    const user = ref(null);
    const reservations = ref([]);
    const loading = ref(false);
    const selectedEvent = ref(null);

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

    const fetchReservations = async () => {
      if (!user.value?.email) return;
      try {
        const reservationsQuery = query(collection(db, 'reservations'), where('email', '==', user.value.email));
        const querySnapshot = await getDocs(reservationsQuery);

        reservations.value = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
          const reservation = { id: docSnap.id, ...docSnap.data() };
          
          if (reservation.eventId) {
            const eventRef = doc(db, 'events', reservation.eventId);
            const eventSnap = await getDoc(eventRef);
            if (eventSnap.exists()) {
              reservation.eventName = eventSnap.data().title;
              reservation.eventDate = eventSnap.data().date;
            } else {
              return null;
            }
          }
          
          return reservation;
        }));

        reservations.value = reservations.value.filter(reservation => reservation !== null);
      } catch (error) {
        console.error('予約情報の取得エラー:', error);
      }
    };

    const deleteReservation = async (reservationId) => {
      if (confirm("本当にこのイベントを削除しますか？")) {
        try {
          const reservationRef = doc(db, 'reservations', reservationId);
          await deleteDoc(reservationRef);
          reservations.value = reservations.value.filter(reservation => reservation.id !== reservationId);
          alert('予約をキャンセルしました');
        } catch (error) {
          console.error('予約削除エラー:', error);
          alert('予約のキャンセルに失敗しました');
        }
      }
    };

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

    const closeModal = () => {
      selectedEvent.value = null;
    };

    const formatDate = (dateStr) => {
      return dateStr ? new Date(dateStr).toLocaleString() : '日付不明';
    };

    const logout = async () => {
      loading.value = true;
      try {
        await signOut(auth);
        alert('ログアウトしました');
        router.push('/login');
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
      deleteReservation,
    };
  },
};
</script>

<style scoped>
.mypage-container {
  padding-bottom: 80px; /* フッターと重ならないように調整 */
}

.mypage {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  text-align: center;
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
}

button:disabled {
  background-color: #ccc;
}

.delete-button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #e60000;
}
</style>

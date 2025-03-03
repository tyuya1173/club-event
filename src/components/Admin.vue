<template>
  <div>
    <h1 v-if="!authenticated">管理者認証</h1>
    <h1 v-else>イベント登録</h1>

    <div v-if="!authenticated">
      <p>管理者パスワードを入力してください</p>
      <input type="password" v-model="password" placeholder="パスワード" />
      <button @click="checkPassword">確認</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>

    <div v-else>
      <form @submit.prevent="submitEvent">
        <div>
          <label for="title">イベント名</label>
          <input type="text" id="title" v-model="newEvent.title" required />
        </div>
        <div>
          <label for="date">日時</label>
          <input type="datetime-local" id="date" v-model="newEvent.date" required />
        </div>
        <div>
          <label for="location">場所</label>
          <input type="text" id="location" v-model="newEvent.location" required />
        </div>
        <div>
          <label for="description">詳細</label>
          <textarea id="description" v-model="newEvent.description" required></textarea>
        </div>
        <button type="submit">イベントを登録</button>
      </form>

      <h2>登録されたイベント</h2>
      <ul>
        <li v-for="event in events" :key="event.id">
          <strong>{{ event.title }}</strong> - {{ event.date }} <br />
          場所: {{ event.location }} <br />
          詳細: {{ event.description }}
          <button @click="editEvent(event)">編集</button>
          <button @click="deleteEvent(event.id)">削除</button>
          <button @click="fetchParticipants(event.id)">参加者一覧</button>

          <div v-if="selectedEventId === event.id">
            <h3>参加者名簿</h3>
            <ul>
              <li v-for="participant in participants" :key="participant.id">
                名前: {{ participant.name }} | 学部: {{ participant.faculty }} | 性別: {{ participant.gender }}
              </li>
            </ul>
          </div>
        </li>
      </ul>

      <button @click="logout">ログアウト</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '@/firebase';

export default {
  setup() {
    const password = ref('');
    const authenticated = ref(false);
    const errorMessage = ref('');
    const correctPassword = 'rikuho2026'; // パスワードを設定

    const checkPassword = () => {
      if (password.value === correctPassword) {
        authenticated.value = true;
        errorMessage.value = '';
      } else {
        errorMessage.value = 'パスワードが間違っています';
        password.value = '';
      }
    };

    const logout = () => {
      authenticated.value = false;
      password.value = '';
    };

    const newEvent = ref({
      title: '',
      date: '',
      location: '',
      description: ''
    });
    const events = ref([]);
    const editingEvent = ref(null);
    const selectedEventId = ref(null);
    const participants = ref([]);

    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, 'events'));
      events.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    };

    const submitEvent = async () => {
      try {
        if (editingEvent.value) {
          const docRef = doc(db, 'events', editingEvent.value.id);
          await updateDoc(docRef, { ...newEvent.value });
          editingEvent.value = null;
        } else {
          await addDoc(collection(db, 'events'), { ...newEvent.value });
        }
        newEvent.value = { title: '', date: '', location: '', description: '' };
        fetchEvents();
      } catch (error) {
        console.error('イベントの登録に失敗しました', error);
      }
    };

    const editEvent = (event) => {
      newEvent.value = { ...event };
      editingEvent.value = event;
    };

    const deleteEvent = async (eventId) => {
      try {
        const docRef = doc(db, 'events', eventId);
        await deleteDoc(docRef);
        fetchEvents();
      } catch (error) {
        console.error('イベントの削除に失敗しました', error);
      }
    };

    const fetchParticipants = async (eventId) => {
      try {
        selectedEventId.value = eventId;
        const q = query(collection(db, 'reservations'), where('eventId', '==', eventId));
        const querySnapshot = await getDocs(q);
        participants.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('参加者の取得に失敗しました', error);
      }
    };

    onMounted(fetchEvents);

    return {
      password,
      authenticated,
      errorMessage,
      checkPassword,
      logout,
      newEvent,
      events,
      submitEvent,
      editEvent,
      deleteEvent,
      selectedEventId,
      participants,
      fetchParticipants
    };
  }
};
</script>

<style scoped>
h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

input, textarea, button {
  padding: 0.75rem;
  margin: 0.5rem;
  width: 100%;  /* 幅を100%に設定 */
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #42b883;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #367c58;
}

.error {
  color: red;
  margin-top: 1rem;
}

h2, h3 {
  margin-top: 2rem;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 1rem;
}

@media (max-width: 600px) {
  h1 {
    font-size: 1.5rem;
  }
  
  input, textarea, button {
    padding: 0.5rem;
  }

  button {
    font-size: 1rem;
  }

  ul {
    padding-left: 1rem;
  }
}
</style>
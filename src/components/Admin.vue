<template>
  <div class="container">
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
        </li>
      </ul>

      <button @click="logout">ログアウト</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default {
  setup() {
    const password = ref('');
    const authenticated = ref(false);
    const errorMessage = ref('');
    const correctPassword = 'rikuho2026';

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
      deleteEvent
    };
  }
};
</script>

<style scoped>
.container {
  padding-bottom: 100px; /* フッターと被らないように余白を追加 */
}
</style>
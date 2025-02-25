<template>
  <div>
    <h1>イベント登録</h1>
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
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

export default {
  setup() {
    const newEvent = ref({
      title: '',
      date: '',
      location: '',
      description: ''
    });
    const events = ref([]);

    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, 'events'));
      events.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    };

    const submitEvent = async () => {
      try {
        await addDoc(collection(db, 'events'), {
          title: newEvent.value.title,
          date: newEvent.value.date,
          location: newEvent.value.location,
          description: newEvent.value.description
        });
        // 入力後フォームをクリア
        newEvent.value.title = '';
        newEvent.value.date = '';
        newEvent.value.location = '';
        newEvent.value.description = '';
        // 再度イベントを取得
        fetchEvents();
      } catch (error) {
        console.error('イベントの登録に失敗しました', error);
      }
    };

    onMounted(fetchEvents);

    return {
      newEvent,
      events,
      submitEvent
    };
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
form div {
  display: flex;
  flex-direction: column;
}
button {
  padding: 0.5rem;
  background-color: #42b883;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #367c58;
}
h2 {
  margin-top: 2rem;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 1rem;
}
</style>
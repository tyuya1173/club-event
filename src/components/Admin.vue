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
        <button @click="editEvent(event)">編集</button>
        <button @click="deleteEvent(event.id)">削除</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
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
    const editingEvent = ref(null); // 編集するイベントのデータ

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
          // 編集の場合
          const docRef = doc(db, 'events', editingEvent.value.id);
          await updateDoc(docRef, {
            title: newEvent.value.title,
            date: newEvent.value.date,
            location: newEvent.value.location,
            description: newEvent.value.description
          });
          editingEvent.value = null; // 編集を終了
        } else {
          // 新規追加の場合
          await addDoc(collection(db, 'events'), {
            title: newEvent.value.title,
            date: newEvent.value.date,
            location: newEvent.value.location,
            description: newEvent.value.description
          });
        }
        // フォームの内容をリセット
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

    const editEvent = (event) => {
      // 編集フォームにイベントのデータを設定
      newEvent.value.title = event.title;
      newEvent.value.date = event.date;
      newEvent.value.location = event.location;
      newEvent.value.description = event.description;
      editingEvent.value = event; // 編集対象のイベント
    };

    const deleteEvent = async (eventId) => {
      try {
        const docRef = doc(db, 'events', eventId);
        await deleteDoc(docRef);
        fetchEvents(); // イベントリストを再取得
      } catch (error) {
        console.error('イベントの削除に失敗しました', error);
      }
    };

    onMounted(fetchEvents);

    return {
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
button {
  margin-left: 10px;
}
</style>
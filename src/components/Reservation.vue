<template>
  <form @submit.prevent="submitReservation">
    <h2>イベント: {{ eventDetails.title }}</h2>
    <p>{{ eventDetails.description }}</p>
    <p>日時: {{ eventDetails.date }}</p> 
    <label>氏名: <input v-model="name" required /></label>
    <label>学部: <input v-model="faculty" required /></label>
    <label>性別:
      <select v-model="gender">
        <option value="male">男性</option>
        <option value="female">女性</option>
      </select>
    </label>
    <button type="submit">予約する</button>
  </form>
</template>

<script>
import { ref, onMounted } from 'vue';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const name = ref('');
    const faculty = ref('');
    const gender = ref('male');
    const eventDetails = ref({});
    const route = useRoute(); // ルート情報を取得

    // イベントIDを元にイベントの詳細を取得
    const fetchEventDetails = async () => {
      const eventId = route.query.eventId;
      if (eventId) {
        try {
          const docRef = doc(db, 'events', eventId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            eventDetails.value = docSnap.data();
          } else {
            console.log('No such event!');
          }
        } catch (error) {
          console.error('Error fetching event details:', error);
        }
      }
    };

    // 予約の処理
    const submitReservation = async () => {
      await addDoc(collection(db, 'reservations'), {
        name: name.value,
        faculty: faculty.value,
        gender: gender.value,
        eventId: route.query.eventId, // イベントIDも保存
        createdAt: new Date(),
      });
      alert('予約完了');
    };

    onMounted(fetchEventDetails);

    return { name, faculty, gender, submitReservation, eventDetails };
  }
};
</script>
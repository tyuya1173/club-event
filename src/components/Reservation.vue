<template>
  <form @submit.prevent="submitReservation">
    <h2>イベント: {{ eventDetails.title }}</h2>
    <p>{{ eventDetails.description }}</p>
    <p>日時: {{ eventDetails.date }}</p>
    <br>
    <label>氏名: <input v-model="name" required /></label>
    <br>
    <label>学部:
      <select v-model="faculty">
        <option value="システム工学部">システム工学部</option>
        <option value="教育学部">教育学部</option>
        <option value="経済学部">経済学部</option>
        <option value="観光学部">観光学部</option>
        <option value="社会インフォマティクス">社会インフォマティクス学環</option>
      </select>
    </label>
    <br>
    <label>性別:
      <select v-model="gender">
        <option value="male">男性</option>
        <option value="female">女性</option>
      </select>
    </label>
    <br>
    <button type="submit">予約する</button>
  </form>
</template>

<script>
import { ref, onMounted } from 'vue';
import { collection, doc, getDoc, addDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const name = ref('');
    const faculty = ref('');
    const gender = ref('male');
    const eventDetails = ref({});
    const route = useRoute();

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

    const submitReservation = async () => {
      try {
        await addDoc(collection(db, 'reservations'), {
          name: name.value,
          faculty: faculty.value,
          gender: gender.value,
          eventId: route.query.eventId,
          eventName: eventDetails.value.title, // イベント名を追加
          createdAt: new Date(),
        });

        alert('予約完了');

        // **入力内容をリセット**
        name.value = '';
        faculty.value = '';
        gender.value = 'male';
      } catch (error) {
        console.error('Error submitting reservation:', error);
        alert('予約に失敗しました');
      }
    };

    onMounted(fetchEventDetails);

    return { name, faculty, gender, submitReservation, eventDetails };
  }
};
</script>

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
    <p><strong>登録メールアドレス:</strong> {{ userEmail || '未ログイン' }}</p>
    <br>
    <button type="submit" :disabled="!userEmail">予約する</button>
  </form>
</template>

<script>
import { ref, onMounted } from 'vue';
import { collection, doc, getDoc, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/firebase';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const name = ref('');
    const faculty = ref('');
    const gender = ref('male');
    const eventDetails = ref({});
    const userEmail = ref(null);
    const route = useRoute();
    const auth = getAuth();

    // ログイン中のユーザーのメールアドレスを取得
    const fetchUserEmail = () => {
      onAuthStateChanged(auth, (user) => {
        userEmail.value = user ? user.email : null;
      });
    };

    // イベントの詳細を取得
    const fetchEventDetails = async () => {
      const eventId = route.query.eventId;
      if (!eventId) return;
      
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
    };

    // 予約情報を Firebase に保存
    const submitReservation = async () => {
      if (!userEmail.value) {
        alert('ログインしてください');
        return;
      }

      try {
        await addDoc(collection(db, 'reservations'), {
          name: name.value,
          faculty: faculty.value,
          gender: gender.value,
          email: userEmail.value,
          eventId: route.query.eventId,
          eventName: eventDetails.value.title,
          createdAt: new Date(),
        });

        alert('予約完了');
        resetForm();
      } catch (error) {
        console.error('Error submitting reservation:', error);
        alert('予約に失敗しました');
      }
    };

    // フォームリセット
    const resetForm = () => {
      name.value = '';
      faculty.value = '';
      gender.value = 'male';
    };

    // 初期化処理
    onMounted(() => {
      fetchUserEmail();
      fetchEventDetails();
    });

    return {
      name, faculty, gender, userEmail, eventDetails, submitReservation
    };
  }
};
</script>

<style scoped>
form {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 10px;
}

input, select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
}

button:disabled {
  background-color: #ccc;
}

p {
  font-size: 1rem;
  margin-bottom: 20px;
}

/* レスポンシブ対応 */
@media (max-width: 600px) {
  form {
    padding: 15px;
  }

  h2 {
    font-size: 1.3rem;
  }

  label {
    font-size: 1rem;
  }

  input, select {
    font-size: 1rem;
    padding: 10px;
  }

  button {
    padding: 12px;
    font-size: 1.2rem;
  }

  p {
    font-size: 0.9rem;
  }
}
</style>
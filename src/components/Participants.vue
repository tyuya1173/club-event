<template>
    <div class="container">
      <h1>参加者一覧</h1>
      <button @click="goBack">戻る</button>
      <div v-if="participants.length">
        <ul>
          <li v-for="participant in participants" :key="participant.id">
            名前: {{ participant.name }} | 学部: {{ participant.faculty }} | 性別: {{ participant.gender }}
          </li>
        </ul>
      </div>
      <p v-else>参加者がいません。</p>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { collection, getDocs, query, where } from 'firebase/firestore';
  import { db } from '@/firebase';
  
  export default {
    setup() {
      const route = useRoute();
      const router = useRouter();
      const participants = ref([]);
      const eventId = route.params.eventId;
  
      const fetchParticipants = async () => {
        try {
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
  
      const goBack = () => {
        router.push('/admin');
      };
  
      onMounted(fetchParticipants);
  
      return {
        participants,
        goBack
      };
    }
  };
  </script>
  
  <style scoped>
  .container {
    padding: 20px;
    text-align: center;
    padding-bottom: 80px; /* フッターと重ならないように調整 */
  }
  button {
    background-color: #42b883;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    margin-bottom: 20px;
  }
  button:hover {
    background-color: #367c58;
  }
  </style>

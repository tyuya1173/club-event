<template>
    <form @submit.prevent="submitReservation">
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
  import { ref } from 'vue';
  import { collection, addDoc } from 'firebase/firestore';
  import { db } from '@/firebase';
  
  export default {
    setup() {
      const name = ref('');
      const faculty = ref('');
      const gender = ref('male');
  
      const submitReservation = async () => {
        await addDoc(collection(db, 'reservations'), {
          name: name.value,
          faculty: faculty.value,
          gender: gender.value,
          createdAt: new Date()
        });
        alert('予約完了');
      };
  
      return { name, faculty, gender, submitReservation };
    }
  };
  </script>
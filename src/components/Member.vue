<template>
    <div class="participant-container">
      <button @click="goToParticipants">参加者一覧</button>
    </div>
</template>
  
<script>
import { useRouter } from 'vue-router';
  
export default {
  props: {
    eventId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();
    
    const goToParticipants = () => {
      router.push({ path: `/participants/${props.eventId}` });
    };
  
    return {
      goToParticipants
    };
  }
};
</script>
  
<style scoped>
.participant-container {
  padding-bottom: 80px; /* フッターと重ならないように調整 */
  text-align: center;
}

button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  margin-top: 10px;
}
button:hover {
  background-color: #367c58;
}
</style>

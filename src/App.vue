<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

const router = useRouter();
const events = ref([]);

const fetchEvents = async () => {
  const querySnapshot = await getDocs(collection(db, 'events'));
  events.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    title: doc.data().title,
    start: doc.data().date,
    extendedProps: { eventId: doc.id }
  }));
};

onMounted(fetchEvents);
</script>

<template>
  <div>
    <h1>イベントカレンダー</h1>
    <FullCalendar :options="{
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: events,
      eventClick: (info) => {
        router.push(`/reservation/${info.event.extendedProps.eventId}`);
      }
    }" />
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
<template>
    <FullCalendar :options="calendarOptions" />
  </template>
  
  <script>
  import { defineComponent, ref, onMounted } from 'vue';
  import FullCalendar from '@fullcalendar/vue3';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import interactionPlugin from '@fullcalendar/interaction';
  import { collection, getDocs } from 'firebase/firestore';
  import { db } from '@/firebase';
  
  export default defineComponent({
    components: { FullCalendar },
    setup() {
      const events = ref([]);
  
      const fetchEvents = async () => {
        const querySnapshot = await getDocs(collection(db, 'events'));
        events.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          start: doc.data().date
        }));
      };
  
      onMounted(fetchEvents);
  
      return {
        calendarOptions: {
          plugins: [dayGridPlugin, interactionPlugin],
          initialView: 'dayGridMonth',
          events: events,
        }
      };
    }
  });
  </script>
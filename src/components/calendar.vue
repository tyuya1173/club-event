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
    const calendarOptions = ref({
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: events.value, // eventsを直接参照

      // イベントが表示される際に何を表示するかをカスタマイズ
      eventContent: function(info) {
        return {
          // イベント名だけを表示
          html: `<span>${info.event.title}</span>`
        };
      },
    });

    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const fetchedEvents = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const startDate = new Date(data.date);

          // イベントの詳細をログに出力
          console.log('Fetched Event:', {
            id: doc.id,
            title: data.title,
            description: data.description,
            location: data.location,
            start: startDate,
          });

          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            location: data.location,
            start: startDate,
          };
        });
        // Firestoreから取得したイベントをeventsにセット
        events.value = fetchedEvents;

        // calendarOptionsを更新してカレンダーに反映
        calendarOptions.value.events = events.value;
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    // コンポーネントがマウントされた時にイベントを取得
    onMounted(fetchEvents);

    return {
      calendarOptions,
    };
  },
});
</script>
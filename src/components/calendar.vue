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
import { useRouter } from 'vue-router';
// 日本語ロケールをインポート
import jaLocale from '@fullcalendar/core/locales/ja';

export default defineComponent({
  components: { FullCalendar },
  setup() {
    const events = ref([]);
    const router = useRouter(); // ルーターを使用

    const calendarOptions = ref({
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: events.value, // eventsを直接参照

      // イベントがクリックされたときに予約画面に遷移
      eventClick: function(info) {
        console.log('Event clicked:', info);
        const eventId = info.event.id;

        // 予約画面に遷移、paramsまたはqueryにeventIdを渡す
        router.push({ 
          name: 'reserve', 
          query: { eventId } // クエリパラメータとしてeventIdを渡す
        });
      },

      // イベントの内容をカスタマイズしてイベント名のみ表示
      eventContent: function(info) {
        return {
          // イベント名だけを表示
          html: `<span>${info.event.title}</span>`
        };
      },

      // 日本語のロケールを設定
      locale: jaLocale,  // 日本語ロケールを適用

      // 全てを1画面に表示するために高さを設定
      height: 'auto',  // 自動的に高さを調整

      // スクロールを防ぐための設定
      contentHeight: 'auto', // コンテンツの高さを自動に設定
      aspectRatio: 1.5, // 幅と高さの比率を調整（画面に収まるように調整）
    });

    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const fetchedEvents = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const startDate = new Date(data.date);

          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            location: data.location,
            start: startDate,
          };
        });
        events.value = fetchedEvents;
        calendarOptions.value.events = events.value;
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    onMounted(fetchEvents);

    return {
      calendarOptions,
    };
  },
});
</script>
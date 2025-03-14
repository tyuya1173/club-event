<template>
  <div class="calendar-wrapper">
    <div class="calendar-container">
      <FullCalendar :options="calendarOptions" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { useRouter } from 'vue-router';
import jaLocale from '@fullcalendar/core/locales/ja';

export default defineComponent({
  components: { FullCalendar },
  setup() {
    const events = ref([]);
    const router = useRouter();

    // カレンダーのオプションを定義
    const calendarOptions = ref({
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: () => events.value,  // イベントはリアクティブに設定

      // イベントクリック時の処理
      eventClick: ({ event }) => {
        const eventId = event.id;
        router.push({ 
          name: 'reserve', 
          query: { eventId } 
        });
      },

      // イベント内容のカスタマイズ
      eventContent: ({ event }) => ({
        html: `<span>${event.title}</span>`  // イベント名だけを表示
      }),

      // 日本語ロケール
      locale: jaLocale,

      // 高さとスクロールの設定
      height: 'auto',
      contentHeight: 'auto',
      aspectRatio: 1.5,
      // モバイル向けのスクロール設定
      windowResize: true,
    });

    // イベントデータの取得
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const fetchedEvents = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            location: data.location,
            start: new Date(data.date),  // startを日付オブジェクトとして保存
          };
        });
        events.value = fetchedEvents;

        // カレンダーオプションのイベントを更新
        calendarOptions.value = {
          ...calendarOptions.value,
          events: events.value,  // イベントデータを反映
        };
      } catch (error) {
        console.error('イベントの取得に失敗しました:', error);
      }
    };

    // コンポーネントがマウントされたときにイベントデータを取得
    onMounted(fetchEvents);

    return {
      calendarOptions,
    };
  },
});
</script>

<style scoped>
.calendar-wrapper {
  position: relative;
  z-index: 0;
}

.calendar-container {
  padding-bottom: 150px; /* フッターと重ならないように調整 */
  position: relative;
  z-index: 1;
}

/* スマホ用にレスポンシブ対応 */
@media (max-width: 600px) {
  .fc {
    font-size: 12px;  /* フォントサイズを小さく */
  }

  .fc-header-toolbar {
    padding: 5px 10px;  /* ツールバーのパディング調整 */
  }

  .fc-daygrid-day {
    padding: 5px;  /* 日付セルのパディング調整 */
  }

  /* カレンダーの高さが足りない場合、スクロールを有効に */
  .fc-scroller {
    max-height: 80vh;  /* スクロールエリアの最大高さ */
    overflow-y: auto;  /* 縦スクロール可能に */
  }
}

/* タブレット向け（601px〜）のデザイン調整 */
@media (min-width: 601px) and (max-width: 1024px) {
  .fc {
    font-size: 14px;  /* タブレットサイズのフォントサイズ */
  }
}
</style>

import { createRouter, createWebHistory } from 'vue-router';
import Calendar from '../components/Calendar.vue';
import Reservation from '../components/Reservation.vue';
import Admin from '../components/Admin.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Calendar,
  },
  {
    path: '/reserve',
    name: 'reserve',
    component: Reservation, // 予約画面
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin, // 管理画面
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
import { createRouter, createWebHistory } from 'vue-router';
import Calendar from '../components/Calendar.vue';
import Reservation from '../components/Reservation.vue';
import Admin from '../components/Admin.vue';
import SignUp from '../components/SignUp.vue';
import Login from '../components/Login.vue';
import MyPage from '../components/MyPage.vue';
import Participants from '../components/Participants.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Calendar, // イベントカレンダー
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
  {
    path: '/signup',
    name: 'signup',
    component: SignUp, // サインアップ画面
  },
  {
    path: '/login',
    name: 'login',
    component: Login, // ログイン画面
  },
  {
    path: '/mypage',
    name: 'mypage',
    component: MyPage, // マイページ
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔒 ルートガードを設定
import { getAuth, onAuthStateChanged } from 'firebase/auth';

let authResolved = false;
let cachedUser = null;

function getCurrentUser() {
  return new Promise((resolve) => {
    if (authResolved) {
      resolve(cachedUser);
    } else {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        authResolved = true;
        cachedUser = user;
        resolve(user);
      });
    }
  });
}

router.beforeEach(async (to, from, next) => {
  const user = await getCurrentUser();

  if (to.meta.requiresAuth && !user) {
    router.push('/login');
  } else {
    next();
  }
});


export default router;
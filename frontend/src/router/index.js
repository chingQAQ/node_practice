import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/components/Home.vue';
import MessageApi from '@/components/MessageApi.vue';
import Liff from '@/components/Liff.vue';
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/messageApi',
    component: MessageApi,
  },
  {
    path: '/liff',
    component: Liff,
  }
]

export default new VueRouter({ mode: 'history', routes: routes });

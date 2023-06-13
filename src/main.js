import Vue from 'vue'
import App from './App.vue'
import vuetify from "@/plugins/vuetify";
// import '@mdi/font/css/materialdesignicons.css';
import router from "./router";
import axios from 'axios';
import { mdiAccount } from '@mdi/js'
import Chart from 'chart.js/auto';

console.log(mdiAccount); // "M...Z"

// eslint-disable-next-line vue/multi-word-component-names

Vue.config.productionTip = false

Vue.prototype.$http = axios;
// Vue.prototype.$api = 'http://127.0.0.1:8000/api';
// Vue.prototype.$baseUrl = 'http://127.0.0.1:8000';
Vue.prototype.$api = 'https://backendgofit.gofitceria.com/public/api';
Vue.prototype.$baseUrl = 'https://backendgofit.gofitceria.com/public';
new Vue({
  vuetify,
  router,
  Chart,
  render: (h) => h(App),
}).$mount("#app")

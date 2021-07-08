import Vue from "vue";
// import firebase antes de App.vue
import firebase from "firebase";

import App from "./App.vue";
import router from "./router";
import store from "./store";

import "material-icons/iconfont/material-icons.css";

Vue.config.productionTip = false;

const firebaseConfig = {
  apiKey: "AIzaSyBa9fHbqpNy1oyq6DcBd55ALft_DBhKaFs",
  authDomain: "rommies-33efd.firebaseapp.com",
  databaseURL: "https://rommies-33efd-default-rtdb.firebaseio.com",
  projectId: "rommies-33efd",
  storageBucket: "rommies-33efd.appspot.com",
  messagingSenderId: "917015906926",
  appId: "1:917015906926:web:8b32b46b1d37bb9db8f47f",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  store,
  render: (h) => h(App),
  beforeCreate() {
    this.$store.dispatch("FETCH_USER", { id: store.state.authId });
  },
}).$mount("#app");

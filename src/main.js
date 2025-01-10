import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import i18n from "./i18n";
import './assets/global.css';
import io from 'socket.io-client'; // Import socket.io-client

loadFonts();

// Initialize socket connection
const socket = io("http://localhost:3001"); // Your server's address

const app = createApp(App)
  .use(router)
  .use(vuetify)
  .use(i18n());

// Provide socket connection globally to all components
app.config.globalProperties.$socket = socket;

app.mount("#app");

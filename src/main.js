import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import i18n from "./i18n";
import './assets/global.css'

loadFonts();

createApp(App).use(router).use(vuetify).use(i18n()).mount("#app");

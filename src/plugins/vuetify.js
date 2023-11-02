// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { VBtn } from 'vuetify/components/VBtn';

// Vuetify
import { createVuetify } from "vuetify";
import {
  VDataTable,
  VDataTableServer,
  VDataTableVirtual,
} from "vuetify/labs/VDataTable";
export default createVuetify({
  components: {
    VDataTable,
    VDataTableServer,
    VDataTableVirtual,
  },
  aliases: {
    VBtnPrimary: VBtn,
  },

  defaults: {
    VBtnPrimary: {
      class: ['v-btn--primary', 'text-none'],
    },
  },
});

<template>
  <div>
     <!-- <select class="App-language" v-model="locale">
          <option
            v-for="optionLocale in supportLocales"
            :key="`locale-${optionLocale}`"
            :value="optionLocale.value">{{ optionLocale.title }}
          </option>
        </select> -->

    <v-select  v-model="locale"
      :items="supportLocales"
    ></v-select>

  </div>
</template>
<script setup>
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SUPPORT_LOCALES as supportLocales, setI18nLanguage } from '../../i18n';
const { locale } = useI18n({ useScope: 'global' });

watch(locale, (val) => {
  setI18nLanguage(val);
});

</script>
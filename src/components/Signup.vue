<template>
  <v-app id="signup" class="secondary">
    <v-content>
      <v-container>
        <v-card :loading="loading" class="mx-auto my-12" max-width="374">
          <v-img class="mt-4" height="180" src="../assets/logo.svg"></v-img>
          <v-card-title class="text-center">Signup</v-card-title>
           <v-form>
             <TextField :fields="text_sample" />
             <TextField :fields="text_sample2" />
                <v-card-actions>
               <v-btn block color="primary" @click="signup" :loading="loading">Signup</v-btn>
          </v-card-actions>
           </v-form>
        </v-card>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import TextField from '@/components/core/TextField';
export default {
  name:"signup",
   components: {
    TextField,
  },
    data: () => ({
    text_sample: {
      label: 'User Name',
      text: ''
    },
    text_sample2: {
      label: 'password',
      text: ''
    },
  }),
    methods: {
    signup() {
       this.$router.push({ name: 'dashboard' });
    }
  }
}
</script>
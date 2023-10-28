<template>
  <v-app id="login" class="secondary">
    <v-content>
      <v-container>
        <v-card :loading="loading" class="mx-auto my-12" max-width="374">
          <v-img class="mt-4" height="180" src="../assets/logo.svg"></v-img>
          <v-card-title class="text-center">Login</v-card-title>
          <v-card-text> 
            <v-form>
              <v-text-field
                append-icon="person"
                name="login"
                label="Login"
                type="text"
                v-model="userEmail"
                :error="error"
                :rules="[rules.required]"/>
              <v-text-field
                :type="hidePassword ? 'password' : 'text'"
                :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
                name="password"
                label="Password"
                id="password"
                :rules="[rules.required, rules.min]"
                v-model="password"
                :error="error"
                @click="showPassword()"/>
            </v-form>
          </v-card-text>
          <v-divider class="mx-4"></v-divider>
          <v-card-actions>
          <v-btn block color="primary" @click="login" :loading="loading">Login</v-btn>
          </v-card-actions>
          <div class="d-flex justify-space-between align-center mx-3">
             <v-card-title class="text-overline">New user?</v-card-title>
          <v-btn color="primary" @click="signup" :loading="loading">Signup</v-btn>
          </div>
        </v-card>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name:"Login",
  data() {
    return {
      loading: false,
      userEmail: 'admin@yopmail.com',
      password: '12345678',
      hidePassword: true,
      error: false,
      showResult: false,
      result: '',
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
      }
    }
  },

  methods: {
    showPassword() {
      this.hidePassword = !this.hidePassword;
    },
    login() {
      if (!this.userEmail || !this.password) {
 
        this.result = "Email and Password can't be null.";
        this.showResult = true;
        return;
      }

      if (this.userEmail && this.password) {
        this.$router.push({ name: 'dashboard' });
      }
    },
    signup() {
       this.$router.push({ name: 'signup' });
    }
  }
}
</script>


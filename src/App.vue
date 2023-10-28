<template>
  <div>
    <template v-if="!$route.meta.allowAnonymous">
      <v-app>
        <Navbar/>
        <v-content class="ma-4">
          <router-view />
        </v-content>
        <Footer/>
      </v-app>
    </template>
    <template v-else>
      <transition>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </template>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"
export default {
  name: "App",
  components: {
    Navbar,
    Footer
  },
  data: () => ({
    //
  }),
};
</script>

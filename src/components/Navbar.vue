<template>
  <nav>
    <v-app-bar color="red" dark app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase">
      <span>Vue BoilerPlate</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn id="menu-activator" >
        <img src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Sunglasses&hairColor=Black&facialHairType=Blank&clotheType=CollarSweater&clotheColor=Black&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light" />
      </v-btn> -->

      <v-btn id="menu-activator"
        class="ma-2"
        color="indigo"
        icon="mdi-cloud-upload"
      ></v-btn>
    <v-menu activator="#menu-activator">
      <v-list>
        <v-list-item
          v-for="(item, index) in links"
          :key="index"
          :value="index"
        >
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
      <!-- <v-menu offset-y>
        <template v-slot:activator="{on}">
          <v-btn text v-on="on">
            <v-icon left>expand_more</v-icon>
            <span>Menu</span>
          </v-btn>
        </template>
        <v-list flat>
          <v-list-item v-for="link in links"  :key="link.text" router :to="link.route" active-class="border">
            <v-list-item-title >{{link.text}}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu> -->
      <!-- <v-btn text>
        <span>Exit</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn> -->
    </v-app-bar>
     <v-navigation-drawer  v-model="drawer" dark app class="red darken-4">
      <v-layout column align-center>
            <v-flex class="mt-5"> 
                <v-avatar size="100">
                        <img src="/img1.png" alt="">
                </v-avatar>
                <p class="white--text subheading mt-1 text-center">Username</p>
            </v-flex>
            <v-flex class="mt-4 mb-4">
            <Popup />
            </v-flex>
      </v-layout>
      <v-list flat>
          <v-list-item v-for="link in links"  :key="link.text" router :to="link.route" active-class="border">
            <template v-slot:prepend>
              <v-icon :icon="link.icon"></v-icon>
            </template>
              <v-list-item-content >
                <v-list-item-title >{{link.text}}</v-list-item-title>
              </v-list-item-content>
          </v-list-item>
      </v-list>

    </v-navigation-drawer>
  </nav>
</template>
<script>
import Popup from "./Popup.vue";
export default {
  data: () => ({
    drawer: true,
    links :[
      {icon: "mdi-clock", text:"Dashboard", route: "/"},
      {icon: "folder", text:"My Project", route: "/projects"},
      {icon: "person", text:"Team", route: "/team"}
    ]
  }),
  components: {
    Popup
  },
}
</script>
<style scoped>
.border {
  border-left: 4px solid #0ba518;
}
</style>

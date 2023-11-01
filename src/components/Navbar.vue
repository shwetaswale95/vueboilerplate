<template>
  <nav>
    <v-app-bar dark app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase">
      <span>{{$t('admin-template')}}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <Language/>
      <div id="menu-activator" class="cursor-pointer">
        <v-avatar>
          <img src="https://cdn.vuetifyjs.com/images/john.jpg"
              alt="John">
        </v-avatar>
        <span class="mx-4"> username</span>
      </div>
     
    <v-menu activator="#menu-activator">
      <v-list>
        <v-list-item
          v-for="(item, index) in drpdownMenu"
          :key="index"
          :value="index"
          router :to="item.route"
        >
        <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    </v-app-bar>
     <v-navigation-drawer  v-model="drawer" dark app class="red darken-4">
      <v-list dense>
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
import SvgIcon from '@jamescoyle/vue-icon';
import Language from "@/components/core/Language";
export default {
  components: {
		SvgIcon,
    Language
	},
  data: () => (
    {
    drawer: true,
    links :[
      {icon: "mdi-view-dashboard", text:"Dashboard", route: "/"},
      {icon: "mdi-information", text:"card", route: "/about"},
    ],
    drpdownMenu :[
      {icon: "mdi-account", text:"Profile", route: "/"},
      {icon: "mdi-cog", text:"Settings", route: "/projects"},
      {icon: "mdi-logout", text:"Logout", route: "/login"}
    ]
  }),
}
</script>
<style scoped>
.border {
  border-left: 4px solid #0ba518;
}
</style>

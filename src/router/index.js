import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import About from "../views/About.vue";
import Login from "../components/Login.vue";
import Signup from "../components/Signup.vue";

const routes = [
  {
    path: "/",
    name: "dashboard",
    component: Dashboard,
  },
  {
    path: "/about",
    name: "about",
    component: About,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      allowAnonymous: true
    }
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
    meta: {
      allowAnonymous: true
    }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

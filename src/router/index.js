import { createRouter, createWebHistory } from "vue-router";
// import HomeView from "../views/HomeView.vue";
import Dashboard from "../views/Dashboard.vue";
import Projects from "../views/Projects.vue";
import Team from "../views/Team.vue";

const routes = [
  {
    path: "/",
    name: "dashboard",
    component: Dashboard,
  },
  {
    path: "/projects",
    name: "projects",
    component: Projects,
  },
  {
    path: "/team",
    name: "team",
    component: Team,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

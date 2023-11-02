import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import About from "../views/About.vue";
import Component from "../views/Component.vue";
import Login from "../components/Login.vue";
import Signup from "../components/Signup.vue";


function guardMyroute(to, from, next)
{
 var isAuthenticated= false;
//this is just an example. You will have to find a better or 
// centralised way to handle you localstorage data handling 
if(localStorage.getItem('LoggedUser'))
  isAuthenticated = true;
 else
  isAuthenticated= false;
 if(isAuthenticated) 
 {
  next(); // allow to enter route
 } 
 else
 {
  next('/login'); // go to '/login';
 }
}
const routes = [
  {
    path: "/",
    name: "dashboard",
    beforeEnter : guardMyroute,
    component: Dashboard,
  },
  {
    path: "/about",
    name: "about",
    beforeEnter : guardMyroute,
    component: About,
  },
  {
    path: "/component",
    name: "component",
    beforeEnter : guardMyroute,
    component: Component,
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

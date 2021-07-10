import Vue from "vue";
import Router from "vue-router";
import HomePage from "../views/HomePage.vue";
import SearchPage from "../views/SearchPage.vue";
import NotFoundPage from "../views/NotFoundPage.vue";
import CreateHousePage from "../views/CreateHousePage.vue";

// User Pages
import ProfilePage from "../views/user/ProfilePage.vue";
import HousesPages from "../views/user/HousesPage.vue";

import store from "../store";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "HomePage",
      component: HomePage,
    },
    {
      path: "/search",
      name: "SearchPage",
      component: SearchPage,
    },
    {
      path: "/user",
      redirect: { name: "ProfilePage" },
    },
    {
      path: "/user/profile",
      name: "ProfilePage",
      component: ProfilePage,
      // protegemos ProfilePage
      meta: {
        requiresAuth: true,
      },
    },
    // mostramos las habitaciones disponibles del user
    {
      path: "/user/houses",
      name: "HousesPages",
      component: HousesPages,
      meta: {
        requiresAuth: true,
      },
    },
    // si el usuario ingresa /house se redirecciona al ProfilePage
    {
      path: "/house",
      redirect: { name: "ProfilePage" },
    },
    // crear una nueva habitacion
    {
      path: "/house/new",
      name: "CreateHousePage",
      component: CreateHousePage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "*",
      name: "NotFoundPage",
      component: NotFoundPage,
    },
  ],
});

// Agregamos los guards. verifficamos cada ruta que se accede
router.beforeEach((to, from, next) => {
  // de las rutas que van entrando verificamos si alguna ruta requiere autenticacion
  // si ruta de entrada (to) coindice con alguna de las rutas requiere autenticacion
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    // si lla ruta requiere atenticacion validamos que el user este autenticado
    if (store.state.authId) {
      // si esta autenticado, lo dejamos pasar
      next();
    }
    // al no estar autenticado lo enviamos a la HomePage
    else {
      next({ name: "HomePage" });
    }
  }
  // si no requiere de autenticacion la dejamos pasar y mostramos la pagina solicitada
  else {
    next();
  }
});

export default router;

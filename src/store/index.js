import Vue from "vue";
import Vuex from "vuex";

import sourceData from "../data.json";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // adicionamos los datos de nuestro archivo data.json con el spread operator
    ...sourceData,
    user: null,
    authId: "38St7Q8Zi2N1SPa5ahzssq9kbyp1",
    modals: {
      login: false,
    },
  },
  mutations: {
    /**
     * function que actualiza el state
     * @param state
     * @param payload {name, value}
     */
    SET_MODAL_STATE: (state, { name, value }) => {
      // modificamos la variable modals que contiene al modal login y le cambiamos el valor
      state.modals[name] = value;
    },
  },
  actions: {
    /**
     * funcion que realiza el toggle de cualquier modal en la app
     * @param {commit} la accion recibe un commit
     * @param {name, value} payload - valores para modificar el state. name = nombre modal to show, value= valor a procesar
     */
    TOGGLE_MODAL_STATE: ({ commit }, { name, value }) => {
      // lanzamos los datos que la mutation necesita para actualizar el state
      commit("SET_MODAL_STATE", { name, value });
    },
  },
  getters: {
    // funcion que retorna los datos del state
    modals: (state) => state.modals,
    // recibe el state y retorna el user con la authId que hemos definido dentro del Vuex
    // getter se va al state dentro del state esta el objeto user y obtenemos el user cuyo authId coincida
    authUser: (state) => state.users[state.authId],

    // obtenemos las habtaciones
    rooms: (state) => state.rooms,
  },
  modules: {},
});

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
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
  },
  modules: {},
});

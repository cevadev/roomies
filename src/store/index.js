import Vue from "vue";
import Vuex from "vuex";

import sourceData from "../data.json";
import countObjectProperties from "../utils/countobjectprops.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // volcamos los datos de nuestro archivo data.json con el spread operator
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

    // mutator que agrega un room al objeto rooms del state
    // le pasamos el state y un objet que contiene la nueva room y roomId
    SET_ROOM(state, { newRoom, roomId }) {
      // los objetos no se modifican de manera reactiva dentro de VUEJs. con Vue.set hacemos un push
      // para actualizar los datos
      // dentro del objeto rooms añadimos el nuevo room
      Vue.set(state.rooms, roomId, newRoom);
    },

    // mutator que agregar un room al objeto rooms del user
    // pasamos el state, el id del room a agregar y el id del user que se le asignará la nueva room
    APPEND_ROOM_TO_USER(state, { roomId, userId }) {
      Vue.set(state.users[userId].rooms, roomId, roomId);
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
    // action que nos permite agregar un nuevo room al state
    // commit -> lanzará los mutators
    // room -> payload que contiene al nuevo objeto room agregado
    CREATE_ROOM: ({ state, commit }, room) => {
      const newRoom = room;
      // generamos un id
      const roomId = `room${Math.random()}`;
      newRoom[".key"] = roomId;
      // asignamos el id del user autenticado al nuevo room que se esta creando
      newRoom.userId = state.authId;

      // Lanzamos las mutaciones:
      // 1. Registramos el room en el state
      // 2. Agregamos el room al objeto user dentro del state
      commit("SET_ROOM", { newRoom, roomId });
      commit("APPEND_ROOM_TO_USER", { roomId, userId: newRoom.userId });
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

    // le pasamos el id
    userRoomsCount: (state) => (id) =>
      countObjectProperties(state.users[id].rooms),
  },
  modules: {},
});

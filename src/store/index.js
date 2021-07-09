import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";

// import sourceData from "../data.json"; los datos vienen desde Firebase
import countObjectProperties from "../utils/countobjectprops.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // volcamos los datos de nuestro archivo data.json con el spread operator
    // sourceData ya no es local sino desde Firebase
    // ...sourceData,
    // user: null,

    // inicializamos los recursos dentro del state
    users: {},
    services: {},
    rooms: {},
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

    // Mutator que registra los datos de los rooms en Vuex
    // param state
    // param {item (room), id (roomId), resource (rooms)} -> room que recuperamos desde firebase
    SET_ITEM(state, { item, id, resource }) {
      // generamos el nuevo elemento (room) ya que no podemos modificar los params que enviamos a la funcion
      const newItem = item;
      // agregamos una nueva key llamada .key que contiene el id del room
      newItem[".key"] = id;
      // seteamos los valores dentro del state con el room, roomId y el nuevo campo .key
      Vue.set(state[resource], id, newItem);
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
      // obtenemos el id para la nueva publicacion
      const roomId = firebase
        .database()
        .ref("rooms")
        .push().key;

      // asignamos el id del user autenticado al nuevo room que se esta creando
      newRoom.userId = state.authId;
      newRoom.publishedAt = Math.floor(Date.now() / 1000);
      newRoom.meta = { likes: 0 };

      // Cuando creamos una nueva publicacion debemos hacer 2 actualizaciones:
      // primero la nueva publicacion se registra dentro de rooms
      // segundo actualizar el user para indicarle que se ha creado una nueva publicacion que esta vinculada
      // al user. La actualizacion simultanea en firebase se realiza a traves de objetos
      const updates = {};
      // query que actualiza dentro de la coleccion rooms, el elemento con el roomId, se agregamos la nueva publicac
      updates[`rooms/${roomId}`] = newRoom;
      /// query que actualiza dentro de la coleccion users
      // path -> users/userId/rooms/roomId
      updates[`users/${newRoom.userId}/rooms/${roomId}`] = roomId;
      // le indicamos a firebase que queremos hacer estas actualizaciones
      firebase
        .database()
        .ref()
        // le pasamos el objeto de que contiene las actualizacones
        .update(updates)
        // la operacion update retorna una promise
        .then(() => {
          // Lanzamos las mutaciones:
          // 1. Registramos el room en el state
          // 2. Agregamos el room al objeto user dentro del state
          commit("SET_ROOM", { newRoom, roomId });
          commit("APPEND_ROOM_TO_USER", { roomId, userId: newRoom.userId });
          // resolvemos la promesa
          return Promise.resolve(state.rooms[roomId]);
        });
    },
    // Obtenemos las habitaciones disponbles en el BD
    // {state, commit} -> params para las mutaciones
    // limit -> payload
    FETCH_ROOMS: ({ state, commit }, limit) =>
      // manejamos promesas ya que firebase tardara cierto tiempo en retornar la informacion
      new Promise((resolve) => {
        // creamos una instancia de firebase y obtenemos los dato de rooms
        let instance = firebase.database().ref("rooms");
        // si indicamos limit en la obtenencion de datos, limitamos la cantidad de datos a recibir
        if (limit) {
          instance = instance.limitToFirst(limit);
        }

        // Generamos el query que retorna un snapshot de datos
        instance.once("value", (snapshot) => {
          // almacenamos los rooms del snapshot
          const rooms = snapshot.val();

          // Inyectamos los datos hacia Vuex utilizando el mutator SET_ITEM
          // Iteramos los elementos del array rooms y por cada room recuperaos el roomId
          Object.keys(rooms).forEach((roomId) => {
            // de nuestro array de rooms, recuperamos el room que se esta iterando pasando el roomId
            const room = rooms[roomId];
            // Llamamos al mutator para registrar el room en el state manejado por Vuex
            // vamos a modificar el recurso rooms, pasamos el roomId y el elemento room
            // Por cada elemento que se seleccione dentro del array rooms lo agregamos a vuex
            commit("SET_ITEM", { resource: "rooms", id: roomId, item: room });
          });
          // resolvemos la promesa
          resolve(Object.values(state.rooms));
        });
      }),

    // obtenemos los datos de User
    FETCH_USER: ({ state, commit }, { id }) =>
      new Promise((resolve) => {
        firebase
          .database()
          // documento users
          .ref("users")
          // elemento hijo que coincida con el id
          .child(id)
          // por cada valor hacemos una accion
          .once("value", (snapshot) => {
            // setteamos los valores del user para almacenarlos en Vuex
            commit("SET_ITEM", {
              resource: "users",
              id: snapshot.key,
              item: snapshot.val(),
            });
            // resolvemos la funcion,buscamos al user segun el id dentro del state
            resolve(state.users[id]);
          });
      }),
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

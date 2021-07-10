<template>
  <div class="current-user">
    <!--slot principal todo lo que se coloque dentro de este componente se a inyectar dentro de el
        el slot hacia afuera lanza la informacion del user-->
    <slot :user="user"></slot>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "CurrentUser",
  computed: {
    ...mapGetters({
      user: "authUser",
    }),
  },
};
</script>

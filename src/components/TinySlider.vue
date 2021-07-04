<template>
  <vue-tiny-slider>
    <slot></slot>
  </vue-tiny-slider>
</template>

<script>
import VueTinySlider from "vue-tiny-slider";
export default {
  name: "TinySlider",
  components: {
    VueTinySlider,
  },
  props: {
    options: {
      type: Object,
      default: {
        mouseDrag: false,
        loop: true,
        autoInit: true,
        controls: true,
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./node_modules/tiny-slider/src/tiny-slider.scss";
</style>

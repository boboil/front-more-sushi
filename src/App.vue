<template>
  <div class="wrapper">
    <HeaderComponent :product="cartProducts" />
    <div id="app">
      <router-view @addToCart="addToCart"/>
    </div>
    <FooterComponent/>
  </div>
</template>

<script>
import FooterComponent from "@/components/layouts/FooterComponent";
import HeaderComponent from "@/components/layouts/HeaderComponent";

export default {
  name: 'App',
  components: {
    FooterComponent,
    HeaderComponent
  },
  data() {
    return {
      categories: [],
      cartProducts: {}
    }
  },
  methods: {
    addToCart(products) {
      this.cartProducts = products
    }
  },

}
</script>

<style>

</style>

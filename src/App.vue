<template>
  <div class="wrapper">
    <HeaderComponent :product="cartProduct" @cartAdded="clearCartProduct"/>
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
      cartProduct: {}
    }
  },
  methods: {
    addToCart(product) {
      this.cartProduct = product
    },
    clearCartProduct() {
      this.cartProduct = {}
    }
  },

}
</script>

<style>

</style>

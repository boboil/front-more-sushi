<template>
  <div class="wrapper">
    <HeaderComponent
        :product="cartProduct"
        :clear-cart="clear"
        @cartAdded="clearCartProduct"
        @cartCleared="cartCleared"
    />
    <div id="app">
      <router-view
          @addToCart="addToCart"
          @clearCart="clearCart"
      />
    </div>
    <FooterComponent />
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
      cartProduct: {},
      clear: false
    }
  },
  methods: {
    addToCart(product) {
      this.cartProduct = product
    },
    clearCartProduct() {
      this.cartProduct = {}
    },
    cartCleared() {
      this.clear = false
    },
    clearCart() {
      this.clear = true
    }
  },

}
</script>

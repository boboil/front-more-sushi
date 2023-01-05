<template>
  <div :class="{ 'mobile-menu-open': mobileMenuOpen }">
    <header class="header">
      <div class="container">
        <button class="burger-btn" @click="mobileMenuOpen = !mobileMenuOpen">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div class="logo">
          <router-link to="/">
            <img src="../.././assets/img/logo.svg" alt="">
          </router-link>
        </div>
        <div class="collapsed">
          <nav class="menu">
            <ul>
              <li>
                <router-link to="/" active-class="active">Головна</router-link>
              </li>
              <li>
                <router-link to="/catalog" active-class="active">Меню</router-link>
              </li>
              <li>
                <a href="/">Акції</a>
              </li>
              <li>
                <router-link to="/delivery" active-class="active">Доставка</router-link>
              </li>
              <li>
                <router-link to="/contacts" active-class="active">Контакти</router-link>
              </li>
            </ul>
          </nav>

          <div class="contacts">
            <a href="https://instagram.com/darymorya.sushi.sumy" rel="nofollow noopener" class="insta" target="_blank">
              <img src="../.././assets/img/icons/icon-insta.png" alt="">
            </a>
            <a href="tel:0990663511" class="phone">
              <img src="../.././assets/img/icons/icon-phone.png" alt="">
              <span>099-066-35-11</span>
            </a>
          </div>
        </div>
        <!-- выводи корзину если есть продукты -->
        <CartComponent :cart-product="product"/>
      </div>
    </header>
  </div>
</template>
<script>
import CartComponent from "@/components/CartComponent.vue";

export default {
  name: "HeaderComponent",
  components: {CartComponent},
  props: {
    product: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      mobileMenuOpen: false
    }
  }
}
</script>

<style scoped>
.burger-btn {
  z-index: 3;
}
</style>
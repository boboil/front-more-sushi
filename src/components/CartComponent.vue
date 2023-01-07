<template>
  <div v-if="products.length" class="cart" :class="{ 'open' : openCart }">
    <button class="cart-btn" @click="openCart = !openCart">
      <img :src="assetIcon('icon-cart', 'png')" alt="cartIcon">
      <span>{{ fullQuantity }}</span>
    </button>
    <div class="cart-inner">
      <table class="cart-table">
        <thead>
        <tr>
          <th>
            Продукт
          </th>
          <th>
            Цiна
          </th>
          <th>
            Кiлькiсть
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="product in products" v-bind:key="product.id">
          <td>
            <div class="cart-product-info">
              <button @click="removeProduct(product.id)"></button>
              <img
                  :src="product.main_image"
                  alt="">
              <h3>
                {{ product.title }}
              </h3>
            </div>
          </td>
          <td>
            <div class="cart-product-price">
              {{ product.price }} <span>грн</span>
            </div>
          </td>
          <td>
            <div class="cart-product-quantity">
              <button @click="product.quantity -= 1">-</button>
              <input type="number" min="1" v-model="product.quantity">
              <button @click="product.quantity += 1">+</button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="cart-summary">
        <div
            v-if="fullPrice < 650"
            class="cart-delivery-annotation">
          Безкоштовна доставка від 650 грн
        </div>
        <div
            v-else
            class="cart-delivery-annotation">
          Безкоштовна доставка
        </div>
        <div class="cart-total">
          До сплати: <span>{{ fullPrice + 80 }} грн</span>
        </div>
      </div>
      <button
          class="btn green cart-proceed"
          @click="goToCheckout">оформити замовлення
      </button>
    </div>
  </div>
</template>

<script>
import {assetIcon} from '@/helpers/helpers'

export default {
  name: "CartComponent",
  props: {
    cartProduct: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      openCart: false,
      products: [],
      assetIcon
    }
  },
  watch: {
    cartProduct() {
      this.addToCart(this.cartProduct)
    }
  },
  mounted() {
    this.getCart()
  },
  methods: {
    goToCheckout() {
      this.openCart = false
      this.$router.push('/checkout')
    },
    getCart() {
      if (localStorage.getItem('products')) {
        try {
          this.products = JSON.parse(localStorage.getItem('products'));
        } catch (e) {
          localStorage.removeItem('products');
        }
      }
    },
    addToCart(product) {
      if (Object.keys(product).length === 0) {
        return;
      }
      let cartProduct = this.products.find(el => el.id === product.id)
      if (!cartProduct) {
        product.quantity = 1
        this.products.push(product)
      } else {
        cartProduct.quantity += 1
      }
      this.saveCart()
      this.$emit('cartAdded')
    },
    saveCart() {
      localStorage.setItem('products', JSON.stringify(this.products))
    },
    removeProduct(id) {
      this.products = this.products.filter(el => el.id !== id)
      this.saveCart()
    }
  },
  computed: {
    fullPrice() {
      let sum = 0
      this.products.forEach(({price, quantity}) => {
        sum += price * quantity
      })
      return sum
    },
    fullQuantity() {
      let sum = 0
      this.products.forEach(({quantity}) => {
        sum += quantity
      })
      return sum
    }
  }
}
</script>
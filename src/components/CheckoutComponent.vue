<template>
  <main class="content">
    <section class="block-checkout">
      <div class="container">
        <h1 class="block-title">
          оформлення замовлення
        </h1>
        <div class="checkout">
          <table class="checkout-table" v-if="products.length">
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
            <tr v-for="product in products" :key="product.id">
              <td>
                <div class="checkout-product-info">
                  <button></button>
                  <img :src="product.main_image" :alt="product.title">
                  <h3>
                    {{ product.title }}
                  </h3>
                </div>
              </td>
              <td>
                <div class="checkout-product-price">
                  {{ product.price }} <span>грн</span>
                </div>
              </td>
              <td>
                <div class="checkout-product-quantity">
                  <button type="button" @click="product.quantity -= 1">-</button>
                  <input type="number" min="1" v-model="product.quantity">
                  <button type="button" @click="product.quantity += 1">+</button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
          <div class="checkout-related">
            <h3 class="checkout-related-title">
              БажаЄте додати напоÏ чи соуси?
            </h3>
            <div class="checkout-related-products">
              <div class="related-slider swiper-container js-related-swiper">
                <div class="swiper-wrapper">
                  <SliderComponent/>
                </div>
              </div>
            </div>
          </div>
          <div class="checkout-summary">
            <div class="checkout-delivery-annotation">
              Безкоштовна доставка від 650 грн
            </div>
            <div class="checkout-total">
              До сплати: <span>{{ fullPrice }} грн</span>
            </div>
          </div>

          <form class="checkout-form" @submit.stop.prevent="addOrder">
            <div class="checkout-group">
              <h3>Контактнi данi</h3>
              <div class="input-wrapper">
                <label for="customer_name">Ваше ім'я</label>
                <input
                    v-model="customer.name"
                    type="text"
                    placeholder="Ваше ім'я"
                    required
                    class="regular-input"
                >
              </div>
              <div class="input-wrapper">
                <label for="customer_phone">Ваш телефон</label>
                <input
                    v-model="customer.phone"
                    type="text"
                    placeholder="+38(___)-___-__-__"
                    name="customer_phone"
                    id="customer_phone"
                    class="regular-input phone-mask"
                    required
                    maxlength="18">
              </div>
            </div>
            <div class="checkout-group">
              <h3>Варіант отримання замовлення</h3>
              <div class="radio-wrapper">
                <input
                    v-model="customer.delivery"
                    type="radio"
                    hidden
                    checked
                    value="Самовивiз"
                    id="order-radio-1"
                >
                <label for="order-radio-1"><span></span> Самовивiз (м. Суми, вул. Адреса 1/1)</label>
              </div>
              <div class="radio-wrapper">
                <input
                    v-model="customer.delivery"
                    type="radio"
                    hidden
                    value="Кур'єр"
                    id="order-radio-2"
                >
                <label for="order-radio-2"><span></span> Доставка кур'єром</label>
              </div>
              <!-- if delivery -->
              <div class="delivery-inputs">
                <div class="input-wrapper">
                  <label for="customer_street">Вулиця</label>
                  <input
                      v-model="customer.street"
                      type="text"
                      placeholder="Вулиця"
                      name="customer_street"
                      id="customer_street"
                      required
                  >
                </div>
                <div class="input-wrapper">
                  <label for="customer_building">Номер будинку</label>
                  <input
                      v-model="customer.building"
                      type="text"
                      placeholder="Будинок"
                      name="customer_building"
                      id="customer_building"
                      required
                  >
                </div>
              </div>
            </div>
            <div class="checkout-group">
              <h3>Спосiб оплати</h3>
              <div class="radio-wrapper">
                <input
                    v-model="customer.payment"
                    type="radio"
                    checked
                    hidden
                    name="online_payment"
                    value="готівка"
                    id="payment-radio-1"
                >
                <label for="payment-radio-1"><span></span> Кур'єру готiвкою </label>
              </div>
              <div class="radio-wrapper">
                <input
                    v-model="customer.payment"
                    type="radio"
                    hidden
                    name="online_payment"
                    value="термінал"
                    id="payment-radio-2"
                >
                <label for="payment-radio-2"><span></span> Оплата кур'єру термiналом</label>
              </div>
            </div>
            <div class="checkout-group">
              <h3>Додатковi опцii</h3>
              <div class="checkout-subgroup">
                <h4>
                  Тип палочок:
                </h4>
                <div class="quantity-item">
                  <span>Звичайнi</span>
                  <button type="button" @click="customer.sticks.standard -=1">–</button>
                  <input
                      v-model="customer.sticks.standard"
                      type="text"
                      disabled
                      min="1"
                      value="1"
                      max="10"
                  >
                  <button type="button" @click="customer.sticks.standard +=1">+</button>
                </div>
                <div class="quantity-item">
                  <span>Тренувальнi</span>
                  <button type="button" @click="customer.sticks.educational -=1">–</button>
                  <input
                      v-model="customer.sticks.educational"
                      type="text"
                      disabled
                      min="0"
                      max="10"
                  >
                  <button type="button" @click="customer.sticks.educational +=1">+</button>
                </div>
              </div>
              <div class="checkout-subgroup">
                <h4>Бажаний час доставки:</h4>
                <div class="radio-wrapper">
                  <input
                      v-model="customer.isAsSoonAsPossible"
                      type="radio"
                      checked
                      hidden
                      value="1"
                      id="delivery_time-1"
                  >
                  <label for="delivery_time-1"><span></span> Найближчий час </label>
                </div>
                <div class="radio-wrapper">
                  <input
                      v-model="customer.isAsSoonAsPossible"
                      type="radio"
                      hidden
                      value="2"
                      id="delivery_time-2">
                  <label for="delivery_time-2"><span></span> Запланований час </label>
                </div>

                <!-- if time -->
                <div class="date-time-inputs" v-if="customer.isAsSoonAsPossible ==='2'">
                  <div class="input-wrapper">
                    <label for="delivery_date_input">Дата</label>
                    <input
                        v-model="customer.time.day"
                        type="date"
                        id="delivery_date_input"
                        placeholder="ДД.ММ.ГГГГ"
                        autocomplete="off"
                    >
                  </div>
                  <div class="input-wrapper">
                    <label for="delivery_time_input">Час</label>
                    <input
                        v-model="customer.time.time"
                        type="time"
                        id="delivery_time_input"
                        placeholder="00:00"
                        autocomplete="off"
                    >
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" class="btn green checkout-submit">
              оформити замовлення
            </button>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import SliderComponent from "@/components/SliderComponent";

export default {
  name: "CheckoutComponent",
  components: {SliderComponent},
  data() {
    return {
      products: [],
      customer: {
        name: '',
        phone: '',
        delivery: '',
        street: '',
        building: '',
        payment: '',
        sticks: {
          standard: 0,
          educational: 0
        },
        isAsSoonAsPossible: false,
        time: {
          day: '',
          time: ''
        }
      }
    }
  },
  mounted() {
    this.getCart()
  },
  watch: {
    products() {
      this.saveCart()
    }
  },
  methods: {
    getCart() {
      if (localStorage.getItem('products')) {
        try {
          this.products = JSON.parse(localStorage.getItem('products'));
        } catch (e) {
          localStorage.removeItem('products');
        }
      }
    },
    saveCart() {
      localStorage.setItem('products', JSON.stringify(this.products))
    },
    removeProduct(id) {
      this.products = this.products.filter(el => el.id !== id)
      this.saveCart()
    },
    addOrder() {
      this.axios.post(`${this.$API_URL}/api/shop/add-order`, {
        customer: this.customer, products: this.products
      }).then((response) => {
        console.log(response.data.data)
      })
    }
  },
  computed: {
    fullPrice() {
      let sum = 0
      this.products.forEach(({price, quantity}) => {
        sum += price * quantity
      })
      return sum
    }
  }
}
</script>

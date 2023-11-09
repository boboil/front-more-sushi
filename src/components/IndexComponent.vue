<template>
  <main class="content">
    <section class="block-homescreen">
      <div class="container">
        <div class="text">
          <h1>
            Суші <br>
            <span>що смакують</span>
          </h1>
          <div class="descr">
            <p>
              Дякуємо що завітали на наш сайт! <br>
              Ми сподіваємося, що Ви знайдете те, що буде Вам до смаку. Тільки справжній сир Філадельфія, тільки краща
              риба від виробника, і найкращі інгредієнти - ніяких компромісів! <br>
              Ми , як ніхто знаємося на сушi , переконайтесь в цьому i Ви!
            </p>
          </div>
          <router-link :to="{ path: 'catalog'}" class="btn green">
            Меню
          </router-link>
        </div>
        <div class="banner">
          <img src=".././assets/img/home-banner.png" alt="">
        </div>
      </div>
    </section>

    <section class="block-categories">
      <div class="container">
        <h2 class="block-title">
          Меню
        </h2>
        <ul class="categories-list">
          <li v-for="category in categories" :key="category.id">
            <router-link :to="`/catalog?filter=${category.slug}`"
                         class="category-item">
              <div class="category-item-photo">
                <img :src="category.image"
                     :alt="category.title">
              </div>
              <div class="category-item-title">
                {{ category.title }}
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </section>
    <StockComponent is-main-page>
      <div class="loadmore-block">
        <button class="loadmore" @click="this.$router.push('/stock')">
          <span>показати більше</span>
          <span class="circle"></span>
          <span class="circle"></span>
          <span class="circle"></span>
        </button>
      </div>
    </StockComponent>


    <section class="block-seo">
      <div class="container">
        <p>
          Море Суші – це завжди свіжа рибка, смачна колаборація інгредієнтів та неперевершений сервіс!
        </p>
        <p>
          Японська кухня заполонила світ своїми незвичними поєднаннями: манго та лосось, авокадо та тунець, такуан та
          креветка...можна перелічувати їх годинами, але все ж таки краще спробувати на смак!
        </p>
        <p>
          Чому варто обрати заклад “Море Суші” у місті Суми:<br>
          - ми створюємо традиційні японські страви тільки з якісних інгредієнтів;<br>
          - маємо кваліфікований персонал, що надає послуги на найвижчому рівні;<br>
          - наші постачальники завжди слідкують за якістю продукції та мають великий досвід та високий рейтинг серед
          інших;<br>
          - кухня, де ми готуємо смачнющі суші та роли, відповідає всім стандартам за чистотою та обладнанням.
        </p>
        <p>
          Для наших клієнтів ми створили зручний сервіс доставки, встановили доступні ціни на всі позиції меню: від
          закусок до преміум-ролів та сетів.
          <br>
          Також, заклад “МореСуші” відрізняється своїм широким асортиментом у меню. У нас і гарніри, і закуски, сети
          та окремо суші, роли, преміум-роли, а також напої.
          <br>
          Ми пишаємося нашими перевагами та радимо спробувати сервіс “Море Суші”!
        </p>
      </div>
    </section>
  </main>
</template>

<script>
import StockComponent from '@/components/StockComponent'
export default {
  name: "IndexComponent",
  components: {
    StockComponent
  },
  data() {
    return {
      categories: [],
      filter: "",
      category: {},
      products: [],
      roly: [],
      sushi: [],
    }
  },
  methods: {
    addToCart(product) {
      this.$emit('addToCart', product)
    },
    getCategories() {
      return this.axios.get(`${this.$API_URL}/api/shop/catalog`)
          .then((response) => {
            this.categories = response.data.data
          }).then(() => {
            this.roly = this.categories.find(elem => elem.slug === 'roli').products.data
          })
    },
    showAlert() {
      this.$swal('Вибачте, у нас сьогодні вихідний день. Завтра ми знову будемо раді вас бачити!');
    },
  },
  mounted() {
    document.title = `Заказать Суши, Роллы и Пицца Сумы с Доставкой. Преміум Роли та Суші Суми. Піца Суми та Доставка Суші та Піци від Море Суші в Сумах`;
    this.getCategories()
  }
}
</script>

<style lang="scss" scoped>
.loadmore-block {
  display: flex;
  justify-content: center;
}
.product-item {
  &:hover {
    cursor: pointer;
  }
  .product-item-photo {
    img {
      max-height: 239px;
    }
  }
}
</style>

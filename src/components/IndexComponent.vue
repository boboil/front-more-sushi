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
          <a href="/categories.html" class="btn green">
            Меню
          </a>
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
          <li>
            <a href="/" class="category-item">
              <div class="category-item-photo">
                <img src=".././assets/img/temp/category-premium.jpg" alt="">
              </div>
              <div class="category-item-title">
                Преміум-роли
              </div>
            </a>
          </li>
          <li>
            <a href="/" class="category-item">
              <div class="category-item-photo">
                <img src=".././assets//img/temp/category-rolls.jpg" alt="">
              </div>
              <div class="category-item-title">
                Роли
              </div>
            </a>
          </li>
          <li>
            <a href="/" class="category-item">
              <div class="category-item-photo">
                <img src=".././assets//img/temp/category-sushi.jpg" alt="">
              </div>
              <div class="category-item-title">
                Суші
              </div>
            </a>
          </li>
          <li>
            <a href="/" class="category-item">
              <div class="category-item-photo">
                <img src=".././assets//img/temp/category-sets.jpg" alt="">
              </div>
              <div class="category-item-title">
                Сети
              </div>
            </a>
          </li>
          <li>
            <a href="/" class="category-item">
              <div class="category-item-photo">
                <img src=".././assets//img/temp/category-snacks.jpg" alt="">
              </div>
              <div class="category-item-title">
                Закуски
              </div>
            </a>
          </li>
          <li>
            <a href="/" class="category-item">
              <div class="category-item-photo">
                <img src=".././assets//img/temp/category-drinks.jpg" alt="">
              </div>
              <div class="category-item-title">
                Напої
              </div>
            </a>
          </li>
          <li>
            <a href="/" class="category-item">
              <div class="category-item-photo">
                <img src=".././assets//img/temp/category-salads.jpg" alt="">
              </div>
              <div class="category-item-title">
                Гарніри
              </div>
            </a>
          </li>
        </ul>
      </div>
    </section>

    <section class="block-category-products">
      <div class="container">
        <!-- если на странице одной категории то н1 -->
        <h2 class="block-title">
          Роли
        </h2>
        <!-- в одной категории тут также блок с подкатегориями -->
        <div class="category-products-list">
          <div class="product-item">
            <div class="product-item-label orange">Акция</div>
            <div class="product-item-photo">
              <img src=".././assets//img/temp/category-rolls.jpg" alt="" loading="lazy">
            </div>
            <div class="product-item-info">
              <div class="product-item-title">
                Сирний рол з лососем
              </div>
              <div class="product-item-descr">
                <p>
                  Склад: <br>
                  рис, водорості норі, сир «Філадельфія», лосось, манго, сир чеддер.&nbsp;
                </p>
              </div>
              <div class="product-item-params">
                <div class="product-item-weight">
                  260 г
                </div>
                <div class="product-item-price">
                  <span class="old-price">155</span>
                  <span class="current-price">125</span>
                  <span class="currency">
												грн
											</span>
                </div>
              </div>
              <button class="btn green small product-item-add">
                в кошик
              </button>
              <!-- <button class="btn orange small product-item-add">
                в кошику
              </button> -->
            </div>
          </div>
          <div class="product-item">
            <!-- <div class="product-item-label orange">Акция</div> -->
            <div class="product-item-photo">
              <img src=".././assets//img/temp/category-rolls.jpg" alt="" loading="lazy">
            </div>
            <div class="product-item-info">
              <div class="product-item-title">
                Сирний рол з лососем
              </div>
              <div class="product-item-descr">
                <p>
                  Склад: <br>
                  рис, водорості норі, сир «Філадельфія», лосось, манго, сир чеддер.&nbsp;
                </p>
              </div>
              <div class="product-item-params">
                <div class="product-item-weight">
                  260 г
                </div>
                <div class="product-item-price">
                  <span class="current-price">125</span>
                  <span class="currency">
												грн
											</span>
                </div>
              </div>
              <button class="btn green small product-item-add">
                в кошик
              </button>
              <!-- <button class="btn orange small product-item-add">
                в кошику
              </button> -->
            </div>
          </div>
          <div class="product-item">
            <div class="product-item-label green">Новинка</div>
            <div class="product-item-photo">
              <img src=".././assets//img/temp/category-rolls.jpg" alt="" loading="lazy">
            </div>
            <div class="product-item-info">
              <div class="product-item-title">
                Сирний рол з лососем
              </div>
              <div class="product-item-descr">
                <p>
                  Склад: <br>
                  рис, водорості норі, сир «Філадельфія», лосось, манго, сир чеддер.&nbsp;
                </p>
              </div>
              <div class="product-item-params">
                <div class="product-item-weight">
                  260 г
                </div>
                <div class="product-item-price">
                  <span class="current-price">155</span>
                  <span class="currency">
												грн
											</span>
                </div>
              </div>
              <button class="btn green small product-item-add">
                в кошик
              </button>
              <!-- <button class="btn orange small product-item-add">
                в кошику
              </button> -->
            </div>
          </div>
        </div>
        <button class="loadmore">
          <span>показати більше</span>
          <span class="circle"></span>
          <span class="circle"></span>
          <span class="circle"></span>
        </button>
      </div>
    </section>
    <section class="block-category-products">
      <div class="container">
        <h2 class="block-title">
          Суші
        </h2>
        <div class="category-products-list">
          <div class="product-item">
            <div class="product-item-label orange">Акция</div>
            <div class="product-item-photo">
              <img src=".././assets//img/temp/category-rolls.jpg" alt="" loading="lazy">
            </div>
            <div class="product-item-info">
              <div class="product-item-title">
                Сирний рол з лососем
              </div>
              <div class="product-item-descr">
                <p>
                  Склад: <br>
                  рис, водорості норі, сир «Філадельфія», лосось, манго, сир чеддер.&nbsp;
                </p>
              </div>
              <div class="product-item-params">
                <div class="product-item-weight">
                  260 г
                </div>
                <div class="product-item-price">
                  <span class="old-price">155</span>
                  <span class="current-price">125</span>
                  <span class="currency">
												грн
											</span>
                </div>
              </div>
              <button class="btn green small product-item-add">
                в кошик
              </button>
              <!-- <button class="btn orange small product-item-add">
                в кошику
              </button> -->
            </div>
          </div>
          <div class="product-item">
            <!-- <div class="product-item-label orange">Акция</div> -->
            <div class="product-item-photo">
              <img src=".././assets//img/temp/category-rolls.jpg" alt="" loading="lazy">
            </div>
            <div class="product-item-info">
              <div class="product-item-title">
                Сирний рол з лососем
              </div>
              <div class="product-item-descr">
                <p>
                  Склад: <br>
                  рис, водорості норі, сир «Філадельфія», лосось, манго, сир чеддер.&nbsp;
                </p>
              </div>
              <div class="product-item-params">
                <div class="product-item-weight">
                  260 г
                </div>
                <div class="product-item-price">
                  <span class="current-price">155</span>
                  <span class="currency">
												грн
											</span>
                </div>
              </div>
              <button class="btn green small product-item-add">
                в кошик
              </button>
              <!-- <button class="btn orange small product-item-add">
                в кошику
              </button> -->
            </div>
          </div>
          <div class="product-item">
            <div class="product-item-label green">Новинка</div>
            <div class="product-item-photo">
              <img src=".././assets//img/temp/category-rolls.jpg" alt="" loading="lazy">
            </div>
            <div class="product-item-info">
              <div class="product-item-title">
                Сирний рол з лососем
              </div>
              <div class="product-item-descr">
                <p>
                  Склад: <br>
                  рис, водорості норі, сир «Філадельфія», лосось, манго, сир чеддер.&nbsp;
                </p>
              </div>
              <div class="product-item-params">
                <div class="product-item-weight">
                  260 г
                </div>
                <div class="product-item-price">
                  <span class="current-price">155</span>
                  <span class="currency">
												грн
											</span>
                </div>
              </div>
              <button class="btn green small product-item-add">
                в кошик
              </button>
              <!-- <button class="btn orange small product-item-add">
                в кошику
              </button> -->
            </div>
          </div>
        </div>
        <button class="loadmore">
          <span>показати більше</span>
          <span class="circle"></span>
          <span class="circle"></span>
          <span class="circle"></span>
        </button>
      </div>
    </section>

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
export default {
  name: "IndexComponent"
}
</script>

<style scoped>

</style>
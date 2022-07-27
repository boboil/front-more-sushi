<template>
    <header class="header">
      <div class="container">
        <button class="burger-btn">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div class="logo">
          <a href="/">
            <img src="../.././assets/img/logo.svg" alt="">
          </a>
        </div>
        <div class="collapsed">
          <nav class="menu">
            <ul>
              <li>
                <a href="/" class="active">Головна</a>
              </li>
              <li>
                <a href="/">Меню</a>
              </li>
              <li>
                <a href="/">Акції</a>
              </li>
              <li>
                <a href="/">Доставка</a>
              </li>
              <li>
                <a href="/">Контакти</a>
              </li>
            </ul>
          </nav>

          <div class="contacts">
            <a href="https://instagram.com/darymorya.sushi.sumy" rel="nofollow noopener" class="insta" target="_blank">
              <img src="../.././assets/img/icons/icon-insta.png" alt="">
            </a>
            <a href="tel:0990663511" class="phone">
              <img src="../.././assets/img/icons/icon-phone.png" alt="">
              <span>
									099-066-35-11
								</span>
            </a>
          </div>
        </div>

        <!-- выводи корзину если есть продукты -->
        <div class="cart">
          <button class="cart-btn">
            <img src="../.././assets/img/icons/icon-cart.png" alt="">
            <span>1</span>
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
              <tr>
                <td>
                  <div class="cart-product-info">
                    <button></button>
                    <img
                        src="https://tokyo-sushi.com.ua/storage/products/7f/7f4c521c0ec05990c6e6327e17a16a7f4929f1852050.jpeg"
                        alt="">
                    <h3>
                      Акція Сет "Флай"
                    </h3>
                  </div>
                </td>
                <td>
                  <div class="cart-product-price">
                    519 <span>грн</span>
                  </div>
                </td>
                <td>
                  <div class="cart-product-quantity">
                    <button>-</button>
                    <input type="number" min="1" max="9" value="1">
                    <button>+</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cart-product-info">
                    <button></button>
                    <img
                        src="https://tokyo-sushi.com.ua/storage/products/7f/7f4c521c0ec05990c6e6327e17a16a7f4929f1852050.jpeg"
                        alt="">
                    <h3>
                      Акція Сет "Флай"
                    </h3>
                  </div>
                </td>
                <td>
                  <div class="cart-product-price">
                    519 <span>грн</span>
                  </div>
                </td>
                <td>
                  <div class="cart-product-quantity">
                    <button>-</button>
                    <input type="number" min="1" max="9" value="1">
                    <button>+</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cart-product-info">
                    <button></button>
                    <img
                        src="https://tokyo-sushi.com.ua/storage/products/7f/7f4c521c0ec05990c6e6327e17a16a7f4929f1852050.jpeg"
                        alt="">
                    <h3>
                      Акція Сет "Флай"
                    </h3>
                  </div>
                </td>
                <td>
                  <div class="cart-product-price">
                    519 <span>грн</span>
                  </div>
                </td>
                <td>
                  <div class="cart-product-quantity">
                    <button>-</button>
                    <input type="number" min="1" max="9" value="1">
                    <button>+</button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="cart-summary">
              <div class="cart-delivery-annotation">
                Безкоштовна доставка від 650 грн
              </div>
              <div class="cart-total">
                До сплати: <span>1218 грн</span>
              </div>
            </div>
            <button class="btn green cart-proceed">оформити замовлення</button>
          </div>
        </div>
      </div>
    </header>
</template>
<script>
export default {
  name: "HeaderComponent"
}
</script>

<style scoped>

</style>
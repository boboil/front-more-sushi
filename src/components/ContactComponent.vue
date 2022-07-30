<template>
  <main class="content">
    <section class="section block-contacts">
      <div class="container">
        <h1 class="block-title">Контакти</h1>
        <div class="contact-text">
          <h2>
            Наше місцезнаходження
          </h2>

          <div class="contact-items">
            <div class="contact-item">
              <h3>
                Море Суші
              </h3>
              <address class="address">
                <a href="https://maps.google.com/maps?daddr=50.915289473323675,34.814197684261224" rel="noindex nofollow noreferrer" target="_blank">
                  <img src="img/icons/icon-marker.png" alt="">
                  <span>
                                                м. Суми, вул. Троїцька, 17
                                            </span>
                </a>
              </address>
            </div>
            <div class="contact-item">
              <h3>
                Телефон
              </h3>
              <a href="tel:0990663511" class="phone">
                <img src="img/icons/icon-phone.png" alt="">
                <span>
                                            099-066-35-11
                                        </span>
              </a>
            </div>
          </div>


        </div>
        <div class="contact-form">
          <h2>
            Зворотній зв'язок
          </h2>
          <form action="/">
            <input type="text" placeholder="Ім'я">
            <input type="email" placeholder="E-mail">
            <textarea placeholder="Ваше питання або повідомлення"></textarea>
            <button type="submit" class="btn green">
              Відправити повідомлення
            </button>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: "ContactComponent"
}
</script>

<style scoped>

</style>
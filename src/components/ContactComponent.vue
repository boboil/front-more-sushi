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
                <a href="https://maps.google.com/maps?daddr=50.915289473323675,34.814197684261224"
                   rel="noindex nofollow noreferrer" target="_blank">
                  <img :src="assetIcon('icon-marker', 'png')" alt="icon-marker">
                  <span>м. Суми, вул. Троїцька, 17</span>
                </a>
              </address>
            </div>
            <div class="contact-item">
              <h3>
                Телефон
              </h3>
              <a href="tel:0990663511" class="phone">
                <img :src="assetIcon('icon-phone', 'png')" alt="icon-phone">
                <span>099-066-35-11</span>
              </a>
            </div>
          </div>


        </div>
        <div class="contact-form">
          <h2>
            Зворотній зв'язок
          </h2>
          <form @submit.stop.prevent="submitFormHandler">
            <input
                v-model="fields.name"
                type="text"
                placeholder="Ім'я"
                required
            >
            <input
                v-model="fields.email"
                type="email"
                placeholder="E-mail"
                required
            >
            <textarea
                v-model="fields.question"
                placeholder="Ваше питання або повідомлення"
                required
            >
            </textarea>
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
import {assetIcon} from "@/helpers/helpers";

export default {
  name: "ContactComponent",
  data() {
    return {
      fields: {
        name: '',
        email: '',
        question: ''
      },
      assetIcon
    }
  },
  methods: {
    submitFormHandler() {
      if (
          !this.fields.name.trim().length
          && !this.fields.email.trim().length
          && !this.fields.question.trim().length
      ) {
        return;
      }
      this.axios.post(`${this.$API_URL}/api/shop/add-question`, {
        fields: this.fields
      }).then(() => {
        this.fields = {
          name: '',
          email: '',
          question: ''
        };
      })
    }
  }
}
</script>

<style scoped>

</style>
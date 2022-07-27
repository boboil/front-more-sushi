<template>
  <div class="wrapper">
    <HeaderComponent/>
    <div id="app">
      <router-view/>
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
      categories: []
    }
  },
  methods: {
    getCategories() {
      return this.axios.get('http://localhost/api/admin-order')
          .then((response) => {
            this.categories = response.data.data
          })
    }
  },
  mounted() {
    this.getCategories()
  }
}
</script>

<style>

</style>

<template>
  <div>
    <pre v-if="sitemap">{{ sitemap }}</pre>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sitemap: null,
      error: null
    };
  },
  mounted() {
    this.fetchSitemap();
  },
  methods: {
    async fetchSitemap() {
      try {
        const response = await fetch(`${this.$API_URL}/api/shop/sitemap`);
        if (!response.ok) {
          throw new Error('Failed to fetch the sitemap');
        }
        const data = await response.json();
        this.sitemap = data;
      } catch (err) {
        this.error = err.message;
      }
    }
  }
};
</script>

<style scoped>
/* You can style your sitemap content here if needed */
</style>

<template>
  <footer class="footer">
    <div class="container">
      <div class="contacts">
        <a href="tel:0990663511" class="phone">
          <img :src="assetIcon('icon-phone', 'png')" alt="phone-icon">
          <span>
								099-066-35-11
							</span>
        </a>

        <address class="address">
          <a href="https://maps.google.com/maps?daddr=50.915289473323675,34.814197684261224"
             rel="noindex nofollow noreferrer" target="_blank">
            <img :src="assetIcon('icon-marker', 'png')" alt="address-icon">
            <span>
									м. Суми, вул. Троїцька, 17
								</span>
          </a>
        </address>
      </div>
      <div class="copyright">
        © {{ currentYear }} All rights reserved
      </div>
      <div class="logo">
        <img :src="assetImage('logo')" alt="logo">
      </div>
    </div>
  </footer>
</template>

<script>
import {assetIcon, assetImage} from '@/helpers/helpers'
export default {
  name: "FooterComponent",
  data() {
    return {
      assetIcon,
      assetImage
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear().toString()
    }
  }
}
</script>
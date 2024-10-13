import * as Vue from 'vue';
import * as VueRouter from 'vue-router';
import App from './App.vue'
import './assets/style/sass/styles.scss'
import 'sweetalert2/dist/sweetalert2.min.css'


import IndexComponent from "@/components/IndexComponent";
import ProductComponent from "@/components/ProductComponent";
import CategoryComponent from "@/components/CategoryComponent";
import ContactComponent from "@/components/ContactComponent";
import DeliveryComponent from "@/components/DeliveryComponent";
import CheckoutComponent from "@/components/CheckoutComponent";
import StockComponent from "@/components/StockComponent.vue";

import { VueMaskDirective } from 'v-mask';
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueSweetalert2 from 'vue-sweetalert2'
import initFBPixel from '@/plugins/fb-pixel'

const routes = [
    {
        name: 'index',
        path: '/',
        component: IndexComponent
    },
    {
        name: 'product',
        path: '/product/:slug',
        component: ProductComponent
    },
    {
        name: 'category',
        path: '/catalog',
        meta: { title: 'Категорії' },
        component: CategoryComponent
    },
    {
        name: 'contact',
        path: '/contacts',
        meta: { title: 'Контакти' },
        component: ContactComponent
    },
    {
        name: 'delivery',
        path: '/delivery',
        meta: { title: 'Доставка' },
        component: DeliveryComponent
    },
    {
        name: 'checkout',
        path: '/checkout',
        meta: { title: 'Оформлення замовлення' },
        component: CheckoutComponent
    },
    {
        name: 'stock',
        path: '/stock',
        meta: { title: 'Акції' },
        component: StockComponent
    },
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
});
const DEFAULT_TITLE = 'Море Суші';
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || DEFAULT_TITLE;
    next();
});
initFBPixel();
const app = Vue.createApp(App)
    .use(router)
    .use(VueAxios, axios)
    .use(VueSweetalert2);
const vMaskV2 = VueMaskDirective;
const vMaskV3 = {
    beforeMount: vMaskV2.bind,
    updated: vMaskV2.componentUpdated,
    unmounted: vMaskV2.unbind
};
app.directive('mask', vMaskV3);
app.config.globalProperties.$API_URL = 'https://bot.moresushi.in.ua'
app.mount('#app');

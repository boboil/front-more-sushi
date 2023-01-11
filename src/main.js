import * as Vue from 'vue';
import * as VueRouter from 'vue-router';
import App from './App.vue'
import './assets/style/sass/styles.scss'


import IndexComponent from "@/components/IndexComponent";
import ProductComponent from "@/components/ProductComponent";
import CategoryComponent from "@/components/CategoryComponent";
import ContactComponent from "@/components/ContactComponent";
import DeliveryComponent from "@/components/DeliveryComponent";
import CheckoutComponent from "@/components/CheckoutComponent";

import axios from 'axios'
import VueAxios from 'vue-axios'

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
// Vue.prototype.$API_URL = 'http://localhost:8080'
// const cors = require('cors');
// const corsOptions ={
//     origin:'https://bot.moresushi.in.ua/',
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }
const app = Vue.createApp(App).use(router).use(VueAxios, axios);
// app.config.globalProperties.$API_URL = 'https://bot.moresushi.in.ua'
app.config.globalProperties.$API_URL = 'http://localhost'
app.mount('#app');
// Vue.prototype.$API_URL = 'http://localhost:8080'
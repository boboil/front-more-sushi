import * as Vue from 'vue';
import * as VueRouter from 'vue-router';
import App from './App.vue'


import IndexComponent from "./components/IndexComponent";
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
        component: CategoryComponent
    },
    {
        name: 'contact',
        path: '/contacts',
        component: ContactComponent
    },
    {
        name: 'delivery',
        path: '/delivery',
        component: DeliveryComponent
    },
    {
        name: 'checkout',
        path: '/checkout',
        component: CheckoutComponent
    },
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
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
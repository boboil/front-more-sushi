import * as Vue from 'vue';
import * as VueRouter from 'vue-router';
import App from './App.vue'


import IndexComponent from "./components/IndexComponent";
import ProductComponent from "@/components/ProductComponent";
import CategoryComponent from "@/components/CategoryComponent";
import ContactComponent from "@/components/ContactComponent";
import DeliveryComponent from "@/components/DeliveryComponent";

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
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
});

Vue.createApp(App).use(router).use(VueAxios, axios).mount('#app');
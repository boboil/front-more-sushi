import * as Vue from 'vue';
import * as VueRouter from 'vue-router';
import App from './App.vue'


import IndexComponent from "./components/IndexComponent";
import ProductComponent from "@/components/ProductComponent";

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
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
});

Vue.createApp(App).use(router).use(VueAxios, axios).mount('#app');
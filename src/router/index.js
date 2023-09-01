import Vue from 'vue'
import VueRouter from 'vue-router'
import IndexView from '../views/index.vue'
import {Message} from 'element-ui';
import login from '../views/login.vue';
import statistics from '../views/charts/statistics.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '',
    component: login,
    hidden: true,
    meta: {
      requireAuth: false
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/index',
    name: '首页',
    component: IndexView,
    iconCls: 'el-icon-tickets',
    children: [{
      path: '/charts/statistics',
      name: '数据可视化',
      component: statistics,
      meta: {
        requireAuth: true
      }
    },
      {
        path: '/user/user',
        name: 'user',
        component: () => import('../views/user/user.vue')
      }, {
        path: '/product/category',
        name: 'category',
        component: () => import('../views/product/category.vue')
      },
      {
        path: '/product/product',
        name: 'product',
        component: () => import('../views/product/product.vue')
      },
      {
        path: '/product/advertise',
        name: 'advertise',
        component: () => import('../views/product/advertise.vue')
      }, {
        path: '/order/order',
        name: 'order',
        component: () => import('../views/order/order.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/' || to.path === '/reg') {
    return next()
  } else {
    let user = localStorage.getItem('token')
    if (user != null) {
      //校验token
      return next()
    } else {
      Message.error('用户未登录')
      return next('/')
    }
  }
})
export default router

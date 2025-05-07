import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'products',
        children: [
          {
            path: 'list',
            name: 'ProductList',
            component: () => import('@/views/products/ProductList.vue'),
          },
          {
            path: 'create',
            name: 'ProductCreate',
            component: () => import('@/views/products/ProductCreate.vue'),
          },
          {
            path: ':id',
            name: 'ProductDetail',
            component: () => import('@/views/products/ProductDetail.vue'),
          }
        ]
      },
      {
        path: 'auction',
        children: [
          {
            path: 'list',
            name: 'AuctionList',
            component: () => import('@/views/auction/ProductList.vue'),
          },
          {
            path: ':id',
            name: 'AuctionDetail',
            component: () => import('@/views/auction/ProductDetail.vue'),
          }
        ]
      },
      {
        path: 'account',
        children: [
          {
            path: 'selling',
            name: 'SellingList',
            component: () => import('@/views/account/SellingList.vue'),
          },
          {
            path: 'buying',
            name: 'BuyingList',
            component: () => import('@/views/account/BuyingList.vue'),
          },
          {
            path: 'trade',
            name: 'TradeList',
            component: () => import('@/views/account/TradeList.vue'),
          }
        ]
      }
    ],
  },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/auth/Login.vue'),
      },
      {
        path: 'signup',
        name: 'Signup',
        component: () => import('@/views/auth/Signup.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    next('/auth/login');
  } else if (isAuthenticated && to.path.startsWith('/auth/')) {
    // 이미 로그인된 사용자가 로그인/회원가입 페이지에 접근하면 홈으로 리다이렉트
    next('/');
  } else {
    next();
  }
});

export default router; 
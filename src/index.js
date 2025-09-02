import { Router } from '@vaadin/router';
import setupLocalization from './localization';

function initRouter() {
  const router = new Router(document.querySelector('#application'));

  router.setRoutes([
    {
      path: '/',
      component: 'dashboard-home',
      action: () => import('./pages/home'),
    },
    {
      path: '/add',
      component: 'dashboard-add-edit',
      action: () => import('./pages/add-edit'),
    },
    {
      path: '/edit/:id',
      component: 'dashboard-add-edit',
      action: () => import('./pages/add-edit'),
    },
    {
      path: '(.*)',
      component: 'dashboard-not-found',
      action: () => import('./pages/not-found'),
    },
  ]);
}

window.addEventListener('load', () => {
  initRouter();
  setupLocalization();
});

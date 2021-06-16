import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _b215bb8a = () => interopDefault(import('../pages/layout' /* webpackChunkName: "" */))
const _791bac30 = () => interopDefault(import('../pages/home' /* webpackChunkName: "" */))
const _aadbbb90 = () => interopDefault(import('../pages/login' /* webpackChunkName: "" */))
const _27b944b8 = () => interopDefault(import('../pages/profile' /* webpackChunkName: "" */))
const _60af62f4 = () => interopDefault(import('../pages/settings' /* webpackChunkName: "" */))
const _c9b36f04 = () => interopDefault(import('../pages/editor' /* webpackChunkName: "" */))
const _0e838805 = () => interopDefault(import('../pages/article' /* webpackChunkName: "" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/",
    component: _b215bb8a,
    children: [{
      path: "",
      component: _791bac30,
      name: "home"
    }, {
      path: "/login",
      component: _aadbbb90,
      name: "login"
    }, {
      path: "/register",
      component: _aadbbb90,
      name: "register"
    }, {
      path: "/profile/:username",
      component: _27b944b8,
      name: "profile"
    }, {
      path: "/settings",
      component: _60af62f4,
      name: "settings"
    }, {
      path: "/editor",
      component: _c9b36f04,
      name: "editor"
    }, {
      path: "/article/:slug",
      component: _0e838805,
      name: "article"
    }]
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}

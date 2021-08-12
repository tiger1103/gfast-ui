import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'

import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from "@/api/system/dict/data";
import { getItems, setItems } from '@/api/items'
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, download,
  handleTree,getUpFileUrl,handleTreeRmEmpty,selectItemsLabel } from "@/utils/ruoyi";
import Pagination from "@/components/Pagination";


// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getItems = getItems
Vue.prototype.setItems = setItems
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectItemsLabel = selectItemsLabel
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.handleTreeRmEmpty = handleTreeRmEmpty
Vue.prototype.getUpFileUrl = getUpFileUrl
Vue.prototype.apiUrl = process.env.VUE_APP_BASE_API

Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

// 全局组件挂载
Vue.component('Pagination', Pagination)

Vue.use(permission)


// 全局弹窗
import Popup from "./components/popup/index"
Vue.prototype.$dialog = Popup.install

// 修正url链接中的地址
Vue.filter("urlCorrection",function(url) {
  if (/^http|^blob/.test(url)) {
    return url
  } else {
    let reg = new RegExp('^/*'+Vue.prototype.apiUrl + "/*");
    return Vue.prototype.apiUrl + "/" + url.replace(reg,'')
  }
})

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

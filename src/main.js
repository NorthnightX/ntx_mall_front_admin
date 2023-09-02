// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// 引入element UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
// 引入路由
import router from './router';

// 引入icon
import './assets/icon/iconfont.css'
// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
import VueQuillEditor from 'vue-quill-editor'
//引入VueQuillEditor
// 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor, /* { 默认全局 } */)
import axios from 'axios';
axios.defaults.baseURL='http://localhost:10100'
Vue.prototype.$axios = axios;
Vue.prototype.pathURL='http://localhost:10100'
Vue.config.productionTip = false;
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor);
// 使用element UI
Vue.use(ElementUI);
// 过滤器


axios.interceptors.request.use(
  config => {
    let token = localStorage.getItem("token");
    if(token) config.headers.authorization = token
    return config
  }
)
axios.interceptors.response.use(
  response => {
    // 检查是否需要清除 Session Storage 中的 token
    const token= response.headers["authorization"];
    if (token != null) {
      localStorage.setItem("token", token)
    }
    return response;
  }
);
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
    data: {
        // 空的实例放到根组件下，所有的子组件都能调用
        Bus: new Vue()
    }

})

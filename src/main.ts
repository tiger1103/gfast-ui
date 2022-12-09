import { createApp } from 'vue';
import pinia from '/@/stores/index';
import App from './App.vue';
import router from './router';
import { directive } from '/@/directive/index';
import { i18n } from '/@/i18n/index';
import other from '/@/utils/other';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '/@/theme/index.scss';
import VueGridLayout from 'vue-grid-layout';
import {getUpFileUrl, handleTree, selectDictLabel} from "/@/utils/gfast";
import {useDict} from "/@/api/system/dict/data";
// 分页组件
import pagination from '/@/components/pagination/index.vue'

const app = createApp(App);

directive(app);
other.elSvg(app);

app.component('pagination', pagination)
app.use(pinia).use(router).use(ElementPlus, { i18n: i18n.global.t }).use(i18n).use(VueGridLayout).mount('#app');

app.config.globalProperties.useDict=useDict
app.config.globalProperties.selectDictLabel=selectDictLabel

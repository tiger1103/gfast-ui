import Vue from 'vue'
import Popup from './popup'
const PopupObj = Vue.extend(Popup)
Popup.install = function(config) {  
    const instance = new PopupObj({ propsData:{config} }).$mount()  
    document.body.appendChild(instance.$el)  
    Vue.nextTick(()=>{ instance.baseConfig.visible = true  })  
    return instance
}
export default Popup

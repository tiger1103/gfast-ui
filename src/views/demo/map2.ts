import {defineComponent,h} from "vue";

export default defineComponent({
    name:"baiduMap",
    props:{
        src:{
            type:String,
            default:'',
        }
    },
    setup(prop){
        return ()=>{
            return h('script',{src:prop.src,type:'text/javascript'})
        }
    },
})

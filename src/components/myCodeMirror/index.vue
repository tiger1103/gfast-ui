<template>
  <codemirror
      v-model="code"
      placeholder="Code goes here..."
      :style="{ height: editHeight+'px' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      @ready="handleReady"
  />
</template>

<script lang="ts">
import {computed, defineComponent, ref, shallowRef} from 'vue'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

export default defineComponent({
  name:"myCodeMirror",
  components: {
    Codemirror
  },
  props: {
    // 外部传入的内容，用于实现双向绑定
    modelValue: {
      type:String,
      default:`console.log('Hello, world!')`
    },
    height:{
      type:Number,
      default:400
    }
  },
  setup(props) {
    const code = ref('')
    const extensions = [javascript(), oneDark]

    // Codemirror EditorView instance ref
    const view = shallowRef()

    const handleReady = (payload:any) => {
      code.value = props.modelValue
      view.value = payload.view
    }
    const editHeight = computed(()=>props.height)
    return {
      code,
      extensions,
      handleReady,
      editHeight,
    }
  }
})
</script>

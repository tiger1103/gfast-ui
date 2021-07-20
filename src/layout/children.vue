<template>
    <app-main />
</template>

<script>

import { AppMain} from './components'

import { mapState } from 'vuex'

export default {
  name: 'LayoutChildren',
  components: {
    AppMain,
  }
}
</script>
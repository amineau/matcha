<template>
    <defaultLayout :auth="auth">

      coucouc

    </defaultLayout>
</template>

<script>

  import CONFIG from '../../config/conf.json'
  import defaultLayout from './layout/Default.vue'

  export default {
    name: 'Chat',
    props: {
      auth: Function
    },
    components: {
      defaultLayout
    }
  }

</script>

<style>


</style>

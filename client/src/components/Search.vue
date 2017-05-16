<template>
  <div>

    <tagbutton :auth="auth" :autocomplete="true" :init="false"></tagbutton>
    <formInputs :inputs="inputs" :submit="search" button="Rechercher"></formInputs>
  </div>
</template>

<script>

  import tagbutton from './button/Tag.vue'
  import formInputs from './Form.vue'
  import CONFIG from '../../config/conf.json'

  export default {
    name: 'Search',
    data () {
      return {
        httpOption: null,
        inputs: [{
          name: 'age',
          text: 'Âge',
          formatter: '{value}ans',
          type: 'range',
          min: 18,
          max: 77,
          value: [18, 77],
          interval: 1,
          label: true
        },{
          name: 'score',
          text: 'Score de popularité',
          formatter: '{value} points',
          type: 'range',
          min: 0,
          max: 2000,
          value: [0, 2000],
          interval: 10,
          label: true
        },{
          name: 'distance',
          text: 'Distance',
          formatter: '{value}km',
          type: 'range',
          min: 0,
          max: 250,
          value: 250,
          interval: 1,
          label: true
        }]
      }
    },
    props: {
      auth: Function,
      update: Function
    },
    methods: {
      search () {
        let params = []
        this.inputs.forEach(e => {
          if (typeof(e.value) !== 'object') {
            params.push(`${e.name}=${e.value}`)
          } else {
            params.push(`${e.name}[min]=${e.value[0]}`)
            params.push(`${e.name}[max]=${e.value[1]}`)
          }
        })
        $('.chips').material_chip('data').forEach((e, k) => {
          params.push(`tags[${k}]=${e.tag}`)
        })
        const auth = this.auth()
        if (!auth.success) return alert(auth.err)
        this.$http.get(`${CONFIG.BASEURL_API}users?${params.join('&')}`, auth.httpOption)
          .then(this.update)
      }
    },
    components: {
      tagbutton,
      formInputs
    }
  }

</script>

<style>


</style>

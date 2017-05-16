<template>
  <div>

    <div v-if="active">
      <div class='row'>
        <div class="input-field col s12">
          <label>Tags</label>
          <tagbutton :auth="auth" :autocomplete="true" :init="false"></tagbutton>
        </div>
      </div>
      <formInputs :inputs="inputs" :submit="search" button="Rechercher"></formInputs>
    </div>

    <div @click="active=!active" class="search center text-blue-m"><i :class='{"fa-chevron-down": !active, "fa-chevron-up": active}' class="fa" aria-hidden="true"></i> Recherche</div>
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
        active: false,
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
          max: 200,
          value: 100,
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
          .then(() => this.active=false)
      }
    },
    components: {
      tagbutton,
      formInputs
    }
  }

</script>

<style>

  .chips {
    margin-right: 20px;
  }

  div.search {
    cursor: pointer;
    padding-bottom: 10px;
    margin: 40px 0 40px 0;
    border-bottom: 1px solid #34888C
  }

</style>

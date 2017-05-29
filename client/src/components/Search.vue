<template>
  <div>
    <div v-show="active">
      <div class='row'>
        <div class="input-field col s12">
          <label>Tags</label>
          <tagbutton :auth="auth" :autocomplete="true" :init="false"></tagbutton>
        </div>
      </div>
      <formInputs :inputs="inputs" :submit="search" :active="active" button="Rechercher"></formInputs>
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
        inputs: [{
          name: 'age',
          text: 'Âge',
          formatter: '{value}ans',
          type: 'range',
          min: 0,
          max: 1,
          value: [0, 1],
          interval: 1,
          label: true
        },{
          name: 'score',
          text: 'Score de popularité',
          formatter: '{value} points',
          type: 'range',
          min: 0,
          max: 10,
          value: [0, 10],
          interval: 10,
          label: true
        },{
          name: 'distance',
          text: 'Distance',
          formatter: '{value}km',
          type: 'range',
          min: 0,
          max: 300,
          value: 100,
          interval: 1,
          label: true
        }],
        httpOption: {}
      }
    },
    props: {
      auth: Function,
      update: Function,
      selected: String,
      meaning: Number
    },
    created () {
      const auth = this.auth()
      if (!auth.success) return console.log(auth.err)
      this.httpOption = auth.httpOption
      this.$http.get(`${CONFIG.BASEURL_API}user/limits`, this.httpOption)
        .then(res => {
          if (!res.body.success) return console.log(res.body.err)
          const data = res.body.data[0]
          this.inputs[0].min = this.calculateAge(data.age_min)
          this.inputs[0].max = this.calculateAge(data.age_max)
          this.inputs[0].value = [this.inputs[0].min, this.inputs[0].max]
          this.inputs[1].max = data.score
          this.inputs[1].value = [0, data.score]
          console.log(this.inputs[1].value)
        })

    },
    methods: {
      search () {
        return this.$http.get(`${CONFIG.BASEURL_API}users?${this.params.join('&')}`, this.httpOption)
          .then(this.update)
          .then(() => this.active=false)
      },
      calculateAge (birthDate) {
          birthDate = new Date(birthDate)
          const now = new Date()

          var years = (now.getFullYear() - birthDate.getFullYear())

          if (now.getMonth() < birthDate.getMonth()
              || now.getMonth() == birthDate.getMonth()
              && now.getDate() < birthDate.getDate()) {
              years--
          }
          return years
      }
    },
    computed: {
      params() {
        let params = []
        this.inputs.forEach(e => {
          if (typeof(e.value) !== 'object') {
            params.push(`${e.name}=${e.value}`)
          } else {
            params.push(`${e.name}[min]=${e.value[0]}`)
            params.push(`${e.name}[max]=${e.value[1]}`)
          }
        })
        if ($('.chips').material_chip('data')) {
          $('.chips').material_chip('data').forEach(e => params.push(`tags=${e.tag}`))
        }
        if (this.selected) {
          params.push(`sort=${this.selected}`)
        }
        if (this.meaning) {
          params.push(`meaning=${this.meaning}`)
        }
        return params
      }
    },
    watch: {
      selected () {
        this.search()
      },
      meaning () {
        this.search()
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

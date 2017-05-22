<template>
  <form class="row">
    <div v-for="input in inputs" class="input-field col s12">
      <input v-if="input.type === 'text'" :id="input.name" type="text" v-model.lazy='input.value' class="validate">
      <input v-else-if="input.type === 'email'" :id="input.name" type="email" v-model.lazy='input.value' class="validate">
      <input v-else-if="input.type === 'password'" :id="input.name" type="password" :pattern="input.pattern" v-model.lazy='input.value' class="validate">
      <input v-else-if="input.type === 'date'" :id="input.name" type="text" class="datepicker">
      <textarea v-else-if="input.type === 'textarea'" :id="input.name" class="materialize-textarea" v-model='input.value' data-length="300">{{input.value}}</textarea>
      <div v-else-if="input.type === 'radio'" class='radio'>
        <p v-for="option in input.options">
          <input :name="input.name" type="radio" :id="option.name" :value="option.name" v-model.lazy='input.value'/>
          {{input.value}}
          <label :for="option.name">{{option.text}}</label>
          <div v-if="input.value==='place'">
            <gmap-autocomplete
              id='autocomplete'
              class="validate"
              @place_changed="setPlace"
              v-model="autocomplete.place"
              :types.sync="autocomplete.types"
              :componentRestrictions.sync="autocomplete.restrictions"
              >
            </gmap-autocomplete>
          </div>
        </p>
      </div>
      <vue-slider v-else-if="input.type === 'range'" v-model="input.value"
        :min='input.min'
        :max='input.max'
        :style='{"marginLeft": "160px", "marginRight": "20px", "marginBottom": "10px", "marginTop": "10px"}'
        :bgStyle='{
          "backgroundColor": "#fff",
          "boxShadow": "inset 0.5px 0.5px 3px 1px rgba(0,0,0,.36)"
        }'
        tooltip="always"
        :sliderStyle='{"backgroundColor": "#34888C"}'
        :tooltipStyle='{"backgroundColor": "#34888C", "borderColor": "#34888C"}'
        :processStyle='{"backgroundColor": "#34888C"}'
        :formatter="input.formatter"
        :interval="input.interval"
      ></vue-slider>
      <input v-else :id="input.name" :type="input.type" class="validate">
      <label v-show="input.label" v-if="input.type !== 'radio'" :for="input.name" :data-error="input.error">{{input.text}}</label>
    </div>
    <button @click.prevent="submiting(inputs)" class="btn waves-effect waves-light waves-green right" type='submit'>{{button}}</button>
  </form>
</template>

<script>

  import vueSlider from 'vue-slider-component'

  export default {
    name: 'formInputs',
    data () {
      return {
        picker: null,
        autocomplete: {
          place: '',
          types: ['(regions)'],
          restrictions: {'country': 'fr'}
        },
        latLng: {}
      }
    },
    props: {
      inputs: Array,
      submit: Function,
      button: String
    },
    components: {
      vueSlider
    },
    created () {
      this.inputs.forEach(e => {
        if (e.place) {
          this.autocomplete.place = e.place
        }
      })
    },
    mounted () {
      $(function() {
        Materialize.updateTextFields()
        $('textarea').characterCounter()
      })
      var date = new Date()
      date.setYear(date.getFullYear() - 18)
      this.picker = $('.datepicker').pickadate({
        monthsFull: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        monthsShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
        weekdaysFull: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
        today: '',
        clear: 'effacer',
        close: 'Fermer',
        format: 'dd/mm/yyyy',
        firstDay: 1,
        closeOnSelect: true,
        selectMonths: true,
        selectYears: true,
        max: date,
        onClose: () => {
          if (!this.picker.get()) {
            $('.datepicker').removeClass('valid').addClass('invalid')
          } else {
            this.inputs.forEach(e => {
              if (e.type === 'date') {
                e.value = this.picker.get()
              }
            })
          }
        }
      }).pickadate('picker')
      this.inputs.forEach(e => {
        if (e.type === 'date') {
          this.picker.set('select', e.value)
        }
      })
      $('textarea').focus(function() {
        if (this.value == "Non renseigné") {
             this.value = ""
        }
      }).blur(function() {
        if (this.value=="") {
             this.value = "Non renseigné"
        }
      })
    },
    methods: {
      submiting (body) {
        let data = {}
        let error = false
        console.log(body)
        body.forEach(e => {
          if (e.type === 'date') {
            data[e.name] = this.picker.get()
          } else {
            data[e.name] = e.value
          }
          if (e.value === 'place' && e.name === 'localisation') {
            data.latitude = this.latLng.lat
            data.longitude = this.latLng.lng
            data.place = $('#autocomplete').val()
            if (!data.latitude) {
              $('#autocomplete').removeClass('valid').addClass('invalid')
              error = true
            }
          }
          if (!data[e.name]) {
            $('#' + e.name).removeClass('valid').addClass('invalid')
            error = true
          }
        })
        if (!error) return this.submit(data)
      },
      setPlace(place) {
        this.latLng = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
      }
    }
  }

</script>

<style>

  .input-field .radio label {
    top: 0
  }

</style>

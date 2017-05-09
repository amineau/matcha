<template>
  <form class="row">
    <div v-for="input in inputs" class="input-field col s12">
      <input v-if="input.type === 'text'" :id="input.name" type="text" v-model.lazy='input.value' class="validate">
      <input v-else-if="input.type === 'email'" :id="input.name" type="email" v-model.lazy='input.value' class="validate">
      <input v-else-if="input.type === 'password'" :id="input.name" type="password" :pattern="input.pattern" v-model.lazy='input.value' class="validate">
      <input v-else-if="input.type === 'date'" :id="input.name" type="text" class="datepicker">
      <div v-else-if="input.type === 'chips'" class="chips chips-autocomplete"></div>
      <textarea v-else-if="input.type === 'textarea'" :id="input.name" class="materialize-textarea" data-length="300">{{input.value}}</textarea>
      <div v-else-if="input.type === 'radio'" class='radio'>
        <p v-for="option in input.options">
          <input :name="input.name" type="radio" :id="option.name" :value="option.name" />
          <label :for="option.name">{{option.text}}</label>
        </p>
      </div>
      <input v-else :id="input.name" :type="input.type" class="validate">
      <label v-show="input.label" v-if="input.type !== 'radio'" :for="input.name" :data-error="input.error">{{input.text}}</label>
    </div>
    <button @click.prevent="submiting(inputs)" class="btn waves-effect waves-light" type='submit'>{{button}}</button>
  </form>
</template>

<script>

  export default {
    name: 'formInputs',
    data () {
      return {
        picker: null
      }
    },
    props: {
      inputs: Array,
      submit: Function,
      button: String
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
        onSet: () => {
          this.inputs.forEach(e => {
            if (e.type === 'date') {
              e.value = this.picker.get()
            }
          })
          $('.datepicker').removeClass('invalid').addClass('valid')
        },
        onClose: () => {
          if (!this.picker.get()) {
            $('.datepicker').removeClass('valid').addClass('invalid')
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
        body.forEach(e => {
          if (e.type === 'date') {
            data[e.name] = this.picker.get()
          } else if (e.type === 'radio'){
            data[e.name] = $(`input[name='${e.name}']:checked`).val()
          } else if (e.type === 'textarea'){
            data[e.name] = $(`textarea#${e.name}`).val()
          }else {
            data[e.name] = e.value
          }
          if (!data[e.name]) {
            $('#' + e.name).removeClass('valid').addClass('invalid')
            error = true
          }
        })
        console.log('error', data)
        if (!error) return this.submit(data)
      }
    },
    watch: {
      picker: function() {
        console.log('picker')
        this.inputs.forEach(e => {
          if (e.type === 'date') {
            e.value = this.picker.get()
          }
        })
      }
    }
  }

</script>

<style>

  .input-field .radio label {
    top: 0
  }

</style>

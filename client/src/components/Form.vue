<template>
  <form class="row">
    <div v-for="input in inputs" class="input-field col s12">
      <input v-if="input.type === 'text'" :id="input.name" type="text" v-model.lazy='input.value' class="validate">
      <input v-else-if="input.type === 'email'" :id="input.name" type="email" v-model.lazy='input.value' class="validate">
      <input v-else-if="input.type === 'password'" :id="input.name" type="password" :pattern="input.pattern" v-model.lazy='input.value' class="validate">
      <input v-else-if="input.type === 'date'" :id="input.name" type="text" class="datepicker">
      <div v-else-if="input.type === 'chips'" class="chips chips-autocomplete"></div>
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

  var picker
  $(function() {
    var date = new Date()
    date.setYear(date.getFullYear() - 18)
    Materialize.updateTextFields()
    picker = $('.datepicker').pickadate({
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
      onSet: () => {$('.datepicker').removeClass('invalid').addClass('valid')},
      onClose: () => {
        if (!picker.get()) {
          $('.datepicker').removeClass('valid').addClass('invalid')
        }
      }
    }).pickadate('picker')
  })

  export default {
    name: 'formInputs',
    props: {
      inputs: Array,
      action: String,
      submit: Function,
      button: String
    },
    methods: {
      submiting (body) {
        let data = {}
        let error = false
        console.log($("input[name='sex']:checked").val())
        body.forEach(e => {
          if (e.type === 'date') {
            data[e.name] = picker.get()
          } else if (e.type === 'radio'){
            data[e.name] = $(`input[name='${e.name}']:checked`).val()
          } else {
            data[e.name] = e.value
          }
          if (!data[e.name]) {
            $('#' + e.name).removeClass('valid').addClass('invalid')
            error = true
          }
        })
        console.log(data)
        if (!error) return this.submit(data)
      }
    }
  }

</script>

<style>

  .input-field .radio label {
    top: 0
  }

</style>

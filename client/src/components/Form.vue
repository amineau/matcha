<template>
  <form class="row" :action='action'>
    <div v-for="input in inputs" class="input-field col s12">
      <input v-if="input.type === 'text'" :id="input.name" type="text" v-model.lazy='input.value' class="validate">
      <input v-else-if="input.type === 'email'" :id="input.name" type="email" v-model.lazy='input.value' class="validate">
      <input v-else-if="input.type === 'password'" :id="input.name" type="password" v-model.lazy='input.value' class="validate">
      <div v-else-if="input.type === 'chips'" class="chips chips-autocomplete"></div>
      <input v-else :id="input.name" :type="input.type" class="validate">
      <label v-show="input.label" :for="input.name">{{input.text}}</label>
    </div>
    <button v-on:click.prevent="submit(parseData(inputs))" class="btn waves-effect waves-light" type='submit'>{{button}}</button>
  </form>
</template>

<script>

  require('materialize-css/js/forms')

  export default {
    name: 'formInputs',
    props: {
      inputs: Array,
      action: String,
      submit: Function,
      button: String
    },
    created () {
      this.inputs.forEach(e => e.value = e.value ? e.value : null)
    },
    methods: {
      parseData (body) {
        let data = {}
        body.forEach(e => data[e.name] = e.value)
        return data
      }
    }
  }

  $(function() {
    Materialize.updateTextFields()
  })

</script>

<style>

</style>

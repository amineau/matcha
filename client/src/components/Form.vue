<template>
  <form class="row" :action='action'>
    <div v-for="input in inputs" class="input-field col s12">
      <input v-if="input.type === 'text'" :id="input.name" type="text" v-model='input.value' class="validate">
      <input v-else-if="input.type === 'email'" :id="input.name" type="email" v-model='input.value' class="validate">
      <input v-else-if="input.type === 'password'" :id="input.name" type="password" v-model='input.value' class="validate">
      <input v-else :id="input.name" :type="input.type" class="validate">
      <label :for="input.name">{{input.text}}</label>
    </div>
    <button v-on:click.prevent="submit(parseData(inputs))" class="btn waves-effect waves-light" type='submit'>{{button}}</button>
  </form>
</template>

<script>

  export default {
    name: 'formInputs',
    props: {
      inputs: Array,
      action: String,
      submit: Function,
      button: String
    },
    created () {
      this.inputs.forEach(e => e.value = null)
    },
    methods: {
      parseData (body) => {
        let data = {}
        body.forEach(e => data[e.name] = e.value)
        return data
      }
    }
  }

</script>

<style>

</style>

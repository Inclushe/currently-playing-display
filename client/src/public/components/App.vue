<template lang="pug">
  .vue-test
    h1 {{ message }}
</template>

<script>
export default {
  data () {
    return {
      message: 'Hello world from Vue!'
    }
  }
}
</script>

<style lang="stylus">
  .vue-test
    padding: 0
</style>

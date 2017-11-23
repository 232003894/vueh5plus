<template>
  <div id="app">
    <test></test>
  </div>
</template>

<script>

import test from './components/test'
export default {
  name: 'app',
  components: {test},
  data () {
    return {
    }
  },
  mounted: function () {
    debugger
    console.log('APP主页  mounted')
  },
  onload: function () {
    console.log('APP主页  Dom加载完成')
  },
  plusready: function () {
    console.log('APP主页 设备加载完成')
  }
}
</script>

<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>

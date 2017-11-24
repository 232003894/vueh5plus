<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: "test",
  data() {
    return {
      msg: "test组件"
    };
  },
  onload: function() {
    console.log("test组件 Dom加载完成");
  },
  plusready: function() {
    console.log("test组件 设备加载完成");
  },
  mounted: function() {
    console.log("test组件  mounted");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
</style>

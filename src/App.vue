<template>
  <div id="app">
    <test></test>
    <p><button @click="send" style="width:90%;height:40px;">send</button></p>
    <p><button @click="click" style="width:90%;height:40px;">open</button></p>
    <p><button @click="click2" style="width:90%;height:40px;">open-随机id</button></p>
  </div>
</template>

<script>
import test from "./components/test";
export default {
  name: "app",
  components: { test },
  data() {
    return {
      abc: "123"
    };
  },
  mounted: function() {
    console.log("APP主页  mounted");
  },
  listens: {
    event1: function(e) {
      alert(JSON.stringify(e.detail));
    }
  },
  onload: function() {
    console.log("APP主页  Dom加载完成");
  },
  plusready: function() {
    console.log("APP主页 设备加载完成");
    this.plus.send("event1", "plusready", { self: false });
  },
  methods: {
    send: function() {
      this.plus.send("event1", { a: 1 }, { self: true });
    },
    click: function() {
      this.plus.open("http://192.168.2.124:8081/", "", { abc: 121 });
      // this.plus.send("event1", { a: 1 }, { self: true });
    },
    click2: function() {
      this.plus.open("http://192.168.2.124:8081/", new Date().valueOf(), {
        abc: 121
      });
      // this.plus.send("event1", { a: 1 }, { self: true });
    }
  }
};
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

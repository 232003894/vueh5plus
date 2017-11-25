<template>
  <div id="app" :style="{color:color}">
    <test></test>
    <h4>页面ID：{{id}}</h4>
    <p>
      广播：<br>
      <button @click="send" >send</button>
    </p>
    <p>
      窗体控制：<br>
      <button @click="goHome">回到首页</button>
      <button @click="openAbc">打开abc</button>
      <button @click="hideAbc">隐藏abc</button>
      <button @click="openRandom">打开随机id</button>
      <button @click="closeMe" >关闭自己</button>
      <button  v-if="!ishome" @click="hideMe">隐藏自己</button>
    </p>
    <p>
      提示消息：<br>
      <button @click="toastBasic">Toast基础</button>
    </p>
  </div>
</template>

<script>
import test from "./components/test";
export default {
  name: "app",
  components: { test },
  data() {
    return {
      id: "",
      abc: "123",
      ishome: true,
      color: "#2c3e50",
      bgcolor: ""
    };
  },
  mounted: function() {
    let bgcolor = this.plus.randomColor(false);
    this.bgcolor = bgcolor;
    document.body.style.backgroundColor = bgcolor;
    this.color = this.plus.reversalColor(bgcolor);
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
    // this.plus.send("event1", "plusready", { self: false });
    this.id = this.plus.getWin().id;
    this.ishome = this.plus.isHome();
  },
  methods: {
    // #region 广播消息
    send: function() {
      this.plus.send("event1", { a: 1 }, { self: true });
    },
    // #endregion
    // #region 窗体控制
    openAbc: function() {
      this.plus.open("http://192.168.2.124:8081/", "abc", { abc: 121 });
    },
    hideAbc: function() {
      this.plus.hide("abc");
    },
    openRandom: function() {
      this.plus.open("http://192.168.2.124:8081/", new Date().valueOf(), {
        abc: 121
      });
    },
    closeMe: function() {
      this.plus.close();
    },
    hideMe: function() {
      this.plus.hide();
    },
    goHome: function() {
      this.plus.goHome();
    },
    // #endregion
    // #region 提示消息
    toastBasic: function() {
      this.plus.toast("kl;k;");
    }
    // #endregion
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
  background-color: transparent;
  margin-top: 60px;
}
p {
  padding-left: 20px;
  text-align: left;
}
button {
  width: 28%;
  height: 35px;
  margin-top: 12px;
  margin-right: 6px;
}
</style>

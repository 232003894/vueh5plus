<template>
  <div id="app" :style="{color:color}">
    <div :style="{position:'fixed',top:0,height:'30px',width:'100%',background:color,color:bgcolor,'line-height':'30px'}">
      头部
    </div>
    <test>
      <h2>页面ID：{{id}}</h2>
    </test>
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
      提示消息-仅文字+换行：<br>
      <button @click="toastTop">上-默认</button>
      <button @click="toastCenter">中-13</button>
      <button @click="toastBottom">底-40</button>
    </p>
    <p>
      提示消息-带图标：<br>
      <button @click="toastOK">成 功</button>
      <button @click="toastError">失 败</button>
      <button @click="toastWarn"> 警 告</button>
    </p>
  </div>
</template>

<script>
import test from "./components/test";
export default {
  listener: {
    event1(e) {
      alert("app:" + JSON.stringify(e.detail));
    }
  },
  load: {
    dom() {
      console.log("APP主页  Dom加载完成");
    },
    plus() {
      let self = this;
      console.log("APP主页 设备加载完成");
      this.ishome = this.plus.isHome();
      let view = this.plus.getWin();
      this.id = view.id;
      view.bgcolor = self.bgcolor;
      if (this.ishome) {
        this.statusBar(self.bgcolor);
      } else {
        view.addEventListener("show", function(e) {
          self.statusBar(plus.webview.getTopWebview().bgcolor);
        });
      }

      setTimeout(() => {
        let handle1 = {
          index: 100,
          act() {
            console.log(self.$options.name + " back  handle1");
          }
        };
        let handle2 = {
          index: 100,
          act() {
            console.log(self.$options.name + " back  handle2");
          }
        };
        let handle3 = {
          index: 9,
          act() {
            console.log(self.$options.name + " back  handle3");
          }
        };
        self.plus.addBack(handle1);
        self.plus.addBack(handle2);
        self.plus.addBack(handle3);
        self.plus.removeBack(handle3);
        // console.log(self.plus.acts(self));
      }, 17);
    }
  },
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
  created() {
    this.bgcolor = this.plus.randomColor();
    document.body.style.backgroundColor = this.bgcolor;
    this.color = this.plus.reversalColor(this.bgcolor);
  },
  mounted: function() {
    console.log("APP主页  mounted");
  },
  methods: {
    // #region 广播消息
    send: function() {
      this.plus.send("event1", { a: 1 }, { self: true });
    },
    statusBar(colorStr) {
      this.plus.setStatusBarBackground(colorStr);
    },
    // #endregion
    // #region 窗体控制
    openAbc: function() {
      let self = this;
      let v = this.plus.open("http://192.168.2.124:8081/", "abc", {
        abc: 121
      });
      v.addEventListener("close", function(e) {
        self.statusBar(plus.webview.getTopWebview().bgcolor);
      });
      v.addEventListener("hide", function(e) {
        self.statusBar(plus.webview.getTopWebview().bgcolor);
      });
    },
    hideAbc: function() {
      this.plus.hide("abc");
    },
    openRandom: function() {
      let self = this;
      let v = this.plus.open(
        "http://192.168.2.124:8081/",
        new Date().valueOf(),
        {
          abc: 121
        }
      );
      v.addEventListener("close", function(e) {
        self.statusBar(plus.webview.getTopWebview().bgcolor);
      });
      v.addEventListener("hide", function(e) {
        self.statusBar(plus.webview.getTopWebview().bgcolor);
      });
    },
    closeMe: function() {
      this.plus.back();
    },
    hideMe: function() {
      this.plus.hide();
    },
    goHome: function() {
      this.plus.goHome();
    },
    // #endregion
    // #region 提示消息
    toastTop: function() {
      this.plus.toast(
        "创建并显示系统样式提示消息，弹出的提示消息为非阻塞模式，显示指定时间后自动消失。 提示消息显示时间可通过options的duration属性控制，长时间提示消息显示时间约为3.5s，短时间提示消息显示时间约为2s。",
        {
          position: "top",
          duration: "short",
          lineLength: 0
        }
      );
    },
    toastCenter: function() {
      this.plus.toast(
        "创建并显示系统样式提示消息，弹出的提示消息为非阻塞模式，显示指定时间后自动消失。 提示消息显示时间可通过options的duration属性控制，长时间提示消息显示时间约为3.5s，短时间提示消息显示时间约为2s。",
        {
          position: "center",
          duration: "short",
          lineLength: 13
        }
      );
    },
    toastBottom: function() {
      this.plus.toast(
        "创建并显示系统样式提示消息，弹出的提示消息为非阻塞模式，显示指定时间后自动消失。 提示消息显示时间可通过options的duration属性控制，长时间提示消息显示时间约为3.5s，短时间提示消息显示时间约为2s。",
        {
          position: "bottom",
          duration: "short",
          lineLength: 40
        }
      );
    },
    toastOK: function() {
      this.plus.toast("提案成功", {
        position: "center",
        duration: "short",
        icon: "/ui/ok.png",
        lineLength: 13
      });
    },
    toastError: function() {
      this.plus.toast("提案失败", {
        position: "center",
        duration: "short",
        icon: "/ui/error.png",
        lineLength: 13
      });
    },
    toastWarn: function() {
      this.plus.toast("提案警告", {
        position: "center",
        duration: "short",
        icon: "/ui/warn.png",
        lineLength: 13
      });
    }
    // #endregion
  }
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}
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

<template>
  <div class="hello">
    <slot >
      <h1>{{ msg }}</h1>
    </slot>
  </div>
</template>

<script>
export default {
  name: "test",
  load: {
    dom() {
      console.log("test组件 Dom加载完成");
    },
    plus() {
      var self = this;
      console.log("test组件 设备加载完成");
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
            console.log(self.$options.name + " back handle3");
            self.plus.removeBack(handle3);
            alert(self.$options.name + " back  handle3");
            return false;
          }
        };
        self.plus.addBack(handle1);
        self.plus.addBack(handle2);
        self.plus.addBack(handle3);
        self.plus.removeBack(handle1);
      }, 17);
    }
  },
  mounted: function() {
    console.log("test组件  mounted");
  },
  // listener: {
  //   event1(e) {
  //     alert("test:" + JSON.stringify(e.detail));
  //   }
  // },
  data() {
    return {
      msg: "test组件"
    };
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

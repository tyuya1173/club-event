<script setup>
import { ref } from 'vue'

// Propsの定義
const props = defineProps({
  msg: String,
})

const count = ref(0)

// カウントを増加させる関数
const incrementCount = () => {
  count.value++
}
</script>

<template>
  <h1>{{ props.msg }}</h1>

  <div class="card">
    <button type="button" @click="incrementCount">count is {{ count }}</button>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, 
    the official Vue + Vite starter
  </p>

  <p>
    Learn more about IDE Support for Vue in the 
    <a href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support" target="_blank">
      Vue Docs Scaling up Guide
    </a>.
  </p>

  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
<template>
  <div>
    <h1>Home</h1>
    <el-button
      type="primary"
      @click="testFn">
      Primary
    </el-button>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

export default {
  name: 'Home',
  methods: {
    testFn() {
      console.log('butt soup');
      ipcRenderer.send('test-message', 'ping');
    },
  },
};
</script>

<style>

</style>

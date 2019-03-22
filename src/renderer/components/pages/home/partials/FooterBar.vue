<template>
  <div class="footer-bar">
    <el-button
      type="primary"
      @click="getUserData"
    >
      Load data
    </el-button>
    <p class="italic pull-right mb-0"><small>Sentry Watchtower by George Broadhurst</small></p>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

export default {
  name: 'footer-bar',
  methods: {
    getUserData() {
      ipcRenderer.send('get-user-data', 'ping');
    },
  },
};
</script>

<style>
.footer-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #323232;
  padding: 1em;
  color: #dedede;
}
</style>

<template>
  <div>
    <table v-if="users">
      <thead>
        <tr>
          <th>Place</th>
          <th>Name</th>
          <th>Issues</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(user, i) in users"
          :key="user.id"
          :class="{
            even: i % 2 === 1,
            odd: i % 2 === 0,
          }"
        >
          <td v-if="i === 0">🥇</td>
          <td v-else-if="i === 1">🥈</td>
          <td v-else-if="i === 2">🥉</td>
          <td v-else>{{ i + 1 }}</td>
          <td>{{ user.name.match(/.*\s\S/)[0] }}</td>
          <td>{{ user.count }}</td>
        </tr>
      </tbody>
    </table>
    <footer-bar />
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import FooterBar from './partials/FooterBar';

export default {
  name: 'Home',
  components: {
    FooterBar,
  },
  data() {
    return {
      users: false,
    };
  },
  created() {
    ipcRenderer.on('set-user-data', (e, users) => {
      console.log(users);
      const usersArray = [];
      Object.keys(users).forEach((key) => {
        usersArray.push(users[key]);
      });
      usersArray.sort((a, b) => a.count > b.count);
      this.users = usersArray;
    });
  },
};
</script>

<style>

</style>

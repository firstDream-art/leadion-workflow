<template>
  <div id="app">
    <h1>LeadIO</h1>
    <nav class="simple-nav">
      <router-link to="/">首頁</router-link>
      <router-link to="/sign-in">登入</router-link>
      <router-link to="/dashboard">儀表板</router-link>
    </nav>
    
    <!-- 路由視圖 -->
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
console.log('App.vue with router loaded successfully!')
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  min-height: 100vh;
}

h1 {
  background: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  margin: 0;
}

.simple-nav {
  background: #34495e;
  padding: 1rem 2rem;
  display: flex;
  gap: 1rem;
}

.simple-nav a {
  color: #ecf0f1;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.simple-nav a:hover,
.simple-nav a.router-link-active {
  background-color: #3498db;
}

.content {
  padding: 2rem;
}
</style> 
<template>
  <div class="not-found">
    <el-result
      icon="warning"
      title="404"
      sub-title="抱歉，您訪問的頁面不存在"
    >
      <template #extra>
        <el-button type="primary" @click="goHome">回到首頁</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const goHome = () => {
  router.push('/')
}

useHead({
  title: '頁面不存在 - LeadIO'
})
</script>

<style scoped>
.not-found {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 
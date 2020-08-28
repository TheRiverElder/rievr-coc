<template>
  <v-app class="fill">
    <v-app-bar
      app
      color="primary"
      dark
    >
      
    </v-app-bar>

    <v-main class="fill-height">
      <div class="fill-height d-flex">
        <!-- 聊天窗口 -->
        <Chat class="fill-height flex-grow-0 flex-shrink-0"/>

        <v-divider vertical/>
        <!-- 副面板 -->
        <InvInfo class="fill-height flex-grow-1"/>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import InvInfo from './components/InvInfo';
import Chat from './components/Chat';

export default {
  name: 'App',

  components: {
    InvInfo,
    Chat,
  },

  data: () => ({
    //
  }),
};
</script>

<style>
.fill, html, body {
  width: 100%;
  height: 100%;
}

.fill-height {
  height: 100%;
}

.overflow-auto {
  overflow: auto;
}
</style>

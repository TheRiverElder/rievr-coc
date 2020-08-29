<template>
  <v-app class="fill">
    <v-app-bar app color="primary" dark></v-app-bar>

    <v-main class="fill-height">
      <div class="fill-height d-flex">
        <!-- 聊天窗口 -->
        <Chat ref="chat" class="chat fill-height flex-grow-0 flex-shrink-0" />

        <v-divider v-if="!isMobile" vertical />
        <!-- 副面板 -->
        <div v-if="!isMobile" class="fill-height overflow-auto flex-grow-1">
          <InvInfo/>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import InvInfo from './components/InvInfo';
import Chat from "./components/Chat";
import { mapState } from "vuex";

export default {
  name: "App",

  components: {
    InvInfo,
    Chat,
  },

  data: () => ({
    //
  }),

  computed: {
    ...mapState(["isMobile"]),
  },

  mounted() {
    if (this.isMobile) {
      this.$refs.chat.$el.classList.add("mobile-chat");
    }
  },
};
</script>

<style>
.fill,
html,
body {
  width: 100%;
  height: 100%;
}

.fill-height {
  height: 100%;
}

.overflow-auto {
  overflow: auto;
}

.chat.mobile-chat {
  max-width: 100%;
}
</style>

<template>
  <v-app class="fill">
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="toggleSidePanel"/>

      <span class="flex-grow-1 text-center text-h6">{{ groupInfo.name }}</span>

      <v-btn icon @click="reconnect"><v-icon>mdi-refresh</v-icon></v-btn>
    </v-app-bar>
      
    <v-main class="fill-height">
      <div class="fill-height d-flex">
        <!-- 聊天窗口 -->
        <Chat ref="chat" class="chat fill-height flex-grow-0 flex-shrink-0" />

        <v-divider v-if="!isMobile" vertical />
        <!-- 副面板 -->
        <div v-if="!isMobile || sidePanel" :class="sidePanelClass">
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

  data() {
    const isMobile = this.$store.state.isMobile;
    return {
      sidePanel: false,
      sidePanelClass: ['white', 'overflow-auto', 'flex-grow-1', isMobile ? 'fill' : 'fill-height', isMobile ? 'overlay' : null],
    };
  },

  computed: {
    ...mapState(["isMobile", 'groupInfo']),
  },

  methods: {
    toggleSidePanel() {
      if (this.isMobile) {
        this.sidePanel = !this.sidePanel;
      }
    },

    reconnect() {
      this.$store.dispatch('connectServer', true);
    },
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
  overflow: hidden;
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

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
}
</style>

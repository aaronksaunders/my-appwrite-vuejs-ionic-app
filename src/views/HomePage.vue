<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <template v-if="!currentUser">
        <ion-button @click="loginIsOpen = true">LOGIN</ion-button>
        <ion-button @click="createAcctIsOpen = true">CREATE ACCOUNT</ion-button>
      </template>
      <template v-else>
        {{ currentUser }}
        <ion-button @click="doLogout">LOGOUT</ion-button>
      </template>

      <!-- CREATE ACCOUNT MODAL  -->
      <create-account-modal
        :isVisible="createAcctIsOpen"
        @onClose="doCreateAccount"
      ></create-account-modal>

      <!-- LOGIN MODAL  -->
      <login-modal
        :isVisible="loginIsOpen"
        @onClose="doLogin"
      ></login-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  alertController,
} from "@ionic/vue";
import { ref } from "vue";

import { useAppwriteAccount } from "../composables/useAppwriteAccount";
import CreateAccountModal from "../components/CreateAccountModal.vue";
import LoginModal from "../components/LoginModal.vue"

const { createAccount, getCurrentUser, login, logout } = useAppwriteAccount();
const currentUser = ref(null);

const createAcctIsOpen = ref(false);
const loginIsOpen = ref(false);

// check for user at startup
getCurrentUser().then(
  (user) => (currentUser.value = user),
  (error) => {}
);

const doLogin = async (payload: null | { email: string; password: string }) => {
  loginIsOpen.value = false;
  debugger;
  if (payload) {
    try {
      const { email, password } = payload;

      const loginResp = await login(email, password);
      if (loginResp?.error) throw loginResp.error;

      currentUser.value = loginResp?.data;
    } catch (error) {
      errorAlert("Error Creating Account", (error as Error).message);
    }
  }
};

const doLogout = async () => {
  try {
    const response = await logout();
    if (response?.error) throw response.error;
    currentUser.value = null;
  } catch (error) {
    errorAlert("Error Logging Out", (error as Error).message);
  }
};

const doCreateAccount = async (
  payload: null | { email: string; password: string; name: string }
) => {
  createAcctIsOpen.value = false;
  debugger;
  if (payload) {
    try {
      const { email, password, name } = payload;
      const createAccountResp = await createAccount(email, password, name);
      if (createAccountResp?.error) throw createAccountResp.error;

      const loginResp = await login(email, password);
      if (loginResp?.error) throw loginResp.error;

      currentUser.value = loginResp?.data;
    } catch (error) {
      errorAlert("Error Creating Account", (error as Error).message);
    }
  }
};

const errorAlert = async (title: string, message: string) => {
  const alert = await alertController.create({
    header: title,
    message: message,
    buttons: ["OK"],
  });
  await alert.present();
};
</script>

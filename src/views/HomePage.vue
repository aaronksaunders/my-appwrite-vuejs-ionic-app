<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <template v-if="!currentUser">
          <ion-title>Home</ion-title>
        </template>
        <template v-else>
          <ion-title>Home: {{ currentUser?.name }}</ion-title>
        </template>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <template v-if="!currentUser">
        <ion-button @click="loginIsOpen = true">LOGIN</ion-button>
        <ion-button @click="createAcctIsOpen = true">CREATE ACCOUNT</ion-button>
      </template>
      <template v-else>
        <!-- {{ currentUser }} -->
        <div>
          <ion-button @click="addItemIsOpen = true" class="ion-float-left"
            >ADD ITEM</ion-button
          >
          <ion-button @click="doLogout" class="ion-float-right"
            >LOGOUT</ion-button
          >
        </div>

        <div style="clear: both"></div>
        <div style="margin-top: 16px">
          <ion-list>
            <ion-item v-for="item in documents" :key="item.$id">
              <ion-label>
                <p>{{ item.$id }}</p>
                <p>{{ item.name }}</p>
                <p>{{ item.description }}</p>
                <p>{{ item.$updatedAt }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </div>
      </template>

      <!-- CREATE ACCOUNT MODAL  -->
      <create-account-modal
        :isVisible="createAcctIsOpen"
        @onClose="doCreateAccount"
      ></create-account-modal>

      <!-- ADD ITEM MODAL  -->
      <add-item-modal
        :isVisible="addItemIsOpen"
        @onClose="doAddItem"
      ></add-item-modal>

      <!-- LOGIN MODAL  -->
      <login-modal :isVisible="loginIsOpen" @onClose="doLogin"></login-modal>
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
  onIonViewWillEnter,
  IonList,
  IonItem,
  IonLabel
} from "@ionic/vue";
import { ref } from "vue";

import { useAppwriteAccount } from "../composables/useAppwriteAccount";
import { useAppwriteDB } from "../composables/useAppwriteDB";
import CreateAccountModal from "../components/CreateAccountModal.vue";
import LoginModal from "../components/LoginModal.vue";
import AddItemModal from "@/components/AddItemModal.vue";
import { Models } from "appwrite";

const { createAccount, getCurrentUser, login, logout } = useAppwriteAccount();
const { doCreateDocument, doListDocuments, documents } = useAppwriteDB();

const currentUser = ref();

const createAcctIsOpen = ref(false);
const loginIsOpen = ref(false);
const addItemIsOpen = ref(false);

onIonViewWillEnter(async () => {
  if (currentUser.value) {
    await doListDocuments();
  }
});

// check for user at startup
getCurrentUser().then(
  async (user) => {
    currentUser.value = user;
    await doListDocuments();
  },
  (error) => {}
);

/**
 *
 * @param payload
 */
const doAddItem = async (
  payload: null | { title: string; description: string; file?: File }
) => {
  addItemIsOpen.value = false;

  if (payload) {
    try {
      const resp = await doCreateDocument(payload, currentUser?.value.$id);
      if (resp.error) throw resp.error;
      console.log(resp.data);
    } catch (error) {
      errorAlert("Error Creating New Item", (error as Error).message);
    }
  }
};

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

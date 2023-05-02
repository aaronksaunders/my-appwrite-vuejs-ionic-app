<template>
  <ion-modal :is-open="isVisible" @willDismiss="emit('onClose', null)">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="doSave">SAVE</ion-button>
        </ion-buttons>
        <ion-title>CREATE ACCOUNT</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="emit('onClose', null)">CANCEL</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-item>
        <ion-label position="stacked">Name</ion-label>
        <ion-input ref="nameRef" type="text" placeholder="Name"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Email</ion-label>
        <ion-input ref="emailRef" type="email" placeholder="Email"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Password</ion-label>
        <ion-input ref="passwordRef" type="password" placeholder=""></ion-input>
      </ion-item>
    </ion-content>
  </ion-modal>
</template>
<script setup lang="ts">
import {
  IonContent,
  IonModal,
  IonButton,
  IonButtons,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItem,
  IonLabel,
  IonInput
} from "@ionic/vue";
const props = defineProps<{ isVisible: boolean }>();
const emit = defineEmits<{
  (event: "onClose", payload: any): void;
}>();
import { ref } from "vue";

const nameRef = ref();
const emailRef = ref();
const passwordRef = ref();

const doSave = () => {
  emit("onClose", {
    email: emailRef.value.$el.value,
    password: passwordRef.value.$el.value,
    name: nameRef.value.$el.value,
  });
};
</script>

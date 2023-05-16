<template>
  <ion-modal :is-open="isVisible" @willDismiss="emit('onClose', null)">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="doSave">SAVE</ion-button>
        </ion-buttons>
        <ion-title>CREATE NEW ITEM</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="emit('onClose', null)">CANCEL</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-item>
        <ion-label position="stacked">Title</ion-label>
        <ion-input ref="titleRef" type="text" placeholder="Title"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Description</ion-label>
        <ion-input ref="descriptionRef" type="text" placeholder="Description"></ion-input>
      </ion-item>
      <!-- <ion-item>
        <ion-label position="stacked">Password</ion-label>
        <ion-input ref="passwordRef" type="password" placeholder=""></ion-input>
      </ion-item> -->
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

const titleRef = ref();
const descriptionRef = ref();

const doSave = () => {
  emit("onClose", {
    title: titleRef.value.$el.value,
    description: descriptionRef.value.$el.value,
    file: undefined,
  });
};
</script>

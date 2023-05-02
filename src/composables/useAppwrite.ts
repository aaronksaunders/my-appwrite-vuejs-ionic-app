import { Client, Account, ID } from "appwrite";
import { ref } from "vue";

const accountRef = ref();

export const useAppwrite = () => {
  console.log(import.meta.env.VITE_ENDPOINT)
  const client = new Client()
    .setEndpoint(import.meta.env.VITE_ENDPOINT)
    .setProject(import.meta.env.VITE_PROJECT);

  accountRef.value = new Account(client);

  return {
    account: accountRef,
    ID: ID,
  };
};

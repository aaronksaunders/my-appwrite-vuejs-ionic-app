import { Client, Account, ID, Databases } from "appwrite";
import { ref } from "vue";

const accountRef = ref<Account>();
const databaseRef = ref<Databases>()

export const useAppwrite = () => {
  console.log(import.meta.env.VITE_ENDPOINT)
  const client = new Client()
    .setEndpoint(import.meta.env.VITE_ENDPOINT)
    .setProject(import.meta.env.VITE_PROJECT);

    accountRef.value = new Account(client);
    databaseRef.value = new Databases(client);

  return {
    account: accountRef,
    database: databaseRef,
    ID: ID,
    CONFIG : {
      DATABASE_ID : import.meta.env.VITE_DATABASE_ID,
      COLLECTION_ID : import.meta.env.VITE_COLLECTION_ID
    }
  };
};

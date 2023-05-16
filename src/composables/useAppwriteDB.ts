import { Models, Permission, Role } from "appwrite";
import { useAppwrite } from "./useAppwrite";
import { ref } from "vue";

const itemDocuments = ref<Models.Document[] | undefined>();

export const useAppwriteDB = () => {
  const { database, CONFIG, ID } = useAppwrite();

  /**
   *
   * @param itemData
   * @param userId
   * @returns
   */
  const doCreateDocument = async (itemData: any, userId: string) => {
    try {
      const data = await database.value?.createDocument(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTION_ID,
        ID.unique(),
        { ...itemData },
        [
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ]
      );

      await doListDocuments();

      return { data, error: undefined };
    } catch (error) {
      return { error, data: undefined };
    }
  };

  /**
   *
   * @returns
   */
  const doListDocuments = async () => {
    try {
      const data = await database.value?.listDocuments(
        CONFIG.DATABASE_ID,
        CONFIG.COLLECTION_ID
      );
      itemDocuments.value = data?.documents;
      return { data, error: undefined };
    } catch (error) {
      return { error, data: undefined };
    }
  };
  return {
    doCreateDocument,
    doListDocuments,
    documents: itemDocuments,
  };
};



//kết noi61firestore colection == "catalogs"
//catalogs là data của nguyên liệu bao gồm các loại nguyên liệu

import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../config";
import type { Catalog } from "../models/catalogs/catalogs.model";

//conection
const catalogsCollection = collection(db, "catalogs");

//các services liên quan đến catalogs
export const catalogsServices = {
  //lấy danh sách nguyên liệu
  getCatalogs: async () : Promise<Catalog | null> => {
    try {
      const docRef = doc(db, "catalogs", "ingredients"); 
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as Catalog;
      }
      return null;
    } catch (error) {
      console.error("Error getting catalogs:", error);
      return null;
    }
  },
  //lấy danh sách nguyên liệu theo id
  getCatalogById: async (id: string) : Promise<Catalog | null> => {
    try {
      const snapshot = await getDocs(catalogsCollection);
      const catalogDoc = snapshot.docs.find((doc) => doc.id === id);
      return catalogDoc ? (catalogDoc.data() as Catalog) : null;
    } catch (error) {
      console.error(`Error getting catalog with id ${id}:`, error);
      return null;
    }
  },
}
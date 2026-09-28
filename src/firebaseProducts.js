import { collection, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import app from "./firebase";

const db = getFirestore(app);

export async function getProducts() {
  const productsRef = collection(db, "products");
  const snapshot = await getDocs(productsRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
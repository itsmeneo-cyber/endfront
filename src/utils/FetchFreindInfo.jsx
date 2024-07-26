// chatUtils.js

import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";

export const FetchFriendInfo = async (id) => {
  try {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching friend info:", error);
    return null;
  }
};

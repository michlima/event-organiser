import {
  collection,
  query,
  where,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";

import { db } from "./firebase";

const getSections = async () => {
  let data = [];
  const querySnapshot = await getDocs(collection(db, "sections"));
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, data: doc.data() });
  });

  return data;
};

const postForm = async (formData, id) => {
  const docRef = await addDoc(
    collection(db, "sections", id, "schedule"),
    formData
  );
  console.log("Document added id: ", docRef);
};

const getSchedule = async (id) => {
  let data = [];
  const querySnapshot = await getDocs(
    query(collection(db, "sections", id, "schedule"), orderBy("startTime"))
  );
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    console.log(doc.data());
    data.push(doc.data());
  });
  console.log(data);
  return data;
};

export { getSections, getSchedule, postForm };

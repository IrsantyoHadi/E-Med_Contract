import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  onSnapshot,
  limit,
  orderBy
} from 'firebase/firestore';

import { firebaseConfig } from '../firebaseConfig';

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

export const addNew = async (message, from, chatRoom) => {
  const docRef = await addDoc(collection(db, chatRoom), {
    message,
    date: new Date(),
    from
  });
  console.log('Document written with ID: ', docRef.id);
};

export const getData = async (setState, chatRoom) => {
  const q = query(collection(db, chatRoom), orderBy('date', 'desc'), limit(10));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const data = [];
    querySnapshot.forEach((doc) => {
      data.unshift(doc.data());
    });
    // console.log('Current messages : ', data.join(', '));
    setState(data);
  });
};

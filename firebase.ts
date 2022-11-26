import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

import getConfig from 'next/config'
import Image from 'next/image'

// Only holds serverRuntimeConfig and publicRuntimeConfig
const { publicRuntimeConfig } = getConfig()

const firebaseConfig = {
  apiKey: publicRuntimeConfig.API_KEY,
  authDomain: "dailies-702f2.firebaseapp.com",
  projectId: "dailies-702f2",
  storageBucket: "dailies-702f2.appspot.com",
  messagingSenderId: "465829378315",
  appId: publicRuntimeConfig.APP_ID,
};


export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);


// firebase deploy --only hosting:mydailies

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";


 export let userData=[]
 export let establishment;
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCauitOiKDUc0iI0rYZrl5fcJ_Wnth_Zp4",
    authDomain: "paridhi-groups.firebaseapp.com",
    projectId: "paridhi-groups",
    storageBucket: "paridhi-groups.appspot.com",
    messagingSenderId: "1002960962372",
    appId: "1:1002960962372:web:cbca074ff3ad2e28044d11",
    measurementId: "G-3Z9RNC1E7J"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  
  // const storageRef = firebase.storage().ref();

  const analytics = getAnalytics(app);

  // Initialize Firestore
  export const db = getFirestore(app);
  export const storage = getStorage(app);

  


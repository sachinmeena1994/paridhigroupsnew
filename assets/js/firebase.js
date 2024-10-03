import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";



let userData=[]
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
  const db = getFirestore(app);
  
  // Function to fetch users from the 'users' collection
  async function fetchUsers() {
    try {
      const usersCollection = collection(db, 'user'); // Get a reference to the 'users' collection
      const userSnapshot = await getDocs(usersCollection); // Fetch all documents in the collection
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map documents to an array of objects
      userData=[...userList]
      localStorage.setItem("UserData", userData)
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  }


document.getElementById("loginbtn").addEventListener("click",() => {
  const emailId = document.getElementById("adminEmail").value
  const PasswordId = document.getElementById("adminPassword").value
  console.log(emailId,PasswordId)
  if (userData[0].email == emailId && userData[0].password == PasswordId) {
    document.getElementById("parentContainer").style.display = "none"
   }
})
// document.getElementById("uploadPropertyBtn").addEventListener("click",() => {
//   const TitleProperty = document.getElementById("propertyTitle").value
//   const DescriptionProperty = document.getElementById("propertyDescription").value
//   console.log(TitleProperty,DescriptionProperty)
  
// })
  // Call the function to fetch users
  fetchUsers();
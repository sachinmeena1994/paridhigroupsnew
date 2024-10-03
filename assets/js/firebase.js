import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";



let userData=[]
let establishment;
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



// document.getElementById("uploadPropertyBtn").addEventListener("click",() => {
//   const TitleProperty = document.getElementById("propertyTitle").value
//   const DescriptionProperty = document.getElementById("propertyDescription").value
//   console.log(TitleProperty,DescriptionProperty)
  
// })
    // Function to fetch users from the 'information' collection
    async function fetchUEstablishment() {
        try {
          const usersCollection = collection(db, 'information'); // Get a reference to the 'users' collection
          const userSnapshot = await getDocs(usersCollection); // Fetch all documents in the collection
          const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map documents to an array of objects
    
          establishment=[...userList][0]
          console.log(establishment)
          document.getElementById("estabishmentInformation").innerHTML=establishment.establishment;
          document.getElementById("point1").innerHTML+=establishment.point1
          document.getElementById("point2").innerHTML+=establishment.point2
          document.getElementById("point3").innerHTML+=establishment.point3
          document.getElementById("point4").innerHTML+=establishment.point4
          document.getElementById("point5").innerHTML+=establishment.point5
          document.getElementById("point6").innerHTML+=establishment.point6
          document.getElementById("point7").innerHTML+=establishment.point7
          document.getElementById("point8").innerHTML+=establishment.point8
          document.getElementById("point9").innerHTML+=establishment.point9
          document.getElementById("point10").innerHTML+=establishment.point10
          document.getElementById("point11").innerHTML+=establishment.point11
          document.getElementById("point12").innerHTML+=establishment.point12;
          document.getElementById("point13").innerHTML+=establishment.point13;
        } catch (error) {
            
          console.error("Error fetching user data: ", error);
        }
      }



  // Call the function to fetch users
  fetchUsers();
  fetchUEstablishment();
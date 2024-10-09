

import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {db} from './firebase.js'

async function fetchUEstablishment() {
    try {
      const usersCollection = collection(db, 'information'); // Get a reference to the 'users' collection
      const userSnapshot = await getDocs(usersCollection); // Fetch all documents in the collection
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map documents to an array of objects

let establishment=[...userList][0]
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

  fetchUEstablishment()

  

  
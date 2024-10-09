import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {db} from './firebase.js'


async function fecthProperties() {
    try {
        const propertiesCollection = collection(db, 'properties'); // Get a reference to the 'users' collection
        const propertiesSnapShots = await getDocs(propertiesCollection); // Fetch all documents in the collection
        const properList = propertiesSnapShots.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map documents to an array of objects
        console.log(properList)
    }catch(error){
        console.log(error)
    }      
}fecthProperties()
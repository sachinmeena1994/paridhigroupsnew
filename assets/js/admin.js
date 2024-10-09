import { collection, getDocs ,addDoc,setDoc,doc} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {db,storage} from './firebase.js'
// Import Storage functions separately
import {  ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";
let userData=[]
async function fetchUsers() {
  try {
    const usersCollection = collection(db, 'user'); // Get a reference to the 'users' collection
    const userSnapshot = await getDocs(usersCollection); // Fetch all documents in the collection
    const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map documents to an array of objects
    userData = [...userList]
  } catch (error) {
    console.error("Error fetching user data: ", error);
  }
}


fetchUsers();

document.getElementById("loginbtn").addEventListener("click", (event) => {
  event.preventDefault();  // Prevent the form submission and page reload
  const emailId = document.getElementById("adminEmail").value;
  const PasswordId = document.getElementById("adminPassword").value;
  
  if (userData[0].email == emailId && userData[0].password == PasswordId) {
    document.getElementById("parentContainer").style.display = "none";
    document.getElementById("dashboardSection").style.display = "block";
  }
});



document.getElementById("manageServicesBtn").addEventListener("click", function() {
  showSection("manageServicesSection");
});

document.getElementById("managePropertyBtn").addEventListener("click", function() {
  showSection("managePropertySection");
});

document.getElementById("manageTeamBtn").addEventListener("click", function() {
  showSection("manageTeamSection");
});

function showSection(sectionId) {
  const sections = document.querySelectorAll(".content-section");
  sections.forEach(section => section.classList.add("hidden"));
  document.getElementById(sectionId).classList.remove("hidden");
}



// Handle showing/hiding the property form
document.getElementById('addPropertyBtn').addEventListener('click', function() {
  const propertyForm = document.getElementById('propertyForm');
  propertyForm.classList.toggle('hidden'); // Toggle the form visibility

  // Update button text based on form visibility
  if (propertyForm.classList.contains('hidden')) {
    this.textContent = 'Add New Property';
  } else {
    this.textContent = 'Close Form';
  }
});


// Fetch properties and display them in collapsible cards
async function fetchProperties() {
  try {
    const propertiesCollection = collection(db, 'properties');
    const propertiesSnapShots = await getDocs(propertiesCollection);
    const properList = propertiesSnapShots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const propertyListContainer = document.getElementById('propertyList');
    propertyListContainer.innerHTML = "";

    properList.forEach(property => {
      const propertyCard = document.createElement('div');
      propertyCard.classList.add('property-card');

      propertyCard.innerHTML = `
        <div class="property-card-header" style="background-color: #343a40;">
          <span>${property.partner}</span>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="property-card-body">
          <img src="${property.images[0]}" alt="${property.partner}" class="img-fluid mb-2" style="max-width: 150px; height: auto;">
          <p>${property.description}</p>
     <button class="btn btn-primary custom-btn edit-btn" data-id="${property.id}">
  Edit <i class="fas fa-arrow-down"></i>
</button>

          </div>
      `;

      // Add event listener for toggling the card
      propertyCard.querySelector('.property-card-header').addEventListener('click', function() {
        propertyCard.classList.toggle('open'); // Toggle card open/close
      });

      // Add event listener for the Edit button
      propertyCard.querySelector('.edit-btn').addEventListener('click', function() {
        loadPropertyData(property);
      });

      propertyListContainer.appendChild(propertyCard);
    });

  } catch (error) {
    console.log(error);
  }
}



fetchProperties();


function loadPropertyData(property) {
  const propertyForm = document.getElementById('propertyForm');
  
  // Show the form
  propertyForm.classList.remove('hidden');
  
  // Populate form fields with existing data
  document.getElementById('propertyTitle').value = property.partner;
  document.getElementById('propertyContact').value = property.contact;
  document.getElementById('propertyDescription').value = property.description;

  // Store the property ID for updating
  propertyForm.setAttribute('data-id', property.id);

  // Change button text to indicate editing mode
  document.getElementById('addPropertyBtn').textContent = 'Close Form';

  // Wait for the next animation frame to ensure visibility, then scroll
  requestAnimationFrame(() => {
    propertyForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}






async function updateProperty(propertyId, propertyData, files) {
  try {
    let imageUrls = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const storageRef = ref(storage, file.name); 
        const snapshot = await uploadBytes(storageRef, file); 
        const imageUrl = await getDownloadURL(snapshot.ref);
        imageUrls.push(imageUrl); 
      }
    } else {
      // Get existing images if none are uploaded
      const propertyRef = doc(db, 'properties', propertyId);
      const propertyDoc = await getDoc(propertyRef);
      imageUrls = propertyDoc.data().images;
    }

    // Update property data
    const propertyDetails = {
      contact: propertyData.contact,
      description: propertyData.description,
      images: imageUrls,
      partner: propertyData.partner
    };

    await setDoc(doc(db, 'properties', propertyId), propertyDetails, { merge: true });
    console.log("Property updated with ID: ", propertyId);

    return { success: true, message: "Property updated successfully", docId: propertyId };

  } catch (error) {
    console.error("Error updating property: ", error);
    return { success: false, message: error.message };
  }
}


document.getElementById('propertyUploadForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const propertyTitle = document.getElementById('propertyTitle').value;
  const propertyContact = document.getElementById('propertyContact').value;
  const propertyDescription = document.getElementById('propertyDescription').value;
  const propertyImages = document.getElementById('propertyImage').files;

  const propertyData = {
    contact: propertyContact,
    description: propertyDescription,
    partner: propertyTitle
  };

  const propertyForm = document.getElementById('propertyForm');
  const propertyId = propertyForm.getAttribute('data-id');

  if (propertyId) {
    // Update property if ID is present
    const result = await updateProperty(propertyId, propertyData, propertyImages);
    if (result.success) {
      alert("Property updated successfully!");
    } else {
      alert("Error updating property: " + result.message);
    }
  } else {
    // Otherwise, add a new property
    const result = await addProperty(propertyData, propertyImages);
    if (result.success) {
      alert("Property added successfully!");
    } else {
      alert("Error adding property: " + result.message);
    }
  }

  // Clear the form after success
  propertyForm.reset();
  propertyForm.removeAttribute('data-id');
  document.getElementById('addPropertyBtn').textContent = 'Add New Property';
  propertyForm.classList.add('hidden');

  fetchProperties(); // Refresh the property list
});



async function addProperty(propertyData, files) {
  try {
    // Array to hold the image URLs
    let imageUrls = [];

    // Loop through all files and upload each one to Firebase Storage
    for (const file of files) {
      const storageRef = ref(storage, file.name);  // Reference to the properties folder in storage
      const snapshot = await uploadBytes(storageRef, file);  // Upload each image file
      const imageUrl = await getDownloadURL(snapshot.ref);  // Get the uploaded image URL
      imageUrls.push(imageUrl);  // Store the image URL in the array
    }

    // Prepare the property object with multiple image URLs
    const propertyDetails = {
      contact: propertyData.contact,
      description: propertyData.description,
      images: imageUrls,  // Store the array of image URLs in 'images'
      partner: propertyData.partner
    };

    // Add the property details to Firestore collection
    const docRef = await addDoc(collection(db, 'properties'), propertyDetails);
    console.log("Property added with ID: ", docRef.id);
    
    return { success: true, message: "Property added successfully", docId: docRef.id };
    
  } catch (error) {
    console.error("Error adding property: ", error);
    return { success: false, message: error.message };
  }
}


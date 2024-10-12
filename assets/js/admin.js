import { collection, getDocs,getDoc ,addDoc,setDoc,doc,deleteDoc} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {db,storage} from './firebase.js'
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

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

async function deleteProperty(propertyId) {
  const confirmDelete = confirm("Are you sure you want to delete this property?");
  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, 'properties', propertyId)); // Deletes the document from Firestore
    alert("Property deleted successfully!");
    fetchProperties(); // Refresh the list of properties
  } catch (error) {
    console.error("Error deleting property: ", error);
    alert("Error deleting property: " + error.message);
  }
}


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
          <button class="btn btn-danger custom-btn delete-btn" data-id="${property.id}">
            Delete <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;
    
      // Event listener to toggle the card open/close
      propertyCard.querySelector('.property-card-header').addEventListener('click', function() {
        propertyCard.classList.toggle('open');
      });
    
      // Event listener for the Edit button
      propertyCard.querySelector('.edit-btn').addEventListener('click', function() {
        loadPropertyData(property);
      });
    
      // Event listener for the Delete button
      propertyCard.querySelector('.delete-btn').addEventListener('click', function() {
        deleteProperty(property.id);
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



// Open the modal for adding/editing service details
function openServiceDetailForm(serviceIndex, detailIndex = null) {
  const service = serviceList[0].services[serviceIndex];

  // If detailIndex is provided, we're editing an existing detail
  if (detailIndex !== null && service.serviceDetails[detailIndex]) {
    const detail = service.serviceDetails[detailIndex];
    
    document.getElementById("serviceContact").value = detail.contact || "";
    document.getElementById("serviceLocation").value = detail.location || "";
    document.getElementById("servicePropertyName").value = detail.propertyName || "";
    
    // Set the data attributes to indicate the service and detail being edited
    document.getElementById("serviceForm").setAttribute("data-service-index", serviceIndex);
    document.getElementById("serviceForm").setAttribute("data-detail-index", detailIndex);
  } else {
    // If no detailIndex is provided, clear the form for adding a new detail
    document.getElementById("serviceContact").value = "";
    document.getElementById("serviceLocation").value = "";
    document.getElementById("servicePropertyName").value = "";

    // Set only the service index and remove the detail index for a new detail
    document.getElementById("serviceForm").setAttribute("data-service-index", serviceIndex);
    document.getElementById("serviceForm").removeAttribute("data-detail-index");
  }

  // Show the modal for editing or adding
  document.getElementById("serviceModal").style.display = "block";
}

// Fetch services from Firebase and display them

let serviceList = [];

async function fetchServices() {
  try {
    const serviceCollection = collection(db, 'services');
    const servicesSnapShots = await getDocs(serviceCollection);
    serviceList = servicesSnapShots.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (serviceList.length > 0) {
      displayServices(serviceList[0].services);  // Assuming you only want the first document's services
    }
  } catch (error) {
    console.error("Error fetching services: ", error);
  }
}

function displayServices(services) {
  const manageServicesSection = document.getElementById("manageServicesSection");
  manageServicesSection.innerHTML = `
    <h4 class="mt-5 mb-3">Manage Services</h4>
    <p>This section will handle service management.</p>
  `;

  services.forEach((service, serviceIndex) => {
    const serviceCard = document.createElement("div");
    serviceCard.classList.add("service-card", "mb-4", "p-3");
    serviceCard.style.border = "1px solid #ddd";
    serviceCard.style.borderRadius = "5px";
    serviceCard.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.1)";
    
    // Use an empty array as a fallback if serviceDetails is undefined
    const serviceDetailsArray = service.serviceDetails || [];
  
    serviceCard.innerHTML = `
      <h5 class="service-title mb-2">${service.serviceTitle}</h5>
     
    `;

    // Create a container for service details
    const detailsContainer = document.createElement("div");
    detailsContainer.classList.add("details-container");

    // Loop through each detail and create a card for each
    serviceDetailsArray.forEach((detail, detailIndex) => {
      const detailCard = document.createElement("div");
      detailCard.classList.add("detail-card", "p-2", "mb-3");
      detailCard.style.border = "1px solid #ddd";
      detailCard.style.borderRadius = "5px";
      detailCard.style.boxShadow = "0px 2px 6px rgba(0, 0, 0, 0.1)";

      // Display contact, location, property name, and images
      detailCard.innerHTML = `
        <ul>
          <li><strong>Contact:</strong> ${detail.contact || 'N/A'}</li>
          <li><strong>Location:</strong> ${detail.location || 'N/A'}</li>
          <li><strong>Property Name:</strong> ${detail.propertyName || 'N/A'}</li>
        </ul>
        <div class="detail-images d-flex flex-wrap gap-2">
          ${detail.images?.map(image => `<img src="${image}" class="img-fluid" style="max-width: 100px; height: auto; border-radius: 4px;">`).join('') || 'No images available'}
        </div>
      `;

      // Add Edit and Delete buttons for each detail
      const editDetailButton = document.createElement("button");
      editDetailButton.classList.add("btn", "btn-success", "btn-sm");
      editDetailButton.textContent = "Edit Detail";
      editDetailButton.addEventListener("click", () => openServiceDetailForm(serviceIndex, detailIndex));

      const deleteDetailButton = document.createElement("button");
      deleteDetailButton.classList.add("btn", "btn-danger", "btn-sm", "ms-2");
      deleteDetailButton.textContent = "Delete Detail";
      deleteDetailButton.addEventListener("click", () => deleteServiceDetail(serviceIndex, detailIndex));

      // Append buttons to detail card
      const detailButtonContainer = document.createElement("div");
      detailButtonContainer.classList.add("mt-2");
      detailButtonContainer.appendChild(editDetailButton);
      detailButtonContainer.appendChild(deleteDetailButton);
      detailCard.appendChild(detailButtonContainer);

      // Append detail card to details container
      detailsContainer.appendChild(detailCard);
    });

    // Add the details container to the main service card
    serviceCard.appendChild(detailsContainer);

    // Add the main "Add New Detail" button for the service
    const addDetailButton = document.createElement("button");
    addDetailButton.classList.add("btn", "btn-primary", "btn-sm", "mt-2");
    addDetailButton.textContent = "Add New Detail";
    addDetailButton.addEventListener("click", () => openServiceDetailForm(serviceIndex));

    serviceCard.appendChild(addDetailButton);
    manageServicesSection.appendChild(serviceCard);
  });
}


async function saveServiceDetails() {
  const contact = document.getElementById("serviceContact").value;
  const location = document.getElementById("serviceLocation").value;
  const propertyName = document.getElementById("servicePropertyName").value;
  const imageFiles = document.getElementById("serviceImages").files;
  const currentServiceIndex = parseInt(document.querySelector("[data-service-index]").getAttribute("data-service-index"));
  
  let imageUrls = [];
  for (const file of imageFiles) {
    const storageRef = ref(storage, `service-images/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(snapshot.ref);
    imageUrls.push(imageUrl);
  }

  const newServiceDetails = { contact, location, propertyName, images: imageUrls };
  const serviceId = serviceList[0].id;
  const serviceDocRef = doc(db, "services", serviceId);
  const servicesArray = serviceList[0].services;

  if (currentServiceIndex >= 0 && currentServiceIndex < servicesArray.length) {
    const serviceDetailsArray = servicesArray[currentServiceIndex].serviceDetails || [];
    const existingDetailIndex = serviceDetailsArray.findIndex(detail => detail.propertyName === propertyName);

    if (existingDetailIndex >= 0) {
      serviceDetailsArray[existingDetailIndex] = { ...serviceDetailsArray[existingDetailIndex], ...newServiceDetails };
    } else {
      serviceDetailsArray.push(newServiceDetails);
    }

    servicesArray[currentServiceIndex].serviceDetails = serviceDetailsArray;

    try {
      await setDoc(serviceDocRef, { services: servicesArray }, { merge: true });
      console.log("Firestore update completed successfully.");

      // Re-fetch document data to update serviceList and ensure UI reflects changes
      const updatedDoc = await getDoc(serviceDocRef);
      if (updatedDoc.exists()) {
        serviceList[0] = { id: updatedDoc.id, ...updatedDoc.data() };
        alert(existingDetailIndex >= 0 ? "Service details updated successfully!" : "New service details added successfully!");
        displayServices(serviceList[0].services);
      }
    } catch (error) {
      console.error("Error updating service details:", error);
      alert("Failed to update service details: " + error.message);
    }

    document.getElementById("serviceModal").style.display = "none";
  } else {
    console.error("Invalid service index!");
  }
}

async function deleteServiceDetail(serviceIndex, detailIndex) {
  // Ask for confirmation
  const confirmDelete = confirm("Are you sure you want to delete this service detail?");
  if (!confirmDelete) return; // Exit if the user cancels

  // Get the specific service details array
  const serviceDetailsArray = serviceList[0].services[serviceIndex].serviceDetails;

  if (serviceDetailsArray && serviceDetailsArray.length > detailIndex) {
    // Remove the detail at the specified index
    serviceDetailsArray.splice(detailIndex, 1);

    // Get the document ID of the service document to update
    const serviceId = serviceList[0].id; // Assuming you're updating the first service document in the list
    const serviceDocRef = doc(db, "services", serviceId);

    // Update the services array with the modified serviceDetails array
    serviceList[0].services[serviceIndex].serviceDetails = serviceDetailsArray;

    try {
      // Update the Firestore document with the modified services array
      await setDoc(serviceDocRef, { services: serviceList[0].services }, { merge: true });
      
      // Refresh the UI to reflect the deleted detail
      displayServices(serviceList[0].services);
      alert("Service detail deleted successfully!");
    } catch (error) {
      console.error("Error deleting service detail: ", error);
      alert("Failed to delete service detail: " + error.message);
    }
  } else {
    console.error("Invalid detail index for deletion.");
  }
}



fetchServices();
window.openServiceDetailForm = openServiceDetailForm;
window.deleteServiceDetail = deleteServiceDetail;
document.getElementById("saveServiceDetailsForm").addEventListener("click", function(event) {
  event.preventDefault();  // Prevents the default form submission
  saveServiceDetails();
});

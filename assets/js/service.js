import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { db } from './firebase.js';

// Get the 'id' parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const serviceId = urlParams.get('id');

async function fetchServices() {
  try {
    const serviceCollection = collection(db, 'services');
    const propertiesSnapShots = await getDocs(serviceCollection);
    const serviceList = propertiesSnapShots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Find the specific service based on the 'id' from the URL
    const currentService = serviceList[0].services[serviceId]

    if (currentService) {
      displayServiceDetails(currentService); // Display the service details on the page
    } else {
      console.log("Service not found");
    }
  } catch (error) {
    console.log(error);
  }
}

fetchServices();

function displayServiceDetails(service) {
    const serviceContainer = document.getElementById('serviceDetails');
  
    // Create the main title for the service
    const titleElement = document.createElement('h2');
    titleElement.textContent = service.serviceTitle || "Service Details";
    titleElement.classList.add('service-title');
  
    // Main container for all service details
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('details-container');
  
    // Loop over each service detail
    service.serviceDetails?.forEach(detail => {
      const detailCard = document.createElement('div');
      detailCard.classList.add('detail-card');
  
      // Gallery for main image and thumbnails
      const imageGallery = document.createElement('div');
      imageGallery.classList.add('image-gallery');
  
      // Main Image
      const mainImage = document.createElement('img');
      mainImage.src = detail.images && detail.images.length > 0 ? detail.images[0] : 'placeholder.jpg';
      mainImage.classList.add('main-image');
      mainImage.style.width = '600px';
      mainImage.style.height = '400px';
      mainImage.style.objectFit = 'cover';
      mainImage.style.borderRadius = '10px';
      imageGallery.appendChild(mainImage);
  
      // Thumbnail Gallery for the rest of the images
      const thumbnailGallery = document.createElement('div');
      thumbnailGallery.classList.add('thumbnail-gallery');
      thumbnailGallery.style.textAlign = 'center'; // Center-align thumbnails
  
      detail.images?.forEach((imageUrl, index) => {
        if (index === 0) return;
        
        const thumbnail = document.createElement('img');
        thumbnail.src = imageUrl;
        thumbnail.classList.add('thumbnail');
        thumbnail.style.width = '100px';
        thumbnail.style.height = '75px';
        thumbnail.style.objectFit = 'cover';
        thumbnail.style.borderRadius = '5px';
        thumbnail.style.marginRight = '5px';
        thumbnail.style.cursor = 'pointer';
        
        // Clicking the thumbnail changes the main image
        thumbnail.addEventListener('click', () => {
          mainImage.src = imageUrl;
        });
  
        thumbnailGallery.appendChild(thumbnail);
      });
  
      // Append the thumbnail gallery below the main image
      imageGallery.appendChild(thumbnailGallery);
  
      // Display detail information
      const infoContainer = document.createElement('div');
      infoContainer.style.textAlign = 'center'; // Center-align text
      infoContainer.innerHTML = `
        <ul>
          <li><strong>Contact:</strong> ${detail.contact || 'N/A'}</li>
          <li><strong>Location:</strong> ${detail.location || 'N/A'}</li>
          <li><strong>Property Name:</strong> ${detail.propertyName || 'N/A'}</li>
        </ul>
      `;
      
      // Append elements to detail card
      detailCard.appendChild(imageGallery);
      detailCard.appendChild(infoContainer);
      
      // Append each detail card to the details container
      detailsContainer.appendChild(detailCard);
    });
  
    // Append all elements to the main container
    serviceContainer.appendChild(titleElement);
    serviceContainer.appendChild(detailsContainer);
}

  
  

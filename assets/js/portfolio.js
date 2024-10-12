import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { db } from './firebase.js';

// Get the ID from the URL hash
const portfolioId = window.location.hash.substring(1); // Removes the '#' from the ID

// Function to fetch data based on the specific document ID
async function fetchPropertyById(id) {
    try {
        const propertyDocRef = doc(db, 'properties', id); // Reference to the specific document in the 'properties' collection
        const propertySnap = await getDoc(propertyDocRef); // Fetch the document

        if (propertySnap.exists()) {
            const propertyData = { id: propertySnap.id, ...propertySnap.data() };
            console.log("Property Data:", propertyData);
            displayPropertyDetails(propertyData);
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error fetching document:", error);
    }
}

// Function to display property data in the HTML
function displayPropertyDetails(data) {
    // Display Client Name
    document.getElementById("client").innerText = data.partner;
    document.getElementById("contact").innerText = data.contact;

    // Display Description
    document.getElementById("description").innerHTML = data.description;

    // Display Images in Swiper Slider
    const swiperWrapper = document.querySelector(".swiper-wrapper");
    data.images.forEach(imageUrl => {
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");
        slide.innerHTML = `<img src="${imageUrl}" class="img-fluid" alt="${data.partner}">`;
        swiperWrapper.appendChild(slide);
    });

    // Initialize Swiper after adding slides
    const swiper = new Swiper('.swiper', {
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        }
    });
}

// Fetch the data for the specific ID
fetchPropertyById(portfolioId);

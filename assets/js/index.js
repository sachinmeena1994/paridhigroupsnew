

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

// Fetch properties and display them in collapsible cards
async function fetchProperties() {
  try {
    const propertiesCollection = collection(db, 'properties');
    const propertiesSnapShots = await getDocs(propertiesCollection);
    const properList = propertiesSnapShots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(properList)
    const portfolioContainer = document.getElementById("portfolio-container");

    properList.forEach(item => {
      const portfolioItem = document.createElement("div");
      portfolioItem.classList.add("col-lg-4", "col-md-6", "portfolio-item");
  
      portfolioItem.innerHTML = `
        <a href="portfolio-details.html#${item.id}" class="portfolio-wrap" >
          <img src="${item.images[0]}" class="img-fluid" alt="${item.partner}">
          <div class="portfolio-info">
            <h4>${item.partner}</h4>
            <p>${item.contact}</p>
            <div class="portfolio-links">
              <a href="${item.images[0]}" data-gallery="portfolioGallery" class="portfolio-lightbox" title="${item.partner}">
              </a>
            </div>
          </div>
        </a>
      `;
  
      portfolioContainer.appendChild(portfolioItem);
    });
  
  }
  catch (error) {
    console.log(error);
  }}



  // portfolio-details.html script
document.addEventListener("DOMContentLoaded", () => {
  const portfolioId = window.location.hash.substring(1); // Gets the id after the #
  if (portfolioId) {
    // Fetch data or filter items based on portfolioId
    // Example: Call a function to display the correct details
    loadPortfolioDetails(portfolioId);
  }
});

function loadPortfolioDetails(id) {
  // Your logic here to display data based on the id
  // For example, fetch item data from API and render it to the page
}

async function fetchServices() {
  try {
    const serviceCollection = collection(db, 'services');
    const propertiesSnapShots = await getDocs(serviceCollection);
    const serviceList = propertiesSnapShots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(serviceList)
  document.getElementById("service1").innerHTML=serviceList[0].services[0].description
  document.getElementById("service2").innerHTML=serviceList[0].services[1].description
  document.getElementById("service3").innerHTML=serviceList[0].services[2].description
  document.getElementById("service4").innerHTML=serviceList[0].services[3].description
  document.getElementById("service5").innerHTML=serviceList[0].services[4].description
  document.getElementById("service6").innerHTML=serviceList[0].services[5].description

  
  }
  catch (error) {
    console.log(error);
  }}
  fetchServices()
fetchProperties()
  fetchUEstablishment()




  
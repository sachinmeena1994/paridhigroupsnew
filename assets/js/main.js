  // Import the functions you need from the SDKs you need


(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select("#header");
    let offset = header.offsetHeight;

    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: "smooth",
    });
  };

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select("#header");
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add("header-scrolled");
      } else {
        selectHeader.classList.remove("header-scrolled");
      }
    };
    window.addEventListener("load", headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Back to top button
   */
  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on("click", ".mobile-nav-toggle", function (e) {
    select("#navbar").classList.toggle("navbar-mobile");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /**
   * Mobile nav dropdowns activate
   */
  on(
    "click",
    ".navbar .dropdown > a",
    function (e) {
      if (select("#navbar").classList.contains("navbar-mobile")) {
        e.preventDefault();
        this.nextElementSibling.classList.toggle("dropdown-active");
      }
    },
    true
  );

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        let navbar = select("#navbar");
        if (navbar.classList.contains("navbar-mobile")) {
          navbar.classList.remove("navbar-mobile");
          let navbarToggle = select(".mobile-nav-toggle");
          navbarToggle.classList.toggle("bi-list");
          navbarToggle.classList.toggle("bi-x");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Clients Slider
   */
  new Swiper(".clients-slider", {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    slidesPerView: "auto",
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 40,
      },
      480: {
        slidesPerView: 3,
        spaceBetween: 60,
      },
      640: {
        slidesPerView: 4,
        spaceBetween: 80,
      },
      992: {
        slidesPerView: 6,
        spaceBetween: 120,
      },
    },
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener("load", () => {
    let portfolioContainer = select(".portfolio-container");
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: ".portfolio-item",
      });

      let portfolioFilters = select("#portfolio-flters li", true);

      on(
        "click",
        "#portfolio-flters li",
        function (e) {
          e.preventDefault();
          portfolioFilters.forEach(function (el) {
            el.classList.remove("filter-active");
          });
          this.classList.add("filter-active");

          portfolioIsotope.arrange({
            filter: this.getAttribute("data-filter"),
          });
          portfolioIsotope.on("arrangeComplete", function () {
            AOS.refresh();
          });
        },
        true
      );
    }
  });

  /**
   * Initiate portfolio lightbox
   */
  const portfolioLightbox = GLightbox({
    selector: ".portfolio-lightbox",
  });

  /**
   * Portfolio details slider
   */
  new Swiper(".portfolio-details-slider", {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
  });

  /**
   * Testimonials slider
   */
  new Swiper(".testimonials-slider", {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    slidesPerView: "auto",
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
  });

  /**
   * Animation on scroll
   */

  document.addEventListener("DOMContentLoaded", function () {
    var welcomeText = document.getElementsByClassName("welcome-text");

    // Add the 'slide-in' class to trigger the animation
    for (let i = 0; i < welcomeText.length; i++) {
      welcomeText[i].classList.add("slide-in");
      welcomeText[i].addEventListener("animationend", addGlow);
    }

    function addGlow(event) {
      // Add the 'glow' class to start the glow effect
      event.target.classList.add("glow");

      setTimeout(function () {
        event.target.classList.remove("glow", "glow-active");
      }, 3000);
      setTimeout(function () {
        event.target.classList.add("glow-active");
      }, 300); // Adjust the delay as needed
    }
  });
  window.addEventListener("load", () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  // for portfolio page style="color: rgb(46 158 255)
  const projectsData = [
    {
      partner: "Wallfort",
      contact: "+91 99819 49909",
      description: `
      <strong> Wallfort Residences: </strong>Redefining Modern Living Wallfort Residences stand as a testament to contemporary living, seamlessly blending luxurious elements with functional design. Every Wallfort property is a reflection of sophistication, offering residents an unparalleled urban lifestyle.
      
      <strong style='color: rgb(46 158 255)'> The architectural ethos of Wallfort Residences is rooted in modernity.</strong> <br><br> Innovative design principles are employed to create spaces that resonate with the evolving needs of urban dwellers. The residences showcase a harmonious blend of luxury and functionality, setting a new standard for  <strong style='color: rgb(46 158 255)'> modern living.</strong> 
      
      <br><br>   At the heart of Wallfort properties is a commitment to providing residents with an enriched living experience. Thoughtful design ensures that every square foot is optimized for both comfort and utility. From the grand entrance to the intricacies of interior spaces, Wallfort Residences prioritize aesthetics without compromising on functionality.`,
      images: [
        "assets/img/portfolio/wallfor.jpg",
        "assets/img/portfolio/Wallfort2.jpeg",
        "assets/img/portfolio/wallfort2.jpg",
      ],
    },
    {
      partner: "Sarvam the Complete Life",
      contact: "+91 99819 49909",
      description: `<strong>Sarvam </strong>is meticulously crafted to offer residents a comprehensive and enriching life experience. Centered around the principles of holistic living, Sarvam seamlessly integrates residences, recreational spaces, and essential amenities, creating a harmonious environment that caters to the <strong style='color: rgb(46 158 255)'> mind, body, and soul. </strong>

      <br><br> Nestled within <strong style='color: rgb(46 158 255)'> Sarvam are thoughtfully designed residences  </strong> that embody the essence of contemporary living. The architecture reflects a perfect balance between aesthetics and functionality, creating living spaces that inspire and rejuvenate. Each residence is a testament to comfort, style, and modernity, providing a tranquil sanctuary for residents.
      
      <br><br> Beyond the confines of individual homes, Sarvam unfolds a landscape of recreational spaces.<strong style='color: rgb(46 158 255)'>  Immerse yourself </strong> in lush greenery, unwind by pristine water features, and engage in activities that cater to various interests. The carefully curated recreational spaces contribute to a vibrant community life, fostering connections and well-being.
      
      `,
      images: [
        "assets/img/portfolio/sarvam-.jpg",
        "assets/img/portfolio/SARVAM.jpeg",
      ],
    },
    {
      partner: "Galaxy Shrishti Heights",
      contact: "+91 99819 49909",
      description:
        "<strong>Galaxy Shrishti Heights</strong>, a towering symbol of architectural brilliance, redefines urban living with a perfect blend of sophistication and modern design.<br><br> This residential masterpiece stands tall, offering residents stunning views, spacious apartments, and top-notch facilities.At the core of  <strong style='color: rgb(46 158 255)'>Galaxy Shrishti Heights  </strong>is an architectural marvel that seamlessly integrates innovative design with functionality. The meticulously crafted structure captivates with its aesthetic appeal, creating an environment where luxury and comfort converge.Positioned strategically, the heights provide panoramic views of the city, creating an ever-changing backdrop for residents. The elevated vantage point enhances the living experience, combining vibrant city lights with serene landscapes.",
      images: [
        "assets/img/portfolio/shristi2.jpg",
        "assets/img/portfolio/Shristi.jpeg",
      ],
    },
    {
      partner: "Flats for Sale and Rent",
      contact: "+91 99819 49909",
      description: `<strong >Step into a world </strong> of convenience and comfort with our diverse range of flats available for both sale and rent. Our properties are thoughtfully crafted to cater to varied preferences, providing modern living spaces that seamlessly blend style and functionality. Located in the heart of the city, these flats offer a perfect balance between accessibility and tranquility.

      <br><br> <strong style='color: rgb(46 158 255)'>  Each flat  </strong> is designed to meet the highest standards of contemporary living. Modern architecture, smart layouts, and stylish finishes define our properties, ensuring that residents experience the epitome of urban lifestyle. Whether you are seeking a cozy one-bedroom apartment or a spacious family home, our collection of flats caters to <strong style='color: rgb(46 158 255)'> all your housing needs.</strong>
      
      <br><br>  <strong style='color: rgb(46 158 255)'> Discover the convenience </strong> of city living with amenities tailored to enhance your daily life. From fitness centers to communal spaces, our properties offer facilities that complement the modern lifestyle. Embrace a hassle-free living experience where everything you need is within reach.`,
      images: [
        "assets/img/portfolio/flats.jpg",
        "assets/img/portfolio/flat2.jpg",
      ],
    },
    {
      partner: "Auro Villas",
      contact: "+91 99819 49909",
      description: `Indulge in the epitome of luxury living at <strong> Auro Villas </strong>, where each detail is meticulously designed to offer a serene and sophisticated lifestyle. Situated in a picturesque location, these villas redefine the concept of modern living, providing residents with a perfect balance of tranquility and convenience.

      <br><br> <strong style='color: rgb(46 158 255)'>   Experience the joy  </strong> of spacious interiors that seamlessly blend elegance with functionality. The villas boast contemporary architecture, ensuring a harmonious living environment that reflects both style and comfort. Open layouts, large windows, and thoughtfully designed spaces create an ambiance of openness and freedom.
      
      `,
      images: [
        "assets/img/portfolio/Aura-.jpg",
        "assets/img/portfolio/AURA.jpeg",
      ],
    },
    {
      partner: "Souls Pearl",
      contact: "+91 99819 49909",
      description: `<strong>Souls Pearl </strong> stands as a testament to exquisite living, offering a haven of elegance and sophistication that transcends the ordinary. Each facet of Souls Pearl is a masterpiece, meticulously designed to provide residents with an unparalleled living experience that seamlessly blends comfort and style.

      <br><br> <strong style='color: rgb(46 158 255)'> Step into a world </strong>  where every detail reflects a commitment to quality living and contemporary aesthetics. The interiors of Souls Pearl are a symphony of elegance, with meticulously chosen materials, stylish finishes, and thoughtful layouts that enhance the overall living experience.
      
      <br><br>The living spaces are designed to be not just functional but also visually stunning, creating an ambiance that resonates with a sense of sophistication. From the grand entrance to the smallest details, Souls Pearl exudes an air of luxury that elevates the standards of modern living.
      
      `,
      images: [
        "assets/img/portfolio/souls-2.jpg",
        "assets/img/portfolio/souls.jpg",
      ],
    },
  ];

  document.addEventListener("DOMContentLoaded", function () {
    const currentUrl = window.location.href;
    const projectIndex = currentUrl.split("#")[1];

    // Assuming you have the projectsData array
    const project = projectsData[projectIndex];

    // Set Swiper images dynamically
    const swiperContainer = document.querySelector(
      ".portfolio-details-slider .swiper-wrapper"
    );
    if (swiperContainer) {
      swiperContainer.innerHTML = ""; // Clear existing content
      document.getElementById("client").innerHTML = project.partner;
      document.getElementById("client").innerHTML += `<br> <br> <span style="color: rgb(46 158 255)" >${project.contact}</span>`
      document.getElementById("description").innerHTML = project.description;
      // Add the first image
      const image1Slide = document.createElement("div");
      image1Slide.classList.add("swiper-slide");
      const image1 = document.createElement("img");
      image1.src = project.images[0];
      image1.alt = "Image 1";
      image1Slide.appendChild(image1);
      swiperContainer.appendChild(image1Slide);

      // Add the second image
      const image2Slide = document.createElement("div");
      image2Slide.classList.add("swiper-slide");
      const image2 = document.createElement("img");
      image2.src = project.images[1];
      image2.alt = "Image 2";
      image2Slide.appendChild(image2);
      swiperContainer.appendChild(image2Slide);
      new Swiper(".portfolio-details-slider", {
        slidesPerView: 1,
        spaceBetween: 10,
        // Set your desired height here
        height: "200px", // Adjust the height accordingly
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      });
    }
  });

  document.getElementById("currentYear").textContent = new Date().getFullYear();








})();

'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const section_1 = document.getElementById('section--1');
const navLinks = document.querySelector('.nav__links');
const parentTab = document.querySelector('.operations');
const tabContainer = document.querySelector('.operations__tab-container');
const navContainer = document.querySelector('.nav');
const header = document.querySelector('.header');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const allSections = document.querySelectorAll('.section');
const slides = document.querySelectorAll('.slide');
const dotContainer = document.querySelector('.dots');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Smooth Scrolling With Nav Bar
btnScrollTo.addEventListener('click', e => {
  // section_1.scrollIntoView({ behavior: 'smooth' });
  // console.log(e.target.getBoundingClientRect());
  // console.log(window.scrollX, window.scrollY);
  // console.log(
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  window.scrollTo({
    left: 0,
    top: section_1.getBoundingClientRect().top + window.scrollY,
    behavior: 'smooth',
  });
});

navLinks.addEventListener('click', event => {
  event.preventDefault();
  const sectionID = event.target.getAttribute('href');

  document.querySelector(sectionID).scrollIntoView({ behavior: 'smooth' });
});

//Tab click - Display Content
tabContainer.addEventListener('click', event => {
  Array.from(tabContainer.children).forEach(element => {
    element.classList.remove('operations__tab--active');
  });
  const targetButton = event.target.closest('.operations__tab');
  if (!targetButton) return;

  targetButton?.classList.add('operations__tab--active');

  Array.from(parentTab.children).forEach(element => {
    element.classList.contains('operations__content')
      ? element.classList.remove('operations__content--active')
      : null;
  });

  // Another way of achieving the same result
  // parentTab.querySelectorAll('.operations__content').forEach(element => {
  //   element.classList.remove('operations__content--active');
  // });

  const operationContent = document.querySelector(
    `.operations__content--${targetButton?.dataset.tab}`
  );
  document
    .querySelector(`.operations__content--${targetButton?.dataset?.tab}`)
    ?.classList.add('operations__content--active');
});

// Mouse Over UnHighlight Effect

// My designed way
// navLinks.addEventListener('mouseover', event => {
//   if (event.target.classList.contains('nav__link')) {
//     const link = event.target;
//     console.log(link);
//     Array.from(navLinks.children).forEach(navLink => {
//       console.log(navLink.querySelector('.nav__link'));

//       navLink.querySelector('.nav__link') !== link
//         ? (navLink.style.opacity = 0.5)
//         : null;
//     });
//   }
// });

//ChatGPT way
navLinks.addEventListener('mouseover', event => {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;

    // Loop through all <a> elements inside navLinks and adjust opacity
    navLinks.querySelectorAll('.nav__link').forEach(navLink => {
      navLink.style.opacity = navLink === link ? 1 : 0.5;
    });
  }
});

navLinks.addEventListener('mouseout', () => {
  navLinks.querySelectorAll('.nav__link').forEach(navLink => {
    navLink.style.opacity = 1;
  });
});

// Blurred Images Reveal
const blurredImages = document.querySelectorAll('img[data-src]');

function callbackObserver(entries, observer) {
  const [entry] = entries;

  if (entry.isIntersecting) {
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', () => {
      entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
  }
}

const sectionObs = new IntersectionObserver(callbackObserver, {
  root: null,
  threshold: 0.5,
});

blurredImages.forEach(image => {
  sectionObs.observe(image);
});

// ChatGPT written Code
// // Create IntersectionObserver with a threshold of 40%
// const observer = new IntersectionObserver(
//   (entries, observer) => {
//     entries.forEach(entry => {
//       // Check if the image is at least 40% visible
//       if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
//         entry.target.classList.remove('lazy-img');
//         // Load the image by replacing src with data-src
//         const img = entry.target;
//         img.src = img.getAttribute('data-src');
//         img.addEventListener('load', () => {
//           console.log('Image loaded:', img);
//           img.removeAttribute('data-src'); // Clean up data-src attribute
//         });

//         // Stop observing this image as it's already loaded
//         observer.unobserve(img);
//       }
//     });
//   },
//   { threshold: 0.4 }
// ); // Trigger when 40% of the image is visible

// // Observe all images with the data-src attribute
// blurredImages.forEach(img => observer.observe(img));

// Sticky Navigation
const callBackStickyNav = function (entries, observer) {
  const [entry] = entries;
  !entry.isIntersecting
    ? navContainer.classList.add('sticky')
    : navContainer.classList.remove('sticky');
};

const stickyNav = new IntersectionObserver(callBackStickyNav, {
  root: null,
  threshold: 0,

  rootMargin: `-${navContainer.getBoundingClientRect().height}px`,
});
stickyNav.observe(header);

// Reveal Sections
const sectionsObserver = new IntersectionObserver(
  function (entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('section--hidden');
      }
      // observer.unobserve(entry.target);
    });
  },
  {
    root: null,
    threshold: 0.15,
  }
);

allSections.forEach(section => {
  sectionsObserver.observe(section);
  section.classList.add('section--hidden');
});

//Activate Dot


// Sliders Side-By-Side
(() => {
  slides.forEach(
    (slide, i) => (slide.style.transform = `translateX(${i * 100}%)`)
  );
})();

// Adding dot
slides.forEach((_, i) => {
  const dotHTML = `<button class="dot--${i} dots__dot"></button>`;
  dotContainer.insertAdjacentHTML('beforeend', dotHTML);
});

const allDots = document.querySelectorAll('.dots__dot');

// Activate Dot
const activateDot = function(curr) {
  allDots.forEach(dot => {
    dot.classList.remove('dots__dot--active');
    if (dot.classList.contains(`dot--${curr}`)) {
      dot.classList.add('dots__dot--active');
    }
  });
}

let currentSlide = 0;
let slidesLength = slides.length;
activateDot(currentSlide)
// document.querySelector(`.dot--${currentSlide}`).classList.add('dots__dot--active')

const moveSlides = function (current) {
  activateDot(current)
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${(i - current) * 100}%)`;
  });
};

btnRight.addEventListener('click', () => {
  currentSlide++;
  if (currentSlide < slidesLength) {
    moveSlides(currentSlide);
  } else {
    currentSlide = 0;
    moveSlides(currentSlide);
  }
});
btnLeft.addEventListener('click', () => {
  currentSlide--;
  if (currentSlide < 0) {
    currentSlide = slidesLength - 1;
    moveSlides(currentSlide);
  } else {
    moveSlides(currentSlide);
  }
});


dotContainer.addEventListener('click', (e) => {
  moveSlides(e.target.classList[0].split("--").at(-1))
})
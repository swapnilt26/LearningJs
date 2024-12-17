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

tabContainer.addEventListener('click', event => {
  Array.from(tabContainer.children).forEach(element => {
    element.classList.remove('operations__tab--active');
  });
  const targetButton = event.target.closest('.operations__tab');

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
    `.operations__content--${targetButton.dataset.tab}`
  );
  document
    .querySelector(`.operations__content--${targetButton.dataset.tab}`)
    .classList.add('operations__content--active');
});

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

const navLink = document.querySelectorAll('.nav__link');

function callbackObserver(entries, obsever) {
  console.log(entries);

  const [entry] = entries;
}

const sectionObs = new IntersectionObserver(callbackObserver, {
  root: null,
});

sectionObs.observe(parentTab);

// navLink.forEach(element => {
//   sectionObs.observe(element);
// });

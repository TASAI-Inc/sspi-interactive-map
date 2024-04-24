

// function for add bg to navbar on scroll
// css is
//    .navbar.fixed-top.scrolled {
//     background-color: #fff !important;
//     transition: background-color 200ms linear;
//   }
// $(function () {
//     $(document).scroll(function () {
//       var $nav = $(".navbar.fixed-top");
//       $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
//     });
//   });


//call lightbox from another class query Selector
// document.querySelectorAll('.my-lightbox-toggle').forEach((el) => el.addEventListener('click', (e) => {
// 	e.preventDefault();
// 	const lightbox = new Lightbox(el, options);
// 	lightbox.show();
// }));

// //note bootstrap poppover
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

// note function for add bg to navbar on scroll
// for ref, the css is
//    .navbar.scroll-me.scrolled {
//     background-color: #fff !important;
//     transition: background-color 200ms linear;
//   }
document.addEventListener('DOMContentLoaded', function () {
  var navbar = document.querySelector('.navbar.scroll-me');

  window.addEventListener('scroll', function () {
    if (window.scrollY > navbar.offsetHeight) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
});

//forget why i added this, prob dont need
// const result = await sass.compileAsync('style.scss');
// console.log(result.css);


// note toggle dark mode 
document.addEventListener('DOMContentLoaded', () => {
  const toggleContainer = document.getElementById('darkModeToggle');
  const body = document.body;
  const darkModeIcon = document.getElementById('darkModeIcon');
  const lightModeIcon = document.getElementById('lightModeIcon');
  const closeButtons = document.querySelectorAll('.btn-close');
  const lightBackgrounds = document.querySelectorAll('.bg-light');

  toggleContainer.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const checkbox = toggleContainer.querySelector('.toggle-input');
    checkbox.checked = !checkbox.checked;

    // Toggle icons and update aria-label for accessibility
    if (body.classList.contains('dark-mode')) {
      darkModeIcon.style.display = 'none';
      lightModeIcon.style.display = 'inline';
      toggleContainer.setAttribute('aria-label', 'Switch to Light Mode');
      closeButtons.forEach(button => button.classList.add('btn-close-white')); // Updated line: Add class for dark mode to all buttons
      lightBackgrounds.forEach(bg => bg.classList.replace('bg-light', 'bg-dark')); // Replace bg-light with bg-dark
    } else {
      lightModeIcon.style.display = 'none';
      darkModeIcon.style.display = 'inline';
      toggleContainer.setAttribute('aria-label', 'Switch to Dark Mode');
      lightBackgrounds.forEach(bg => bg.classList.replace('bg-dark', 'bg-light')); // Replace bg-dark with bg-light
    }
  });

  // Initial setup based on body class
  if (body.classList.contains('dark-mode')) {
    darkModeIcon.style.display = 'none';
    lightModeIcon.style.display = 'inline';
    closeButtons.forEach(button => button.classList.add('btn-close-white')); // Updated line: Add class for dark mode to all buttons initially
    lightBackgrounds.forEach(bg => bg.classList.replace('bg-light', 'bg-dark')); // Replace bg-light with bg-dark initially
  } else {
    lightModeIcon.style.display = 'none';
    darkModeIcon.style.display = 'inline';
    toggleContainer.setAttribute('aria-label', 'Switch to Dark Mode');
    closeButtons.forEach(button => button.classList.remove('btn-close-white')); // Updated line: Remove class for light mode from all buttons initially
    lightBackgrounds.forEach(bg => bg.classList.replace('bg-dark', 'bg-light')); // Replace bg-dark with bg-light initially
  }
});



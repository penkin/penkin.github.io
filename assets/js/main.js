document.addEventListener("DOMContentLoaded", function () {
  // Menu
  const menuButton = document.getElementById("menu-button");
  const menuButtonBurger = menuButton.children[0];
  const menuButtonX = menuButton.children[1];
  const menu = document.getElementById("menu");

  var menuOpen = false;

  menuButton.addEventListener("click", () => {
    menuOpen = !menuOpen;

    if (menuOpen) {
      menu.classList.remove("hidden");
      menu.classList.add("block");
      menuButtonBurger.classList.add("hidden");
      menuButtonX.classList.remove("hidden");
      document.body.classList.add(
        "scrolling-auto",
        "overflow-hidden",
        "fixed",
        "pin-x",
      );
    } else {
      menu.classList.remove("block");
      menu.classList.add("hidden");
      menuButtonBurger.classList.remove("hidden");
      menuButtonX.classList.add("hidden");
      document.body.classList.remove(
        "scrolling-auto",
        "overflow-hidden",
        "fixed",
        "pin-x",
      );
    }
  });

  // Theme toggle
  var btnThemeSystem = document.querySelectorAll('.theme-system');
  var btnThemeLight = document.querySelectorAll('.theme-light');
  var btnThemeDark = document.querySelectorAll('.theme-dark');
  var themeToggleSlider = document.querySelectorAll('.theme-toggle-slider');

  function updateThemeToggleSlider(position) {
    themeToggleSlider.forEach(slider => {
      slider.style.left = position;
    });
  }

  function updateTheme(theme) {
    if (theme === 'system') {
      localStorage.removeItem('color-theme');
      updateThemeToggleSlider('0');

      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {  
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    } else {
      localStorage.setItem('color-theme', theme);
      document.documentElement.setAttribute('data-theme', theme);

      if (theme === 'light') {
        updateThemeToggleSlider('33%');
      } else {
        updateThemeToggleSlider('66%');
      }
    }
  }

  btnThemeSystem.forEach(btn => {
    btn.addEventListener('click', function() {
      updateTheme('system');
    });
  });

  btnThemeLight.forEach(btn => {
    btn.addEventListener('click', function() {
      updateTheme('light');
    });
  });

  btnThemeDark.forEach(btn => {
    btn.addEventListener('click', function() {
      updateTheme('dark');
    });
  });

  var theme = localStorage.getItem('color-theme');
  if (theme) {
    updateTheme(theme);
  }

  // Image Dialog using native <dialog> element
  // Create dialog element
  const dialog = document.createElement('dialog');
  dialog.setAttribute('closedby', 'any');
  const dialogImage = document.createElement('img');
  const closeButton = document.createElement('button');
  closeButton.setAttribute('autofocus', true);
  closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>';
  
  // Assemble dialog
  dialog.appendChild(dialogImage);
  dialog.appendChild(closeButton);
  document.body.appendChild(dialog);
  
  // Find all images in figure elements
  const figureImages = document.querySelectorAll('figure img');
  
  // Add click event to each image
  figureImages.forEach(img => {
    img.addEventListener('click', function() {
      // Set image source in dialog
      dialogImage.src = this.src;
      dialogImage.alt = this.alt;
      
      // Show dialog
      dialog.showModal();
    });
  });

  closeButton.addEventListener('click', () => {
    dialog.close();
  });
});

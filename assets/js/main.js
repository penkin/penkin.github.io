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
  var btnThemeSystem = document.getElementById('btnThemeSystem');
  var btnThemeLight = document.getElementById('btnThemeLight');
  var btnThemeDark = document.getElementById('btnThemeDark');
  var themeToggleSlider = document.getElementById('themeToggleSlider');

  // [[data-theme=light]_&]:left-[33%] [[data-theme=dark]_&]:left-[66%]

  function updateTheme(theme) {
    if (theme === 'system') {
      localStorage.removeItem('color-theme');
      themeToggleSlider.style.left = '0';

      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {  
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    } else {
      localStorage.setItem('color-theme', theme);
      document.documentElement.setAttribute('data-theme', theme);

      if (theme === 'light') {
        themeToggleSlider.style.left = '33%';
      } else {
        themeToggleSlider.style.left = '66%';
      }
    }
  }

  btnThemeSystem.addEventListener('click', function() {
    updateTheme('system');
  });

  btnThemeLight.addEventListener('click', function() {
    updateTheme('light');
  });

  btnThemeDark.addEventListener('click', function() {
    updateTheme('dark');
  });

  var theme = localStorage.getItem('color-theme');
  if (theme) {
    updateTheme(theme);
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const sideMenu = document.getElementById('side-menu');

  menuBtn.addEventListener('click', () => {
    sideMenu.classList.toggle('open');
  });
});

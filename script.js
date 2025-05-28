// script.js
const checkbox = document.getElementById('toggle-dark-mode');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-mode');
  checkbox.checked = true;
}

checkbox.addEventListener('change', function () {
  body.classList.toggle('dark-mode');
  localStorage.setItem('theme', this.checked ? 'dark' : 'light');
});

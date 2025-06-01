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


const spotifyIframe = document.getElementById("spotify-embed");
const setSpotifyTheme = () => {
  const isDark = body.classList.contains('dark-mode');
  const themeParam = isDark ? "0" : "1";
  const playlistId = "0nZis5ePycLlX70IrDIX6o";
  spotifyIframe.src = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=${themeParam}`;
};

// Panggil saat awal load
setSpotifyTheme();

// Update ketika toggle berubah
checkbox.addEventListener('change', () => {
  setSpotifyTheme();
});

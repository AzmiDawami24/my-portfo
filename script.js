// ==========================================================================
// CONFIGURATION & CONSTANTS
// ==========================================================================
const CONFIG = {
  USER_ID: "722083917724647506",
  SPOTIFY_PLAYLIST_ID: "0nZis5ePycLlX70IrDIX6o"
};

// ==========================================================================
// DOM ELEMENTS
// ==========================================================================
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const themeIcon = document.getElementById('themeIcon');
const discordIframe = document.getElementById('discord-embed');
const spotifyIframe = document.getElementById('spotify-embed');
const currentYearText = document.getElementById('currentYear');

// ==========================================================================
// THEME MANAGEMENT
// ==========================================================================

/**
 * Memperbarui URL widget Discord dan Spotify berdasarkan tema saat ini
 * @param {boolean} isDark - Status mode gelap
 */
const updateEmbedThemes = (isDark) => {
  const discordTheme = isDark ? "dark" : "light";
  const spotifyTheme = isDark ? "0" : "1";

  discordIframe.src = `https://lanyard-profile-readme.vercel.app/api/${CONFIG.USER_ID}?theme=${discordTheme}`;
  spotifyIframe.src = `https://open.spotify.com/embed/playlist/${CONFIG.SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=${spotifyTheme}`;
};

/**
 * Mengatur tema aplikasi (Dark/Light)
 * @param {boolean} isDark - Status mode gelap
 */
const setTheme = (isDark) => {
  if (isDark) {
    body.classList.add('dark-mode');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  } else {
    body.classList.remove('dark-mode');
    themeIcon.classList.replace('fa-sun', 'fa-moon');
  }

  localStorage.setItem('darkMode', isDark.toString());
  updateEmbedThemes(isDark);
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================
const init = () => {
  // 1. Cek preferensi tersimpan di LocalStorage
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  setTheme(savedDarkMode);

  // 2. Set tahun footer secara otomatis
  currentYearText.textContent = new Date().getFullYear();

  // 3. Event Listener untuk tombol Dark Mode
  darkModeToggle.addEventListener('click', () => {
    const isCurrentlyDark = body.classList.contains('dark-mode');
    setTheme(!isCurrentlyDark);
  });
};

// Jalankan inisialisasi saat script dimuat
init();
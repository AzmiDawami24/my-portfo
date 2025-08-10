// script.js
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const themeIcon = document.getElementById('themeIcon');
const discordIframe = document.getElementById("discord-embed");
const spotifyIframe = document.getElementById("spotify-embed");

// Periksa preferensi mode gelap dari localStorage
const isDarkMode = localStorage.getItem('darkMode') === 'true';

// Terapkan mode gelap dan ikon yang sesuai jika preferensi tersimpan
if (isDarkMode) {
  body.classList.add('dark-mode');
  themeIcon.classList.replace('fa-moon', 'fa-sun');
} else {
  themeIcon.classList.replace('fa-sun', 'fa-moon');
}

// Fungsi untuk mengatur tema Discord
const setDiscordTheme = () => {
  const isDark = body.classList.contains('dark-mode');
  const themeParam = isDark ? "dark" : "light";
  const userId = "722083917724647506";
  discordIframe.src = `https://lanyard-profile-readme.vercel.app/api/${userId}?theme=${themeParam}`;
};

// Fungsi untuk mengatur tema Spotify
const setSpotifyTheme = () => {
  const isDark = body.classList.contains('dark-mode');
  const themeParam = isDark ? "0" : "1";
  const playlistId = "0nZis5ePycLlX70IrDIX6o";
  spotifyIframe.src = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=${themeParam}`;
};

// Panggil fungsi-fungsi ini di awal untuk mengatur tema saat halaman dimuat
setDiscordTheme();
setSpotifyTheme();

// Tambahkan "event listener" pada tombol
darkModeToggle.addEventListener('click', () => {
  // Toggle kelas 'dark-mode' pada body
  body.classList.toggle('dark-mode');

  // Cek apakah mode gelap sedang aktif
  const isCurrentlyDarkMode = body.classList.contains('dark-mode');
  
  if (isCurrentlyDarkMode) {
    // Jika mode gelap aktif, ganti ikon menjadi matahari
    themeIcon.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('darkMode', 'true');
  } else {
    // Jika mode terang aktif, ganti ikon menjadi bulan
    themeIcon.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('darkMode', 'false');
  }

  // Panggil fungsi-fungsi ini setiap kali tema berubah
  setDiscordTheme();
  setSpotifyTheme();
});
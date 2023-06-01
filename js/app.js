const audioContainer = document.querySelector('.audio-container');
const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const audio = document.querySelector('#audio');
const cover = document.querySelector('#cover');

// Cover inicial de la app

(function() {
  setTimeout(function() {
    document.getElementById('splash-screen').remove();
  }, 1000);
})();



// Array con los nombres de las canciones
const songs = ['rock', 'tambores', 'metal'];

let songIndex = 0;

// Crear listener para cada boton de seleccion de cancion y le asigno la funcion loadSong
const selectButtons = document.querySelectorAll('.select-button');

selectButtons.forEach(button => {
  button.addEventListener('click', () => {
    songIndex = button.getAttribute('audioIndex'); 
    loadSong(songs[songIndex]);
  });
});


// Cargar la primera cancion
loadSong(songs[0]);

// Actualizar detalles de la cancion
function loadSong(song) {
  audio.src = `audio/${song}.mp3`;
  cover.src = `images/${song}.png`;
}

// Funciones para reproducir y pausar
function playSong() {
    audioContainer.classList.add('play');
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');

    audio.play();
  }

function pauseSong() {
  audioContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');

  audio.pause();
}

function prevSong() {
  songIndex--;

  if(songIndex < 0) {
    songIndex = songs.length -1;
  }

  loadSong(songs[songIndex]);

  playSong();
}

function nextSong() {
  songIndex++;

  if(songIndex > songs.length -1) {
    songIndex = 0;
  }

  loadSong(songs[songIndex]);

  playSong();
}



// Crear listener para el boton de play/pause
playBtn.addEventListener('click', () => {
  const isPlaying = audioContainer.classList.contains('play');

  if(isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Listener para los botones de siguiente y anterior
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

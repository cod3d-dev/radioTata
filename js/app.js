const audioContainer = document.querySelector('.audio-container');
const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const audio = document.querySelector('#audio');
const progress = document.querySelector('.progress-bar');
const progressContainer = document.querySelector('.progress-container');
const title = document.querySelector('#title');
const cover = document.querySelector('#cover');

// Audios
const songs = ['rock', 'tambores', 'indie', 'metal'];

let songIndex = 0;

const selectButtons = document.querySelectorAll('.select-button');


selectButtons.forEach(button => {
  button.addEventListener('click', () => {
    songIndex = button.getAttribute('audioIndex'); // Retrieve the value of the audioIndex attribute
    console.log(songIndex); // Log the value of the audioIndex variable to the console
  });
});



// Cargar info de la cancion del DOM
loadSong(songs[songIndex]);

// Actualizar detalles de la cancion
function loadSong(song) {
  console.log("Cancion " + song);
  title.innerText = song;
  audio.src = `audio/${song}.mp3`;
  cover.src = `images/${song}.png`;
  console.log("Cover " + cover.src);
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

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;

  progress.style.width = `${progressPercent}%`;
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}



// Eventos
playBtn.addEventListener('click', () => {
  const isPlaying = audioContainer.classList.contains('play');

  if(isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Cambiar cancion
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

audio.addEventListener('timeupdate', updateProgress);

progressContainer.addEventListener('click', setProgress);

audio.addEventListener('ended', nextSong);